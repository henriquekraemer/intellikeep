"""Tests for IntelliKeep WebSocket API commands."""
from __future__ import annotations

import asyncio
from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock, patch

import pytest

from custom_components.intellikeep.const import VERSION
from custom_components.intellikeep.models import TaskFrequency
from custom_components.intellikeep.websocket_api import _get_runtime_data, async_register_websocket_commands
from tests.conftest import make_task


class TestGetTasksWS:
    async def test_returns_all_tasks_with_status(self, task_manager, mock_storage):
        t1 = make_task(name="Task A", due_date=datetime.now(timezone.utc) + timedelta(days=2))
        t2 = make_task(name="Task B", due_date=datetime.now(timezone.utc) - timedelta(days=1))
        mock_storage.upsert_task(t1)
        mock_storage.upsert_task(t2)

        tasks = task_manager.get_all_tasks_with_status()
        names = [t["name"] for t in tasks]
        statuses = [t["status"] for t in tasks]

        assert "Task A" in names
        assert "Task B" in names
        assert "pending" in statuses
        assert "due" in statuses or "overdue" in statuses

    async def test_empty_returns_empty_list(self, task_manager):
        assert task_manager.get_all_tasks_with_status() == []


class TestGetTaskWS:
    async def test_returns_single_task(self, task_manager, mock_storage):
        task = make_task(name="Single task")
        mock_storage.upsert_task(task)

        found = mock_storage.get_task(task.task_id)
        assert found is not None
        assert found.name == "Single task"

    async def test_unknown_task_returns_none(self, mock_storage):
        assert mock_storage.get_task("does-not-exist") is None


class TestTaskDictSerialization:
    def test_as_dict_with_status_has_all_fields(self, task_manager, mock_storage):
        task = make_task(
            name="Full task",
            frequency=TaskFrequency.MONTHLY,
            due_date=datetime.now(timezone.utc) + timedelta(days=10),
            linked_entity_ids=["sensor.temp"],
        )
        mock_storage.upsert_task(task)

        status = task_manager.get_task_status(task)
        result = task.as_dict_with_status(status)

        for field in (
            "task_id",
            "name",
            "description",
            "priority",
            "frequency",
            "weekdays",
            "due_date",
            "linked_entity_ids",
            "notify_days_before",
            "created_at",
            "updated_at",
            "enabled",
            "status",
            "executions_count",
        ):
            assert field in result, f"Missing field: {field}"


@pytest.fixture
def websocket_commands(mock_hass, mock_config_entry):
    registered = {}
    background_tasks = []
    mock_hass.config_entries.async_entries.return_value = [mock_config_entry]
    mock_hass.async_create_background_task = MagicMock(
        side_effect=lambda coro, *_args, **_kwargs: background_tasks.append(
            asyncio.create_task(coro)
        )
        or background_tasks[-1]
    )

    def capture_command(_hass, command):
        registered[command.__name__] = command

    with patch(
        "custom_components.intellikeep.websocket_api.websocket_api.async_register_command",
        side_effect=capture_command,
    ):
        async_register_websocket_commands(mock_hass)

    return registered, background_tasks


class TestRegisteredWebsocketCommands:
    async def test_get_tasks_returns_all_tasks(
        self, websocket_commands, runtime_data, mock_hass
    ):
        commands, background_tasks = websocket_commands
        runtime_data.storage.upsert_task(make_task(name="WS task"))
        connection = MagicMock()

        commands["ws_get_tasks"](mock_hass, connection, {"id": 1})
        await asyncio.gather(*background_tasks)

        connection.send_result.assert_called_once()
        assert connection.send_result.call_args.args[0] == 1
        assert connection.send_result.call_args.args[1]["tasks"][0]["name"] == "WS task"

    async def test_get_task_returns_error_for_unknown_task(
        self, websocket_commands, mock_hass
    ):
        commands, background_tasks = websocket_commands
        connection = MagicMock()

        commands["ws_get_task"](
            mock_hass,
            connection,
            {"id": 2, "task_id": "missing"},
        )
        await asyncio.gather(*background_tasks)

        connection.send_error.assert_called_once_with(2, "not_found", "Task missing not found")

    async def test_get_task_returns_serialized_task(
        self, websocket_commands, runtime_data, mock_hass
    ):
        commands, background_tasks = websocket_commands
        task = make_task(name="One task")
        runtime_data.storage.upsert_task(task)
        connection = MagicMock()

        commands["ws_get_task"](
            mock_hass,
            connection,
            {"id": 3, "task_id": task.task_id},
        )
        await asyncio.gather(*background_tasks)

        connection.send_result.assert_called_once()
        assert connection.send_result.call_args.args[1]["task"]["task_id"] == task.task_id

    def test_subscribe_registers_listener_and_sends_initial_state(
        self, websocket_commands, runtime_data, mock_hass
    ):
        commands, _ = websocket_commands
        runtime_data.storage.upsert_task(make_task(name="Subscribe"))
        unsubscribe = MagicMock()
        runtime_data.coordinator.async_add_listener.return_value = unsubscribe
        connection = MagicMock()
        connection.subscriptions = {}

        commands["ws_subscribe"](mock_hass, connection, {"id": 4})

        connection.send_message.assert_called_once()
        connection.send_result.assert_called_once_with(4)
        assert 4 in connection.subscriptions
        connection.subscriptions[4]()
        unsubscribe.assert_called_once()

    def test_get_version_returns_version(self, websocket_commands, mock_hass):
        commands, _ = websocket_commands
        connection = MagicMock()

        commands["ws_get_version"](mock_hass, connection, {"id": 5})

        connection.send_result.assert_called_once_with(5, {"version": VERSION})

    def test_websocket_registration_is_idempotent(self, mock_hass, mock_config_entry):
        mock_hass.config_entries.async_entries.return_value = [mock_config_entry]

        with patch(
            "custom_components.intellikeep.websocket_api.websocket_api.async_register_command"
        ) as register_command:
            async_register_websocket_commands(mock_hass)
            async_register_websocket_commands(mock_hass)

        assert register_command.call_count == 4

    def test_runtime_data_lookup_fails_when_not_configured(self, mock_hass):
        with pytest.raises(ValueError, match="not configured"):
            _get_runtime_data(mock_hass)
