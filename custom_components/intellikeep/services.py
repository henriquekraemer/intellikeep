"""Service registration and handlers for IntelliKeep."""
from __future__ import annotations

import logging
from datetime import datetime

from homeassistant.core import HomeAssistant, ServiceCall

from .const import (
    DOMAIN,
    SERVICE_ADD_TASK_NOTE,
    SERVICE_COMPLETE_TASK,
    SERVICE_CREATE_TASK,
    SERVICE_DELETE_ALL_DATA,
    SERVICE_DELETE_TASK,
    SERVICE_LOAD_SAMPLE_DATA,
    SERVICE_REOPEN_TASK,
    SERVICE_UPDATE_TASK,
)
from .coordinator import IntelliKeepCoordinator
from .models import TaskFrequency, TaskPriority
from .task_manager import TaskManager

_LOGGER = logging.getLogger(__name__)

def _coerce_int_fields(data: dict, *fields: str) -> dict:
    """Coerce specified fields to int (HA number selectors may send floats)."""
    for field in fields:
        if data.get(field) is not None:
            data[field] = int(data[field])
    return data


def _coerce_due_date(data: dict) -> dict:
    """Convert due_date to datetime if HA sent it as a string."""
    value = data.get("due_date")
    if isinstance(value, str):
        data["due_date"] = datetime.fromisoformat(value)
    return data


def async_register_services(
    hass: HomeAssistant,
    task_manager: TaskManager,
    coordinator: IntelliKeepCoordinator,
) -> None:
    """Register all IntelliKeep services."""

    async def handle_create_task(call: ServiceCall) -> None:
        data = _coerce_int_fields(dict(call.data), "custom_days_interval", "notify_days_before")
        data = _coerce_due_date(data)
        if "priority" in data:
            data["priority"] = TaskPriority(data["priority"])
        if "frequency" in data:
            data["frequency"] = TaskFrequency(data["frequency"])
        await task_manager.async_create_task(**data)
        await coordinator.async_refresh()

    async def handle_complete_task(call: ServiceCall) -> None:
        task = await task_manager.async_complete_task(
            call.data["task_id"],
            completed_by=call.data.get("completed_by", ""),
            notes=call.data.get("notes", ""),
        )
        if task is None:
            _LOGGER.warning("complete_task: task_id not found: %s", call.data["task_id"])
        else:
            await coordinator.async_refresh()

    async def handle_load_sample_data(_call: ServiceCall) -> None:
        from .seed import build_sample_tasks  # noqa: PLC0415
        tasks = build_sample_tasks()
        for task in tasks:
            task.task_number = task_manager._storage.next_task_number()
            task_manager._storage.upsert_task(task)
        await task_manager._storage.async_save()
        await coordinator.async_refresh()
        _LOGGER.info("IntelliKeep sample data loaded (%d tasks)", len(tasks))

    async def handle_reopen_task(call: ServiceCall) -> None:
        task = await task_manager.async_reopen_task(call.data["task_id"])
        if task is None:
            _LOGGER.warning("reopen_task: task_id not found: %s", call.data["task_id"])
        else:
            await coordinator.async_refresh()

    async def handle_delete_task(call: ServiceCall) -> None:
        deleted = await task_manager.async_delete_task(call.data["task_id"])
        if not deleted:
            _LOGGER.warning("delete_task: task_id not found: %s", call.data["task_id"])
        else:
            await coordinator.async_refresh()

    async def handle_update_task(call: ServiceCall) -> None:
        data = _coerce_int_fields(dict(call.data), "custom_days_interval", "notify_days_before")
        data = _coerce_due_date(data)
        task_id = data.pop("task_id")
        if "priority" in data:
            data["priority"] = TaskPriority(data["priority"])
        if "frequency" in data:
            data["frequency"] = TaskFrequency(data["frequency"])
        task = await task_manager.async_update_task(task_id, **data)
        if task is None:
            _LOGGER.warning("update_task: task_id not found: %s", task_id)
        else:
            await coordinator.async_refresh()

    async def handle_add_task_note(call: ServiceCall) -> None:
        note = await task_manager.async_add_task_note(
            call.data["task_id"],
            content=call.data.get("content", ""),
            added_by=call.data.get("added_by", ""),
        )
        if note is None:
            _LOGGER.warning("add_task_note: task_id not found: %s", call.data["task_id"])
        else:
            await coordinator.async_refresh()

    async def handle_delete_all_data(_call: ServiceCall) -> None:
        count = task_manager._storage.clear_all_tasks()
        await task_manager._storage.async_save()
        await coordinator.async_refresh()
        _LOGGER.info("IntelliKeep: deleted all data (%d tasks removed)", count)

    hass.services.async_register(DOMAIN, SERVICE_CREATE_TASK, handle_create_task)
    hass.services.async_register(DOMAIN, SERVICE_LOAD_SAMPLE_DATA, handle_load_sample_data)
    hass.services.async_register(DOMAIN, SERVICE_COMPLETE_TASK, handle_complete_task)
    hass.services.async_register(DOMAIN, SERVICE_REOPEN_TASK, handle_reopen_task)
    hass.services.async_register(DOMAIN, SERVICE_DELETE_TASK, handle_delete_task)
    hass.services.async_register(DOMAIN, SERVICE_UPDATE_TASK, handle_update_task)
    hass.services.async_register(DOMAIN, SERVICE_ADD_TASK_NOTE, handle_add_task_note)
    hass.services.async_register(DOMAIN, SERVICE_DELETE_ALL_DATA, handle_delete_all_data)
    _LOGGER.debug("IntelliKeep services registered")


def async_unregister_services(hass: HomeAssistant) -> None:
    for service in (
        SERVICE_CREATE_TASK,
        SERVICE_LOAD_SAMPLE_DATA,
        SERVICE_COMPLETE_TASK,
        SERVICE_REOPEN_TASK,
        SERVICE_DELETE_TASK,
        SERVICE_UPDATE_TASK,
        SERVICE_ADD_TASK_NOTE,
        SERVICE_DELETE_ALL_DATA,
    ):
        hass.services.async_remove(DOMAIN, service)
