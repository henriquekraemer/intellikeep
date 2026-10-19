"""Calendar platform for IntelliKeep: open tasks on their due dates."""
from __future__ import annotations

from datetime import datetime, timedelta

from homeassistant.components.calendar import CalendarEntity, CalendarEvent
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from .coordinator import IntelliKeepCoordinator
from .entity import IntelliKeepEntity, local_due
from .models import Task
from .runtime_data import IntelliKeepConfigEntry

PARALLEL_UPDATES = 0


async def async_setup_entry(
    hass: HomeAssistant,
    entry: IntelliKeepConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    async_add_entities([IntelliKeepCalendar(entry.runtime_data.coordinator, entry)])


def task_event(task: Task, due_date: datetime) -> CalendarEvent:
    """An event at the task's due time, or all day when it has no time (local midnight).

    A due date is a moment, not a span, so timed events start and end at once;
    calendar triggers still fire at that time.
    """
    start = local_due(due_date)
    end = start if isinstance(start, datetime) else start + timedelta(days=1)
    return CalendarEvent(
        start=start,
        end=end,
        summary=task.name,
        description=task.description or None,
        uid=task.task_id,
    )


class IntelliKeepCalendar(IntelliKeepEntity, CalendarEntity):
    """Read-only calendar of the open tasks that have a due date, overdue ones included.

    Completed tasks are left out, so a task done early doesn't trigger
    automations at its old due time, and future repeats are not projected:
    the next occurrence appears once the current one is completed.
    """

    _attr_translation_key = "tasks"

    def __init__(self, coordinator: IntelliKeepCoordinator, entry: IntelliKeepConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"{entry.entry_id}_calendar"

    def _events(self) -> list[CalendarEvent]:
        tasks: list[Task] = self.coordinator.data.get("all_tasks", [])
        return sorted(
            (task_event(task, task.due_date) for task in tasks if task.enabled and task.due_date is not None),
            key=lambda event: event.start_datetime_local,
        )

    @property
    def event(self) -> CalendarEvent | None:
        """The task due today (all day) or next, which sets the calendar's state."""
        now = dt_util.now()
        return next(
            (
                event
                for event in self._events()
                if (event.end_datetime_local > now if event.all_day else event.start_datetime_local >= now)
            ),
            None,
        )

    async def async_get_events(
        self, hass: HomeAssistant, start_date: datetime, end_date: datetime
    ) -> list[CalendarEvent]:
        # Timed events have no length: they count when their time falls in the range
        return [
            event
            for event in self._events()
            if event.start_datetime_local < end_date
            and (event.end_datetime_local > start_date or event.start_datetime_local >= start_date)
        ]
