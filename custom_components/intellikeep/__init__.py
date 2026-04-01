"""IntelliKeep — Home Maintenance System for Home Assistant.

An Intellilar product. Manages one-time and recurring maintenance tasks,
linked to HA entities, with notifications and execution history.
"""
from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant

from .const import (
    CONF_NOTIFICATION_SERVICE,
    DOMAIN,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL,
    PLATFORMS,
)
from .coordinator import IntelliKeepCoordinator
from .frontend import async_register_frontend
from .notifications import NotificationManager
from .services import async_register_services, async_unregister_services
from .storage import IntelliKeepStorage
from .task_manager import TaskManager
from .websocket_api import async_register_websocket_commands

_LOGGER = logging.getLogger(__name__)


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Global setup (runs once, not per config entry)."""
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up IntelliKeep from a config entry."""
    hass.data.setdefault(DOMAIN, {})

    # --- Storage ---
    storage = IntelliKeepStorage(hass)
    await storage.async_load()

    # --- Business logic ---
    task_manager = TaskManager(hass, storage)

    # --- Coordinator ---
    coordinator = IntelliKeepCoordinator(hass, task_manager)
    await coordinator.async_config_entry_first_refresh()

    hass.data[DOMAIN][entry.entry_id] = coordinator

    # --- Services ---
    async_register_services(hass, task_manager, coordinator)

    # --- WebSocket API ---
    async_register_websocket_commands(hass, task_manager, coordinator)

    # --- Notifications ---
    notification_service = (
        entry.options.get(CONF_NOTIFICATION_SERVICE)
        or entry.data.get(CONF_NOTIFICATION_SERVICE)
        or None
    )
    notification_manager = NotificationManager(
        hass, task_manager, notification_service or None
    )
    notification_manager.start()
    hass.data[DOMAIN][f"{entry.entry_id}_notifications"] = notification_manager

    # --- Frontend: register static path + Lovelace card resource ---
    await async_register_frontend(hass, DOMAIN)

    # --- Panel: register IntelliKeep in HA sidebar ---
    await _async_register_panel(hass)

    # --- Sensor platform ---
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Reload entry when options are updated
    entry.async_on_unload(entry.add_update_listener(_async_options_updated))

    _LOGGER.info("IntelliKeep integration loaded (entry: %s)", entry.entry_id)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload IntelliKeep config entry."""
    # Stop notification manager
    notification_manager: NotificationManager = hass.data[DOMAIN].pop(
        f"{entry.entry_id}_notifications", None
    )
    if notification_manager:
        notification_manager.stop()

    # Unregister services
    async_unregister_services(hass)

    # Unload platforms
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)

    return unload_ok


async def _async_options_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload the entry when options are changed."""
    await hass.config_entries.async_reload(entry.entry_id)


async def _async_register_panel(hass: HomeAssistant) -> None:
    """Register IntelliKeep as a sidebar panel."""
    from homeassistant.components import panel_custom  # noqa: PLC0415

    try:
        await panel_custom.async_register_panel(
            hass,
            webcomponent_name="intellikeep-panel",
            frontend_url_path=PANEL_URL,
            module_url="/intellikeep_static/intellikeep-panel.js",
            sidebar_title=PANEL_TITLE,
            sidebar_icon=PANEL_ICON,
            require_admin=False,
            config={},
        )
    except Exception as err:  # noqa: BLE001
        _LOGGER.warning("Could not register IntelliKeep panel: %s", err)
