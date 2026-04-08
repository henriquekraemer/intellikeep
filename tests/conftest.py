"""Shared fixtures for IntelliKeep tests."""
from __future__ import annotations

from datetime import datetime
from unittest.mock import AsyncMock, MagicMock

import pytest
from homeassistant.config_entries import ConfigEntryState

from custom_components.intellikeep.coordinator import IntelliKeepCoordinator
from custom_components.intellikeep.models import Task, TaskFrequency, TaskPriority
from custom_components.intellikeep.notifications import NotificationManager
from custom_components.intellikeep.runtime_data import IntelliKeepRuntimeData
from custom_components.intellikeep.storage import IntelliKeepStorage
from custom_components.intellikeep.task_manager import TaskManager


@pytest.fixture
def mock_hass():
    hass = MagicMock()
    hass.data = {}
    hass.http = MagicMock()
    hass.http.async_register_static_paths = AsyncMock()
    hass.services = MagicMock()
    hass.services.async_call = AsyncMock()
    hass.services.async_register = MagicMock()
    hass.services.async_remove = MagicMock()
    hass.services.has_service = MagicMock(return_value=False)
    hass.bus = MagicMock()
    hass.bus.async_fire = MagicMock()
    hass.config_entries = MagicMock()
    hass.config_entries.async_entries = MagicMock(return_value=[])
    hass.config_entries.async_forward_entry_setups = AsyncMock(return_value=True)
    hass.config_entries.async_unload_platforms = AsyncMock(return_value=True)
    hass.config_entries.async_reload = AsyncMock()
    return hass


@pytest.fixture
def mock_storage(mock_hass):
    storage = IntelliKeepStorage(mock_hass)
    storage._store = MagicMock()
    storage._store.async_load = AsyncMock(return_value=None)
    storage._store.async_save = AsyncMock()
    return storage


@pytest.fixture
def task_manager(mock_hass, mock_storage):
    return TaskManager(mock_hass, mock_storage)


@pytest.fixture
def runtime_data(mock_storage, task_manager):
    coordinator = MagicMock(spec=IntelliKeepCoordinator)
    coordinator.data = {}
    coordinator.async_refresh = AsyncMock()
    coordinator.async_add_listener = MagicMock(return_value=MagicMock())
    coordinator.last_update_success = True

    notification_manager = MagicMock(spec=NotificationManager)
    notification_manager.clear_task_notifications = MagicMock()

    return IntelliKeepRuntimeData(
        storage=mock_storage,
        task_manager=task_manager,
        coordinator=coordinator,
        notification_manager=notification_manager,
    )


@pytest.fixture
def mock_config_entry(runtime_data):
    entry = MagicMock()
    entry.entry_id = "entry-1"
    entry.title = "IntelliKeep"
    entry.data = {}
    entry.options = {}
    entry.state = ConfigEntryState.LOADED
    entry.runtime_data = runtime_data
    entry.add_update_listener = MagicMock(return_value=MagicMock())
    entry.async_on_unload = MagicMock()
    return entry


def make_task(
    name: str = "Test task",
    frequency: TaskFrequency = TaskFrequency.ONE_TIME,
    priority: TaskPriority = TaskPriority.MEDIUM,
    due_date: datetime | None = None,
    enabled: bool = True,
    **kwargs,
) -> Task:
    return Task(
        name=name,
        frequency=frequency,
        priority=priority,
        due_date=due_date,
        enabled=enabled,
        **kwargs,
    )
