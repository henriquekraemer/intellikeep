"""Sensor platform for IntelliKeep."""
from __future__ import annotations

from homeassistant.components.sensor import SensorEntity, SensorStateClass
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN, SENSOR_NEXT_DUE, SENSOR_TASKS_DUE, SENSOR_TASKS_OVERDUE
from .coordinator import IntelliKeepCoordinator


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator: IntelliKeepCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities(
        [
            IntelliKeepDueCountSensor(coordinator, entry),
            IntelliKeepOverdueCountSensor(coordinator, entry),
            IntelliKeepNextDueSensor(coordinator, entry),
        ]
    )


class _IntelliKeepSensorBase(CoordinatorEntity[IntelliKeepCoordinator], SensorEntity):
    _attr_has_entity_name = True

    def __init__(self, coordinator: IntelliKeepCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator)
        self._entry = entry

    @property
    def device_info(self):
        return {
            "identifiers": {(DOMAIN, self._entry.entry_id)},
            "name": self._entry.title,
            "manufacturer": "Intellilar",
            "model": "IntelliKeep",
        }


class IntelliKeepDueCountSensor(_IntelliKeepSensorBase):
    _attr_name = "Tasks Due Today"
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "tasks"
    _attr_icon = "mdi:clipboard-check-outline"

    def __init__(self, coordinator: IntelliKeepCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"{entry.entry_id}_{SENSOR_TASKS_DUE}"

    @property
    def native_value(self) -> int:
        return self.coordinator.data.get("tasks_due_count", 0)


class IntelliKeepOverdueCountSensor(_IntelliKeepSensorBase):
    _attr_name = "Tasks Overdue"
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "tasks"
    _attr_icon = "mdi:clipboard-alert-outline"

    def __init__(self, coordinator: IntelliKeepCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry)
        self._attr_unique_id = f"{entry.entry_id}_{SENSOR_TASKS_OVERDUE}"

    @property
    def native_value(self) -> int:
        return self.coordinator.data.get("tasks_overdue_count", 0)

    @property
    def extra_state_attributes(self) -> dict | None:
        overdue = [
            {"task_id": t.task_id, "name": t.name, "due_date": t.due_date.isoformat() if t.due_date else None, "priority": str(t.priority)}
            for t in (self.coordinator.data.get("all_tasks") or [])
            if not t.enabled is False
        ]
        return {"overdue_tasks": overdue} if overdue else None


class IntelliKeepNextDueSensor(_IntelliKeepSensorBase):
    _attr_name = "Next Due Task"
    _attr_icon = "mdi:calendar-clock"

    def __init__(self, coordinator: IntelliKeepCoordinator, entry: ConfigEntry) -> None:
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
