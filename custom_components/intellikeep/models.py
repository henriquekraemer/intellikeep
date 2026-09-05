"""Data models for IntelliKeep."""
from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import datetime
from enum import StrEnum
from typing import Any

from homeassistant.const import WEEKDAYS
from homeassistant.util import dt as dt_util


class TaskFrequency(StrEnum):
    ONE_TIME = "one_time"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"
    CUSTOM = "custom"  # uses custom_days_interval


def normalize_weekdays(value: Any, *, strict: bool = True) -> list[str]:
    """Return a de-duplicated list of weekday codes in Monday-first order.

    Accepts a single code or an iterable of codes. Codes are matched
    case-insensitively on their first three letters, so ``"Monday"`` and
    ``"mon"`` are equivalent. With ``strict`` unknown values raise
    ``ValueError``; otherwise they are dropped (used when loading storage).
    """
    if value is None:
        return []
    if isinstance(value, str) or not isinstance(value, (list, tuple, set, frozenset)):
        value = [value]
    codes: set[str] = set()
    invalid: list[str] = []
    for item in value:
        code = str(item).strip().lower()[:3]
        if code in WEEKDAYS:
            codes.add(code)
        else:
            invalid.append(str(item))
    if invalid and strict:
        raise ValueError(", ".join(invalid))
    return [code for code in WEEKDAYS if code in codes]


