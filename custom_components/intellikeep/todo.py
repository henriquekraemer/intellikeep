"""To-do list platform for IntelliKeep: tasks in Home Assistant's To-do lists."""
from __future__ import annotations

from datetime import timedelta

from homeassistant.components.todo import (
    TodoItem,
    TodoItemStatus,
    TodoListEntity,
    TodoListEntityFeature,
)
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import DOMAIN
from .coordinator import IntelliKeepCoordinator
from .entity import IntelliKeepEntity, local_due, utc_due
from .models import Task
from .runtime_data import IntelliKeepConfigEntry, IntelliKeepRuntimeData

PARALLEL_UPDATES = 0

# Completed tasks stay on the list this long, like the panel's Completed view
COMPLETED_WINDOW = timedelta(days=30)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: IntelliKeepConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    async_add_entities([IntelliKeepTodoList(entry.runtime_data.coordinator, entry)])


def todo_item(task: Task) -> TodoItem:
    """The to-do item for a task: open tasks need action, completed ones are done."""
    return TodoItem(
        summary=task.name,
        uid=task.task_id,
        status=TodoItemStatus.NEEDS_ACTION if task.enabled else TodoItemStatus.COMPLETED,
        due=local_due(task.due_date) if task.due_date else None,
        description=task.description or None,
        completed=None if task.enabled else task.last_completed_at,
    )


class IntelliKeepTodoList(IntelliKeepEntity, TodoListEntity):
    """Open tasks by due date, then the tasks completed in the last 30 days.

    Checking an item completes the task (a recurring one gets its next
    occurrence) and unchecking it reopens the task. Completed tasks can't be
    deleted from here, so "Clear completed" doesn't wipe the task history.
    """

    _attr_translation_key = "tasks"
    _attr_supported_features = (
        TodoListEntityFeature.CREATE_TODO_ITEM
        | TodoListEntityFeature.UPDATE_TODO_ITEM
        | TodoListEntityFeature.DELETE_TODO_ITEM
        | TodoListEntityFeature.SET_DUE_DATE_ON_ITEM
        | TodoListEntityFeature.SET_DUE_DATETIME_ON_ITEM
        | TodoListEntityFeature.SET_DESCRIPTION_ON_ITEM
    )

    def __init__(self, coordinator: IntelliKeepCoordinator, entry: IntelliKeepConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"{entry.entry_id}_todo"
        self._update_items()

    @callback
    def _handle_coordinator_update(self) -> None:
        self._update_items()
        super()._handle_coordinator_update()

    def _update_items(self) -> None:
        tasks: list[Task] = self.coordinator.data.get("all_tasks", [])
        since = dt_util.utcnow() - COMPLETED_WINDOW
        open_tasks = sorted(
            (t for t in tasks if t.enabled),
            key=lambda t: (t.due_date is None, t.due_date or since, t.task_number),
        )
        done = sorted(
            (t for t in tasks if not t.enabled and t.last_completed_at and t.last_completed_at >= since),
            key=lambda t: t.last_completed_at or since,
            reverse=True,
        )
        self._attr_todo_items = [todo_item(task) for task in (*open_tasks, *done)]

    @property
    def _runtime(self) -> IntelliKeepRuntimeData:
        return self._entry.runtime_data

    def _task(self, uid: str | None) -> Task:
        task = self._runtime.task_manager.get_task(uid) if uid else None
        if task is None:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="task_not_found",
                translation_placeholders={"task_id": str(uid)},
            )
        return task

    async def _user_name(self) -> str:
        """Name of the user behind the current action, for the task history."""
        user_id = self._context.user_id if self._context else None
        if user_id and (user := await self.hass.auth.async_get_user(user_id)):
            return user.name or ""
        return ""

    async def async_create_todo_item(self, item: TodoItem) -> None:
        """Add a one-time task."""
        await self._runtime.task_manager.async_create_task(
            name=item.summary or "",
            description=item.description or "",
            due_date=utc_due(item.due) if item.due else None,
            notify_days_before=self._runtime.notify_days_before_default,
        )
        await self.coordinator.async_refresh()

    async def async_update_todo_item(self, item: TodoItem) -> None:
        """Apply edits, then complete or reopen the task when its checkbox changed."""
        runtime = self._runtime
        task = self._task(item.uid)
        user = await self._user_name()

        changes: dict[str, object] = {}
        if item.summary and item.summary != task.name:
            changes["name"] = item.summary
        if (item.description or "") != (task.description or ""):
            changes["description"] = item.description or ""
        due = utc_due(item.due) if item.due else None
        # The To-do dialog sends times to the minute; seconds alone are not an edit
        if (due is None) != (task.due_date is None) or (
            due and task.due_date and abs(due - task.due_date) >= timedelta(minutes=1)
        ):
            changes["due_date"] = due
        if changes:
            await runtime.task_manager.async_update_task(task.task_id, updated_by=user, **changes)

        if item.status == TodoItemStatus.COMPLETED and task.enabled:
            await runtime.task_manager.async_complete_task(task.task_id, completed_by=user)
            runtime.notification_manager.clear_task_notifications(task.task_id)
        elif item.status == TodoItemStatus.NEEDS_ACTION and not task.enabled:
            await runtime.task_manager.async_reopen_task(task.task_id, performed_by=user)
        await self.coordinator.async_refresh()

    async def async_delete_todo_items(self, uids: list[str]) -> None:
        """Delete open tasks; completed ones keep their history and are refused."""
        runtime = self._runtime
        tasks = [self._task(uid) for uid in uids]
        if any(not task.enabled for task in tasks):
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="cannot_delete_completed",
            )
        for task in tasks:
            await runtime.task_manager.async_delete_task(task.task_id)
            runtime.notification_manager.clear_task_notifications(task.task_id)
        await self.coordinator.async_refresh()
