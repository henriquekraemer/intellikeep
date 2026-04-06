"""Tests for IntelliKeep NotificationManager."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock, patch

import pytest

from custom_components.intellikeep.notifications import NOTIFICATION_CHECK_INTERVAL, NotificationManager
from tests.conftest import make_task


@pytest.fixture
def notification_manager(mock_hass, task_manager):
    mgr = NotificationManager(mock_hass, task_manager)
    return mgr


class TestApproachingNotifications:
    async def test_notifies_approaching_task(
        self, notification_manager, mock_hass, task_manager, mock_storage
    ):
        task = make_task(
            name="Change filter",
            due_date=datetime.now(timezone.utc) + timedelta(days=1),
            notify_days_before=2,
        )
        mock_storage.upsert_task(task)

        await notification_manager._async_check_notifications(None)

        mock_hass.services.async_call.assert_called_once()
        call_args = mock_hass.services.async_call.call_args
        assert call_args[0][0] == "persistent_notification"
        assert call_args[0][1] == "create"
        assert "Change filter" in call_args[0][2]["title"]

    async def test_deduplicates_approaching_notification(
        self, notification_manager, mock_hass, task_manager, mock_storage
    ):
        task = make_task(
            due_date=datetime.now(timezone.utc) + timedelta(days=1),
            notify_days_before=2,
        )
        mock_storage.upsert_task(task)

        # First check → should notify
        await notification_manager._async_check_notifications(None)
        first_call_count = mock_hass.services.async_call.call_count

        # Second check → should NOT notify again (deduplication)
        await notification_manager._async_check_notifications(None)
        assert mock_hass.services.async_call.call_count == first_call_count

    async def test_clear_removes_dedup_state(
        self, notification_manager, task_manager, mock_storage
    ):
        task = make_task(
            due_date=datetime.now(timezone.utc) + timedelta(days=1),
            notify_days_before=2,
        )
        mock_storage.upsert_task(task)

        await notification_manager._async_check_notifications(None)
        notification_manager.clear_task_notifications(task.task_id)

        assert task.task_id not in notification_manager._notified_approaching
        assert task.task_id not in notification_manager._notified_overdue


class TestOverdueNotifications:
    async def test_notifies_overdue_task(
        self, notification_manager, mock_hass, task_manager, mock_storage
    ):
        task = make_task(
            name="Overdue task",
            due_date=datetime.now(timezone.utc) - timedelta(days=5),
            notify_on_overdue=True,
        )
        mock_storage.upsert_task(task)

        await notification_manager._async_check_notifications(None)

        titles = [
            c[0][2]["title"]
            for c in mock_hass.services.async_call.call_args_list
            if c[0][0] == "persistent_notification"
        ]
        assert any("Overdue task" in t for t in titles)

    async def test_respects_notify_on_overdue_false(
        self, notification_manager, mock_hass, task_manager, mock_storage
    ):
        task = make_task(
            due_date=datetime.now(timezone.utc) - timedelta(days=3),
            notify_on_overdue=False,
        )
        mock_storage.upsert_task(task)

        await notification_manager._async_check_notifications(None)

        mock_hass.services.async_call.assert_not_called()


class TestHaEvent:
    async def test_fires_ha_event(
        self, notification_manager, mock_hass, task_manager, mock_storage
    ):
        task = make_task(
            due_date=datetime.now(timezone.utc) - timedelta(days=3),
            notify_on_overdue=True,
        )
        mock_storage.upsert_task(task)

        await notification_manager._async_check_notifications(None)

        mock_hass.bus.async_fire.assert_called_once()
        event_type = mock_hass.bus.async_fire.call_args[0][0]
        assert event_type == "intellikeep_task_notification"


class TestCustomNotificationService:
    async def test_calls_custom_service(
        self, mock_hass, task_manager, mock_storage
    ):
        mgr = NotificationManager(
            mock_hass, task_manager, notification_service="notify.mobile"
        )
        task = make_task(
            due_date=datetime.now(timezone.utc) - timedelta(days=2),
            notify_on_overdue=True,
        )
        mock_storage.upsert_task(task)

        await mgr._async_check_notifications(None)

        service_calls = [
            c[0][:2] for c in mock_hass.services.async_call.call_args_list
        ]
        assert ("notify", "mobile") in service_calls

    async def test_invalid_custom_service_logs_warning(self, mock_hass, task_manager, mock_storage):
        mgr = NotificationManager(
            mock_hass, task_manager, notification_service="invalid-service"
        )
        task = make_task(
            due_date=datetime.now(timezone.utc) - timedelta(days=2),
            notify_on_overdue=True,
        )
        mock_storage.upsert_task(task)

        with patch("custom_components.intellikeep.notifications._LOGGER.warning") as warning:
            await mgr._async_check_notifications(None)

        warning.assert_called_once()


class TestLifecycle:
    def test_start_registers_interval_listener(self, mock_hass, task_manager):
        with patch(
            "custom_components.intellikeep.notifications.async_track_time_interval",
            return_value=MagicMock(),
        ) as track_interval:
            mgr = NotificationManager(mock_hass, task_manager)
            mgr.start()

        track_interval.assert_called_once_with(
            mock_hass,
            mgr._async_check_notifications,
            NOTIFICATION_CHECK_INTERVAL,
        )

    def test_stop_cancels_interval_listener(self, mock_hass, task_manager):
        mgr = NotificationManager(mock_hass, task_manager)
        cancel = MagicMock()
        mgr._cancel_interval = cancel

        mgr.stop()

        cancel.assert_called_once()
        assert mgr._cancel_interval is None
