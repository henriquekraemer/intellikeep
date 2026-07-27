"""Service registration and handlers for IntelliKeep."""
from __future__ import annotations

import logging
from datetime import datetime
from typing import Any, cast

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers.service import async_register_admin_service

from .const import (
    DOMAIN,
    SERVICE_ADD_TASK_NOTE,
    SERVICE_COMPLETE_TASK,
    SERVICE_CREATE_TASK,
    SERVICE_DELETE_ALL_DATA,
    SERVICE_DELETE_TASK,
    SERVICE_DELETE_TASK_NOTE,
    SERVICE_LOAD_SAMPLE_DATA,
    SERVICE_REOPEN_TASK,
    SERVICE_UPDATE_TASK,
)
from .models import TaskFrequency, TaskPriority
from .runtime_data import IntelliKeepRuntimeData

_LOGGER = logging.getLogger(__name__)


def _coerce_int_fields(data: dict[str, Any], *fields: str) -> dict[str, Any]:
    """Coerce specified fields to int (HA number selectors may send floats)."""
    for field in fields:
        if data.get(field) is not None:
            data[field] = int(data[field])
    return data


def _coerce_due_date(data: dict[str, Any]) -> dict[str, Any]:
    """Convert due_date to datetime if HA sent it as a string."""
    value = data.get("due_date")
    if isinstance(value, str):
        data["due_date"] = datetime.fromisoformat(value)
    return data


def _get_runtime_data(hass: HomeAssistant) -> IntelliKeepRuntimeData:
    """Return runtime data for the loaded IntelliKeep entry."""
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.state is ConfigEntryState.LOADED and entry.runtime_data is not None:
            return cast(IntelliKeepRuntimeData, entry.runtime_data)

    raise ServiceValidationError(
        translation_domain=DOMAIN,
        translation_key="not_configured",
    )


