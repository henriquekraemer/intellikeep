"""Tests for IntelliKeep frontend registration."""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

from custom_components.intellikeep.frontend import async_register_frontend, _async_register_card_resource


async def test_async_register_frontend_registers_static_path(mock_hass):
    with patch("custom_components.intellikeep.frontend.ha_frontend.add_extra_js_url") as add_js:
        with patch("custom_components.intellikeep.frontend.async_call_later"):
            await async_register_frontend(mock_hass, "intellikeep")

    mock_hass.http.async_register_static_paths.assert_awaited_once()
    add_js.assert_called_once()


async def test_register_card_resource_creates_resource_when_missing(mock_hass):
    resources = MagicMock()
    resources.async_get_info = AsyncMock(return_value={"resources": []})
    resources.async_create_item = AsyncMock()
    mock_hass.data["lovelace"] = {"resources": resources}

    callbacks = []

    def capture_later(_hass, _delay, callback):
        callbacks.append(callback)

    with patch("custom_components.intellikeep.frontend.async_call_later", side_effect=capture_later):
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

    callbacks = []

    with patch(
        "custom_components.intellikeep.frontend.async_call_later",
        side_effect=lambda _hass, _delay, callback: callbacks.append(callback),
    ):
        _async_register_card_resource(mock_hass, "intellikeep")

    await callbacks[0](None)

    resources.async_create_item.assert_not_awaited()