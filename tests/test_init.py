"""Tests for IntelliKeep integration setup and unload."""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

from custom_components.intellikeep import async_setup, async_setup_entry, async_unload_entry
from custom_components.intellikeep.runtime_data import IntelliKeepRuntimeData


async def test_async_setup_registers_global_hooks(mock_hass):
    with patch("custom_components.intellikeep.async_register_services") as register_services:
        with patch(
            "custom_components.intellikeep.async_register_websocket_commands"
        ) as register_ws:
            result = await async_setup(mock_hass, {})

    assert result is True
    register_services.assert_called_once_with(mock_hass)
    register_ws.assert_called_once_with(mock_hass)


async def test_async_setup_entry_stores_runtime_data(mock_hass, mock_config_entry):
    with patch("custom_components.intellikeep.IntelliKeepStorage") as storage_cls:
        with patch("custom_components.intellikeep.TaskManager") as task_manager_cls:
            with patch("custom_components.intellikeep.IntelliKeepCoordinator") as coordinator_cls:
                with patch("custom_components.intellikeep.NotificationManager") as notif_cls:
                    with patch("custom_components.intellikeep.async_register_frontend", new=AsyncMock()):
                        with patch("custom_components.intellikeep._async_register_panel", new=AsyncMock()):
                            storage = MagicMock()
                            storage.async_load = AsyncMock()
                            storage_cls.return_value = storage
                            task_manager = MagicMock()
                            task_manager_cls.return_value = task_manager
                            coordinator = MagicMock()
                            coordinator.async_config_entry_first_refresh = AsyncMock()
                            coordinator_cls.return_value = coordinator
                            notification_manager = MagicMock()
                            notif_cls.return_value = notification_manager

                            result = await async_setup_entry(mock_hass, mock_config_entry)

    assert result is True
    assert isinstance(mock_config_entry.runtime_data, IntelliKeepRuntimeData)
    notification_manager.start.assert_called_once()
    mock_hass.config_entries.async_forward_entry_setups.assert_awaited_once()


async def test_async_unload_entry_stops_notification_manager(
    mock_hass, mock_config_entry, runtime_data
):
    result = await async_unload_entry(mock_hass, mock_config_entry)

    assert result is True
    runtime_data.notification_manager.stop.assert_called_once()