def async_register_services(
    hass: HomeAssistant,
) -> None:
    """Register all IntelliKeep services."""
    if hass.services.has_service(DOMAIN, SERVICE_CREATE_TASK):
        return

    async def handle_create_task(call: ServiceCall) -> None:
        runtime_data = _get_runtime_data(hass)
        task_manager = runtime_data.task_manager
        coordinator = runtime_data.coordinator
        data = _coerce_int_fields(dict(call.data), "custom_days_interval", "notify_days_before")
        data = _coerce_due_date(data)
        if "notify_days_before" not in data:
            data["notify_days_before"] = runtime_data.notify_days_before_default
        if "priority" in data:
            data["priority"] = TaskPriority(data["priority"])
        if "frequency" in data:
            data["frequency"] = TaskFrequency(data["frequency"])
        await task_manager.async_create_task(**data)
        await coordinator.async_refresh()

    async def handle_complete_task(call: ServiceCall) -> None:
        runtime_data = _get_runtime_data(hass)
        task_manager = runtime_data.task_manager
        coordinator = runtime_data.coordinator
        task = await task_manager.async_complete_task(
            call.data["task_id"],
            completed_by=call.data.get("completed_by", ""),
            notes=call.data.get("notes", ""),
        )
        if task is None:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="task_not_found",
                translation_placeholders={"task_id": str(call.data["task_id"])}
            )
        runtime_data.notification_manager.clear_task_notifications(task.task_id)
        await coordinator.async_refresh()

    async def handle_load_sample_data(_call: ServiceCall) -> None:
        runtime_data = _get_runtime_data(hass)
        task_manager = runtime_data.task_manager
        coordinator = runtime_data.coordinator
        from .seed import build_sample_tasks  # noqa: PLC0415

        tasks = build_sample_tasks()
        await task_manager.async_add_tasks(tasks)
        await coordinator.async_refresh()
        _LOGGER.info("IntelliKeep sample data loaded (%d tasks)", len(tasks))

    async def handle_reopen_task(call: ServiceCall) -> None:
        runtime_data = _get_runtime_data(hass)
        task_manager = runtime_data.task_manager
        coordinator = runtime_data.coordinator
        task = await task_manager.async_reopen_task(
            call.data["task_id"],
            performed_by=call.data.get("performed_by", ""),
        )
        if task is None:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="task_not_found",
                translation_placeholders={"task_id": str(call.data["task_id"])}
            )
        await coordinator.async_refresh()

    async def handle_delete_task(call: ServiceCall) -> None:
        runtime_data = _get_runtime_data(hass)
        task_manager = runtime_data.task_manager
        coordinator = runtime_data.coordinator
        deleted = await task_manager.async_delete_task(call.data["task_id"])
        if not deleted:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="task_not_found",
                translation_placeholders={"task_id": str(call.data["task_id"])}
            )
        runtime_data.notification_manager.clear_task_notifications(str(call.data["task_id"]))
        await coordinator.async_refresh()

    async def handle_update_task(call: ServiceCall) -> None:
        runtime_data = _get_runtime_data(hass)
        task_manager = runtime_data.task_manager
        coordinator = runtime_data.coordinator
        data = _coerce_int_fields(dict(call.data), "custom_days_interval", "notify_days_before")
        data = _coerce_due_date(data)
        task_id = data.pop("task_id")
        updated_by = data.pop("updated_by", "")
        if "priority" in data:
            data["priority"] = TaskPriority(data["priority"])
        if "frequency" in data:
            data["frequency"] = TaskFrequency(data["frequency"])
        task = await task_manager.async_update_task(task_id, updated_by=updated_by, **data)
        if task is None:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="task_not_found",
                translation_placeholders={"task_id": str(task_id)}
            )
        await coordinator.async_refresh()

    async def handle_add_task_note(call: ServiceCall) -> None:
        runtime_data = _get_runtime_data(hass)
        task_manager = runtime_data.task_manager
        coordinator = runtime_data.coordinator
        note = await task_manager.async_add_task_note(
            call.data["task_id"],
            content=call.data.get("content", ""),
            added_by=call.data.get("added_by", ""),
        )
        if note is None:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="task_not_found",
                translation_placeholders={"task_id": str(call.data["task_id"])}
            )
        await coordinator.async_refresh()

    async def handle_delete_task_note(call: ServiceCall) -> None:
        runtime_data = _get_runtime_data(hass)
        task_manager = runtime_data.task_manager
        coordinator = runtime_data.coordinator
        deleted = await task_manager.async_delete_task_note(
            call.data["task_id"],
            note_id=call.data["note_id"],
        )
        if not deleted:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="task_note_not_found",
                translation_placeholders={
                    "task_id": str(call.data["task_id"]),
                    "note_id": str(call.data["note_id"]),
                },
            )
        await coordinator.async_refresh()

    async def handle_delete_all_data(_call: ServiceCall) -> None:
        runtime_data = _get_runtime_data(hass)
        task_manager = runtime_data.task_manager
        coordinator = runtime_data.coordinator
        count = await task_manager.async_delete_all_tasks()
        runtime_data.notification_manager.reset()
        await coordinator.async_refresh()
        _LOGGER.info("IntelliKeep: deleted all data (%d tasks removed)", count)

    hass.services.async_register(DOMAIN, SERVICE_CREATE_TASK, handle_create_task)
    hass.services.async_register(DOMAIN, SERVICE_LOAD_SAMPLE_DATA, handle_load_sample_data)
    hass.services.async_register(DOMAIN, SERVICE_COMPLETE_TASK, handle_complete_task)
    hass.services.async_register(DOMAIN, SERVICE_REOPEN_TASK, handle_reopen_task)
    hass.services.async_register(DOMAIN, SERVICE_DELETE_TASK, handle_delete_task)
    hass.services.async_register(DOMAIN, SERVICE_UPDATE_TASK, handle_update_task)
    hass.services.async_register(DOMAIN, SERVICE_ADD_TASK_NOTE, handle_add_task_note)
    hass.services.async_register(DOMAIN, SERVICE_DELETE_TASK_NOTE, handle_delete_task_note)
    # Destructive: only admins may wipe all data
    async_register_admin_service(
        hass, DOMAIN, SERVICE_DELETE_ALL_DATA, handle_delete_all_data
    )
    _LOGGER.debug("IntelliKeep services registered")


def async_unregister_services(hass: HomeAssistant) -> None:
    """Unregister all IntelliKeep services."""
    for service in (
        SERVICE_CREATE_TASK,
        SERVICE_LOAD_SAMPLE_DATA,
        SERVICE_COMPLETE_TASK,
        SERVICE_REOPEN_TASK,
        SERVICE_DELETE_TASK,
        SERVICE_UPDATE_TASK,
        SERVICE_ADD_TASK_NOTE,
        SERVICE_DELETE_TASK_NOTE,
        SERVICE_DELETE_ALL_DATA,
    ):
        hass.services.async_remove(DOMAIN, service)
