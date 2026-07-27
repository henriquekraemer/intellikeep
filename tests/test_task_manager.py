"""Tests for IntelliKeep TaskManager business logic."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

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
        base_due = datetime(2025, 1, 1, tzinfo=timezone.utc)
        task = make_task(
            name="Monthly clean",
            frequency=TaskFrequency.MONTHLY,
            due_date=base_due,
            enabled=True,
        )
        mock_storage.upsert_task(task)

        completed = await task_manager.async_complete_task(task.task_id)
        assert completed is not None
        # Original task is marked as done
        assert completed.enabled is False

        # A new task must have been created with the next due date
        all_tasks = mock_storage.get_all_tasks()
        new_tasks = [t for t in all_tasks if t.task_id != task.task_id]
        assert len(new_tasks) == 1
        next_task = new_tasks[0]
        assert next_task.enabled is True
        assert next_task.due_date is not None
        assert next_task.due_date > base_due
        assert next_task.frequency == TaskFrequency.MONTHLY

    async def test_complete_unknown_task_returns_none(self, task_manager):
        result = await task_manager.async_complete_task("nonexistent-id")
        assert result is None

    async def test_complete_recurring_does_not_duplicate_open_occurrence(
        self, task_manager, mock_storage
    ):
        task = make_task(name="Weekly", frequency=TaskFrequency.WEEKLY)
        existing_open = make_task(
            name="Weekly next",
            frequency=TaskFrequency.WEEKLY,
            previous_task_id=task.task_id,
        )
        mock_storage.upsert_task(task)
        mock_storage.upsert_task(existing_open)

        await task_manager.async_complete_task(task.task_id)

        assert len(mock_storage.get_all_tasks()) == 2


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


class TestUpdateAndNotes:
    async def test_update_task_records_activity(self, task_manager, mock_storage):
        task = make_task(name="Old", linked_entity_ids=["area:kitchen"])
        mock_storage.upsert_task(task)

        updated = await task_manager.async_update_task(
            task.task_id,
            updated_by="Alice",
            name="New",
            linked_entity_ids=["device:abc"],
            notify_on_overdue=False,
        )

        assert updated is not None
        assert updated.activities[-1].performed_by == "Alice"
        assert "name:" in updated.activities[-1].details
        assert "linked:" in updated.activities[-1].details

    async def test_add_and_delete_note_roundtrip(self, task_manager, mock_storage):
        task = make_task(name="With notes")
        mock_storage.upsert_task(task)

        note = await task_manager.async_add_task_note(
            task.task_id,
            content="Changed filter",
            added_by="Bob",
        )

        assert note is not None
        assert note.content == "Changed filter"

        deleted = await task_manager.async_delete_task_note(task.task_id, note.note_id)
        assert deleted is True
        assert mock_storage.get_task(task.task_id).notes == []

    async def test_delete_unknown_note_returns_false(self, task_manager, mock_storage):
        task = make_task(name="Unknown note")
        mock_storage.upsert_task(task)

        assert await task_manager.async_delete_task_note(task.task_id, "missing") is False

    async def test_reopen_task_reenables_task(self, task_manager, mock_storage):
        task = make_task(name="Reopen me", enabled=False)
        mock_storage.upsert_task(task)

        reopened = await task_manager.async_reopen_task(task.task_id, performed_by="Eve")

        assert reopened is not None
        assert reopened.enabled is True
        assert reopened.activities[-1].performed_by == "Eve"


class TestTaskStatus:
    def test_status_pending(self, task_manager):
        task = make_task(due_date=datetime.now(timezone.utc) + timedelta(days=5))
        assert task_manager.get_task_status(task) == TaskStatus.PENDING

    def test_status_due(self, task_manager):
        task = make_task(due_date=datetime.now(timezone.utc))
        assert task_manager.get_task_status(task) == TaskStatus.DUE

    def test_status_overdue(self, task_manager):
        task = make_task(due_date=datetime.now(timezone.utc) - timedelta(days=3))
        assert task_manager.get_task_status(task) == TaskStatus.OVERDUE

    def test_status_overdue_one_day_after_due(self, task_manager):
        """A task becomes overdue the day after its due date."""
        task = make_task(due_date=datetime.now(timezone.utc) - timedelta(days=1))
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

    def test_yearly_leap_day(self, task_manager):
        """Feb 29 → Feb 28 when the next year is not a leap year."""
        task = make_task(frequency=TaskFrequency.YEARLY)
        task.last_completed_at = datetime(2024, 2, 29)
        next_due = task_manager._calculate_next_due(task)
        assert next_due.year == 2025
        assert next_due.month == 2
        assert next_due.day == 28

    def test_custom(self, task_manager):
        task = make_task(frequency=TaskFrequency.CUSTOM, custom_days_interval=45)
        task.last_completed_at = datetime(2025, 1, 1)
        next_due = task_manager._calculate_next_due(task)
        assert next_due.date() == datetime(2025, 2, 15).date()


class TestQueryMethods:
    async def test_get_tasks_due_today(self, task_manager, mock_storage):
        t1 = make_task(name="Due", due_date=datetime.now(timezone.utc))
        t2 = make_task(name="Future", due_date=datetime.now(timezone.utc) + timedelta(days=3))
        t3 = make_task(name="Disabled", due_date=datetime.now(timezone.utc), enabled=False)
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
            due_date=datetime.now(timezone.utc) + timedelta(days=1),
            notify_days_before=2,
        )
        mock_storage.upsert_task(t)
        approaching = task_manager.get_tasks_approaching_due()
        assert any(x.name == "Approaching" for x in approaching)

    async def test_get_next_due_task(self, task_manager, mock_storage):
        t1 = make_task(name="Later", due_date=datetime.now(timezone.utc) + timedelta(days=5))
        t2 = make_task(name="Sooner", due_date=datetime.now(timezone.utc) + timedelta(days=1))
        mock_storage.upsert_task(t1)
        mock_storage.upsert_task(t2)
        next_task = task_manager.get_next_due_task()
        assert next_task is not None
        assert next_task.name == "Sooner"

    async def test_get_overdue_tasks_only_returns_overdue(self, task_manager, mock_storage):
        overdue = make_task(name="Late", due_date=datetime.now(timezone.utc) - timedelta(days=3))
        due = make_task(name="Due", due_date=datetime.now(timezone.utc))
        mock_storage.upsert_task(overdue)
        mock_storage.upsert_task(due)

        result = task_manager.get_overdue_tasks()

        assert [task.name for task in result] == ["Late"]

    async def test_get_approaching_tasks_skips_due_and_disabled(self, task_manager, mock_storage):
        due_now = make_task(
            name="Due now",
            due_date=datetime.now(timezone.utc),
            notify_days_before=2,
        )
        disabled = make_task(
            name="Disabled",
            due_date=datetime.now(timezone.utc) + timedelta(days=1),
            notify_days_before=2,
            enabled=False,
        )
        mock_storage.upsert_task(due_now)
        mock_storage.upsert_task(disabled)

        assert task_manager.get_tasks_approaching_due() == []


class TestTaskUpdatedEvent:
    async def test_mutations_fire_task_updated_event(
        self, task_manager, mock_storage, mock_hass
    ):
        task = await task_manager.async_create_task(name="Evented")
        await task_manager.async_complete_task(task.task_id)
        await task_manager.async_delete_task(task.task_id)

        events = [
            call.args
            for call in mock_hass.bus.async_fire.call_args_list
            if call.args[0] == "intellikeep_task_updated"
        ]
        actions = [payload["action"] for _, payload in events]
        assert actions == ["created", "completed", "deleted"]
        assert all(payload["task_id"] == task.task_id for _, payload in events)
