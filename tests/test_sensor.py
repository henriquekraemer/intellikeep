"""Tests for IntelliKeep sensor entities."""
from __future__ import annotations

from datetime import datetime, timedelta
from unittest.mock import MagicMock, patch

import pytest

from custom_components.intellikeep.models import TaskFrequency, TaskPriority
from tests.conftest import make_task


class TestCoordinatorData:
    """Test that the coordinator aggregates data correctly."""

    async def test_tasks_due_count(self, task_manager, mock_storage):
        t1 = make_task(name="Due now", due_date=datetime.utcnow())
        t2 = make_task(name="Future", due_date=datetime.utcnow() + timedelta(days=5))
        mock_storage.upsert_task(t1)
        mock_storage.upsert_task(t2)

        due = task_manager.get_tasks_due_today()
        assert len(due) == 1
        assert due[0].name == "Due now"

    async def test_tasks_overdue_count(self, task_manager, mock_storage):
        t1 = make_task(name="Overdue", due_date=datetime.utcnow() - timedelta(days=3))
        t2 = make_task(name="OK", due_date=datetime.utcnow() + timedelta(days=1))
        mock_storage.upsert_task(t1)
        mock_storage.upsert_task(t2)

        overdue = task_manager.get_overdue_tasks()
        assert len(overdue) == 1
        assert overdue[0].name == "Overdue"

    async def test_next_due_task(self, task_manager, mock_storage):
        t1 = make_task(name="Far", due_date=datetime.utcnow() + timedelta(days=10))
        t2 = make_task(name="Near", due_date=datetime.utcnow() + timedelta(days=2))
        t3 = make_task(name="No date", due_date=None)
        mock_storage.upsert_task(t1)
        mock_storage.upsert_task(t2)
        mock_storage.upsert_task(t3)

        next_task = task_manager.get_next_due_task()
        assert next_task is not None
        assert next_task.name == "Near"

    async def test_next_due_task_empty(self, task_manager):
        assert task_manager.get_next_due_task() is None

    async def test_next_due_excludes_disabled(self, task_manager, mock_storage):
        t = make_task(name="Disabled", due_date=datetime.utcnow(), enabled=False)
        mock_storage.upsert_task(t)
        # Disabled task has no due_date for scheduling purposes
        # next_due_task only considers enabled=True with due_date set
        result = task_manager.get_next_due_task()
        assert result is None


class TestTaskWithStatus:
    def test_all_tasks_with_status_includes_status_field(
        self, task_manager, mock_storage
    ):
        t = make_task(name="Check", due_date=datetime.utcnow() + timedelta(days=3))
        mock_storage.upsert_task(t)

        result = task_manager.get_all_tasks_with_status()
        assert len(result) == 1
        assert "status" in result[0]
        assert result[0]["status"] == "pending"

    def test_overdue_task_has_overdue_status(self, task_manager, mock_storage):
        t = make_task(due_date=datetime.utcnow() - timedelta(days=5))
        mock_storage.upsert_task(t)

        result = task_manager.get_all_tasks_with_status()
        assert result[0]["status"] == "overdue"
