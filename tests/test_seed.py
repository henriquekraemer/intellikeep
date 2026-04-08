"""Tests for IntelliKeep sample task generation."""
from __future__ import annotations

from custom_components.intellikeep.models import Task
from custom_components.intellikeep.seed import SAMPLE_TASKS, build_sample_tasks


def test_build_sample_tasks_creates_task_objects():
    tasks = build_sample_tasks()

    assert len(tasks) == len(SAMPLE_TASKS)
    assert all(isinstance(task, Task) for task in tasks)
    assert any(task.notify_on_overdue for task in tasks)