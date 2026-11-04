"""Tests for IntelliKeep NotificationManager."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.util import dt as dt_util

from custom_components.intellikeep.models import TaskPriority
from custom_components.intellikeep.notifications import (
    NOTIFICATION_CHECK_INTERVAL,
    NotificationManager,
    messages_for,
)
from tests.conftest import make_task


def _manager(hass, task_manager, stored=None, **kwargs) -> NotificationManager:
    """A NotificationManager whose saved state is `stored` and whose writes go nowhere."""
    mgr = NotificationManager(hass, task_manager, **kwargs)
    mgr._store = MagicMock()
    mgr._store.async_load = AsyncMock(return_value=stored)
    return mgr


def _saved(mgr: NotificationManager) -> dict:
    """The state the manager last asked to save."""
    data_func = mgr._store.async_delay_save.call_args[0][0]
    return data_func()


def _persistent_calls(hass) -> list:
    return [c for c in hass.services.async_call.call_args_list if c[0][0] == "persistent_notification"]


@pytest.fixture
def notification_manager(mock_hass, task_manager):
    return _manager(mock_hass, task_manager)


def test_reset_clears_dedup_state(notification_manager):
    notification_manager._notified["approaching"]["task-a"] = "2026-01-01T00:00:00+00:00"
    notification_manager._notified["overdue"]["task-b"] = "2026-01-01T00:00:00+00:00"

    notification_manager.reset()

    assert notification_manager._notified == {"approaching": {}, "overdue": {}}
    assert _saved(notification_manager) == {"approaching": {}, "overdue": {}}


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
        assert call_args[0][2]["title"] == "IntelliKeep: Change filter due soon"
        assert call_args[0][2]["message"] == "Task **Change filter** is due in 1 day.\nPriority: MEDIUM"

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

        assert task.task_id not in notification_manager._notified["approaching"]
        assert task.task_id not in notification_manager._notified["overdue"]
        assert task.task_id not in _saved(notification_manager)["approaching"]

    async def test_new_due_date_notifies_again(
        self, notification_manager, mock_hass, mock_storage
    ):
        """Moving the due date within the reminder window sends a reminder for the new date."""
        task = make_task(
            due_date=datetime.now(timezone.utc) + timedelta(days=1),
            notify_days_before=3,
        )
        mock_storage.upsert_task(task)
        await notification_manager._async_check_notifications(None)

        task.due_date = datetime.now(timezone.utc) + timedelta(days=2)
        await notification_manager._async_check_notifications(None)

        assert len(_persistent_calls(mock_hass)) == 2
        assert "due in 2 days." in mock_hass.services.async_call.call_args[0][2]["message"]

    async def test_forgets_tasks_that_leave_the_window(
        self, notification_manager, mock_storage
    ):
        task = make_task(
            due_date=datetime.now(timezone.utc) + timedelta(days=1),
            notify_days_before=2,
        )
        mock_storage.upsert_task(task)
        await notification_manager._async_check_notifications(None)

        task.enabled = False
        await notification_manager._async_check_notifications(None)

        assert notification_manager._notified["approaching"] == {}
        assert _saved(notification_manager)["approaching"] == {}

    async def test_days_left_counts_local_days(
        self, notification_manager, mock_hass, mock_storage, sao_paulo_tz
    ):
        """At 21:30 in São Paulo a task due tomorrow morning is one day away, not zero."""
        task = make_task(
            name="Change filter",
            due_date=dt_util.as_utc(datetime(2026, 10, 11, 8, 0, tzinfo=sao_paulo_tz)),
            notify_days_before=1,
        )
        mock_storage.upsert_task(task)

        now = datetime(2026, 10, 10, 21, 30, tzinfo=sao_paulo_tz)
        with patch.object(dt_util, "utcnow", return_value=dt_util.as_utc(now)):
            await notification_manager._async_check_notifications(None)

        mock_hass.services.async_call.assert_called_once()
        assert "due in 1 day." in mock_hass.services.async_call.call_args[0][2]["message"]


class TestOverdueNotifications:
    async def test_notifies_overdue_task(
        self, notification_manager, mock_hass, task_manager, mock_storage
    ):
        task = make_task(
            name="Overdue task",
            priority=TaskPriority.HIGH,
            due_date=datetime.now(timezone.utc) - timedelta(days=5),
            notify_on_overdue=True,
        )
        mock_storage.upsert_task(task)

        await notification_manager._async_check_notifications(None)

        data = _persistent_calls(mock_hass)[0][0][2]
        assert data["title"] == "IntelliKeep — OVERDUE: Overdue task"
        assert data["message"] == "Task **Overdue task** is overdue! Priority: HIGH"

    async def test_deduplicates_overdue_notification(
        self, notification_manager, mock_hass, mock_storage
    ):
        task = make_task(
            due_date=datetime.now(timezone.utc) - timedelta(days=5),
            notify_on_overdue=True,
        )
        mock_storage.upsert_task(task)

        await notification_manager._async_check_notifications(None)
        await notification_manager._async_check_notifications(None)

        assert len(_persistent_calls(mock_hass)) == 1

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


class TestPersistence:
    async def test_saves_what_was_sent(self, notification_manager, mock_storage):
        due = datetime(2030, 1, 1, 9, 0, tzinfo=timezone.utc)
        task = make_task(due_date=due, notify_on_overdue=True)
        mock_storage.upsert_task(task)

        with patch.object(dt_util, "utcnow", return_value=due + timedelta(days=2)):
            await notification_manager._async_check_notifications(None)

        assert _saved(notification_manager) == {
            "approaching": {},
            "overdue": {task.task_id: due.isoformat()},
        }

    async def test_restart_does_not_send_again(self, mock_hass, task_manager, mock_storage):
        task = make_task(
            due_date=datetime.now(timezone.utc) - timedelta(days=2),
            notify_on_overdue=True,
        )
        mock_storage.upsert_task(task)
        stored = {"approaching": {}, "overdue": {task.task_id: dt_util.as_utc(task.due_date).isoformat()}}
        mgr = _manager(mock_hass, task_manager, stored=stored)

        await mgr.async_load()
        await mgr._async_check_notifications(None)

        mock_hass.services.async_call.assert_not_called()
        mgr._store.async_delay_save.assert_not_called()

    async def test_load_without_saved_state(self, notification_manager):
        await notification_manager.async_load()

        assert notification_manager._notified == {"approaching": {}, "overdue": {}}

    async def test_nothing_to_save_when_nothing_was_sent(self, notification_manager):
        await notification_manager._async_check_notifications(None)

        notification_manager._store.async_delay_save.assert_not_called()


class TestLanguage:
    async def test_brazilian_portuguese(self, notification_manager, mock_hass, mock_storage):
        mock_hass.config.language = "pt-BR"
        task = make_task(
            name="Trocar filtro",
            due_date=datetime.now(timezone.utc) + timedelta(days=2),
            notify_days_before=3,
        )
        mock_storage.upsert_task(task)

        await notification_manager._async_check_notifications(None)

        data = mock_hass.services.async_call.call_args[0][2]
        assert data["title"] == "IntelliKeep: Trocar filtro vence em breve"
        assert data["message"] == "A tarefa **Trocar filtro** vence em 2 dias.\nPrioridade: MÉDIA"

    async def test_spanish_overdue(self, notification_manager, mock_hass, mock_storage):
        mock_hass.config.language = "es"
        task = make_task(
            name="Limpiar canaletas",
            priority=TaskPriority.CRITICAL,
            due_date=datetime.now(timezone.utc) - timedelta(days=1),
            notify_on_overdue=True,
        )
        mock_storage.upsert_task(task)

        await notification_manager._async_check_notifications(None)

        data = _persistent_calls(mock_hass)[0][0][2]
        assert data["title"] == "IntelliKeep — VENCIDA: Limpiar canaletas"
        assert data["message"] == "¡La tarea **Limpiar canaletas** está vencida! Prioridad: CRÍTICA"

    @pytest.mark.parametrize("language", ["de", "", None])
    def test_other_languages_fall_back_to_english(self, language):
        assert messages_for(language) is messages_for("en")

    def test_every_language_has_every_text(self):
        english = messages_for("en")
        for language in ("pt", "es"):
            texts = messages_for(language)
            assert set(texts) == set(english)
            assert set(texts["priorities"]) == {p.value for p in TaskPriority}


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
        mgr = _manager(mock_hass, task_manager, notification_service="notify.mobile")
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
        mgr = _manager(mock_hass, task_manager, notification_service="invalid-service")
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
            mgr = _manager(mock_hass, task_manager)
            mgr.start()

        track_interval.assert_called_once_with(
            mock_hass,
            mgr._async_check_notifications,
            NOTIFICATION_CHECK_INTERVAL,
        )

    def test_stop_cancels_interval_listener(self, mock_hass, task_manager):
        mgr = _manager(mock_hass, task_manager)
        cancel = MagicMock()
        mgr._cancel_interval = cancel

        mgr.stop()

        cancel.assert_called_once()
        assert mgr._cancel_interval is None
