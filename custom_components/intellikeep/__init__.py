"""IntelliKeep — Home Maintenance System for Home Assistant.

An Intellilar product. Manages one-time and recurring maintenance tasks,
linked to HA entities, with notifications and execution history.
"""
from __future__ import annotations

import logging
from collections.abc import Mapping
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr

from .const import (
    CONF_NOTIFICATION_SERVICE,
    CONF_NOTIFY_DAYS_BEFORE_DEFAULT,
    DEFAULT_NOTIFY_DAYS_BEFORE,
    DOMAIN,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL,
    PLATFORMS,
)
from .coordinator import IntelliKeepCoordinator
from .frontend import async_register_frontend
from .notifications import NotificationManager
from .services import async_register_services
from .runtime_data import IntelliKeepConfigEntry, IntelliKeepRuntimeData
from .storage import IntelliKeepStorage
from .task_manager import TaskManager
from .websocket_api import async_register_websocket_commands

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: Mapping[str, Any]) -> bool:
    """Global setup (runs once, not per config entry)."""
    del config
    hass.data.setdefault(DOMAIN, {})
    async_register_services(hass)
    async_register_websocket_commands(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: IntelliKeepConfigEntry) -> bool:
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

    notify_days_before_default = entry.options.get(
        CONF_NOTIFY_DAYS_BEFORE_DEFAULT,
        entry.data.get(CONF_NOTIFY_DAYS_BEFORE_DEFAULT, DEFAULT_NOTIFY_DAYS_BEFORE),
    )
    runtime_data = IntelliKeepRuntimeData(
        storage=storage,
        task_manager=task_manager,
        coordinator=coordinator,
        notification_manager=notification_manager,
        notify_days_before_default=int(notify_days_before_default),
    )
    entry.runtime_data = runtime_data
    hass.data[DOMAIN][entry.entry_id] = runtime_data

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


async def async_unload_entry(hass: HomeAssistant, entry: IntelliKeepConfigEntry) -> bool:
    """Unload IntelliKeep config entry."""
    # Stop notification manager
    runtime_data = hass.data[DOMAIN].get(entry.entry_id)
    notification_manager = runtime_data.notification_manager if runtime_data else None
    if notification_manager:
        notification_manager.stop()

    # Unload platforms
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)
        _async_remove_panel(hass)

    return unload_ok


async def _async_options_updated(hass: HomeAssistant, entry: IntelliKeepConfigEntry) -> None:
    """Reload the entry when options are changed."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_remove_config_entry_device(
    hass: HomeAssistant,
    entry: IntelliKeepConfigEntry,
    device_entry: dr.DeviceEntry,
) -> bool:
    """Allow removing the IntelliKeep virtual device from the device registry."""
    return not any(
        identifier
        for identifier in device_entry.identifiers
        if identifier[0] == DOMAIN and identifier[1] == entry.entry_id
    )


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


def _async_remove_panel(hass: HomeAssistant) -> None:
    """Remove the sidebar panel so a reload can re-register it cleanly."""
    from homeassistant.components import frontend as ha_frontend  # noqa: PLC0415

    try:
        ha_frontend.async_remove_panel(hass, PANEL_URL)
    except Exception as err:  # noqa: BLE001
        _LOGGER.debug("Could not remove IntelliKeep panel: %s", err)
