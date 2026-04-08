"""Tests for IntelliKeep config flow."""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.intellikeep.const import (
    CONF_INSTANCE_NAME,
    CONF_NOTIFICATION_SERVICE,
    CONF_NOTIFY_DAYS_BEFORE_DEFAULT,
    DEFAULT_INSTANCE_NAME,
    DEFAULT_NOTIFY_DAYS_BEFORE,
    DOMAIN,
)
from custom_components.intellikeep.config_flow import IntelliKeepConfigFlow


class TestConfigFlow:
    async def test_creates_entry_with_defaults(self):
        flow = IntelliKeepConfigFlow()
        flow.hass = MagicMock()
        flow.context = {"source": "user"}
        flow._async_current_entries = MagicMock(return_value=[])
        flow.async_set_unique_id = AsyncMock()
        flow._abort_if_unique_id_configured = MagicMock()

        result = await flow.async_step_user(
            {
                CONF_INSTANCE_NAME: "My Home",
                CONF_NOTIFY_DAYS_BEFORE_DEFAULT: 2,
                CONF_NOTIFICATION_SERVICE: "",
            }
        )

        assert result["type"] == "create_entry"
        assert result["title"] == "My Home"
        assert result["data"][CONF_INSTANCE_NAME] == "My Home"
        assert result["data"][CONF_NOTIFY_DAYS_BEFORE_DEFAULT] == 2
        flow.async_set_unique_id.assert_awaited_once_with(DOMAIN)
        flow._abort_if_unique_id_configured.assert_called_once()

    async def test_shows_form_when_no_input(self):
        flow = IntelliKeepConfigFlow()
        flow.hass = MagicMock()
        flow.context = {"source": "user"}
        flow._async_current_entries = MagicMock(return_value=[])

        result = await flow.async_step_user(None)

        assert result["type"] == "form"
        assert result["step_id"] == "user"

    async def test_default_instance_name(self):
        flow = IntelliKeepConfigFlow()
        flow.hass = MagicMock()
        flow.context = {"source": "user"}
        flow._async_current_entries = MagicMock(return_value=[])
        flow.async_set_unique_id = AsyncMock()
        flow._abort_if_unique_id_configured = MagicMock()

        result = await flow.async_step_user(
            {
                CONF_INSTANCE_NAME: DEFAULT_INSTANCE_NAME,
                CONF_NOTIFY_DAYS_BEFORE_DEFAULT: DEFAULT_NOTIFY_DAYS_BEFORE,
                CONF_NOTIFICATION_SERVICE: "",
            }
        )

        assert result["data"][CONF_INSTANCE_NAME] == DEFAULT_INSTANCE_NAME

    async def test_reconfigure_updates_entry(self):
        flow = IntelliKeepConfigFlow()
        entry = MagicMock()
        entry.data = {
            CONF_INSTANCE_NAME: "Old",
            CONF_NOTIFY_DAYS_BEFORE_DEFAULT: 1,
            CONF_NOTIFICATION_SERVICE: "",
        }
        entry.options = {}
        flow._get_reconfigure_entry = MagicMock(return_value=entry)
        flow.async_update_reload_and_abort = MagicMock(
            return_value={"type": "abort", "reason": "reconfigured"}
        )

        result = await flow.async_step_reconfigure(
            {
                CONF_INSTANCE_NAME: "New",
                CONF_NOTIFY_DAYS_BEFORE_DEFAULT: 3,
                CONF_NOTIFICATION_SERVICE: "notify.mobile_app",
            }
        )

        assert result["reason"] == "reconfigured"
        flow.async_update_reload_and_abort.assert_called_once()

    async def test_reconfigure_shows_form(self):
        flow = IntelliKeepConfigFlow()
        entry = MagicMock()
        entry.data = {
            CONF_INSTANCE_NAME: "Configured",
            CONF_NOTIFY_DAYS_BEFORE_DEFAULT: 2,
            CONF_NOTIFICATION_SERVICE: "",
        }
        entry.options = {}
        flow._get_reconfigure_entry = MagicMock(return_value=entry)

        result = await flow.async_step_reconfigure()

        assert result["type"] == "form"
        assert result["step_id"] == "reconfigure"


class TestOptionsFlow:
    async def test_options_flow_updates_config(self):
        from custom_components.intellikeep.config_flow import IntelliKeepOptionsFlow

        entry = MagicMock()
        entry.data = {
            CONF_INSTANCE_NAME: "Home",
            CONF_NOTIFY_DAYS_BEFORE_DEFAULT: 1,
            CONF_NOTIFICATION_SERVICE: "",
        }
        entry.options = {}

        flow = IntelliKeepOptionsFlow(entry)
        result = await flow.async_step_init(
            {
                CONF_INSTANCE_NAME: "Updated Home",
                CONF_NOTIFY_DAYS_BEFORE_DEFAULT: 3,
                CONF_NOTIFICATION_SERVICE: "notify.mobile_app",
            }
        )

        assert result["type"] == "create_entry"
        assert result["data"][CONF_INSTANCE_NAME] == "Updated Home"
        assert result["data"][CONF_NOTIFICATION_SERVICE] == "notify.mobile_app"
