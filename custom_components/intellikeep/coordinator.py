"""DataUpdateCoordinator for IntelliKeep."""
from __future__ import annotations

import logging
from datetime import timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .const import DOMAIN
from .task_manager import TaskManager

_LOGGER = logging.getLogger(__name__)

UPDATE_INTERVAL = timedelta(minutes=5)


class IntelliKeepCoordinator(DataUpdateCoordinator[dict]):
    """Coordinator for IntelliKeep. Reads from local TaskManager."""

    config_entry: ConfigEntry

    def __init__(
        self,
        hass: HomeAssistant,
        config_entry: ConfigEntry,
        task_manager: TaskManager,
    ) -> None:
        super().__init__(
            hass,
            _LOGGER,
            config_entry=config_entry,
            name=DOMAIN,
            update_interval=UPDATE_INTERVAL,
        )
        self.task_manager = task_manager

    async def _async_update_data(self) -> dict:
        """Aggregate task stats for sensor entities."""
        all_tasks = self.task_manager._storage.get_all_tasks()
        overdue_tasks = self.task_manager.get_overdue_tasks()
        return {
            "all_tasks": all_tasks,
            "tasks_due_count": len(self.task_manager.get_tasks_due_today()),
            "tasks_overdue_count": len(overdue_tasks),
            "overdue_tasks": overdue_tasks,
            "next_due_task": self.task_manager.get_next_due_task(),
        }
