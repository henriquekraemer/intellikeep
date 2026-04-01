"""Tests for IntelliKeep HA services."""
from __future__ import annotations

from datetime import datetime, timedelta
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from custom_components.intellikeep.models import TaskFrequency, TaskPriority
from tests.conftest import make_task


class TestCreateTaskService:
    async def test_create_task_stores_and_returns(self, task_manager, mock_storage):
        task = await task_manager.async_create_task(
            name="HVAC filter",
            priority=TaskPriority.HIGH,
            frequency=TaskFrequency.MONTHLY,
            linked_entity_ids=["climate.living_room"],
        )
        assert task.name == "HVAC filter"
        assert task.priority == TaskPriority.HIGH
        assert task.frequency == TaskFrequency.MONTHLY
        assert "climate.living_room" in task.linked_entity_ids
        assert mock_storage.get_task(task.task_id) is not None

    async def test_create_task_with_custom_interval(self, task_manager, mock_storage):
        task = await task_manager.async_create_task(
            name="Custom task",
            frequency=TaskFrequency.CUSTOM,
            custom_days_interval=45,
        )
        assert task.custom_days_interval == 45


class TestCompleteTaskService:
    async def test_complete_records_execution(self, task_manager, mock_storage):
        task = make_task(name="Paint fence", frequency=TaskFrequency.YEARLY)
        mock_storage.upsert_task(task)

        completed = await task_manager.async_complete_task(
            task.task_id, completed_by="Bob", notes="Used white paint"
        )
        assert completed is not None
        assert len(completed.executions) == 1
        assert completed.executions[0].completed_by == "Bob"
        assert completed.executions[0].notes == "Used white paint"

    async def test_complete_multiple_times_accumulates_history(
        self, task_manager, mock_storage
    ):
        task = make_task(frequency=TaskFrequency.WEEKLY)
        mock_storage.upsert_task(task)

        await task_manager.async_complete_task(task.task_id, completed_by="Alice")
        await task_manager.async_complete_task(task.task_id, completed_by="Bob")

        stored = mock_storage.get_task(task.task_id)
        assert stored is not None
        assert len(stored.executions) == 2


class TestDeleteTaskService:
    async def test_delete_removes_task(self, task_manager, mock_storage):
        task = make_task(name="Remove me")
        mock_storage.upsert_task(task)

        result = await task_manager.async_delete_task(task.task_id)
        assert result is True
        assert mock_storage.get_task(task.task_id) is None

    async def test_delete_saves_storage(self, task_manager, mock_storage):
        task = make_task()
        mock_storage.upsert_task(task)
        mock_storage._store.async_save.reset_mock()

        await task_manager.async_delete_task(task.task_id)
        mock_storage._store.async_save.assert_called_once()


class TestUpdateTaskService:
    async def test_update_name(self, task_manager, mock_storage):
        task = make_task(name="Old name")
        mock_storage.upsert_task(task)

        updated = await task_manager.async_update_task(task.task_id, name="New name")
        assert updated is not None
        assert updated.name == "New name"

    async def test_update_preserves_other_fields(self, task_manager, mock_storage):
        task = make_task(
            name="Keep me",
            priority=TaskPriority.HIGH,
            frequency=TaskFrequency.WEEKLY,
        )
        mock_storage.upsert_task(task)

        updated = await task_manager.async_update_task(task.task_id, name="Updated")
        assert updated is not None
        assert updated.priority == TaskPriority.HIGH
        assert updated.frequency == TaskFrequency.WEEKLY

    async def test_update_nonexistent_returns_none(self, task_manager):
        result = await task_manager.async_update_task("ghost", name="X")
        assert result is None
