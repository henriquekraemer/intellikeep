"""Notification manager for IntelliKeep."""
from __future__ import annotations

import logging
from datetime import datetime, timedelta

from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_track_time_interval

from .const import DOMAIN, EVENT_TASK_NOTIFICATION
from .task_manager import TaskManager

_LOGGER = logging.getLogger(__name__)

NOTIFICATION_CHECK_INTERVAL = timedelta(hours=1)


class NotificationManager:
    """Checks due/overdue tasks hourly and fires HA notifications."""

    def __init__(
        self,
        hass: HomeAssistant,
        task_manager: TaskManager,
        notification_service: str | None = None,
    ) -> None:
        self.hass = hass
        self.task_manager = task_manager
        self.notification_service = notification_service
        self._cancel_interval = None
        # Deduplicate per session to avoid spamming on every hourly check
        self._notified_approaching: set[str] = set()
        self._notified_overdue: set[str] = set()

    def start(self) -> None:
        self._cancel_interval = async_track_time_interval(
            self.hass,
            self._async_check_notifications,
            NOTIFICATION_CHECK_INTERVAL,
        )
        _LOGGER.debug("IntelliKeep notification manager started")

    def stop(self) -> None:
        if self._cancel_interval:
            self._cancel_interval()
            self._cancel_interval = None
        _LOGGER.debug("IntelliKeep notification manager stopped")

    def clear_task_notifications(self, task_id: str) -> None:
        """Call after a task is completed to reset its notification state."""
        self._notified_approaching.discard(task_id)
        self._notified_overdue.discard(task_id)

    async def _async_check_notifications(self, _now: datetime) -> None:
        await self._notify_approaching_tasks()
        await self._notify_overdue_tasks()

    async def _notify_approaching_tasks(self) -> None:
        for task in self.task_manager.get_tasks_approaching_due():
            if task.task_id in self._notified_approaching:
                continue
            days_left = (
                task.due_date.date() - datetime.utcnow().date()  # type: ignore[union-attr]
            ).days
            unit = "day" if days_left == 1 else "days"
            await self._send_notification(
                notification_id=f"{DOMAIN}_approaching_{task.task_id}",
                title=f"IntelliKeep: {task.name} due soon",
                message=(
                    f"Task **{task.name}** is due in {days_left} {unit}.\n"
                    f"Priority: {task.priority.upper()}"
                ),
                task_id=task.task_id,
                event_type="approaching",
            )
            self._notified_approaching.add(task.task_id)

    async def _notify_overdue_tasks(self) -> None:
        for task in self.task_manager.get_overdue_tasks():
            if not task.notify_on_overdue:
                continue
            if task.task_id in self._notified_overdue:
                continue
            await self._send_notification(
                notification_id=f"{DOMAIN}_overdue_{task.task_id}",
                title=f"IntelliKeep — OVERDUE: {task.name}",
                message=f"Task **{task.name}** is overdue! Priority: {task.priority.upper()}",
                task_id=task.task_id,
                event_type="overdue",
            )
            self._notified_overdue.add(task.task_id)

    async def _send_notification(
        self,
        notification_id: str,
        title: str,
        message: str,
        task_id: str,
        event_type: str,
    ) -> None:
        # Always create a persistent notification (HA bell icon)
        await self.hass.services.async_call(
            "persistent_notification",
            "create",
            {
                "notification_id": notification_id,
                "title": title,
                "message": message,
            },
            blocking=False,
        )

        # Fire an HA event so users can build automations on top
        self.hass.bus.async_fire(
            EVENT_TASK_NOTIFICATION,
            {
                "notification_id": notification_id,
                "task_id": task_id,
                "title": title,
                "message": message,
                "event_type": event_type,
            },
        )

        # Optionally call a custom notify.* service (e.g. mobile app)
        if self.notification_service:
            try:
                domain, service = self.notification_service.split(".", 1)
                await self.hass.services.async_call(
                    domain,
                    service,
                    {"title": title, "message": message},
                    blocking=False,
                )
            except (ValueError, Exception) as err:
                _LOGGER.warning(
                    "Failed to call notification service %s: %s",
                    self.notification_service,
                    err,
                )
