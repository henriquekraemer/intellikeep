"""Tests for IntelliKeep data models."""
from __future__ import annotations

from datetime import datetime, timezone

import pytest

from custom_components.intellikeep.models import (
    ScheduleAnchor,
    Task,
    TaskExecution,
    TaskFrequency,
    normalize_weekdays,
)


class TestNormalizeWeekdays:
    def test_none_and_empty_return_empty_list(self):
        assert normalize_weekdays(None) == []
        assert normalize_weekdays([]) == []

    def test_orders_monday_first_and_removes_duplicates(self):
        assert normalize_weekdays(["fri", "mon", "wed", "mon"]) == ["mon", "wed", "fri"]

    def test_accepts_single_string(self):
        assert normalize_weekdays("sat") == ["sat"]

    def test_is_case_insensitive_and_accepts_full_names(self):
        assert normalize_weekdays(["Monday", "WED", " friday "]) == ["mon", "wed", "fri"]

    def test_strict_rejects_unknown_codes(self):
        with pytest.raises(ValueError, match="funday"):
            normalize_weekdays(["mon", "funday"])

    def test_lenient_drops_unknown_codes(self):
        assert normalize_weekdays(["mon", "funday", 3], strict=False) == ["mon"]
        assert normalize_weekdays(42, strict=False) == []


class TestTaskWeekdaysSerialization:
    def test_round_trip_keeps_weekdays(self):
        task = Task(
            name="Trash",
            frequency=TaskFrequency.WEEKLY,
            weekdays=["mon", "wed", "fri"],
            due_date=datetime(2025, 6, 2, 7, 0, tzinfo=timezone.utc),
        )
        restored = Task.from_dict(task.as_dict())
        assert restored.weekdays == ["mon", "wed", "fri"]

    def test_from_dict_without_weekdays_defaults_to_empty(self):
        data = Task(name="Legacy").as_dict()
        del data["weekdays"]
        assert Task.from_dict(data).weekdays == []

    def test_from_dict_drops_unknown_weekday_codes(self):
        data = Task(name="Corrupt").as_dict()
        data["weekdays"] = ["mon", "funday"]
        assert Task.from_dict(data).weekdays == ["mon"]


class TestTaskExecutionSerialization:
    def test_round_trip_keeps_next_task_id(self):
        execution = TaskExecution(task_id="a", next_task_id="b")
        assert TaskExecution.from_dict(execution.as_dict()).next_task_id == "b"

    def test_from_dict_without_next_task_id_defaults_to_none(self):
        data = TaskExecution(task_id="a").as_dict()
        del data["next_task_id"]
        assert TaskExecution.from_dict(data).next_task_id is None


class TestScheduleFieldsSerialization:
    def test_round_trip_keeps_interval_anchor_and_icon(self):
        task = Task(
            name="Filter",
            frequency=TaskFrequency.MONTHLY,
            repeat_interval=3,
            schedule_anchor=ScheduleAnchor.DUE_DATE,
            icon="mdi:air-filter",
        )
        restored = Task.from_dict(task.as_dict())
        assert (restored.repeat_interval, restored.schedule_anchor, restored.icon) == (
            3, ScheduleAnchor.DUE_DATE, "mdi:air-filter"
        )

    def test_from_dict_without_new_fields_uses_defaults(self):
        data = Task(name="Legacy").as_dict()
        for key in ("repeat_interval", "schedule_anchor", "icon"):
            del data[key]
        task = Task.from_dict(data)
        assert (task.repeat_interval, task.schedule_anchor, task.icon) == (1, ScheduleAnchor.COMPLETION, None)

    def test_from_dict_turns_legacy_custom_into_daily_interval(self):
        data = Task(name="Legacy").as_dict()
        data.update(frequency="custom", custom_days_interval=45)
        del data["repeat_interval"]
        task = Task.from_dict(data)
        assert (task.frequency, task.repeat_interval) == (TaskFrequency.DAILY, 45)
        assert "custom_days_interval" not in task.as_dict()

    def test_from_dict_legacy_custom_without_interval_defaults_to_30_days(self):
        data = Task(name="Legacy").as_dict()
        data["frequency"] = "custom"
        del data["repeat_interval"]
        assert Task.from_dict(data).repeat_interval == 30
