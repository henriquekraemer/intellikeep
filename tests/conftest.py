"""Shared fixtures for IntelliKeep tests."""
from __future__ import annotations

from datetime import datetime
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from custom_components.intellikeep.models import Task, TaskFrequency, TaskPriority
from custom_components.intellikeep.storage import IntelliKeepStorage
from custom_components.intellikeep.task_manager import TaskManager


@pytest.fixture
def mock_hass():
    hass = MagicMock()
    hass.services.async_call = AsyncMock()
    hass.bus.async_fire = MagicMock()
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
