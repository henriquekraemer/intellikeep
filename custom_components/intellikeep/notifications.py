"""Notification manager for IntelliKeep."""
from __future__ import annotations

import logging
from datetime import datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import DOMAIN, EVENT_TASK_NOTIFICATION, NOTIFICATIONS_STORAGE_KEY, STORAGE_VERSION
from .models import Task
from .task_manager import TaskManager

_LOGGER = logging.getLogger(__name__)

NOTIFICATION_CHECK_INTERVAL = timedelta(hours=1)

# Delay before the sent-notification state is written, so several notifications
# in one check share a write. Home Assistant also writes it when shutting down.
SAVE_DELAY = 10

APPROACHING = "approaching"
OVERDUE = "overdue"

# Notification texts in Home Assistant's server language. They live here rather
# than in translations/, which only holds the categories Home Assistant defines.
MESSAGES: dict[str, dict[str, Any]] = {
    "en": {
        "approaching_title": "IntelliKeep: {name} due soon",
        "approaching_message": "Task **{name}** is due in {days}.\nPriority: {priority}",
        "overdue_title": "IntelliKeep — OVERDUE: {name}",
        "overdue_message": "Task **{name}** is overdue! Priority: {priority}",
        "day": "day",
        "days": "days",
        "priorities": {"low": "Low", "medium": "Medium", "high": "High", "critical": "Critical"},
    },
    "pt": {
        "approaching_title": "IntelliKeep: {name} vence em breve",
        "approaching_message": "A tarefa **{name}** vence em {days}.\nPrioridade: {priority}",
        "overdue_title": "IntelliKeep — ATRASADA: {name}",
        "overdue_message": "A tarefa **{name}** está atrasada! Prioridade: {priority}",
        "day": "dia",
        "days": "dias",
        "priorities": {"low": "Baixa", "medium": "Média", "high": "Alta", "critical": "Crítica"},
    },
    "es": {
        "approaching_title": "IntelliKeep: {name} vence pronto",
        "approaching_message": "La tarea **{name}** vence en {days}.\nPrioridad: {priority}",
        "overdue_title": "IntelliKeep — VENCIDA: {name}",
        "overdue_message": "¡La tarea **{name}** está vencida! Prioridad: {priority}",
        "day": "día",
        "days": "días",
        "priorities": {"low": "Baja", "medium": "Media", "high": "Alta", "critical": "Crítica"},
    },
}


def messages_for(language: object) -> dict[str, Any]:
    """Notification texts for a Home Assistant language code such as "pt-BR"; English otherwise."""
    lang = language.split("-")[0].lower() if isinstance(language, str) else ""
    return MESSAGES.get(lang, MESSAGES["en"])


def _due_key(task: Task) -> str:
    """The due date a notification was sent for: a new due date gets a new notification."""
    return dt_util.as_utc(task.due_date).isoformat() if task.due_date else ""


def _priority(texts: dict[str, Any], task: Task) -> str:
    """The task's priority as its translated label, in capitals."""
    value = getattr(task.priority, "value", task.priority)
    return texts["priorities"].get(value, str(value)).upper()


class NotificationManager:
    """Checks due/overdue tasks hourly and fires HA notifications.

    Each task is notified once per due date and kind. What was sent is saved,
    so a restart doesn't send the same reminders again.
    """

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
        self._store: Store[dict[str, dict[str, str]]] = Store(
            hass, STORAGE_VERSION, NOTIFICATIONS_STORAGE_KEY
        )
        # Kind → task_id → the due date it was notified for
        self._notified: dict[str, dict[str, str]] = {APPROACHING: {}, OVERDUE: {}}

    async def async_load(self) -> None:
        """Restore which notifications were already sent."""
        data = await self._store.async_load() or {}
        for kind, sent in self._notified.items():
            sent.update(data.get(kind) or {})

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
        """Call after a task is completed or deleted to reset its notification state."""
        changed = False
        for sent in self._notified.values():
            changed |= sent.pop(task_id, None) is not None
        if changed:
            self._schedule_save()

    def reset(self) -> None:
        """Clear all notification deduplication state."""
        for sent in self._notified.values():
            sent.clear()
        self._schedule_save()

    def _schedule_save(self) -> None:
        self._store.async_delay_save(lambda: self._notified, SAVE_DELAY)

    async def _async_check_notifications(self, _now: datetime | None) -> None:
        texts = messages_for(self.hass.config.language)
        changed = await self._notify_approaching_tasks(texts)
        changed |= await self._notify_overdue_tasks(texts)
        if changed:
            self._schedule_save()

    def _prune(self, kind: str, tasks: list[Task]) -> bool:
        """Forget tasks that left this kind (completed, deleted, moved), so they can be notified again."""
        sent = self._notified[kind]
        current = {task.task_id for task in tasks}
        gone = [task_id for task_id in sent if task_id not in current]
        for task_id in gone:
            del sent[task_id]
        return bool(gone)

    async def _notify_approaching_tasks(self, texts: dict[str, Any]) -> bool:
        tasks = self.task_manager.get_tasks_approaching_due()
        changed = self._prune(APPROACHING, tasks)
        sent = self._notified[APPROACHING]
        for task in tasks:
            due = _due_key(task)
            if sent.get(task.task_id) == due:
                continue
            days_left = self.task_manager.days_until_due(task)
            days = f"{days_left} {texts['day'] if days_left == 1 else texts['days']}"
            await self._send_notification(
                notification_id=f"{DOMAIN}_approaching_{task.task_id}",
                title=texts["approaching_title"].format(name=task.name),
                message=texts["approaching_message"].format(
                    name=task.name, days=days, priority=_priority(texts, task)
                ),
                task_id=task.task_id,
                event_type=APPROACHING,
            )
            sent[task.task_id] = due
            changed = True
        return changed

    async def _notify_overdue_tasks(self, texts: dict[str, Any]) -> bool:
        tasks = [task for task in self.task_manager.get_overdue_tasks() if task.notify_on_overdue]
        changed = self._prune(OVERDUE, tasks)
        sent = self._notified[OVERDUE]
        for task in tasks:
            due = _due_key(task)
            if sent.get(task.task_id) == due:
                continue
            await self._send_notification(
                notification_id=f"{DOMAIN}_overdue_{task.task_id}",
                title=texts["overdue_title"].format(name=task.name),
                message=texts["overdue_message"].format(name=task.name, priority=_priority(texts, task)),
                task_id=task.task_id,
                event_type=OVERDUE,
            )
            sent[task.task_id] = due
            changed = True
        return changed

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
            except Exception as err:  # noqa: BLE001
                _LOGGER.warning(
                    "Failed to call notification service %s: %s",
                    self.notification_service,
                    err,
                )
