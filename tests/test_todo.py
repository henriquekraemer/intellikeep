"""Tests for the IntelliKeep to-do list entity."""
from __future__ import annotations

from datetime import date, datetime, timedelta, timezone
from unittest.mock import AsyncMock, MagicMock

import pytest
from homeassistant.components.todo import TodoItem, TodoItemStatus
from homeassistant.core import Context
from homeassistant.exceptions import ServiceValidationError
from homeassistant.util import dt as dt_util

from custom_components.intellikeep.models import TaskFrequency
from custom_components.intellikeep.todo import IntelliKeepTodoList, async_setup_entry
from tests.conftest import make_task


@pytest.fixture
def todo_list(mock_hass, mock_config_entry, runtime_data, task_manager):
    """The to-do entity, reading the task manager's tasks like the real coordinator."""
    runtime_data.coordinator.data = {"all_tasks": task_manager.get_all_tasks()}
    entity = IntelliKeepTodoList(runtime_data.coordinator, mock_config_entry)
    entity.hass = mock_hass
    user = MagicMock()
    user.name = "Ana"
    mock_hass.auth.async_get_user = AsyncMock(return_value=user)
    entity.async_set_context(Context(user_id="user-1"))
    return entity


def refresh(entity: IntelliKeepTodoList, task_manager) -> list[TodoItem]:
    """What the coordinator refresh does after a change."""
    entity.coordinator.data = {"all_tasks": task_manager.get_all_tasks()}
    entity._update_items()
    return entity.todo_items or []


async def test_setup_adds_one_list(mock_hass, mock_config_entry):
    added = []
    await async_setup_entry(mock_hass, mock_config_entry, added.extend)
    assert len(added) == 1
    assert added[0].unique_id == "entry-1_todo"


class TestItems:
    def test_open_tasks_by_due_date_then_recent_completions(self, todo_list, task_manager, mock_storage):
        now = dt_util.utcnow()
        later = make_task(name="Later", due_date=now + timedelta(days=5))
        undated = make_task(name="Undated")
        soon = make_task(name="Soon", due_date=now + timedelta(days=1))
        done_recently = make_task(name="Done recently", enabled=False, last_completed_at=now - timedelta(days=2))
        done_today = make_task(name="Done today", enabled=False, last_completed_at=now)
        done_long_ago = make_task(name="Done long ago", enabled=False, last_completed_at=now - timedelta(days=45))
        for task in (later, undated, soon, done_recently, done_today, done_long_ago):
            mock_storage.upsert_task(task)

        items = refresh(todo_list, task_manager)

        assert [item.summary for item in items] == ["Soon", "Later", "Undated", "Done today", "Done recently"]
        assert [item.status for item in items] == [TodoItemStatus.NEEDS_ACTION] * 3 + [TodoItemStatus.COMPLETED] * 2
        assert items[0].uid == soon.task_id

    def test_due_is_a_date_at_local_midnight(self, todo_list, task_manager, mock_storage, sao_paulo_tz):
        midnight = make_task(name="Midnight", due_date=datetime(2026, 10, 20, 3, 0, tzinfo=timezone.utc))
        evening = make_task(name="Evening", due_date=datetime(2026, 10, 20, 22, 14, tzinfo=timezone.utc))
        mock_storage.upsert_task(midnight)
        mock_storage.upsert_task(evening)

        items = {item.summary: item for item in refresh(todo_list, task_manager)}

        assert items["Midnight"].due == date(2026, 10, 20)
        assert items["Evening"].due == datetime(2026, 10, 20, 19, 14, tzinfo=sao_paulo_tz)

    def test_item_fields(self, todo_list, task_manager, mock_storage):
        done_at = dt_util.utcnow()
        task = make_task(name="Filter", description="", enabled=False, last_completed_at=done_at)
        mock_storage.upsert_task(task)

        (item,) = refresh(todo_list, task_manager)

        assert item.description is None
        assert item.due is None
        assert item.completed == done_at


class TestCreate:
    async def test_creates_one_time_task(self, todo_list, task_manager, runtime_data, sao_paulo_tz):
        await todo_list.async_create_todo_item(
            TodoItem(summary="Water plants", description="Balcony", due=date(2026, 10, 21))
        )

        (task,) = task_manager.get_all_tasks()
        assert task.name == "Water plants"
        assert task.description == "Balcony"
        assert task.frequency == TaskFrequency.ONE_TIME
        # A date is local midnight
        assert task.due_date == datetime(2026, 10, 21, 3, 0, tzinfo=timezone.utc)
        assert task.notify_days_before == runtime_data.notify_days_before_default
        runtime_data.coordinator.async_refresh.assert_awaited()

    async def test_due_datetime(self, todo_list, task_manager, sao_paulo_tz):
        due = datetime(2026, 10, 21, 18, 30, tzinfo=sao_paulo_tz)
        await todo_list.async_create_todo_item(TodoItem(summary="Call plumber", due=due))

        (task,) = task_manager.get_all_tasks()
        assert task.due_date == datetime(2026, 10, 21, 21, 30, tzinfo=timezone.utc)


