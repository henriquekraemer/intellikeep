"""Tests for IntelliKeep sensor entities."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock

import pytest

from custom_components.intellikeep.sensor import async_setup_entry
from custom_components.intellikeep.models import TaskFrequency, TaskPriority
from tests.conftest import make_task


class TestCoordinatorData:
    """Test that the coordinator aggregates data correctly."""

    async def test_tasks_due_count(self, task_manager, mock_storage):
        t1 = make_task(name="Due now", due_date=datetime.now(timezone.utc))
        t2 = make_task(name="Future", due_date=datetime.now(timezone.utc) + timedelta(days=5))
        mock_storage.upsert_task(t1)
        mock_storage.upsert_task(t2)

        due = task_manager.get_tasks_due_today()
        assert len(due) == 1
        assert due[0].name == "Due now"

    async def test_tasks_overdue_count(self, task_manager, mock_storage):
        t1 = make_task(name="Overdue", due_date=datetime.now(timezone.utc) - timedelta(days=3))
        t2 = make_task(name="OK", due_date=datetime.now(timezone.utc) + timedelta(days=1))
        mock_storage.upsert_task(t1)
        mock_storage.upsert_task(t2)

        overdue = task_manager.get_overdue_tasks()
        assert len(overdue) == 1
        assert overdue[0].name == "Overdue"

    async def test_next_due_task(self, task_manager, mock_storage):
        t1 = make_task(name="Far", due_date=datetime.now(timezone.utc) + timedelta(days=10))
        t2 = make_task(name="Near", due_date=datetime.now(timezone.utc) + timedelta(days=2))
        t3 = make_task(name="No date", due_date=None)
        mock_storage.upsert_task(t1)
        mock_storage.upsert_task(t2)
        mock_storage.upsert_task(t3)

        next_task = task_manager.get_next_due_task()
        assert next_task is not None
        assert next_task.name == "Near"

    async def test_next_due_task_empty(self, task_manager):
        assert task_manager.get_next_due_task() is None

    async def test_next_due_excludes_disabled(self, task_manager, mock_storage):
        t = make_task(name="Disabled", due_date=datetime.now(timezone.utc), enabled=False)
        mock_storage.upsert_task(t)
        # Disabled task has no due_date for scheduling purposes
        # next_due_task only considers enabled=True with due_date set
        result = task_manager.get_next_due_task()
        assert result is None


class TestTaskWithStatus:
    def test_all_tasks_with_status_includes_status_field(
        self, task_manager, mock_storage
    ):
        t = make_task(name="Check", due_date=datetime.now(timezone.utc) + timedelta(days=3))
        mock_storage.upsert_task(t)

        result = task_manager.get_all_tasks_with_status()
        assert len(result) == 1
        assert "status" in result[0]
        assert result[0]["status"] == "pending"

    def test_overdue_task_has_overdue_status(self, task_manager, mock_storage):
        t = make_task(due_date=datetime.now(timezone.utc) - timedelta(days=5))
        mock_storage.upsert_task(t)

        result = task_manager.get_all_tasks_with_status()
        assert result[0]["status"] == "overdue"


class TestSensorEntities:
    async def test_async_setup_entry_adds_three_entities(
        self, mock_hass, mock_config_entry, runtime_data
    ):
        task = make_task(
            name="Overdue",
            due_date=datetime.now(timezone.utc) - timedelta(days=2),
        )
        runtime_data.coordinator.data = {
            "all_tasks": [task],
            "tasks_due_count": 1,
            "tasks_overdue_count": 1,
            "next_due_task": task,
        }

        added_entities = []

        await async_setup_entry(
            mock_hass,
            mock_config_entry,
            lambda entities: added_entities.extend(entities),
        )

        assert len(added_entities) == 3
        assert added_entities[0].native_value == 1
        assert added_entities[1].native_value == 1
        assert added_entities[2].native_value == "Overdue"

    async def test_sensor_attributes_include_device_and_task_details(
        self, mock_hass, mock_config_entry, runtime_data
    ):
        task = make_task(
            name="Replace filter",
            due_date=datetime.now(timezone.utc) + timedelta(days=1),
            linked_entity_ids=["climate.living_room"],
        )
        runtime_data.coordinator.data = {
            "all_tasks": [task],
            "tasks_due_count": 0,
            "tasks_overdue_count": 1,
            "next_due_task": task,
        }

        added_entities = []
        await async_setup_entry(
            mock_hass,
            mock_config_entry,
            lambda entities: added_entities.extend(entities),
        )

        due_sensor, overdue_sensor, next_due_sensor = added_entities

        assert due_sensor.device_info["name"] == "IntelliKeep"
        assert overdue_sensor.extra_state_attributes == {
            "overdue_tasks": [
                {
                    "task_id": task.task_id,
                    "name": "Replace filter",
                    "due_date": task.due_date.isoformat(),
                    "priority": str(task.priority),
                }
            ]
        }
        assert next_due_sensor.extra_state_attributes == {
            "task_id": task.task_id,
            "due_date": task.due_date.isoformat(),
            "priority": str(task.priority),
            "linked_entity_ids": ["climate.living_room"],
            "frequency": str(task.frequency),
        }
