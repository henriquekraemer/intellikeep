"""Frontend resource registration for IntelliKeep."""
from __future__ import annotations

import logging
import os
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.event import async_call_later

_LOGGER = logging.getLogger(__name__)

FRONTEND_DIR = Path(__file__).parent
CARD_FILENAME = "intellikeep-card.js"
PANEL_FILENAME = "intellikeep-panel.js"


STATIC_PATH = "intellikeep_static"


async def async_register_frontend(hass: HomeAssistant, component_domain: str) -> None:
    """Register static path and Lovelace resource for the card."""
    await hass.http.async_register_static_paths([
        StaticPathConfig(
            f"/{STATIC_PATH}",
            str(FRONTEND_DIR),
            cache_headers=False,
        )
    ])
    _LOGGER.debug("IntelliKeep frontend registered at /%s", STATIC_PATH)

    # Register the Lovelace card resource so it auto-loads in dashboards
    _async_register_card_resource(hass, component_domain)


@callback
def _async_register_card_resource(hass: HomeAssistant, component_domain: str) -> None:
    """Add the card JS as a Lovelace resource (if lovelace is available)."""

    async def _do_register(_now=None) -> None:
        try:
            lovelace = hass.data.get("lovelace")
            if lovelace is None:
                _LOGGER.debug("Lovelace not yet available, skipping card registration")
                return

            url = f"/{STATIC_PATH}/{CARD_FILENAME}"
            resources = lovelace.get("resources")
            if resources is None:
                return

            # Avoid duplicate registration
            existing = await resources.async_get_info()
            for resource in existing.get("resources", []):
                if resource.get("url") == url:
                    return

            await resources.async_create_item({"res_type": "module", "url": url})
            _LOGGER.info("IntelliKeep Lovelace card resource registered: %s", url)
        except Exception as err:  # noqa: BLE001
            _LOGGER.debug("Could not register Lovelace card resource: %s", err)

    # Defer until HA has finished starting so Lovelace data is available
    async_call_later(hass, 2, _do_register)
