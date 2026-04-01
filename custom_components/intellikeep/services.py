"""Service registration and handlers for IntelliKeep."""
from __future__ import annotations

import logging
from datetime import datetime

import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv

from .const import (
    DOMAIN,
    SERVICE_COMPLETE_TASK,
    SERVICE_CREATE_TASK,
    SERVICE_DELETE_TASK,
    SERVICE_UPDATE_TASK,
)
from .coordinator import IntelliKeepCoordinator
from .models import TaskFrequency, TaskPriority
from .task_manager import TaskManager

_LOGGER = logging.getLogger(__name__)

CREATE_TASK_SCHEMA = vol.Schema(
    {
        vol.Required("name"): cv.string,
        vol.Optional("description", default=""): cv.string,
        vol.Optional("priority", default=TaskPriority.MEDIUM): vol.In(
            list(TaskPriority)
        ),
        vol.Optional("frequency", default=TaskFrequency.ONE_TIME): vol.In(
            list(TaskFrequency)
        ),
        vol.Optional("custom_days_interval"): vol.All(int, vol.Range(min=1)),
        vol.Optional("due_date"): cv.datetime,
        vol.Optional("linked_entity_ids", default=[]): [cv.entity_id],
        vol.Optional("notify_days_before", default=1): vol.All(
            int, vol.Range(min=0)
        ),
        vol.Optional("notify_on_overdue", default=True): cv.boolean,
    }
)

COMPLETE_TASK_SCHEMA = vol.Schema(
    {
        vol.Required("task_id"): cv.string,
        vol.Optional("completed_by", default=""): cv.string,
        vol.Optional("notes", default=""): cv.string,
    }
)

DELETE_TASK_SCHEMA = vol.Schema({vol.Required("task_id"): cv.string})

UPDATE_TASK_SCHEMA = vol.Schema(
    {
        vol.Required("task_id"): cv.string,
        vol.Optional("name"): cv.string,
        vol.Optional("description"): cv.string,
        vol.Optional("priority"): vol.In(list(TaskPriority)),
        vol.Optional("frequency"): vol.In(list(TaskFrequency)),
        vol.Optional("custom_days_interval"): vol.All(int, vol.Range(min=1)),
        vol.Optional("due_date"): cv.datetime,
        vol.Optional("linked_entity_ids"): [cv.entity_id],
        vol.Optional("notify_days_before"): vol.All(int, vol.Range(min=0)),
        vol.Optional("notify_on_overdue"): cv.boolean,
        vol.Optional("enabled"): cv.boolean,
    }
)


def async_register_services(
    hass: HomeAssistant,
    task_manager: TaskManager,
    coordinator: IntelliKeepCoordinator,
) -> None:
    """Register all IntelliKeep services."""

    async def handle_create_task(call: ServiceCall) -> None:
        data = dict(call.data)
        # Convert priority/frequency strings to enum instances
        if "priority" in data:
            data["priority"] = TaskPriority(data["priority"])
        if "frequency" in data:
            data["frequency"] = TaskFrequency(data["frequency"])
        await task_manager.async_create_task(**data)
        await coordinator.async_request_refresh()

    async def handle_complete_task(call: ServiceCall) -> None:
        task = await task_manager.async_complete_task(
            call.data["task_id"],
            completed_by=call.data.get("completed_by", ""),
            notes=call.data.get("notes", ""),
        )
        if task is None:
            _LOGGER.warning("complete_task: task_id not found: %s", call.data["task_id"])
        else:
            await coordinator.async_request_refresh()

    async def handle_delete_task(call: ServiceCall) -> None:
        deleted = await task_manager.async_delete_task(call.data["task_id"])
        if not deleted:
            _LOGGER.warning("delete_task: task_id not found: %s", call.data["task_id"])
        else:
            await coordinator.async_request_refresh()

    async def handle_update_task(call: ServiceCall) -> None:
        data = dict(call.data)
        task_id = data.pop("task_id")
        if "priority" in data:
            data["priority"] = TaskPriority(data["priority"])
        if "frequency" in data:
            data["frequency"] = TaskFrequency(data["frequency"])
        task = await task_manager.async_update_task(task_id, **data)
        if task is None:
            _LOGGER.warning("update_task: task_id not found: %s", task_id)
        else:
            await coordinator.async_request_refresh()

    hass.services.async_register(
        DOMAIN, SERVICE_CREATE_TASK, handle_create_task, CREATE_TASK_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_COMPLETE_TASK, handle_complete_task, COMPLETE_TASK_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_DELETE_TASK, handle_delete_task, DELETE_TASK_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_UPDATE_TASK, handle_update_task, UPDATE_TASK_SCHEMA
    )
    _LOGGER.debug("IntelliKeep services registered")


def async_unregister_services(hass: HomeAssistant) -> None:
    for service in (
        SERVICE_CREATE_TASK,
        SERVICE_COMPLETE_TASK,
        SERVICE_DELETE_TASK,
        SERVICE_UPDATE_TASK,
    ):
        hass.services.async_remove(DOMAIN, service)
