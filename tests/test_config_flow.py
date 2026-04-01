"""Tests for IntelliKeep config flow."""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

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

        result = await flow.async_step_user(
            {
                CONF_INSTANCE_NAME: DEFAULT_INSTANCE_NAME,
                CONF_NOTIFY_DAYS_BEFORE_DEFAULT: DEFAULT_NOTIFY_DAYS_BEFORE,
                CONF_NOTIFICATION_SERVICE: "",
            }
        )

        assert result["data"][CONF_INSTANCE_NAME] == DEFAULT_INSTANCE_NAME


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
