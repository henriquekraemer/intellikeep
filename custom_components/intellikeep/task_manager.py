"""Business logic for IntelliKeep task management."""
from __future__ import annotations

import logging
from datetime import datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .models import Task, TaskActivity, TaskActivityType, TaskExecution, TaskNote, TaskFrequency, TaskStatus
from .storage import IntelliKeepStorage

_LOGGER = logging.getLogger(__name__)

_TRACKED_FIELD_LABELS: dict[str, str] = {
    "name": "name",
    "description": "description",
    "priority": "priority",
    "frequency": "frequency",
    "custom_days_interval": "interval",
    "due_date": "due date",
    "notify_days_before": "notify before",
    "notify_on_overdue": "notify overdue",
    "linked_entity_ids": "linked entities",
}


def _fmt_val(val: object) -> str:
    if val is None:
        return "—"
    if isinstance(val, datetime):
        return val.date().isoformat()
    if isinstance(val, list):
        return f"{len(val)} entr{'y' if len(val) == 1 else 'ies'}"
    if isinstance(val, bool):
        return "yes" if val else "no"
    return str(val)


class TaskManager:
    """Handles all task operations and scheduling logic."""

    def __init__(self, hass: HomeAssistant, storage: IntelliKeepStorage) -> None:
        self.hass = hass
        self._storage = storage

    # ------------------------------------------------------------------
    # CRUD
    # ------------------------------------------------------------------

    async def async_create_task(self, **kwargs: Any) -> Task:
        kwargs.setdefault("task_number", self._storage.next_task_number())
        task = Task(**kwargs)
        self._storage.upsert_task(task)
        await self._storage.async_save()
        _LOGGER.debug("Created task %s (%s)", task.task_id, task.name)
        return task

    async def async_update_task(self, task_id: str, updated_by: str = "", **kwargs: Any) -> Task | None:
        task = self._storage.get_task(task_id)
        if task is None:
            _LOGGER.warning("Update called for unknown task_id: %s", task_id)
            return None
        changes: list[str] = []
        for field_name, label in _TRACKED_FIELD_LABELS.items():
            if field_name not in kwargs:
                continue
            old_val = getattr(task, field_name, None)
            new_val = kwargs[field_name]
            if isinstance(old_val, list) and isinstance(new_val, list):
                if set(old_val) != set(new_val):
                    changes.append(f"{label}: {_fmt_val(old_val)} → {_fmt_val(new_val)}")
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
                    custom_days_interval=task.custom_days_interval,
                    due_date=next_due,
                    linked_entity_ids=list(task.linked_entity_ids),
                    notify_days_before=task.notify_days_before,
                    notify_on_overdue=task.notify_on_overdue,
                    enabled=True,
                    previous_task_id=root_id,
                    task_number=self._storage.next_task_number(),
                )
                self._storage.upsert_task(next_task)
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
        _LOGGER.debug("Deleted note %s from task %s", note_id, task_id)
        return True

    async def async_reopen_task(self, task_id: str, performed_by: str = "") -> Task | None:
        task = self._storage.get_task(task_id)
        if task is None:
            _LOGGER.warning("Reopen called for unknown task_id: %s", task_id)
            return None
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
        _LOGGER.debug("Reopened task %s", task_id)
        return task

    async def async_delete_task(self, task_id: str) -> bool:
        deleted = self._storage.delete_task(task_id)
        if deleted:
            await self._storage.async_save()
            _LOGGER.debug("Deleted task %s", task_id)
        return deleted

    # ------------------------------------------------------------------
    # Queries
    # ------------------------------------------------------------------

    def get_task_status(self, task: Task) -> TaskStatus:
        if not task.enabled:
            return TaskStatus.COMPLETED
        now = dt_util.utcnow()
        if task.due_date is None:
            return TaskStatus.PENDING
        days_until_due = (task.due_date.date() - now.date()).days
        if days_until_due < -1:
            return TaskStatus.OVERDUE
        if days_until_due <= 0:
            return TaskStatus.DUE
        return TaskStatus.PENDING

    def get_tasks_due_today(self) -> list[Task]:
        now = dt_util.utcnow()
        return [
            t
            for t in self._storage.get_all_tasks()
            if t.enabled
            and t.due_date is not None
            and t.due_date.date() <= now.date()
        ]

    def get_overdue_tasks(self) -> list[Task]:
        return [
            t
            for t in self._storage.get_all_tasks()
            if self.get_task_status(t) == TaskStatus.OVERDUE
        ]

    def get_tasks_approaching_due(self) -> list[Task]:
        """Return tasks within their notify_days_before window (but not yet due)."""
        now = dt_util.utcnow()
        result = []
        for task in self._storage.get_all_tasks():
            if not task.enabled or task.due_date is None:
                continue
            days_left = (task.due_date.date() - now.date()).days
            if 0 < days_left <= task.notify_days_before:
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

    # ------------------------------------------------------------------
    # Scheduling
    # ------------------------------------------------------------------

    def _calculate_next_due(self, task: Task) -> datetime:
        """Calculate next due date based on task frequency."""
        base = task.last_completed_at or dt_util.utcnow()
        match task.frequency:
            case TaskFrequency.DAILY:
                return base + timedelta(days=1)
            case TaskFrequency.WEEKLY:
                return base + timedelta(weeks=1)
            case TaskFrequency.MONTHLY:
                month = base.month % 12 + 1
                year = base.year + (1 if base.month == 12 else 0)
                # Handle months shorter than current day (e.g. Jan 31 → Feb 28)
                import calendar
                last_day = calendar.monthrange(year, month)[1]
                day = min(base.day, last_day)
                return base.replace(year=year, month=month, day=day)
            case TaskFrequency.YEARLY:
                return base.replace(year=base.year + 1)
            case TaskFrequency.CUSTOM:
                interval = task.custom_days_interval or 30
                return base + timedelta(days=interval)
            case _:
                return base
