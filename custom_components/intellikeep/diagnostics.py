"""Diagnostics support for IntelliKeep."""
from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.core import HomeAssistant

from .const import CONF_NOTIFICATION_SERVICE
from .runtime_data import IntelliKeepConfigEntry, IntelliKeepRuntimeData

_ENTRY_REDACTIONS = {CONF_NOTIFICATION_SERVICE}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant,
    entry: IntelliKeepConfigEntry,
) -> dict[str, Any]:
    """Return diagnostics for a config entry."""
    del hass

    runtime_data: IntelliKeepRuntimeData = entry.runtime_data
    tasks = runtime_data.storage.get_all_tasks()

    return {
        "entry": {
            "entry_id": entry.entry_id,
            "title": entry.title,
            "data": async_redact_data(dict(entry.data), _ENTRY_REDACTIONS),
            "options": async_redact_data(dict(entry.options), _ENTRY_REDACTIONS),
        },
        "stats": {
            "task_count": len(tasks),
            "enabled_task_count": sum(task.enabled for task in tasks),
            "overdue_task_count": len(runtime_data.task_manager.get_overdue_tasks()),
            "due_today_task_count": len(runtime_data.task_manager.get_tasks_due_today()),
            "approaching_task_count": len(runtime_data.task_manager.get_tasks_approaching_due()),
        },
        "tasks": [
            {
                "task_id": task.task_id,
                "task_number": task.task_number,
                "priority": str(task.priority),
                "frequency": str(task.frequency),
                "weekdays": list(task.weekdays),
                "due_date": task.due_date.isoformat() if task.due_date else None,
                "notify_days_before": task.notify_days_before,
                "notify_on_overdue": task.notify_on_overdue,
                "enabled": task.enabled,
                "linked_entity_count": len(task.linked_entity_ids),
                "notes_count": len(task.notes),
                "executions_count": len(task.executions),
                "status": str(runtime_data.task_manager.get_task_status(task)),
            }
            for task in tasks
        ],
    }