"""Tests for IntelliKeep TaskManager business logic."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import pytest
from homeassistant.util import dt as dt_util

from custom_components.intellikeep.models import TaskFrequency, TaskPriority, TaskStatus
from tests.conftest import make_task

UTC = timezone.utc


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


class TestWeekdayScheduling:
    """Weekly tasks pinned to specific weekdays (issue #28).

    Calendar reference: 2025-06-02 is a Monday.
    """

    MONDAY = datetime(2025, 6, 2, 7, 0, tzinfo=UTC)

    def _task(self, completed_at: datetime, due_date: datetime | None = MONDAY, weekdays=("mon", "wed", "fri")):
        task = make_task(
            frequency=TaskFrequency.WEEKLY,
            weekdays=list(weekdays),
            due_date=due_date,
        )
        task.last_completed_at = completed_at
        return task

    def test_on_time_completion_moves_to_next_selected_day(self, task_manager):
        task = self._task(completed_at=datetime(2025, 6, 2, 8, 0, tzinfo=UTC))
        assert task_manager._calculate_next_due(task) == datetime(2025, 6, 4, 7, 0, tzinfo=UTC)

    def test_late_completion_uses_completion_day(self, task_manager):
        task = self._task(completed_at=datetime(2025, 6, 3, 10, 0, tzinfo=UTC))  # Tuesday
        assert task_manager._calculate_next_due(task) == datetime(2025, 6, 4, 7, 0, tzinfo=UTC)

    def test_early_completion_anchors_on_due_date(self, task_manager):
        """Completing on Sunday must not re-schedule the same Monday."""
        task = self._task(completed_at=datetime(2025, 6, 1, 18, 0, tzinfo=UTC))
        assert task_manager._calculate_next_due(task) == datetime(2025, 6, 4, 7, 0, tzinfo=UTC)

    def test_very_late_completion_picks_next_day_after_completion(self, task_manager):
        task = self._task(completed_at=datetime(2025, 6, 19, 12, 0, tzinfo=UTC))  # Thursday, 2 weeks late
        assert task_manager._calculate_next_due(task) == datetime(2025, 6, 20, 7, 0, tzinfo=UTC)

    def test_wraps_to_next_week(self, task_manager):
        friday = datetime(2025, 6, 6, 7, 0, tzinfo=UTC)
        task = self._task(completed_at=friday + timedelta(hours=1), due_date=friday)
        assert task_manager._calculate_next_due(task) == datetime(2025, 6, 9, 7, 0, tzinfo=UTC)

    def test_single_weekday_is_one_week_later(self, task_manager):
        saturday = datetime(2025, 6, 7, 7, 0, tzinfo=UTC)
        task = self._task(completed_at=saturday, due_date=saturday, weekdays=("sat",))
        assert task_manager._calculate_next_due(task) == datetime(2025, 6, 14, 7, 0, tzinfo=UTC)

    def test_keeps_original_time_of_day(self, task_manager):
        task = self._task(completed_at=datetime(2025, 6, 2, 23, 45, tzinfo=UTC))
        next_due = task_manager._calculate_next_due(task)
        assert (next_due.hour, next_due.minute) == (7, 0)

    def test_without_due_date_uses_completion_time(self, task_manager):
        task = self._task(completed_at=datetime(2025, 6, 2, 8, 30, tzinfo=UTC), due_date=None)
        assert task_manager._calculate_next_due(task) == datetime(2025, 6, 4, 8, 30, tzinfo=UTC)

    def test_empty_weekdays_keeps_legacy_behaviour(self, task_manager):
        completed = datetime(2025, 6, 3, 10, 0, tzinfo=UTC)
        task = self._task(completed_at=completed, weekdays=())
        assert task_manager._calculate_next_due(task) == completed + timedelta(weeks=1)

    def test_weekday_math_uses_local_timezone(self, task_manager):
        """Monday 23:30 in São Paulo is already Tuesday in UTC; the schedule must follow local days."""
        original_tz = dt_util.DEFAULT_TIME_ZONE
        tz = dt_util.get_time_zone("America/Sao_Paulo")
        dt_util.set_default_time_zone(tz)
        try:
            task = self._task(
                completed_at=datetime(2025, 6, 2, 23, 30, tzinfo=tz),  # Monday local, Tuesday UTC
                due_date=datetime(2025, 5, 27, 7, 0, tzinfo=tz),  # overdue Tuesday
                weekdays=("tue",),
            )
            next_due = task_manager._calculate_next_due(task)
            assert next_due.utcoffset() == timedelta(0)
            assert dt_util.as_local(next_due) == datetime(2025, 6, 3, 7, 0, tzinfo=tz)
        finally:
            dt_util.set_default_time_zone(original_tz)

    async def test_complete_copies_weekdays_to_next_occurrence(self, task_manager, mock_storage):
        task = make_task(
            name="Household waste",
            frequency=TaskFrequency.WEEKLY,
            weekdays=["mon", "wed", "fri"],
            due_date=self.MONDAY,
        )
        mock_storage.upsert_task(task)

        with patch.object(dt_util, "utcnow", return_value=datetime(2025, 6, 2, 8, 0, tzinfo=UTC)):
            await task_manager.async_complete_task(task.task_id)

        next_task = next(t for t in mock_storage.get_all_tasks() if t.task_id != task.task_id)
        assert next_task.weekdays == ["mon", "wed", "fri"]
        assert next_task.due_date == datetime(2025, 6, 4, 7, 0, tzinfo=UTC)
        assert next_task.previous_task_id == task.task_id

    async def test_create_normalizes_weekdays(self, task_manager):
        task = await task_manager.async_create_task(
            name="Recyclables",
            frequency=TaskFrequency.WEEKLY,
            weekdays=["SAT", "tue", "sat"],
        )
        assert task.weekdays == ["tue", "sat"]

    async def test_update_records_weekday_change_in_activity_log(self, task_manager, mock_storage):
        task = make_task(frequency=TaskFrequency.WEEKLY, weekdays=["mon"])
        mock_storage.upsert_task(task)

        updated = await task_manager.async_update_task(task.task_id, weekdays=["wed", "mon"])

        assert updated.weekdays == ["mon", "wed"]
        assert updated.activities[-1].details == "weekdays: mon → mon, wed"

    async def test_update_with_same_weekdays_does_not_log(self, task_manager, mock_storage):
        task = make_task(frequency=TaskFrequency.WEEKLY, weekdays=["mon", "wed"])
        mock_storage.upsert_task(task)

        updated = await task_manager.async_update_task(task.task_id, weekdays=["wed", "mon"])

        assert updated.activities == []


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


class TestBulkOperations:
    async def test_add_tasks_assigns_sequential_numbers(self, task_manager, mock_storage):
        await task_manager.async_add_tasks([make_task(name="A"), make_task(name="B")])

        numbers = [t.task_number for t in task_manager.get_all_tasks()]
        assert numbers == [1, 2]

    async def test_delete_all_tasks_returns_count(self, task_manager, mock_storage):
        mock_storage.upsert_task(make_task(name="One"))
        mock_storage.upsert_task(make_task(name="Two"))

        count = await task_manager.async_delete_all_tasks()

        assert count == 2
        assert task_manager.get_all_tasks() == []


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