class TestUpdate:
    async def test_edits_name_description_and_due(self, todo_list, task_manager, mock_storage, sao_paulo_tz):
        task = make_task(name="Old", due_date=datetime(2026, 10, 20, 22, 0, tzinfo=timezone.utc))
        mock_storage.upsert_task(task)
        refresh(todo_list, task_manager)

        await todo_list.async_update_todo_item(TodoItem(
            uid=task.task_id,
            summary="New",
            description="Details",
            due=date(2026, 10, 22),
            status=TodoItemStatus.NEEDS_ACTION,
        ))

        assert task.name == "New"
        assert task.description == "Details"
        assert task.due_date == datetime(2026, 10, 22, 3, 0, tzinfo=timezone.utc)
        assert task.enabled
        assert task.activities[-1].performed_by == "Ana"

    async def test_seconds_alone_are_not_an_edit(self, todo_list, task_manager, mock_storage):
        due = datetime(2026, 10, 20, 22, 14, 37, tzinfo=timezone.utc)
        task = make_task(name="Filter", due_date=due)
        mock_storage.upsert_task(task)

        await todo_list.async_update_todo_item(TodoItem(
            uid=task.task_id,
            summary="Filter",
            due=dt_util.as_local(due).replace(second=0),
            status=TodoItemStatus.NEEDS_ACTION,
        ))

        assert task.due_date == due
        assert task.activities == []

    async def test_clearing_due_date(self, todo_list, task_manager, mock_storage):
        task = make_task(name="Filter", due_date=dt_util.utcnow())
        mock_storage.upsert_task(task)

        await todo_list.async_update_todo_item(
            TodoItem(uid=task.task_id, summary="Filter", due=None, status=TodoItemStatus.NEEDS_ACTION)
        )

        assert task.due_date is None

    async def test_checking_completes_and_schedules_next(self, todo_list, task_manager, mock_storage, runtime_data):
        task = make_task(name="Filter", frequency=TaskFrequency.MONTHLY, due_date=dt_util.utcnow())
        mock_storage.upsert_task(task)
        item = next(i for i in refresh(todo_list, task_manager) if i.uid == task.task_id)

        await todo_list.async_update_todo_item(TodoItem(
            uid=item.uid, summary=item.summary, due=item.due, status=TodoItemStatus.COMPLETED,
        ))

        assert not task.enabled
        assert task.executions[-1].completed_by == "Ana"
        runtime_data.notification_manager.clear_task_notifications.assert_called_once_with(task.task_id)
        items = refresh(todo_list, task_manager)
        assert [(i.summary, i.status) for i in items] == [
            ("Filter", TodoItemStatus.NEEDS_ACTION),
            ("Filter", TodoItemStatus.COMPLETED),
        ]

    async def test_unchecking_reopens(self, todo_list, task_manager, mock_storage):
        task = make_task(name="Filter", frequency=TaskFrequency.MONTHLY, due_date=dt_util.utcnow())
        mock_storage.upsert_task(task)
        await task_manager.async_complete_task(task.task_id, completed_by="Ana")
        assert len(task_manager.get_all_tasks()) == 2

        await todo_list.async_update_todo_item(
            TodoItem(uid=task.task_id, summary="Filter", status=TodoItemStatus.NEEDS_ACTION)
        )

        assert task.enabled
        assert task.executions == []
        # The occurrence the completion created is gone again
        assert task_manager.get_all_tasks() == [task]

    async def test_unknown_task(self, todo_list):
        with pytest.raises(ServiceValidationError):
            await todo_list.async_update_todo_item(TodoItem(uid="missing", summary="x"))


class TestDelete:
    async def test_deletes_open_tasks(self, todo_list, task_manager, mock_storage, runtime_data):
        first = make_task(name="First")
        second = make_task(name="Second")
        mock_storage.upsert_task(first)
        mock_storage.upsert_task(second)

        await todo_list.async_delete_todo_items([first.task_id, second.task_id])

        assert task_manager.get_all_tasks() == []
        assert runtime_data.notification_manager.clear_task_notifications.call_count == 2

    async def test_refuses_completed_tasks(self, todo_list, task_manager, mock_storage):
        open_task = make_task(name="Open")
        done = make_task(name="Done", enabled=False, last_completed_at=dt_util.utcnow())
        mock_storage.upsert_task(open_task)
        mock_storage.upsert_task(done)

        with pytest.raises(ServiceValidationError) as err:
            await todo_list.async_delete_todo_items([open_task.task_id, done.task_id])

        assert err.value.translation_key == "cannot_delete_completed"
        # Nothing is deleted, not even the open one
        assert len(task_manager.get_all_tasks()) == 2
