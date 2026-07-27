"""Tests for IntelliKeep HA services."""
from __future__ import annotations

from datetime import datetime, timedelta
from unittest.mock import MagicMock

import pytest
from homeassistant.exceptions import ServiceValidationError

from custom_components.intellikeep.const import (
    SERVICE_ADD_TASK_NOTE,
    SERVICE_COMPLETE_TASK,
    SERVICE_CREATE_TASK,
    SERVICE_DELETE_ALL_DATA,
    SERVICE_DELETE_TASK,
    SERVICE_DELETE_TASK_NOTE,
    SERVICE_LOAD_SAMPLE_DATA,
    SERVICE_REOPEN_TASK,
    SERVICE_UPDATE_TASK,
)
from custom_components.intellikeep.models import TaskFrequency, TaskPriority
from custom_components.intellikeep.services import async_register_services, async_unregister_services
from tests.conftest import make_task


class TestCreateTaskService:
    async def test_create_task_stores_and_returns(self, task_manager, mock_storage):
        task = await task_manager.async_create_task(
            name="HVAC filter",
            priority=TaskPriority.HIGH,
            frequency=TaskFrequency.MONTHLY,
            linked_entity_ids=["climate.living_room"],
        )
        assert task.name == "HVAC filter"
        assert task.priority == TaskPriority.HIGH
        assert task.frequency == TaskFrequency.MONTHLY
        assert "climate.living_room" in task.linked_entity_ids
        assert mock_storage.get_task(task.task_id) is not None

    async def test_create_task_with_custom_interval(self, task_manager, mock_storage):
        task = await task_manager.async_create_task(
            name="Custom task",
            frequency=TaskFrequency.CUSTOM,
            custom_days_interval=45,
        )
        assert task.custom_days_interval == 45


class TestCompleteTaskService:
    async def test_complete_records_execution(self, task_manager, mock_storage):
        task = make_task(name="Paint fence", frequency=TaskFrequency.YEARLY)
        mock_storage.upsert_task(task)

        completed = await task_manager.async_complete_task(
            task.task_id, completed_by="Bob", notes="Used white paint"
        )
        assert completed is not None
        assert len(completed.executions) == 1
        assert completed.executions[0].completed_by == "Bob"
        assert completed.executions[0].notes == "Used white paint"

    async def test_complete_multiple_times_accumulates_history(
        self, task_manager, mock_storage
    ):
        task = make_task(frequency=TaskFrequency.WEEKLY)
        mock_storage.upsert_task(task)

        await task_manager.async_complete_task(task.task_id, completed_by="Alice")
        await task_manager.async_complete_task(task.task_id, completed_by="Bob")

        stored = mock_storage.get_task(task.task_id)
        assert stored is not None
        assert len(stored.executions) == 2


class TestDeleteTaskService:
    async def test_delete_removes_task(self, task_manager, mock_storage):
        task = make_task(name="Remove me")
        mock_storage.upsert_task(task)

        result = await task_manager.async_delete_task(task.task_id)
        assert result is True
        assert mock_storage.get_task(task.task_id) is None

    async def test_delete_saves_storage(self, task_manager, mock_storage):
        task = make_task()
        mock_storage.upsert_task(task)
        mock_storage._store.async_save.reset_mock()

        await task_manager.async_delete_task(task.task_id)
        mock_storage._store.async_save.assert_called_once()


class TestUpdateTaskService:
    async def test_update_name(self, task_manager, mock_storage):
        task = make_task(name="Old name")
        mock_storage.upsert_task(task)

        updated = await task_manager.async_update_task(task.task_id, name="New name")
        assert updated is not None
        assert updated.name == "New name"

    async def test_update_preserves_other_fields(self, task_manager, mock_storage):
        task = make_task(
            name="Keep me",
            priority=TaskPriority.HIGH,
            frequency=TaskFrequency.WEEKLY,
        )
        mock_storage.upsert_task(task)

        updated = await task_manager.async_update_task(task.task_id, name="Updated")
        assert updated is not None
        assert updated.priority == TaskPriority.HIGH
        assert updated.frequency == TaskFrequency.WEEKLY

    async def test_update_nonexistent_returns_none(self, task_manager):
        result = await task_manager.async_update_task("ghost", name="X")
        assert result is None


@pytest.fixture
def registered_service_handlers(mock_hass, mock_config_entry):
    mock_hass.config_entries.async_entries.return_value = [mock_config_entry]
    async_register_services(mock_hass)
    return {
        call.args[1]: call.args[2]
        for call in mock_hass.services.async_register.call_args_list
    }


