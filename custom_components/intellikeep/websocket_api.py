"""WebSocket API commands for IntelliKeep panel/card communication."""
from __future__ import annotations

import logging

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN, VERSION, WS_GET_TASK, WS_GET_TASKS, WS_GET_VERSION, WS_SUBSCRIBE
from .coordinator import IntelliKeepCoordinator
from .task_manager import TaskManager

_LOGGER = logging.getLogger(__name__)


def async_register_websocket_commands(
    hass: HomeAssistant,
    task_manager: TaskManager,
    coordinator: IntelliKeepCoordinator,
) -> None:
    """Register all WebSocket API commands."""

    @websocket_api.websocket_command(
        {
            vol.Required("type"): f"{DOMAIN}/{WS_GET_TASKS}",
        }
    )
    @websocket_api.async_response
    async def ws_get_tasks(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict,
    ) -> None:
        tasks = task_manager.get_all_tasks_with_status()
        connection.send_result(msg["id"], {"tasks": tasks})

    @websocket_api.websocket_command(
        {
            vol.Required("type"): f"{DOMAIN}/{WS_GET_TASK}",
            vol.Required("task_id"): str,
        }
    )
    @websocket_api.async_response
    async def ws_get_task(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict,
    ) -> None:
        task = task_manager._storage.get_task(msg["task_id"])
        if task is None:
            connection.send_error(msg["id"], "not_found", f"Task {msg['task_id']} not found")
            return
        status = task_manager.get_task_status(task)
        connection.send_result(msg["id"], {"task": task.as_dict_with_status(status)})

    @websocket_api.websocket_command(
        {
            vol.Required("type"): f"{DOMAIN}/{WS_SUBSCRIBE}",
        }
    )
    @callback
    def ws_subscribe(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict,
    ) -> None:
        """Subscribe to coordinator updates. Fires a message on every refresh."""

        @callback
        def _send_update(_: None = None) -> None:
            tasks = task_manager.get_all_tasks_with_status()
            connection.send_message(
                websocket_api.event_message(msg["id"], {"tasks": tasks})
            )

        # Send initial state
        _send_update()

        # Subscribe to coordinator updates
        unsub = coordinator.async_add_listener(_send_update)

        @callback
        def _unsubscribe() -> None:
            unsub()

        connection.subscriptions[msg["id"]] = _unsubscribe
        connection.send_result(msg["id"])

    @websocket_api.websocket_command(
        {
            vol.Required("type"): f"{DOMAIN}/{WS_GET_VERSION}",
        }
    )
    @callback
    def ws_get_version(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict,
    ) -> None:
        connection.send_result(msg["id"], {"version": VERSION})

    websocket_api.async_register_command(hass, ws_get_tasks)
    websocket_api.async_register_command(hass, ws_get_task)
    websocket_api.async_register_command(hass, ws_subscribe)
    websocket_api.async_register_command(hass, ws_get_version)

    _LOGGER.debug("IntelliKeep WebSocket commands registered")
