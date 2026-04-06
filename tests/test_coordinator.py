"""Tests for IntelliKeep coordinator."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from unittest.mock import patch

from custom_components.intellikeep.coordinator import IntelliKeepCoordinator
from tests.conftest import make_task


async def test_coordinator_aggregates_task_state(mock_hass, task_manager, mock_storage):
    due_task = make_task(name="Due", due_date=datetime.now(timezone.utc))
    overdue_task = make_task(
        name="Overdue", due_date=datetime.now(timezone.utc) - timedelta(days=3)
    )
    later_task = make_task(
        name="Later", due_date=datetime.now(timezone.utc) + timedelta(days=2)
    )
    mock_storage.upsert_task(due_task)
    mock_storage.upsert_task(overdue_task)
    mock_storage.upsert_task(later_task)

    with patch("homeassistant.helpers.frame.report_usage"):
        coordinator = IntelliKeepCoordinator(mock_hass, task_manager)

    result = await coordinator._async_update_data()

    assert result["tasks_due_count"] == 2
    assert result["tasks_overdue_count"] == 1
    assert result["next_due_task"].name == "Overdue"
    assert len(result["all_tasks"]) == 3