class TestRegisteredServices:
    async def test_create_task_handler_coerces_values(
        self, registered_service_handlers, runtime_data
    ):
        handler = registered_service_handlers[SERVICE_CREATE_TASK]

        await handler(
            MagicMock(
                data={
                    "name": "Monthly filter",
                    "priority": "high",
                    "frequency": "monthly",
                    "custom_days_interval": 7.0,
                    "notify_days_before": 2.0,
                    "due_date": "2025-02-01T09:00:00+00:00",
                }
            )
        )

        tasks = runtime_data.storage.get_all_tasks()
        assert len(tasks) == 1
        assert tasks[0].priority == TaskPriority.HIGH
        assert tasks[0].frequency == TaskFrequency.MONTHLY
        assert tasks[0].custom_days_interval == 7
        assert tasks[0].notify_days_before == 2
        runtime_data.coordinator.async_refresh.assert_awaited_once()

    async def test_create_task_handler_applies_configured_notify_default(
        self, registered_service_handlers, runtime_data
    ):
        runtime_data.notify_days_before_default = 5

        await registered_service_handlers[SERVICE_CREATE_TASK](
            MagicMock(data={"name": "Uses default"})
        )

        tasks = runtime_data.storage.get_all_tasks()
        assert len(tasks) == 1
        assert tasks[0].notify_days_before == 5

    async def test_complete_delete_update_and_note_handlers_raise_for_missing_tasks(
        self, registered_service_handlers
    ):
        for service_name, payload in (
            (SERVICE_COMPLETE_TASK, {"task_id": "missing"}),
            (SERVICE_REOPEN_TASK, {"task_id": "missing"}),
            (SERVICE_DELETE_TASK, {"task_id": "missing"}),
            (SERVICE_UPDATE_TASK, {"task_id": "missing", "name": "New"}),
            (SERVICE_ADD_TASK_NOTE, {"task_id": "missing", "content": "x"}),
            (
                SERVICE_DELETE_TASK_NOTE,
                {"task_id": "missing", "note_id": "note-1"},
            ),
        ):
            with pytest.raises(ServiceValidationError):
                await registered_service_handlers[service_name](MagicMock(data=payload))

    async def test_complete_handler_clears_notification_state(
        self, registered_service_handlers, runtime_data
    ):
        task = make_task(name="Do it")
        runtime_data.storage.upsert_task(task)

        await registered_service_handlers[SERVICE_COMPLETE_TASK](
            MagicMock(data={"task_id": task.task_id})
        )

        runtime_data.notification_manager.clear_task_notifications.assert_called_once_with(
            task.task_id
        )
        runtime_data.coordinator.async_refresh.assert_awaited_once()

    async def test_load_sample_data_populates_storage(
        self, registered_service_handlers, runtime_data
    ):
        await registered_service_handlers[SERVICE_LOAD_SAMPLE_DATA](MagicMock(data={}))

        assert len(runtime_data.storage.get_all_tasks()) > 1
        runtime_data.coordinator.async_refresh.assert_awaited_once()

    async def test_delete_all_data_clears_tasks_and_notification_sets(
        self, registered_service_handlers, runtime_data
    ):
        task = make_task()
        runtime_data.storage.upsert_task(task)
        runtime_data.notification_manager._notified_approaching = {task.task_id}
        runtime_data.notification_manager._notified_overdue = {task.task_id}

        await registered_service_handlers[SERVICE_DELETE_ALL_DATA](MagicMock(data={}))

        assert runtime_data.storage.get_all_tasks() == []
        assert runtime_data.notification_manager._notified_approaching == set()
        assert runtime_data.notification_manager._notified_overdue == set()

    def test_unregister_services_removes_all(self, mock_hass):
        async_unregister_services(mock_hass)

        removed = {call.args[1] for call in mock_hass.services.async_remove.call_args_list}
        assert removed == {
            SERVICE_CREATE_TASK,
            SERVICE_LOAD_SAMPLE_DATA,
            SERVICE_COMPLETE_TASK,
            SERVICE_REOPEN_TASK,
            SERVICE_DELETE_TASK,
            SERVICE_UPDATE_TASK,
            SERVICE_ADD_TASK_NOTE,
            SERVICE_DELETE_TASK_NOTE,
            SERVICE_DELETE_ALL_DATA,
        }

    async def test_service_calls_fail_when_not_configured(self, mock_hass):
        async_register_services(mock_hass)
        handler = mock_hass.services.async_register.call_args_list[0].args[2]

        with pytest.raises(ServiceValidationError):
            await handler(MagicMock(data={"name": "Task"}))

    def test_register_services_is_idempotent(self, mock_hass):
        mock_hass.services.has_service.side_effect = [False, True]

        async_register_services(mock_hass)
        first_count = mock_hass.services.async_register.call_count
        async_register_services(mock_hass)

        assert first_count == len(mock_hass.services.async_register.call_args_list)
