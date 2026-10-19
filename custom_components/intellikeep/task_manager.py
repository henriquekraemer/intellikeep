"""Business logic for IntelliKeep task management."""
from __future__ import annotations

import calendar
import logging
from dataclasses import replace
from datetime import date, datetime, timedelta
from typing import Any

from homeassistant.const import WEEKDAYS
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .const import EVENT_TASK_UPDATED
from .models import (
    ScheduleAnchor,
    Task,
    TaskActivity,
    TaskActivityType,
    TaskExecution,
    TaskFrequency,
    TaskNote,
    TaskStatus,
    migrate_legacy_interval,
    normalize_weekdays,
)
from .storage import IntelliKeepStorage

_LOGGER = logging.getLogger(__name__)

# Repeats projected per task at most: close to three years of a daily task
_MAX_PROJECTED_REPEATS = 1000

_TRACKED_FIELD_LABELS: dict[str, str] = {
    "name": "name",
    "description": "description",
    "priority": "priority",
    "frequency": "frequency",
    "repeat_interval": "repeat every",
    "schedule_anchor": "next due from",
    "weekdays": "weekdays",
    "icon": "icon",
    "due_date": "due date",
    "notify_days_before": "notify before",
    "notify_on_overdue": "notify overdue",
    "linked_entity_ids": "linked",
}


def _fmt_val(val: object) -> str:
    if val is None:
        return "—"
    if isinstance(val, datetime):
        return dt_util.as_local(val).date().isoformat()
    if isinstance(val, list):
        return f"{len(val)} entr{'y' if len(val) == 1 else 'ies'}"
    if isinstance(val, bool):
        return "yes" if val else "no"
    return str(val)


def _add_periods(start: datetime, frequency: TaskFrequency, count: int) -> datetime:
    """``start`` moved by ``count`` days, weeks, months or years.

    Month ends clamp (Jan 31 + 1 month = Feb 28). With a local ``start`` the
    wall-clock time is kept across DST changes.
    """
    match frequency:
        case TaskFrequency.DAILY | TaskFrequency.CUSTOM:
            return start + timedelta(days=count)
        case TaskFrequency.WEEKLY:
            return start + timedelta(weeks=count)
        case TaskFrequency.MONTHLY:
            months = count
        case TaskFrequency.YEARLY:
            months = 12 * count
        case _:
            return start
    month_index = start.month - 1 + months
    year, month = start.year + month_index // 12, month_index % 12 + 1
    return start.replace(year=year, month=month, day=min(start.day, calendar.monthrange(year, month)[1]))


def _fmt_weekdays(val: list[str]) -> str:
    return ", ".join(val) if val else "—"


def _item_label(val: str) -> str:
    if val.startswith("area:"):
        return f"area:{val[5:]}"
    if val.startswith("device:"):
        return f"device:{val[7:]}"
    return val


def _fmt_list_diff(_label: str, old: list, new: list) -> str:
    old_set = set(old)
    new_set = set(new)
    added = new_set - old_set
    removed = old_set - new_set
    parts: list[str] = []
    if added:
        parts.append("added " + ", ".join(_item_label(v) for v in sorted(added)))
    if removed:
        parts.append("removed " + ", ".join(_item_label(v) for v in sorted(removed)))
    return "linked: " + "; ".join(parts)


