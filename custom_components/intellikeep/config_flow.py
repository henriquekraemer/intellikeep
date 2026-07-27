"""Config flow for IntelliKeep."""
from __future__ import annotations

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.config_entries import ConfigEntry
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


def _build_config_schema(defaults: dict[str, object]) -> vol.Schema:
    """Build the shared schema for setup and update flows."""
    return vol.Schema(
        {
            vol.Optional(
                CONF_INSTANCE_NAME,
                default=defaults.get(CONF_INSTANCE_NAME, DEFAULT_INSTANCE_NAME),
            ): selector.selector({"text": {}}),
            vol.Optional(
                CONF_NOTIFY_DAYS_BEFORE_DEFAULT,
                default=defaults.get(
                    CONF_NOTIFY_DAYS_BEFORE_DEFAULT, DEFAULT_NOTIFY_DAYS_BEFORE
                ),
            ): selector.selector(
                {
                    "number": {
                        "min": 0,
                        "max": 30,
                        "unit_of_measurement": "days",
                        "mode": "box",
                    }
                }
            ),
            vol.Optional(
                CONF_NOTIFICATION_SERVICE,
                default=defaults.get(CONF_NOTIFICATION_SERVICE, ""),
            ): selector.selector({"text": {}}),
        }
    )


class IntelliKeepConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle the IntelliKeep config flow."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict | None = None
    ) -> config_entries.ConfigFlowResult:
        if user_input is not None:
            await self.async_set_unique_id(DOMAIN)
            self._abort_if_unique_id_configured()
            return self.async_create_entry(
                title=user_input[CONF_INSTANCE_NAME],
                data={},
                options=user_input,
            )

        return self.async_show_form(
            step_id="user",
            data_schema=_build_config_schema({}),
            description_placeholders={
                "notification_service_example": "notify.mobile_app_my_phone"
            },
        )

    async def async_step_reconfigure(
        self, user_input: dict | None = None
    ) -> config_entries.ConfigFlowResult:
        """Handle reconfiguration of an existing entry."""
        entry = self._get_reconfigure_entry()

        if user_input is not None:
            return self.async_update_reload_and_abort(
                entry,
                title=user_input[CONF_INSTANCE_NAME],
                options=user_input,
            )

        # Merge data for installs created before settings moved to options
        current = {**entry.data, **entry.options}
        return self.async_show_form(
            step_id="reconfigure",
            data_schema=_build_config_schema(current),
        )

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: ConfigEntry,
    ) -> IntelliKeepOptionsFlow:
        return IntelliKeepOptionsFlow()


class IntelliKeepOptionsFlow(config_entries.OptionsFlow):
    """Handle IntelliKeep options (reconfiguration)."""

    async def async_step_init(
        self, user_input: dict | None = None
    ) -> config_entries.ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        # Merge data for installs created before settings moved to options
        current = {**self.config_entry.data, **self.config_entry.options}

        return self.async_show_form(
            step_id="init",
            data_schema=_build_config_schema(current),
        )
