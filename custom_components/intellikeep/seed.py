"""Sample data seed for IntelliKeep — creates realistic home maintenance tasks."""
from __future__ import annotations

from datetime import datetime, timedelta

from homeassistant.util import dt as dt_util

from .models import Task, TaskFrequency, TaskPriority


def _due(days: int) -> datetime:
    return dt_util.utcnow() + timedelta(days=days)


SAMPLE_TASKS: list[dict] = [
    {
        "name": "Replace HVAC filter",
        "description": "Change the air filter on the central A/C unit.",
        "priority": TaskPriority.HIGH,
        "frequency": TaskFrequency.MONTHLY,
        "due_date": _due(-3),  # already overdue
        "notify_days_before": 3,
        "notify_on_overdue": True,
    },
    {
        "name": "Clean gutters",
        "description": "Remove leaves and debris from roof gutters.",
        "priority": TaskPriority.MEDIUM,
        "frequency": TaskFrequency.YEARLY,
        "due_date": _due(2),
        "notify_days_before": 5,
        "notify_on_overdue": True,
    },
    {
        "name": "Test smoke detectors",
        "description": "Press the test button on every smoke and CO detector.",
        "priority": TaskPriority.CRITICAL,
        "frequency": TaskFrequency.MONTHLY,
        "due_date": _due(0),  # due today
        "notify_days_before": 1,
        "notify_on_overdue": True,
    },
    {
        "name": "Service boiler / water heater",
        "description": "Annual inspection and descaling.",
        "priority": TaskPriority.HIGH,
        "frequency": TaskFrequency.YEARLY,
        "due_date": _due(30),
        "notify_days_before": 7,
        "notify_on_overdue": True,
    },
    {
        "name": "Check fire extinguisher",
        "description": "Verify pressure gauge and expiration date.",
        "priority": TaskPriority.CRITICAL,
        "frequency": TaskFrequency.YEARLY,
        "due_date": _due(60),
        "notify_days_before": 14,
        "notify_on_overdue": True,
    },
    {
        "name": "Deep-clean refrigerator coils",
        "description": "Vacuum the condenser coils at the back or bottom of the fridge.",
        "priority": TaskPriority.LOW,
        "frequency": TaskFrequency.YEARLY,
        "due_date": _due(90),
        "notify_days_before": 7,
        "notify_on_overdue": False,
    },
    {
        "name": "Inspect roof and attic",
        "description": "Look for cracked tiles, leaks, or pest activity.",
        "priority": TaskPriority.HIGH,
        "frequency": TaskFrequency.YEARLY,
        "due_date": _due(120),
        "notify_days_before": 14,
        "notify_on_overdue": True,
    },
    {
        "name": "Lubricate garage door",
        "description": "Apply lubricant to hinges, rollers, and tracks.",
        "priority": TaskPriority.LOW,
        "frequency": TaskFrequency.MONTHLY,
        "due_date": _due(15),
        "notify_days_before": 3,
        "notify_on_overdue": False,
    },
]


def build_sample_tasks() -> list[Task]:
    """Instantiate and return all sample Task objects."""
    return [Task(**data) for data in SAMPLE_TASKS]
