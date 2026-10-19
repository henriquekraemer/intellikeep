"""Tests for the IntelliKeep calendar entity."""
from __future__ import annotations

from datetime import date, datetime, timedelta, timezone

import pytest
from homeassistant.util import dt as dt_util

from custom_components.intellikeep.calendar import IntelliKeepCalendar, async_setup_entry
from tests.conftest import make_task


@pytest.fixture
def calendar(mock_hass, mock_config_entry, runtime_data, task_manager):
    runtime_data.coordinator.data = {"all_tasks": task_manager.get_all_tasks()}
    entity = IntelliKeepCalendar(runtime_data.coordinator, mock_config_entry)
    entity.hass = mock_hass
    return entity


def load(calendar: IntelliKeepCalendar, mock_storage, *tasks) -> None:
    for task in tasks:
        mock_storage.upsert_task(task)
    calendar.coordinator.data = {"all_tasks": mock_storage.get_all_tasks()}


async def test_setup_adds_one_calendar(mock_hass, mock_config_entry):
    added = []
    await async_setup_entry(mock_hass, mock_config_entry, added.extend)
    assert len(added) == 1
    assert added[0].unique_id == "entry-1_calendar"


async def test_open_tasks_with_a_due_date(calendar, mock_storage, sao_paulo_tz):
    timed = make_task(name="Filter", description="Central unit", due_date=datetime(2026, 10, 20, 22, 14, tzinfo=timezone.utc))
    all_day = make_task(name="Gutters", due_date=datetime(2026, 10, 21, 3, 0, tzinfo=timezone.utc))
    undated = make_task(name="Undated")
    done = make_task(name="Done", enabled=False, due_date=datetime(2026, 10, 20, 12, 0, tzinfo=timezone.utc))
    load(calendar, mock_storage, timed, all_day, undated, done)

    events = await calendar.async_get_events(
        calendar.hass,
        datetime(2026, 10, 19, tzinfo=sao_paulo_tz),
        datetime(2026, 10, 26, tzinfo=sao_paulo_tz),
    )

    assert [event.summary for event in events] == ["Filter", "Gutters"]
    filter_event, gutters_event = events
    assert filter_event.uid == timed.task_id
    assert filter_event.description == "Central unit"
    # A due time is a moment
    assert filter_event.start == filter_event.end == datetime(2026, 10, 20, 19, 14, tzinfo=sao_paulo_tz)
    # Local midnight means no time: an all-day event
    assert gutters_event.all_day
    assert (gutters_event.start, gutters_event.end) == (date(2026, 10, 21), date(2026, 10, 22))
    assert gutters_event.description is None


async def test_range(calendar, mock_storage, sao_paulo_tz):
    start = datetime(2026, 10, 20, tzinfo=sao_paulo_tz)
    at_start = make_task(name="At start", due_date=dt_util.as_utc(start))
    inside = make_task(name="Inside", due_date=dt_util.as_utc(start + timedelta(hours=10)))
    at_end = make_task(name="At end", due_date=dt_util.as_utc(start + timedelta(days=1, hours=1)))
    before = make_task(name="Before", due_date=dt_util.as_utc(start - timedelta(hours=1)))
    load(calendar, mock_storage, at_start, inside, at_end, before)

    events = await calendar.async_get_events(calendar.hass, start, start + timedelta(days=1, hours=1))

    # "At start" is local midnight, so it is the all-day event of Oct 20
    assert [event.summary for event in events] == ["At start", "Inside"]


async def test_overdue_tasks_stay_on_their_day(calendar, mock_storage):
    overdue = make_task(name="Overdue", due_date=dt_util.utcnow() - timedelta(days=3))
    load(calendar, mock_storage, overdue)
    now = dt_util.now()

    events = await calendar.async_get_events(calendar.hass, now - timedelta(days=7), now)

    assert [event.summary for event in events] == ["Overdue"]


def test_event_is_the_next_task_due(calendar, mock_storage):
    now = dt_util.utcnow()
    past = make_task(name="Past", due_date=now - timedelta(hours=2))
    soon = make_task(name="Soon", due_date=now + timedelta(hours=2))
    later = make_task(name="Later", due_date=now + timedelta(days=3))
    load(calendar, mock_storage, past, later, soon)

    assert calendar.event is not None
    assert calendar.event.summary == "Soon"


def test_event_includes_a_task_due_today_all_day(calendar, mock_storage):
    today = dt_util.start_of_local_day()
    all_day = make_task(name="Today", due_date=dt_util.as_utc(today))
    load(calendar, mock_storage, all_day)

    assert calendar.event is not None
    assert calendar.event.summary == "Today"


def test_no_event_without_upcoming_tasks(calendar, mock_storage):
    load(calendar, mock_storage, make_task(name="Past", due_date=dt_util.utcnow() - timedelta(days=1)))

    assert calendar.event is None
