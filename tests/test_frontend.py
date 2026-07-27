"""Tests for IntelliKeep frontend registration."""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

from homeassistant.core import CoreState

from custom_components.intellikeep.frontend import async_register_frontend, _async_register_card_resource


async def test_async_register_frontend_registers_static_path(mock_hass):
    with patch("custom_components.intellikeep.frontend.ha_frontend.add_extra_js_url") as add_js:
        await async_register_frontend(mock_hass, "intellikeep")

    mock_hass.http.async_register_static_paths.assert_awaited_once()
    add_js.assert_called_once()


def _capture_startup_callback(mock_hass):
    """Make the mock hass defer registration and capture the startup listener."""
    callbacks = []
    mock_hass.state = CoreState.not_running
    mock_hass.bus.async_listen_once = MagicMock(
        side_effect=lambda _event, cb: callbacks.append(cb)
    )
    return callbacks


async def test_register_card_resource_creates_resource_when_missing(mock_hass):
    resources = MagicMock()
    resources.async_get_info = AsyncMock(return_value={"resources": []})
    resources.async_create_item = AsyncMock()
    mock_hass.data["lovelace"] = {"resources": resources}
    callbacks = _capture_startup_callback(mock_hass)

    _async_register_card_resource(mock_hass, "intellikeep")

    await callbacks[0](None)

    resources.async_create_item.assert_awaited_once()


async def test_register_card_resource_skips_duplicate(mock_hass):
    resources = MagicMock()
    resources.async_get_info = AsyncMock(
        return_value={"resources": [{"url": "/intellikeep_static/intellikeep-card.js"}]}
    )
    resources.async_create_item = AsyncMock()
    mock_hass.data["lovelace"] = {"resources": resources}
    callbacks = _capture_startup_callback(mock_hass)

    _async_register_card_resource(mock_hass, "intellikeep")

    await callbacks[0](None)

    resources.async_create_item.assert_not_awaited()


async def test_register_card_resource_runs_immediately_when_started(mock_hass):
    resources = MagicMock()
    resources.async_get_info = AsyncMock(return_value={"resources": []})
    resources.async_create_item = AsyncMock()
    mock_hass.data["lovelace"] = {"resources": resources}

    coros = []
    mock_hass.state = CoreState.running
    mock_hass.async_create_task = MagicMock(side_effect=coros.append)

    _async_register_card_resource(mock_hass, "intellikeep")

    await coros[0]

    resources.async_create_item.assert_awaited_once()
