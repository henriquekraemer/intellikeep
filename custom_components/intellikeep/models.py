"""Data models for IntelliKeep."""
from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import datetime
from enum import StrEnum
from typing import Any

from homeassistant.util import dt as dt_util


class TaskFrequency(StrEnum):
    ONE_TIME = "one_time"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"
    CUSTOM = "custom"  # uses custom_days_interval


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

    def as_dict(self) -> dict[str, Any]:
        return {
            "execution_id": self.execution_id,
            "task_id": self.task_id,
            "completed_at": self.completed_at.isoformat(),
            "completed_by": self.completed_by,
            "notes": self.notes,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> TaskExecution:
        return cls(
            execution_id=data["execution_id"],
            task_id=data["task_id"],
            completed_at=dt_util.as_utc(datetime.fromisoformat(data["completed_at"])),
            completed_by=data.get("completed_by", ""),
            notes=data.get("notes", ""),
        )


@dataclass
class Task:
    task_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    description: str = ""
    priority: TaskPriority = TaskPriority.MEDIUM
    frequency: TaskFrequency = TaskFrequency.ONE_TIME
    custom_days_interval: int | None = None
    due_date: datetime | None = None
    linked_entity_ids: list[str] = field(default_factory=list)
    notify_days_before: int = 1
    notify_on_overdue: bool = True
    created_at: datetime = field(default_factory=dt_util.utcnow)
    updated_at: datetime = field(default_factory=dt_util.utcnow)
    last_completed_at: datetime | None = None
    executions: list[TaskExecution] = field(default_factory=list)
    enabled: bool = True

    def as_dict(self) -> dict[str, Any]:
        return {
            "task_id": self.task_id,
            "name": self.name,
            "description": self.description,
            "priority": str(self.priority),
            "frequency": str(self.frequency),
            "custom_days_interval": self.custom_days_interval,
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
            "enabled": self.enabled,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Task:
        task = cls(
            task_id=data["task_id"],
            name=data["name"],
            description=data.get("description", ""),
            priority=TaskPriority(data.get("priority", TaskPriority.MEDIUM)),
            frequency=TaskFrequency(data.get("frequency", TaskFrequency.ONE_TIME)),
            custom_days_interval=data.get("custom_days_interval"),
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
        task.executions = [
            TaskExecution.from_dict(e) for e in data.get("executions", [])
        ]
        return task

    def as_dict_with_status(self, status: TaskStatus) -> dict[str, Any]:
        result = self.as_dict()
        result["status"] = str(status)
        result["executions_count"] = len(self.executions)
        return result
