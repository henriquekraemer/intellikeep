"""Sensor platform for IntelliKeep."""
from __future__ import annotations

from homeassistant.components.sensor import SensorEntity, SensorStateClass
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN, SENSOR_NEXT_DUE, SENSOR_TASKS_DUE, SENSOR_TASKS_OVERDUE
from .coordinator import IntelliKeepCoordinator
from .runtime_data import IntelliKeepConfigEntry, IntelliKeepRuntimeData

PARALLEL_UPDATES = 0


async def async_setup_entry(
    hass: HomeAssistant,
    entry: IntelliKeepConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    runtime_data: IntelliKeepRuntimeData = entry.runtime_data
    coordinator: IntelliKeepCoordinator = runtime_data.coordinator
    async_add_entities(
        [
            IntelliKeepDueCountSensor(coordinator, entry),
            IntelliKeepOverdueCountSensor(coordinator, entry),
            IntelliKeepNextDueSensor(coordinator, entry),
        ]
    )


class _IntelliKeepSensorBase(CoordinatorEntity[IntelliKeepCoordinator], SensorEntity):
    _attr_has_entity_name = True

    def __init__(self, coordinator: IntelliKeepCoordinator, entry: IntelliKeepConfigEntry) -> None:
        super().__init__(coordinator)
        self._entry = entry

    @property
    def device_info(self) -> dict[str, object]:
        return {
            "identifiers": {(DOMAIN, self._entry.entry_id)},
            "name": self._entry.title,
            "manufacturer": "Intellilar",
            "model": "IntelliKeep",
        }


class IntelliKeepDueCountSensor(_IntelliKeepSensorBase):
    _attr_translation_key = "tasks_due_today"
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "tasks"

    def __init__(self, coordinator: IntelliKeepCoordinator, entry: IntelliKeepConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"{entry.entry_id}_{SENSOR_TASKS_DUE}"

    @property
    def native_value(self) -> int:
        return self.coordinator.data.get("tasks_due_count", 0)


class IntelliKeepOverdueCountSensor(_IntelliKeepSensorBase):
    _attr_translation_key = "tasks_overdue"
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "tasks"

    def __init__(self, coordinator: IntelliKeepCoordinator, entry: IntelliKeepConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"{entry.entry_id}_{SENSOR_TASKS_OVERDUE}"

    @property
    def native_value(self) -> int:
        return self.coordinator.data.get("tasks_overdue_count", 0)

    @property
    def extra_state_attributes(self) -> dict | None:
        overdue = [
            {
                "task_id": t.task_id,
                "name": t.name,
                "due_date": t.due_date.isoformat() if t.due_date else None,
                "priority": str(t.priority),
            }
            for t in (self.coordinator.data.get("all_tasks") or [])
            if not t.enabled is False
        ]
        return {"overdue_tasks": overdue} if overdue else None


class IntelliKeepNextDueSensor(_IntelliKeepSensorBase):
    _attr_translation_key = "next_due_task"

    def __init__(self, coordinator: IntelliKeepCoordinator, entry: IntelliKeepConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"{entry.entry_id}_{SENSOR_NEXT_DUE}"

    @property
    def native_value(self) -> str | None:
        task = self.coordinator.data.get("next_due_task")
        return task.name if task else None

    @property
    def extra_state_attributes(self) -> dict | None:
        task = self.coordinator.data.get("next_due_task")
        if task is None:
            return None
        return {
            "task_id": task.task_id,
            "due_date": task.due_date.isoformat() if task.due_date else None,
            "priority": str(task.priority),
            "linked_entity_ids": task.linked_entity_ids,
            "frequency": str(task.frequency),
        }