class TaskPriority(StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class TaskStatus(StrEnum):
    PENDING = "pending"
    DUE = "due"
    OVERDUE = "overdue"
    COMPLETED = "completed"
    SNOOZED = "snoozed"


@dataclass
class TaskExecution:
    execution_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    task_id: str = ""
    completed_at: datetime = field(default_factory=dt_util.utcnow)
    completed_by: str = ""
    notes: str = ""
    was_late: bool = False

    def as_dict(self) -> dict[str, Any]:
        return {
            "execution_id": self.execution_id,
            "task_id": self.task_id,
            "completed_at": self.completed_at.isoformat(),
            "completed_by": self.completed_by,
            "notes": self.notes,
            "was_late": self.was_late,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> TaskExecution:
        return cls(
            execution_id=data["execution_id"],
            task_id=data["task_id"],
            completed_at=dt_util.as_utc(datetime.fromisoformat(data["completed_at"])),
            completed_by=data.get("completed_by", ""),
            notes=data.get("notes", ""),
            was_late=data.get("was_late", False),
        )


@dataclass
class TaskNote:
    note_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    task_id: str = ""
    created_at: datetime = field(default_factory=dt_util.utcnow)
    content: str = ""
    added_by: str = ""

    def as_dict(self) -> dict[str, Any]:
        return {
            "note_id": self.note_id,
            "task_id": self.task_id,
            "created_at": self.created_at.isoformat(),
            "content": self.content,
            "added_by": self.added_by,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "TaskNote":
        return cls(
            note_id=data["note_id"],
            task_id=data["task_id"],
            created_at=dt_util.as_utc(datetime.fromisoformat(data["created_at"])),
            content=data.get("content", ""),
            added_by=data.get("added_by", ""),
        )


class TaskActivityType(StrEnum):
    EDITED = "edited"
    COMPLETED = "completed"
    REOPENED = "reopened"
    NOTE_ADDED = "note_added"
    NOTE_DELETED = "note_deleted"


@dataclass
class TaskActivity:
    activity_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    task_id: str = ""
    timestamp: datetime = field(default_factory=dt_util.utcnow)
    action: TaskActivityType = TaskActivityType.EDITED
    performed_by: str = ""
    details: str = ""

    def as_dict(self) -> dict[str, Any]:
        return {
            "activity_id": self.activity_id,
            "task_id": self.task_id,
            "timestamp": self.timestamp.isoformat(),
            "action": str(self.action),
            "performed_by": self.performed_by,
            "details": self.details,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "TaskActivity":
        return cls(
            activity_id=data["activity_id"],
            task_id=data["task_id"],
            timestamp=dt_util.as_utc(datetime.fromisoformat(data["timestamp"])),
            action=TaskActivityType(data["action"]),
            performed_by=data.get("performed_by", ""),
            details=data.get("details", ""),
        )


@dataclass
class Task:
    task_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    task_number: int = 0
    name: str = ""
    description: str = ""
    priority: TaskPriority = TaskPriority.MEDIUM
    frequency: TaskFrequency = TaskFrequency.ONE_TIME
    custom_days_interval: int | None = None
    weekdays: list[str] = field(default_factory=list)
    due_date: datetime | None = None
    linked_entity_ids: list[str] = field(default_factory=list)
    notify_days_before: int = 1
    notify_on_overdue: bool = True
    created_at: datetime = field(default_factory=dt_util.utcnow)
    updated_at: datetime = field(default_factory=dt_util.utcnow)
    last_completed_at: datetime | None = None
    executions: list[TaskExecution] = field(default_factory=list)
    notes: list["TaskNote"] = field(default_factory=list)
    activities: list[TaskActivity] = field(default_factory=list)
    enabled: bool = True
    previous_task_id: str | None = None

    def as_dict(self) -> dict[str, Any]:
        return {
            "task_id": self.task_id,
            "task_number": self.task_number,
            "name": self.name,
            "description": self.description,
            "priority": str(self.priority),
            "frequency": str(self.frequency),
            "custom_days_interval": self.custom_days_interval,
            "weekdays": list(self.weekdays),
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "linked_entity_ids": self.linked_entity_ids,
            "notify_days_before": self.notify_days_before,
            "notify_on_overdue": self.notify_on_overdue,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "last_completed_at": (
                self.last_completed_at.isoformat() if self.last_completed_at else None
            ),
            "executions": [e.as_dict() for e in self.executions],
            "notes": [n.as_dict() for n in self.notes],
            "activities": [a.as_dict() for a in self.activities],
            "enabled": self.enabled,
            "previous_task_id": self.previous_task_id,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Task:
        task = cls(
            task_id=data["task_id"],
            task_number=data.get("task_number", 0),
            name=data["name"],
            description=data.get("description", ""),
            priority=TaskPriority(data.get("priority", TaskPriority.MEDIUM)),
            frequency=TaskFrequency(data.get("frequency", TaskFrequency.ONE_TIME)),
            custom_days_interval=data.get("custom_days_interval"),
            weekdays=normalize_weekdays(data.get("weekdays"), strict=False),
            due_date=(
                dt_util.as_utc(datetime.fromisoformat(data["due_date"]))
                if data.get("due_date")
                else None
            ),
            linked_entity_ids=data.get("linked_entity_ids", []),
            notify_days_before=data.get("notify_days_before", 1),
            notify_on_overdue=data.get("notify_on_overdue", True),
            created_at=dt_util.as_utc(datetime.fromisoformat(data["created_at"])),
            updated_at=dt_util.as_utc(datetime.fromisoformat(data["updated_at"])),
            last_completed_at=(
                dt_util.as_utc(datetime.fromisoformat(data["last_completed_at"]))
                if data.get("last_completed_at")
                else None
            ),
            enabled=data.get("enabled", True),
        )
        task.previous_task_id = data.get("previous_task_id") or None
        task.executions = [
            TaskExecution.from_dict(e) for e in data.get("executions", [])
        ]
        raw_notes = data.get("notes", [])
        if isinstance(raw_notes, list):
            task.notes = [TaskNote.from_dict(n) for n in raw_notes if isinstance(n, dict)]
        else:
            task.notes = []
        raw_activities = data.get("activities", [])
        if isinstance(raw_activities, list):
            task.activities = [TaskActivity.from_dict(a) for a in raw_activities if isinstance(a, dict)]
        else:
            task.activities = []
        return task

    def as_dict_with_status(self, status: TaskStatus) -> dict[str, Any]:
        result = self.as_dict()
        result["status"] = str(status)
        result["executions_count"] = len(self.executions)
        return result
