"""Tests for IntelliKeep diagnostics."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

from custom_components.intellikeep.diagnostics import async_get_config_entry_diagnostics
from tests.conftest import make_task


async def test_diagnostics_redacts_notification_service(
    mock_hass, mock_config_entry, runtime_data
):
    task = make_task(
        name="Replace filter",
        due_date=datetime.now(timezone.utc) + timedelta(days=1),
        linked_entity_ids=["sensor.kitchen"],
    )
    runtime_data.storage.upsert_task(task)
    mock_config_entry.data = {"notification_service": "notify.mobile_app_phone"}
    mock_config_entry.options = {"notification_service": "notify.mobile_app_phone"}

    result = await async_get_config_entry_diagnostics(mock_hass, mock_config_entry)

    assert result["entry"]["data"]["notification_service"] == "**REDACTED**"
    assert result["stats"]["task_count"] == 1
    assert result["tasks"][0]["linked_entity_count"] == 1
    assert result["tasks"][0]["weekdays"] == []
    assert result["tasks"][0]["status"] == "pending"