class TaskManager:
    """Handles all task operations and scheduling logic."""

    def __init__(self, hass: HomeAssistant, storage: IntelliKeepStorage) -> None:
        self.hass = hass
        self._storage = storage

    def _fire_task_updated(self, task_id: str, action: str) -> None:
        """Fire intellikeep_task_updated so users can build automations on changes."""
        self.hass.bus.async_fire(
            EVENT_TASK_UPDATED, {"task_id": task_id, "action": action}
        )

    # ------------------------------------------------------------------
    # CRUD
    # ------------------------------------------------------------------

    @staticmethod
    def _normalize_fields(kwargs: dict[str, Any], task: Task | None = None) -> dict[str, Any]:
        """Clean up create/update input in place: legacy interval, weekdays, interval floor, empty icon."""
        migrate_legacy_interval(kwargs, task.frequency if task else None)
        if "weekdays" in kwargs:
            kwargs["weekdays"] = normalize_weekdays(kwargs["weekdays"])
        if "repeat_interval" in kwargs:
            kwargs["repeat_interval"] = max(1, int(kwargs["repeat_interval"] or 1))
        if "icon" in kwargs:
            kwargs["icon"] = (kwargs["icon"] or "").strip() or None
        return kwargs

    async def async_create_task(self, **kwargs: Any) -> Task:
        kwargs.setdefault("task_number", self._storage.next_task_number())
        task = Task(**self._normalize_fields(kwargs))
        self._storage.upsert_task(task)
        await self._storage.async_save()
        self._fire_task_updated(task.task_id, "created")
        _LOGGER.debug("Created task %s (%s)", task.task_id, task.name)
        return task

    async def async_update_task(self, task_id: str, updated_by: str = "", **kwargs: Any) -> Task | None:
        task = self._storage.get_task(task_id)
        if task is None:
            _LOGGER.warning("Update called for unknown task_id: %s", task_id)
            return None
        self._normalize_fields(kwargs, task)
        changes: list[str] = []
        for field_name, label in _TRACKED_FIELD_LABELS.items():
            if field_name not in kwargs:
                continue
            old_val = getattr(task, field_name, None)
            new_val = kwargs[field_name]
            if field_name == "weekdays":
                if old_val != new_val:
                    changes.append(
                        f"{label}: {_fmt_weekdays(old_val)} → {_fmt_weekdays(new_val)}"
                    )
            elif isinstance(old_val, list) and isinstance(new_val, list):
                if set(old_val) != set(new_val):
                    changes.append(_fmt_list_diff(label, old_val, new_val))
            elif old_val != new_val:
                changes.append(f"{label}: {_fmt_val(old_val)} → {_fmt_val(new_val)}")
        for key, value in kwargs.items():
            if key == "notes":
                continue
            if hasattr(task, key):
                setattr(task, key, value)
        task.updated_at = dt_util.utcnow()
        if changes:
            task.activities.append(TaskActivity(
                task_id=task_id,
                action=TaskActivityType.EDITED,
                performed_by=updated_by,
                details=", ".join(changes),
            ))
        self._storage.upsert_task(task)
        await self._storage.async_save()
        self._fire_task_updated(task_id, "updated")
        return task

    async def async_complete_task(
        self,
        task_id: str,
        completed_by: str = "",
        notes: str = "",
    ) -> Task | None:
        task = self._storage.get_task(task_id)
        if task is None:
            _LOGGER.warning("Complete called for unknown task_id: %s", task_id)
            return None

        now = dt_util.utcnow()
        was_late = self.get_task_status(task) == TaskStatus.OVERDUE
        execution = TaskExecution(
            task_id=task_id,
            completed_at=now,
            completed_by=completed_by,
            notes=notes,
            was_late=was_late,
        )
        task.executions.append(execution)
        task.last_completed_at = now
        task.enabled = False
        task.updated_at = now
        task.activities.append(TaskActivity(
            task_id=task_id,
            action=TaskActivityType.COMPLETED,
            performed_by=completed_by,
        ))
        self._storage.upsert_task(task)

        if task.frequency != TaskFrequency.ONE_TIME:
            # Root of this family: use existing parent ref, or this task itself if it's the root
            root_id = task.previous_task_id or task.task_id
            # Only create a next occurrence if one doesn't already exist
            already_open = any(
                t.enabled and t.previous_task_id == root_id
                for t in self._storage.get_all_tasks()
            )
            if not already_open:
                next_due = self._calculate_next_due(task)
                next_task = Task(
                    name=task.name,
                    description=task.description,
                    priority=task.priority,
                    frequency=task.frequency,
                    repeat_interval=task.repeat_interval,
                    schedule_anchor=task.schedule_anchor,
                    weekdays=list(task.weekdays),
                    icon=task.icon,
                    due_date=next_due,
                    linked_entity_ids=list(task.linked_entity_ids),
                    notify_days_before=task.notify_days_before,
                    notify_on_overdue=task.notify_on_overdue,
                    enabled=True,
                    previous_task_id=root_id,
                    task_number=self._storage.next_task_number(),
                )
                self._storage.upsert_task(next_task)
                execution.next_task_id = next_task.task_id
                _LOGGER.debug(
                    "Created next occurrence %s for recurring task %s (due %s, root %s)",
                    next_task.task_id, task_id, next_due.isoformat(), root_id,
                )
            else:
                _LOGGER.debug(
                    "Skipped new occurrence for task %s — an open occurrence already exists",
                    task_id,
                )

        await self._storage.async_save()
        self._fire_task_updated(task_id, "completed")
        _LOGGER.debug("Completed task %s by %s", task_id, completed_by or "unknown")
        return task

    async def async_add_task_note(
        self,
        task_id: str,
        content: str,
        added_by: str = "",
    ) -> TaskNote | None:
        task = self._storage.get_task(task_id)
        if task is None:
            _LOGGER.warning("add_task_note called for unknown task_id: %s", task_id)
            return None
        note = TaskNote(task_id=task_id, content=content, added_by=added_by)
        task.notes.append(note)
        task.activities.append(TaskActivity(
            task_id=task_id,
            action=TaskActivityType.NOTE_ADDED,
            performed_by=added_by,
        ))
        task.updated_at = dt_util.utcnow()
        self._storage.upsert_task(task)
        await self._storage.async_save()
        self._fire_task_updated(task_id, "note_added")
        _LOGGER.debug("Added note to task %s", task_id)
        return note

    async def async_delete_task_note(
        self,
        task_id: str,
        note_id: str,
    ) -> bool:
        task = self._storage.get_task(task_id)
        if task is None:
            _LOGGER.warning("delete_task_note called for unknown task_id: %s", task_id)
            return False
        original_len = len(task.notes)
        task.notes = [n for n in task.notes if n.note_id != note_id]
        if len(task.notes) == original_len:
            _LOGGER.warning("delete_task_note: note_id not found: %s", note_id)
            return False
        task.activities.append(TaskActivity(
            task_id=task_id,
            action=TaskActivityType.NOTE_DELETED,
        ))
        task.updated_at = dt_util.utcnow()
        self._storage.upsert_task(task)
        await self._storage.async_save()
        self._fire_task_updated(task_id, "note_deleted")
        _LOGGER.debug("Deleted note %s from task %s", note_id, task_id)
        return True

    async def async_reopen_task(self, task_id: str, performed_by: str = "") -> Task | None:
        task = self._storage.get_task(task_id)
        if task is None:
            _LOGGER.warning("Reopen called for unknown task_id: %s", task_id)
            return None
        # Reopening takes back the last completion: its record goes, and so does the
        # occurrence it created, unless that one was already edited, noted or completed
        spawned: Task | None = None
        if not task.enabled and task.executions:
            execution = task.executions.pop()
            candidate = self._storage.get_task(execution.next_task_id) if execution.next_task_id else None
            if candidate is not None and candidate.enabled and not (
                candidate.executions or candidate.notes or candidate.activities
            ):
                spawned = candidate
                self._storage.delete_task(candidate.task_id)
        task.enabled = True
        task.last_completed_at = None
        task.updated_at = dt_util.utcnow()
        task.activities.append(TaskActivity(
            task_id=task_id,
            action=TaskActivityType.REOPENED,
            performed_by=performed_by,
        ))
        self._storage.upsert_task(task)
        await self._storage.async_save()
        self._fire_task_updated(task_id, "reopened")
        if spawned is not None:
            self._fire_task_updated(spawned.task_id, "deleted")
        _LOGGER.debug("Reopened task %s", task_id)
        return task

    async def async_delete_task(self, task_id: str) -> bool:
        deleted = self._storage.delete_task(task_id)
        if deleted:
            await self._storage.async_save()
            self._fire_task_updated(task_id, "deleted")
            _LOGGER.debug("Deleted task %s", task_id)
        return deleted

    async def async_add_tasks(self, tasks: list[Task]) -> None:
        """Bulk-insert tasks, assigning sequential task numbers."""
        for task in tasks:
            task.task_number = self._storage.next_task_number()
            self._storage.upsert_task(task)
        await self._storage.async_save()
        _LOGGER.debug("Bulk-added %d tasks", len(tasks))

    async def async_delete_all_tasks(self) -> int:
        """Delete every task and return how many were removed."""
        count = self._storage.clear_all_tasks()
        await self._storage.async_save()
        _LOGGER.debug("Deleted all tasks (%d removed)", count)
        return count

    # ------------------------------------------------------------------
    # Queries
    # ------------------------------------------------------------------

    def get_task(self, task_id: str) -> Task | None:
        return self._storage.get_task(task_id)

    def get_all_tasks(self) -> list[Task]:
        return self._storage.get_all_tasks()

    def days_until_due(self, task: Task) -> int | None:
        """Calendar days from today to the due date, negative once it has passed.

        None for a task without due date. Days are counted in Home Assistant's
        local timezone: due dates are stored in UTC, and the UTC date differs
        from the local one for part of every day.
        """
        if task.due_date is None:
            return None
        today = dt_util.as_local(dt_util.utcnow()).date()
        return (dt_util.as_local(task.due_date).date() - today).days

    def get_task_status(self, task: Task) -> TaskStatus:
        if not task.enabled:
            return TaskStatus.COMPLETED
        days_left = self.days_until_due(task)
        if days_left is None:
            return TaskStatus.PENDING
        if days_left < 0:
            return TaskStatus.OVERDUE
        if days_left == 0:
            return TaskStatus.DUE
        return TaskStatus.PENDING

    def get_tasks_due_today(self) -> list[Task]:
        return [
            t
            for t in self._storage.get_all_tasks()
            if t.enabled
            and (days_left := self.days_until_due(t)) is not None
            and days_left <= 0
        ]

    def get_overdue_tasks(self) -> list[Task]:
        return [
            t
            for t in self._storage.get_all_tasks()
            if self.get_task_status(t) == TaskStatus.OVERDUE
        ]

    def get_tasks_approaching_due(self) -> list[Task]:
        """Return tasks within their notify_days_before window (but not yet due)."""
        result = []
        for task in self._storage.get_all_tasks():
            if not task.enabled:
                continue
            days_left = self.days_until_due(task)
            if days_left is not None and 0 < days_left <= task.notify_days_before:
                result.append(task)
        return result

    def get_next_due_task(self) -> Task | None:
        pending = [
            t
            for t in self._storage.get_all_tasks()
            if t.enabled and t.due_date is not None
        ]
        if not pending:
            return None
        return min(pending, key=lambda t: t.due_date)  # type: ignore[arg-type]

    def get_all_tasks_with_status(self) -> list[dict]:
        return [
            t.as_dict_with_status(self.get_task_status(t))
            for t in self._storage.get_all_tasks()
        ]

    def get_future_repeats(self, start: datetime, end: datetime) -> list[tuple[Task, datetime]]:
        """Due dates the open recurring tasks repeat on from ``start`` to ``end``.

        Only the open occurrence of a task is stored, so the ones after it are
        projected the way completing builds them, each assumed done on its due
        date. That is exact for tasks counted from their due date and an estimate
        for tasks counted from completion.
        """
        now = dt_util.utcnow()
        repeats: list[tuple[Task, datetime]] = []
        for task in self._storage.get_all_tasks():
            if not task.enabled or task.due_date is None or task.frequency == TaskFrequency.ONE_TIME:
                continue
            due = dt_util.as_utc(task.due_date)
            for _ in range(_MAX_PROJECTED_REPEATS):
                done_at = self._assumed_completion(task, due, now)
                next_due = self._calculate_next_due(replace(task, due_date=due, last_completed_at=done_at))
                if next_due <= due or next_due >= end:
                    break
                if next_due >= start:
                    repeats.append((task, next_due))
                due = next_due
        return repeats

    # ------------------------------------------------------------------
    # Scheduling
    # ------------------------------------------------------------------

    def _calculate_next_due(self, task: Task) -> datetime:
        """Next due date of a recurring task: ``repeat_interval`` periods on.

        Counted from the completion, or with ``schedule_anchor`` "due_date" from
        the task's own due date, skipping the periods already past so a late
        completion doesn't schedule something that is overdue at once. Calendar
        math runs in Home Assistant's local time zone.
        """
        done_at = dt_util.as_utc(task.last_completed_at or dt_util.utcnow())
        if task.frequency == TaskFrequency.WEEKLY and task.weekdays:
            return self._next_weekday_due(task, done_at)
        step = max(1, task.repeat_interval)
        if task.schedule_anchor == ScheduleAnchor.DUE_DATE and task.due_date:
            start = dt_util.as_local(task.due_date)
            periods = step
            # Always from the due date itself (not the previous candidate) so month ends don't drift
            while (candidate := _add_periods(start, task.frequency, periods)) <= done_at:
                periods += step
            return dt_util.as_utc(candidate)
        return dt_util.as_utc(_add_periods(dt_util.as_local(done_at), task.frequency, step))

    @staticmethod
    def _assumed_completion(task: Task, due: datetime, now: datetime) -> datetime:
        """When a projection assumes the occurrence due at ``due`` gets done.

        On its due date, or now when it is overdue. A task counted from
        completion takes its time of day from the completion, so an overdue one
        is assumed done today at its due time instead.
        """
        if due >= now:
            return due
        if task.schedule_anchor == ScheduleAnchor.DUE_DATE or (
            task.frequency == TaskFrequency.WEEKLY and task.weekdays
        ):
            return now
        today = dt_util.as_local(now).date()
        return dt_util.as_utc(
            datetime.combine(today, dt_util.as_local(due).time(), tzinfo=dt_util.DEFAULT_TIME_ZONE)
        )

    @staticmethod
    def _next_weekday_due(task: Task, done_at: datetime) -> datetime:
        """Next due date for a weekly task pinned to specific weekdays.

        Takes the next selected weekday of the same Monday-first week, or the
        first selected weekday ``repeat_interval`` weeks on. Counts from the
        later of the due date and the completion, so completing early does not
        re-schedule the occurrence that was just done; with ``schedule_anchor``
        "due_date" it steps from the due date instead and skips slots already
        past, which keeps the fortnightly (or longer) rhythm. The original due
        time of day is kept so the schedule does not drift towards completion
        times. Weekday math runs in Home Assistant's local timezone.
        """
        allowed = sorted({WEEKDAYS.index(code) for code in task.weekdays if code in WEEKDAYS})
        step = max(1, task.repeat_interval)
        if not allowed:
            return done_at + timedelta(weeks=step)

        due_utc = dt_util.as_utc(task.due_date) if task.due_date else None
        time_of_day = dt_util.as_local(due_utc or done_at).time()

        def next_slot(day: date) -> date:
            later = [d for d in allowed if d > day.weekday()]
            if later:
                return day + timedelta(days=later[0] - day.weekday())
            week_start = day - timedelta(days=day.weekday())
            return week_start + timedelta(weeks=step, days=allowed[0])

        def at(day: date) -> datetime:
            return dt_util.as_utc(datetime.combine(day, time_of_day, tzinfo=dt_util.DEFAULT_TIME_ZONE))

        if task.schedule_anchor == ScheduleAnchor.DUE_DATE and due_utc:
            slot = next_slot(dt_util.as_local(due_utc).date())
            while at(slot) <= done_at:
                slot = next_slot(slot)
            return at(slot)
        anchor = max(done_at, due_utc) if due_utc else done_at
        return at(next_slot(dt_util.as_local(anchor).date()))
