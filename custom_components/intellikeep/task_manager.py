"""Business logic for IntelliKeep task management."""
from __future__ import annotations

import logging
from datetime import datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .models import Task, TaskExecution, TaskFrequency, TaskStatus
from .storage import IntelliKeepStorage

_LOGGER = logging.getLogger(__name__)


class TaskManager:
    """Handles all task operations and scheduling logic."""

    def __init__(self, hass: HomeAssistant, storage: IntelliKeepStorage) -> None:
        self.hass = hass
        self._storage = storage

    # ------------------------------------------------------------------
    # CRUD
    # ------------------------------------------------------------------

    async def async_create_task(self, **kwargs: Any) -> Task:
        task = Task(**kwargs)
        self._storage.upsert_task(task)
        await self._storage.async_save()
        _LOGGER.debug("Created task %s (%s)", task.task_id, task.name)
        return task

    async def async_update_task(self, task_id: str, **kwargs: Any) -> Task | None:
        task = self._storage.get_task(task_id)
        if task is None:
            _LOGGER.warning("Update called for unknown task_id: %s", task_id)
            return None
        for key, value in kwargs.items():
            if hasattr(task, key):
                setattr(task, key, value)
        task.updated_at = dt_util.utcnow()
        self._storage.upsert_task(task)
        await self._storage.async_save()
        return task

    async def async_complete_task(
        self,
        task_id: str,
        completed_by: str = "",
        notes: str = "",
    ) -> Task | None:
        task = self._storage.get_task(task_id)
        if task is None:
            _LOGGER.warning("Complete called for unknown task_id: %s", task_id)
            return None

        execution = TaskExecution(
            task_id=task_id,
            completed_at=dt_util.utcnow(),
            completed_by=completed_by,
            notes=notes,
        )
        task.executions.append(execution)
        task.last_completed_at = execution.completed_at

        if task.frequency == TaskFrequency.ONE_TIME:
            task.enabled = False
        else:
            task.due_date = self._calculate_next_due(task)

        task.updated_at = dt_util.utcnow()
        self._storage.upsert_task(task)
        await self._storage.async_save()
        _LOGGER.debug("Completed task %s by %s", task_id, completed_by or "unknown")
        return task

    async def async_reopen_task(self, task_id: str) -> Task | None:
        task = self._storage.get_task(task_id)
        if task is None:
            _LOGGER.warning("Reopen called for unknown task_id: %s", task_id)
            return None
        task.enabled = True
        task.last_completed_at = None
        task.updated_at = dt_util.utcnow()
        self._storage.upsert_task(task)
        await self._storage.async_save()
        _LOGGER.debug("Reopened task %s", task_id)
        return task

    async def async_delete_task(self, task_id: str) -> bool:
        deleted = self._storage.delete_task(task_id)
        if deleted:
            await self._storage.async_save()
            _LOGGER.debug("Deleted task %s", task_id)
        return deleted

    # ------------------------------------------------------------------
    # Queries
    # ------------------------------------------------------------------

    def get_task_status(self, task: Task) -> TaskStatus:
        if not task.enabled:
            return TaskStatus.COMPLETED
        now = dt_util.utcnow()
        if task.due_date is None:
            return TaskStatus.PENDING
        days_until_due = (task.due_date.date() - now.date()).days
        if days_until_due < -1:
            return TaskStatus.OVERDUE
        if days_until_due <= 0:
            return TaskStatus.DUE
        return TaskStatus.PENDING

    def get_tasks_due_today(self) -> list[Task]:
        now = dt_util.utcnow()
        return [
            t
            for t in self._storage.get_all_tasks()
            if t.enabled
            and t.due_date is not None
            and t.due_date.date() <= now.date()
        ]

    def get_overdue_tasks(self) -> list[Task]:
        return [
            t
            for t in self._storage.get_all_tasks()
            if self.get_task_status(t) == TaskStatus.OVERDUE
        ]

    def get_tasks_approaching_due(self) -> list[Task]:
        """Return tasks within their notify_days_before window (but not yet due)."""
        now = dt_util.utcnow()
        result = []
        for task in self._storage.get_all_tasks():
            if not task.enabled or task.due_date is None:
                continue
            days_left = (task.due_date.date() - now.date()).days
            if 0 < days_left <= task.notify_days_before:
                result.append(task)
        return result

    def get_next_due_task(self) -> Task | None:
        pending = [
            t
            for t in self._storage.get_all_tasks()
            if t.enabled and t.due_date is not None
        ]
        if not pending:
            return None
        return min(pending, key=lambda t: t.due_date)  # type: ignore[arg-type]

    def get_all_tasks_with_status(self) -> list[dict]:
        return [
            t.as_dict_with_status(self.get_task_status(t))
            for t in self._storage.get_all_tasks()
        ]

    # ------------------------------------------------------------------
    # Scheduling
    # ------------------------------------------------------------------

    def _calculate_next_due(self, task: Task) -> datetime:
        """Calculate next due date based on task frequency."""
        base = task.last_completed_at or dt_util.utcnow()
        match task.frequency:
            case TaskFrequency.DAILY:
                return base + timedelta(days=1)
            case TaskFrequency.WEEKLY:
                return base + timedelta(weeks=1)
            case TaskFrequency.MONTHLY:
                month = base.month % 12 + 1
                year = base.year + (1 if base.month == 12 else 0)
                # Handle months shorter than current day (e.g. Jan 31 → Feb 28)
                import calendar
                last_day = calendar.monthrange(year, month)[1]
                day = min(base.day, last_day)
                return base.replace(year=year, month=month, day=day)
            case TaskFrequency.YEARLY:
                return base.replace(year=base.year + 1)
            case TaskFrequency.CUSTOM:
                interval = task.custom_days_interval or 30
                return base + timedelta(days=interval)
            case _:
                return base
