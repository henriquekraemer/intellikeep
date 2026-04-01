"""Tests for IntelliKeep WebSocket API commands."""
from __future__ import annotations

from datetime import datetime, timedelta
from unittest.mock import MagicMock, patch

import pytest

from custom_components.intellikeep.models import TaskFrequency
from tests.conftest import make_task


class TestGetTasksWS:
    async def test_returns_all_tasks_with_status(self, task_manager, mock_storage):
        t1 = make_task(name="Task A", due_date=datetime.utcnow() + timedelta(days=2))
        t2 = make_task(name="Task B", due_date=datetime.utcnow() - timedelta(days=1))
        mock_storage.upsert_task(t1)
        mock_storage.upsert_task(t2)

        tasks = task_manager.get_all_tasks_with_status()
        names = [t["name"] for t in tasks]
        statuses = [t["status"] for t in tasks]

        assert "Task A" in names
        assert "Task B" in names
        assert "pending" in statuses
        assert "due" in statuses or "overdue" in statuses

    async def test_empty_returns_empty_list(self, task_manager):
        assert task_manager.get_all_tasks_with_status() == []


class TestGetTaskWS:
    async def test_returns_single_task(self, task_manager, mock_storage):
        task = make_task(name="Single task")
        mock_storage.upsert_task(task)

        found = mock_storage.get_task(task.task_id)
        assert found is not None
        assert found.name == "Single task"

    async def test_unknown_task_returns_none(self, mock_storage):
        assert mock_storage.get_task("does-not-exist") is None


class TestTaskDictSerialization:
    def test_as_dict_with_status_has_all_fields(self, task_manager, mock_storage):
        task = make_task(
            name="Full task",
            frequency=TaskFrequency.MONTHLY,
            due_date=datetime.utcnow() + timedelta(days=10),
            linked_entity_ids=["sensor.temp"],
        )
        mock_storage.upsert_task(task)

        status = task_manager.get_task_status(task)
        result = task.as_dict_with_status(status)

        for field in (
            "task_id",
            "name",
            "description",
            "priority",
            "frequency",
            "due_date",
            "linked_entity_ids",
            "notify_days_before",
            "created_at",
            "updated_at",
            "enabled",
            "status",
            "executions_count",
        ):
            assert field in result, f"Missing field: {field}"
