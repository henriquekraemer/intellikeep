"""Tests for IntelliKeep data models."""
from __future__ import annotations

from datetime import datetime, timezone

import pytest

from custom_components.intellikeep.models import Task, TaskFrequency, normalize_weekdays


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
