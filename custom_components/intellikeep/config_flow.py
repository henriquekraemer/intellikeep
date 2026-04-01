"""Config flow for IntelliKeep."""
from __future__ import annotations

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import selector

from .const import (
    CONF_INSTANCE_NAME,
    CONF_NOTIFICATION_SERVICE,
    CONF_NOTIFY_DAYS_BEFORE_DEFAULT,
    DEFAULT_INSTANCE_NAME,
    DEFAULT_NOTIFY_DAYS_BEFORE,
    DOMAIN,
)


class IntelliKeepConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle the IntelliKeep config flow."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict | None = None
    ) -> config_entries.ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(
                title=user_input[CONF_INSTANCE_NAME],
                data=user_input,
            )

        schema = vol.Schema(
            {
                vol.Optional(CONF_INSTANCE_NAME, default=DEFAULT_INSTANCE_NAME): selector.selector(
                    {"text": {}}
                ),
                vol.Optional(
                    CONF_NOTIFY_DAYS_BEFORE_DEFAULT, default=DEFAULT_NOTIFY_DAYS_BEFORE
                ): selector.selector(
                    {"number": {"min": 0, "max": 30, "unit_of_measurement": "days", "mode": "box"}}
                ),
                vol.Optional(CONF_NOTIFICATION_SERVICE, default=""): selector.selector(
                    {"text": {}}
                ),
            }
        )

        return self.async_show_form(
            step_id="user",
            data_schema=schema,
            description_placeholders={
                "notification_service_example": "notify.mobile_app_my_phone"
            },
        )

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> IntelliKeepOptionsFlow:
        return IntelliKeepOptionsFlow(config_entry)


class IntelliKeepOptionsFlow(config_entries.OptionsFlow):
    """Handle IntelliKeep options (reconfiguration)."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        self._config_entry = config_entry

    async def async_step_init(
        self, user_input: dict | None = None
    ) -> config_entries.ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        current = self._config_entry.options or self._config_entry.data

        schema = vol.Schema(
            {
                vol.Optional(
                    CONF_INSTANCE_NAME,
                    default=current.get(CONF_INSTANCE_NAME, DEFAULT_INSTANCE_NAME),
                ): selector.selector({"text": {}}),
                vol.Optional(
                    CONF_NOTIFY_DAYS_BEFORE_DEFAULT,
                    default=current.get(
                        CONF_NOTIFY_DAYS_BEFORE_DEFAULT, DEFAULT_NOTIFY_DAYS_BEFORE
                    ),
                ): selector.selector(
                    {"number": {"min": 0, "max": 30, "unit_of_measurement": "days", "mode": "box"}}
                ),
                vol.Optional(
                    CONF_NOTIFICATION_SERVICE,
                    default=current.get(CONF_NOTIFICATION_SERVICE, ""),
                ): selector.selector({"text": {}}),
            }
        )

        return self.async_show_form(step_id="init", data_schema=schema)
