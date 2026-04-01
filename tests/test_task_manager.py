"""Tests for IntelliKeep TaskManager business logic."""
from __future__ import annotations

from datetime import datetime, timedelta

import pytest

from custom_components.intellikeep.models import TaskFrequency, TaskPriority, TaskStatus
from tests.conftest import make_task


class TestCreateTask:
    async def test_create_task_basic(self, task_manager, mock_storage):
        task = await task_manager.async_create_task(
            name="Oil change",
            frequency=TaskFrequency.YEARLY,
        )
        assert task.name == "Oil change"
        assert task.frequency == TaskFrequency.YEARLY
        assert task.task_id is not None
        # Verify storage was called
        assert task_manager._storage.get_task(task.task_id) is task

    async def test_create_task_saves(self, task_manager, mock_storage):
        await task_manager.async_create_task(name="Test")
        mock_storage._store.async_save.assert_called_once()


class TestCompleteTask:
    async def test_complete_one_time_disables_task(self, task_manager, mock_storage):
        task = make_task(name="Fix tap", frequency=TaskFrequency.ONE_TIME)
        mock_storage.upsert_task(task)

        completed = await task_manager.async_complete_task(
            task.task_id, completed_by="Alice"
        )
        assert completed is not None
        assert completed.enabled is False
        assert len(completed.executions) == 1
        assert completed.executions[0].completed_by == "Alice"

    async def test_complete_recurring_advances_due_date(self, task_manager, mock_storage):
        base_due = datetime(2025, 1, 1)
        task = make_task(
            name="Monthly clean",
            frequency=TaskFrequency.MONTHLY,
            due_date=base_due,
            enabled=True,
        )
        mock_storage.upsert_task(task)

        completed = await task_manager.async_complete_task(task.task_id)
        assert completed is not None
        assert completed.enabled is True
        assert completed.due_date is not None
        assert completed.due_date > base_due

    async def test_complete_unknown_task_returns_none(self, task_manager):
        result = await task_manager.async_complete_task("nonexistent-id")
        assert result is None


class TestDeleteTask:
    async def test_delete_existing_task(self, task_manager, mock_storage):
        task = make_task(name="Clean gutters")
        mock_storage.upsert_task(task)

        deleted = await task_manager.async_delete_task(task.task_id)
        assert deleted is True
        assert mock_storage.get_task(task.task_id) is None

    async def test_delete_nonexistent_task(self, task_manager):
        deleted = await task_manager.async_delete_task("ghost-id")
        assert deleted is False


class TestTaskStatus:
    def test_status_pending(self, task_manager):
        task = make_task(due_date=datetime.utcnow() + timedelta(days=5))
        assert task_manager.get_task_status(task) == TaskStatus.PENDING

    def test_status_due(self, task_manager):
        task = make_task(due_date=datetime.utcnow())
        assert task_manager.get_task_status(task) == TaskStatus.DUE

    def test_status_overdue(self, task_manager):
        task = make_task(due_date=datetime.utcnow() - timedelta(days=3))
        assert task_manager.get_task_status(task) == TaskStatus.OVERDUE

    def test_status_completed(self, task_manager):
        task = make_task(enabled=False)
        assert task_manager.get_task_status(task) == TaskStatus.COMPLETED

    def test_status_no_due_date(self, task_manager):
        task = make_task(due_date=None)
        assert task_manager.get_task_status(task) == TaskStatus.PENDING


class TestFrequencyCalculation:
    def _make_and_complete(self, task_manager, mock_storage, **kwargs):
        task = make_task(**kwargs)
        mock_storage.upsert_task(task)
        return task

    def test_daily(self, task_manager):
        task = make_task(frequency=TaskFrequency.DAILY)
        task.last_completed_at = datetime(2025, 6, 15)
        next_due = task_manager._calculate_next_due(task)
        assert next_due.date() == datetime(2025, 6, 16).date()

    def test_weekly(self, task_manager):
        task = make_task(frequency=TaskFrequency.WEEKLY)
        task.last_completed_at = datetime(2025, 6, 1)
        next_due = task_manager._calculate_next_due(task)
        assert next_due.date() == datetime(2025, 6, 8).date()

    def test_monthly(self, task_manager):
        task = make_task(frequency=TaskFrequency.MONTHLY)
        task.last_completed_at = datetime(2025, 1, 15)
        next_due = task_manager._calculate_next_due(task)
        assert next_due.month == 2
        assert next_due.day == 15

    def test_monthly_end_of_month(self, task_manager):
        """Jan 31 → should not crash on short months."""
        task = make_task(frequency=TaskFrequency.MONTHLY)
        task.last_completed_at = datetime(2025, 1, 31)
        next_due = task_manager._calculate_next_due(task)
        assert next_due.month == 2
        assert next_due.day == 28  # Feb 2025 has 28 days

    def test_yearly(self, task_manager):
        task = make_task(frequency=TaskFrequency.YEARLY)
        task.last_completed_at = datetime(2025, 3, 10)
        next_due = task_manager._calculate_next_due(task)
        assert next_due.year == 2026

    def test_custom(self, task_manager):
        task = make_task(frequency=TaskFrequency.CUSTOM, custom_days_interval=45)
        task.last_completed_at = datetime(2025, 1, 1)
        next_due = task_manager._calculate_next_due(task)
        assert next_due.date() == datetime(2025, 2, 15).date()


class TestQueryMethods:
    async def test_get_tasks_due_today(self, task_manager, mock_storage):
        t1 = make_task(name="Due", due_date=datetime.utcnow())
        t2 = make_task(name="Future", due_date=datetime.utcnow() + timedelta(days=3))
        t3 = make_task(name="Disabled", due_date=datetime.utcnow(), enabled=False)
        mock_storage.upsert_task(t1)
        mock_storage.upsert_task(t2)
        mock_storage.upsert_task(t3)

        due = task_manager.get_tasks_due_today()
        names = [t.name for t in due]
        assert "Due" in names
        assert "Future" not in names
        assert "Disabled" not in names

    async def test_get_approaching_tasks(self, task_manager, mock_storage):
        t = make_task(
            name="Approaching",
            due_date=datetime.utcnow() + timedelta(days=1),
            notify_days_before=2,
        )
        mock_storage.upsert_task(t)
        approaching = task_manager.get_tasks_approaching_due()
        assert any(x.name == "Approaching" for x in approaching)

    async def test_get_next_due_task(self, task_manager, mock_storage):
        t1 = make_task(name="Later", due_date=datetime.utcnow() + timedelta(days=5))
        t2 = make_task(name="Sooner", due_date=datetime.utcnow() + timedelta(days=1))
        mock_storage.upsert_task(t1)
        mock_storage.upsert_task(t2)
        next_task = task_manager.get_next_due_task()
        assert next_task is not None
        assert next_task.name == "Sooner"
