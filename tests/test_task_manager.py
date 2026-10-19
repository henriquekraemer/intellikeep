"""Tests for IntelliKeep TaskManager business logic."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import pytest
from homeassistant.util import dt as dt_util

from custom_components.intellikeep.models import (
    ScheduleAnchor,
    TaskExecution,
    TaskFrequency,
    TaskPriority,
    TaskStatus,
)
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

    async def test_update_activity_shows_due_date_as_local_day(
        self, task_manager, mock_storage, sao_paulo_tz
    ):
        task = make_task(
            name="Bins",
            due_date=dt_util.as_utc(datetime(2026, 10, 9, 8, 0, tzinfo=sao_paulo_tz)),
        )
        mock_storage.upsert_task(task)

        updated = await task_manager.async_update_task(
            task.task_id,
            # 22:00 in São Paulo is 01:00 UTC on the 11th
            due_date=dt_util.as_utc(datetime(2026, 10, 10, 22, 0, tzinfo=sao_paulo_tz)),
        )

        assert updated is not None
        assert "due date: 2026-10-09 → 2026-10-10" in updated.activities[-1].details

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

    async def test_reopen_drops_the_completion_record(self, task_manager, mock_storage):
        task = make_task(name="Fix tap")
        mock_storage.upsert_task(task)
        await task_manager.async_complete_task(task.task_id)

        reopened = await task_manager.async_reopen_task(task.task_id)

        assert reopened.executions == []
        assert [a.action for a in reopened.activities] == ["completed", "reopened"]

    async def test_reopen_recurring_removes_the_occurrence_it_created(
        self, task_manager, mock_storage, mock_hass
    ):
        task = make_task(
            name="Monthly clean",
            frequency=TaskFrequency.MONTHLY,
            due_date=datetime(2025, 1, 1, tzinfo=UTC),
        )
        mock_storage.upsert_task(task)
        await task_manager.async_complete_task(task.task_id)
        next_task_id = task.executions[-1].next_task_id
        assert mock_storage.get_task(next_task_id) is not None

        await task_manager.async_reopen_task(task.task_id)

        assert mock_storage.get_task(next_task_id) is None
        assert mock_storage.get_all_tasks() == [task]
        assert task.enabled is True
        fired = [c.args[1] for c in mock_hass.bus.async_fire.call_args_list]
        assert {"task_id": next_task_id, "action": "deleted"} in fired

    async def test_reopen_keeps_an_occurrence_someone_worked_on(self, task_manager, mock_storage):
        task = make_task(name="Weekly", frequency=TaskFrequency.WEEKLY)
        mock_storage.upsert_task(task)
        await task_manager.async_complete_task(task.task_id)
        next_task_id = task.executions[-1].next_task_id
        await task_manager.async_add_task_note(next_task_id, "Bought the filter")

        await task_manager.async_reopen_task(task.task_id)

        assert mock_storage.get_task(next_task_id) is not None
        assert task.executions == []

    async def test_reopen_without_link_keeps_open_occurrences(self, task_manager, mock_storage):
        # Completions stored before next_task_id existed don't say what they created
        task = make_task(name="Weekly", frequency=TaskFrequency.WEEKLY)
        mock_storage.upsert_task(task)
        await task_manager.async_complete_task(task.task_id)
        task.executions[-1].next_task_id = None

        await task_manager.async_reopen_task(task.task_id)

        assert len(mock_storage.get_all_tasks()) == 2

    async def test_reopen_open_task_keeps_its_history(self, task_manager, mock_storage):
        task = make_task(name="Fix tap", executions=[TaskExecution()])
        mock_storage.upsert_task(task)

        await task_manager.async_reopen_task(task.task_id)

        assert len(task.executions) == 1


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

    def test_status_due_until_local_midnight(self, task_manager, sao_paulo_tz):
        """21:30 in São Paulo is already the next day in UTC; the task is still due today."""
        task = make_task(due_date=dt_util.as_utc(datetime(2026, 10, 10, 8, 0, tzinfo=sao_paulo_tz)))
        now = datetime(2026, 10, 10, 21, 30, tzinfo=sao_paulo_tz)
        with patch.object(dt_util, "utcnow", return_value=dt_util.as_utc(now)):
            assert task_manager.get_task_status(task) == TaskStatus.DUE

    def test_status_due_when_due_time_is_next_day_in_utc(self, task_manager, sao_paulo_tz):
        """22:00 in São Paulo is stored as 01:00 UTC of the next day; it is due today."""
        task = make_task(due_date=dt_util.as_utc(datetime(2026, 10, 10, 22, 0, tzinfo=sao_paulo_tz)))
        now = datetime(2026, 10, 10, 9, 0, tzinfo=sao_paulo_tz)
        with patch.object(dt_util, "utcnow", return_value=dt_util.as_utc(now)):
            assert task_manager.get_task_status(task) == TaskStatus.DUE

    def test_status_overdue_from_local_midnight(self, task_manager, sao_paulo_tz):
        task = make_task(due_date=dt_util.as_utc(datetime(2026, 10, 10, 8, 0, tzinfo=sao_paulo_tz)))
        now = datetime(2026, 10, 11, 0, 30, tzinfo=sao_paulo_tz)
        with patch.object(dt_util, "utcnow", return_value=dt_util.as_utc(now)):
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

    def test_every_45_days(self, task_manager):
        task = make_task(frequency=TaskFrequency.DAILY, repeat_interval=45)
        task.last_completed_at = datetime(2025, 1, 1)
        next_due = task_manager._calculate_next_due(task)
        assert next_due.date() == datetime(2025, 2, 15).date()

    def test_every_two_weeks(self, task_manager):
        task = make_task(frequency=TaskFrequency.WEEKLY, repeat_interval=2)
        task.last_completed_at = datetime(2025, 6, 1, tzinfo=UTC)
        assert task_manager._calculate_next_due(task) == datetime(2025, 6, 15, tzinfo=UTC)

    def test_every_three_months_clamps_month_end(self, task_manager):
        task = make_task(frequency=TaskFrequency.MONTHLY, repeat_interval=3)
        task.last_completed_at = datetime(2025, 11, 30, tzinfo=UTC)
        assert task_manager._calculate_next_due(task) == datetime(2026, 2, 28, tzinfo=UTC)

    def test_every_two_years(self, task_manager):
        task = make_task(frequency=TaskFrequency.YEARLY, repeat_interval=2)
        task.last_completed_at = datetime(2025, 3, 10, tzinfo=UTC)
        assert task_manager._calculate_next_due(task) == datetime(2027, 3, 10, tzinfo=UTC)

    def test_keeps_local_time_of_day_across_months(self, task_manager, sao_paulo_tz):
        """23:00 in São Paulo is the next day in UTC; months must be added to the local date."""
        task = make_task(frequency=TaskFrequency.MONTHLY)
        task.last_completed_at = datetime(2025, 1, 31, 23, 0, tzinfo=sao_paulo_tz)
        next_due = task_manager._calculate_next_due(task)
        assert dt_util.as_local(next_due) == datetime(2025, 2, 28, 23, 0, tzinfo=sao_paulo_tz)


class TestScheduleAnchor:
    """schedule_anchor "due_date" counts from the due date and keeps a fixed calendar."""

    DUE = datetime(2025, 1, 15, 10, 0, tzinfo=UTC)

    def _task(self, completed_at: datetime, due_date: datetime = DUE, **kwargs):
        kwargs.setdefault("frequency", TaskFrequency.MONTHLY)
        task = make_task(due_date=due_date, schedule_anchor=ScheduleAnchor.DUE_DATE, **kwargs)
        task.last_completed_at = completed_at
        return task

    def test_late_completion_keeps_the_calendar(self, task_manager):
        task = self._task(completed_at=datetime(2025, 1, 20, 18, 0, tzinfo=UTC))
        assert task_manager._calculate_next_due(task) == datetime(2025, 2, 15, 10, 0, tzinfo=UTC)

    def test_early_completion_does_not_skip_a_period(self, task_manager):
        task = self._task(completed_at=datetime(2025, 1, 10, tzinfo=UTC))
        assert task_manager._calculate_next_due(task) == datetime(2025, 2, 15, 10, 0, tzinfo=UTC)

    def test_skips_periods_already_past(self, task_manager):
        task = self._task(completed_at=datetime(2025, 4, 2, tzinfo=UTC))
        assert task_manager._calculate_next_due(task) == datetime(2025, 4, 15, 10, 0, tzinfo=UTC)

    def test_month_end_does_not_drift(self, task_manager):
        task = self._task(
            completed_at=datetime(2025, 3, 5, tzinfo=UTC),
            due_date=datetime(2025, 1, 31, 10, 0, tzinfo=UTC),
        )
        # Feb 28 is past; the next one is Mar 31, not Mar 28
        assert task_manager._calculate_next_due(task) == datetime(2025, 3, 31, 10, 0, tzinfo=UTC)

    def test_respects_repeat_interval(self, task_manager):
        task = self._task(completed_at=datetime(2025, 2, 1, tzinfo=UTC), repeat_interval=6)
        assert task_manager._calculate_next_due(task) == datetime(2025, 7, 15, 10, 0, tzinfo=UTC)

    def test_without_due_date_counts_from_completion(self, task_manager):
        task = make_task(frequency=TaskFrequency.DAILY, schedule_anchor=ScheduleAnchor.DUE_DATE)
        task.last_completed_at = datetime(2025, 1, 20, 18, 0, tzinfo=UTC)
        assert task_manager._calculate_next_due(task) == datetime(2025, 1, 21, 18, 0, tzinfo=UTC)

    def test_completion_anchor_moves_with_a_late_completion(self, task_manager):
        task = make_task(frequency=TaskFrequency.MONTHLY, due_date=self.DUE)
        task.last_completed_at = datetime(2025, 1, 20, 18, 0, tzinfo=UTC)
        assert task_manager._calculate_next_due(task) == datetime(2025, 2, 20, 18, 0, tzinfo=UTC)


class TestFutureRepeats:
    """get_future_repeats projects the occurrences after the open one, for the panel calendar."""

    DUE = datetime(2025, 1, 15, 10, 0, tzinfo=UTC)
    START = datetime(2025, 1, 1, tzinfo=UTC)
    END = datetime(2025, 5, 1, tzinfo=UTC)

    def _repeats(self, task_manager, now: datetime, start: datetime = START, end: datetime = END):
        with patch.object(dt_util, "utcnow", return_value=now):
            return [due for _, due in task_manager.get_future_repeats(start, end)]

    def test_projects_the_repeats_after_the_open_occurrence(self, task_manager, mock_storage):
        mock_storage.upsert_task(make_task(frequency=TaskFrequency.MONTHLY, due_date=self.DUE))
        assert self._repeats(task_manager, now=datetime(2025, 1, 10, tzinfo=UTC)) == [
            datetime(2025, 2, 15, 10, 0, tzinfo=UTC),
            datetime(2025, 3, 15, 10, 0, tzinfo=UTC),
            datetime(2025, 4, 15, 10, 0, tzinfo=UTC),
        ]

    def test_only_the_range_asked_for(self, task_manager, mock_storage):
        mock_storage.upsert_task(make_task(frequency=TaskFrequency.MONTHLY, due_date=self.DUE))
        repeats = self._repeats(
            task_manager,
            now=datetime(2025, 1, 10, tzinfo=UTC),
            start=datetime(2025, 3, 1, tzinfo=UTC),
            end=datetime(2025, 4, 15, 10, 0, tzinfo=UTC),
        )
        assert repeats == [datetime(2025, 3, 15, 10, 0, tzinfo=UTC)]

    def test_skips_one_time_completed_and_undated_tasks(self, task_manager, mock_storage):
        mock_storage.upsert_task(make_task(due_date=self.DUE))
        mock_storage.upsert_task(make_task(frequency=TaskFrequency.MONTHLY, due_date=self.DUE, enabled=False))
        mock_storage.upsert_task(make_task(frequency=TaskFrequency.MONTHLY))
        assert self._repeats(task_manager, now=datetime(2025, 1, 10, tzinfo=UTC)) == []

    def test_overdue_task_counted_from_completion_starts_from_today_at_its_time(self, task_manager, mock_storage):
        mock_storage.upsert_task(make_task(frequency=TaskFrequency.MONTHLY, due_date=self.DUE))
        repeats = self._repeats(task_manager, now=datetime(2025, 3, 20, 18, 0, tzinfo=UTC))
        assert repeats == [datetime(2025, 4, 20, 10, 0, tzinfo=UTC)]

    def test_overdue_task_counted_from_due_date_keeps_its_calendar(self, task_manager, mock_storage):
        mock_storage.upsert_task(make_task(
            frequency=TaskFrequency.MONTHLY, due_date=self.DUE, schedule_anchor=ScheduleAnchor.DUE_DATE,
        ))
        repeats = self._repeats(task_manager, now=datetime(2025, 3, 5, tzinfo=UTC))
        assert repeats == [datetime(2025, 3, 15, 10, 0, tzinfo=UTC), datetime(2025, 4, 15, 10, 0, tzinfo=UTC)]

    def test_weekly_on_chosen_days(self, task_manager, mock_storage):
        monday = datetime(2025, 1, 6, 7, 0, tzinfo=UTC)
        mock_storage.upsert_task(make_task(frequency=TaskFrequency.WEEKLY, weekdays=["mon", "wed"], due_date=monday))
        repeats = self._repeats(task_manager, now=datetime(2025, 1, 1, tzinfo=UTC), end=datetime(2025, 1, 16, tzinfo=UTC))
        assert repeats == [
            datetime(2025, 1, 8, 7, 0, tzinfo=UTC),
            datetime(2025, 1, 13, 7, 0, tzinfo=UTC),
            datetime(2025, 1, 15, 7, 0, tzinfo=UTC),
        ]

    async def test_first_repeat_is_what_completing_on_time_creates(self, task_manager, mock_storage):
        task = make_task(frequency=TaskFrequency.MONTHLY, due_date=datetime(2025, 1, 31, 10, 0, tzinfo=UTC))
        mock_storage.upsert_task(task)
        projected = self._repeats(task_manager, now=datetime(2025, 1, 10, tzinfo=UTC))

        with patch.object(dt_util, "utcnow", return_value=task.due_date):
            completed = await task_manager.async_complete_task(task.task_id)
        next_task = mock_storage.get_task(completed.executions[0].next_task_id)

        # Month ends clamp the way completing does: Jan 31, Feb 28, Mar 28
        assert projected[0] == next_task.due_date == datetime(2025, 2, 28, 10, 0, tzinfo=UTC)
        assert projected[1] == datetime(2025, 3, 28, 10, 0, tzinfo=UTC)


class TestNewFieldsLifecycle:
    async def test_complete_copies_schedule_and_icon(self, task_manager, mock_storage):
        task = make_task(
            frequency=TaskFrequency.MONTHLY,
            repeat_interval=3,
            schedule_anchor=ScheduleAnchor.DUE_DATE,
            icon="mdi:air-filter",
            due_date=datetime(2025, 1, 15, tzinfo=UTC),
        )
        mock_storage.upsert_task(task)

        await task_manager.async_complete_task(task.task_id)

        next_task = mock_storage.get_task(task.executions[-1].next_task_id)
        assert (next_task.repeat_interval, next_task.schedule_anchor, next_task.icon) == (
            3, ScheduleAnchor.DUE_DATE, "mdi:air-filter"
        )

    async def test_update_logs_interval_change(self, task_manager, mock_storage):
        task = make_task(frequency=TaskFrequency.WEEKLY)
        mock_storage.upsert_task(task)

        updated = await task_manager.async_update_task(task.task_id, repeat_interval=2)

        assert updated.repeat_interval == 2
        assert updated.activities[-1].details == "repeat every: 1 → 2"

    async def test_update_legacy_interval_alone_applies_to_daily_tasks(self, task_manager, mock_storage):
        task = make_task(frequency=TaskFrequency.DAILY, repeat_interval=45)
        mock_storage.upsert_task(task)

        updated = await task_manager.async_update_task(task.task_id, custom_days_interval=10)

        assert updated.repeat_interval == 10

    async def test_interval_below_one_and_empty_icon_are_cleaned(self, task_manager):
        task = await task_manager.async_create_task(name="Odd input", repeat_interval=0, icon="  ")
        assert (task.repeat_interval, task.icon) == (1, None)


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

    def test_weekday_math_uses_local_timezone(self, task_manager, sao_paulo_tz):
        """Monday 23:30 in São Paulo is already Tuesday in UTC; the schedule must follow local days."""
        task = self._task(
            completed_at=datetime(2025, 6, 2, 23, 30, tzinfo=sao_paulo_tz),  # Monday local, Tuesday UTC
            due_date=datetime(2025, 5, 27, 7, 0, tzinfo=sao_paulo_tz),  # overdue Tuesday
            weekdays=("tue",),
        )
        next_due = task_manager._calculate_next_due(task)
        assert next_due.utcoffset() == timedelta(0)
        assert dt_util.as_local(next_due) == datetime(2025, 6, 3, 7, 0, tzinfo=sao_paulo_tz)

    def test_every_two_weeks_jumps_a_week_after_the_last_day(self, task_manager):
        wednesday = datetime(2025, 6, 4, 7, 0, tzinfo=UTC)
        task = self._task(completed_at=wednesday, due_date=wednesday, weekdays=("mon", "wed"))
        task.repeat_interval = 2
        assert task_manager._calculate_next_due(task) == datetime(2025, 6, 16, 7, 0, tzinfo=UTC)

    def test_every_two_weeks_fills_the_current_week_first(self, task_manager):
        task = self._task(completed_at=datetime(2025, 6, 2, 8, 0, tzinfo=UTC), weekdays=("mon", "wed"))
        task.repeat_interval = 2
        assert task_manager._calculate_next_due(task) == datetime(2025, 6, 4, 7, 0, tzinfo=UTC)

    def test_due_date_anchor_keeps_the_fortnight_after_a_late_completion(self, task_manager):
        task = self._task(completed_at=datetime(2025, 6, 11, 12, 0, tzinfo=UTC), weekdays=("mon",))  # Wed, a week late
        task.repeat_interval = 2
        task.schedule_anchor = ScheduleAnchor.DUE_DATE
        assert task_manager._calculate_next_due(task) == datetime(2025, 6, 16, 7, 0, tzinfo=UTC)

    def test_completion_anchor_restarts_the_fortnight_after_a_late_completion(self, task_manager):
        task = self._task(completed_at=datetime(2025, 6, 11, 12, 0, tzinfo=UTC), weekdays=("mon",))
        task.repeat_interval = 2
        assert task_manager._calculate_next_due(task) == datetime(2025, 6, 23, 7, 0, tzinfo=UTC)

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


    async def test_due_today_and_approaching_follow_local_day(
        self, task_manager, mock_storage, sao_paulo_tz
    ):
        """After 21:00 in São Paulo the UTC date is already tomorrow."""
        tonight = make_task(
            name="Tonight",
            due_date=dt_util.as_utc(datetime(2026, 10, 10, 22, 0, tzinfo=sao_paulo_tz)),
        )
        tomorrow = make_task(
            name="Tomorrow",
            due_date=dt_util.as_utc(datetime(2026, 10, 11, 8, 0, tzinfo=sao_paulo_tz)),
            notify_days_before=1,
        )
        mock_storage.upsert_task(tonight)
        mock_storage.upsert_task(tomorrow)

        now = datetime(2026, 10, 10, 21, 30, tzinfo=sao_paulo_tz)
        with patch.object(dt_util, "utcnow", return_value=dt_util.as_utc(now)):
            assert [t.name for t in task_manager.get_tasks_due_today()] == ["Tonight"]
            assert [t.name for t in task_manager.get_tasks_approaching_due()] == ["Tomorrow"]
            assert task_manager.get_overdue_tasks() == []


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
