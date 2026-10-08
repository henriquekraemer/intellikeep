"""Tests for IntelliKeep frontend registration."""
from __future__ import annotations

from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

from homeassistant.core import CoreState
from homeassistant.setup import async_setup_component

from custom_components.intellikeep.frontend import async_register_frontend, _async_register_card_resource

CARD_URL = "/intellikeep_static/intellikeep-card.js"


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


def _mock_lovelace(mock_hass, items):
    """Storage-mode Lovelace data shaped like Home Assistant's LovelaceData."""
    resources = MagicMock()
    resources.async_get_info = AsyncMock(return_value={"resources": len(items)})
    resources.async_items = MagicMock(return_value=items)
    resources.async_create_item = AsyncMock()
    # Attribute access only: the dict-style access was removed in 2026.2
    mock_hass.data["lovelace"] = SimpleNamespace(resources=resources)
    return resources


async def test_register_card_resource_creates_resource_when_missing(mock_hass):
    resources = _mock_lovelace(mock_hass, [])
    callbacks = _capture_startup_callback(mock_hass)

    _async_register_card_resource(mock_hass, "intellikeep")

    await callbacks[0](None)

    resources.async_create_item.assert_awaited_once()


async def test_register_card_resource_skips_duplicate(mock_hass):
    resources = _mock_lovelace(mock_hass, [{"id": "abc", "type": "module", "url": CARD_URL}])
    callbacks = _capture_startup_callback(mock_hass)

    _async_register_card_resource(mock_hass, "intellikeep")

    await callbacks[0](None)

    resources.async_create_item.assert_not_awaited()


async def test_register_card_resource_runs_immediately_when_started(mock_hass):
    resources = _mock_lovelace(mock_hass, [])

    coros = []
    mock_hass.state = CoreState.running
    mock_hass.async_create_task = MagicMock(side_effect=coros.append)

    _async_register_card_resource(mock_hass, "intellikeep")

    await coros[0]

    resources.async_create_item.assert_awaited_once()


async def test_register_card_resource_leaves_yaml_mode_alone(mock_hass):
    """YAML-mode resources have no create method; nothing to do and nothing to log."""
    resources = MagicMock(spec=["async_get_info", "async_items"])
    mock_hass.data["lovelace"] = SimpleNamespace(resources=resources)
    callbacks = _capture_startup_callback(mock_hass)

    _async_register_card_resource(mock_hass, "intellikeep")

    with patch("custom_components.intellikeep.frontend._LOGGER.warning") as warning:
        await callbacks[0](None)

    warning.assert_not_called()


async def test_register_card_resource_against_real_lovelace(hass):
    """Run against Home Assistant's own Lovelace component, not a mock of it."""
    assert await async_setup_component(hass, "lovelace", {})

    for _ in range(2):  # a second run must not add a duplicate
        _async_register_card_resource(hass, "intellikeep")
        await hass.async_block_till_done()

    items = hass.data["lovelace"].resources.async_items()
    assert [item["url"] for item in items] == [CARD_URL]
