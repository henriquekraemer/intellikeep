"""Persistent storage for IntelliKeep using HA's Store."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN, STORAGE_KEY, STORAGE_VERSION
from .models import Task

_LOGGER = logging.getLogger(__name__)


class IntelliKeepStorage:
    """Manages persistence via HA's Store (.storage/intellikeep.json)."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, STORAGE_KEY
        )
        self._tasks: dict[str, Task] = {}
        self._task_counter: int = 0

    async def async_load(self) -> None:
        """Load tasks from storage on startup."""
        data = await self._store.async_load()
        if data:
            self._task_counter = data.get("task_counter", 0)
            for raw in (data.get("tasks") or {}).values():
                try:
                    task = Task.from_dict(raw)
                    self._tasks[task.task_id] = task
                    # Back-fill counter in case data was created before persistent counter
                    if task.task_number > self._task_counter:
                        self._task_counter = task.task_number
                except (KeyError, ValueError) as err:
                    _LOGGER.warning("Skipping malformed task entry: %s — %s", raw, err)
        _LOGGER.debug("Loaded %d tasks from storage (counter=%d)", len(self._tasks), self._task_counter)

    async def async_save(self) -> None:
        """Persist all tasks to storage."""
        await self._store.async_save(
            {
                "task_counter": self._task_counter,
                "tasks": {tid: t.as_dict() for tid, t in self._tasks.items()},
            }
        )

    def get_task(self, task_id: str) -> Task | None:
        return self._tasks.get(task_id)

    def get_all_tasks(self) -> list[Task]:
        return list(self._tasks.values())

    def upsert_task(self, task: Task) -> None:
        self._tasks[task.task_id] = task

    def delete_task(self, task_id: str) -> bool:
        if task_id in self._tasks:
            del self._tasks[task_id]
            return True
        return False

    def next_task_number(self) -> int:
        """Return the next unique sequential task number, always incrementing."""
        self._task_counter += 1
        return self._task_counter

    def clear_all_tasks(self) -> int:
        count = len(self._tasks)
        self._tasks.clear()
        return count
