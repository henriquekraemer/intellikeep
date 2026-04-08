"""Tests for IntelliKeep storage layer."""
from __future__ import annotations

from datetime import datetime
from unittest.mock import AsyncMock, MagicMock

import pytest

from custom_components.intellikeep.models import Task, TaskFrequency
from custom_components.intellikeep.storage import IntelliKeepStorage
from tests.conftest import make_task


@pytest.fixture
def storage(mock_hass):
    s = IntelliKeepStorage(mock_hass)
    s._store = MagicMock()
    s._store.async_load = AsyncMock()
    s._store.async_save = AsyncMock()
    return s


class TestLoad:
    async def test_load_empty(self, storage):
        storage._store.async_load.return_value = None
        await storage.async_load()
        assert storage.get_all_tasks() == []

    async def test_load_with_tasks(self, storage):
        task = make_task(name="Loaded task")
        storage._store.async_load.return_value = {
            "tasks": {task.task_id: task.as_dict()}
        }
        await storage.async_load()
        loaded = storage.get_task(task.task_id)
        assert loaded is not None
        assert loaded.name == "Loaded task"

    async def test_load_skips_malformed_entries(self, storage):
        storage._store.async_load.return_value = {
            "tasks": {
                "bad-id": {"not_a_valid": "task"},
            }
        }
        # Should not raise
        await storage.async_load()
        assert storage.get_all_tasks() == []


class TestSave:
    async def test_save_serializes_tasks(self, storage):
        task = make_task(name="Save me")
        storage.upsert_task(task)
        await storage.async_save()

        call_args = storage._store.async_save.call_args[0][0]
        assert task.task_id in call_args["tasks"]
        assert call_args["tasks"][task.task_id]["name"] == "Save me"


class TestCRUD:
    def test_upsert_and_get(self, storage):
        task = make_task(name="Get me")
        storage.upsert_task(task)
        assert storage.get_task(task.task_id) is task

    def test_get_all_tasks(self, storage):
        t1 = make_task(name="A")
        t2 = make_task(name="B")
        storage.upsert_task(t1)
        storage.upsert_task(t2)
        all_tasks = storage.get_all_tasks()
        assert len(all_tasks) == 2

    def test_delete_existing(self, storage):
        task = make_task()
        storage.upsert_task(task)
        assert storage.delete_task(task.task_id) is True
        assert storage.get_task(task.task_id) is None

    def test_delete_nonexistent(self, storage):
        assert storage.delete_task("nope") is False

    def test_upsert_updates_existing(self, storage):
        task = make_task(name="Old name")
        storage.upsert_task(task)
        task.name = "New name"
        storage.upsert_task(task)
        assert storage.get_task(task.task_id).name == "New name"

    def test_next_task_number_increments(self, storage):
        assert storage.next_task_number() == 1
        assert storage.next_task_number() == 2

    def test_clear_all_tasks_returns_removed_count(self, storage):
        storage.upsert_task(make_task(name="A"))
        storage.upsert_task(make_task(name="B"))

        count = storage.clear_all_tasks()

        assert count == 2
        assert storage.get_all_tasks() == []
