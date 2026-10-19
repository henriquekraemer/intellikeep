"""Base entity and helpers shared by the IntelliKeep platforms."""
from __future__ import annotations

from datetime import date, datetime, time

from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.util import dt as dt_util

from .const import DOMAIN
from .coordinator import IntelliKeepCoordinator
from .runtime_data import IntelliKeepConfigEntry


class IntelliKeepEntity(CoordinatorEntity[IntelliKeepCoordinator]):
    """Entity on the IntelliKeep device, updated by the coordinator."""

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


def local_due(due_date: datetime) -> date | datetime:
    """Due date in Home Assistant's time zone, as a plain date when it is at midnight.

    The panel saves a due date without a time as local midnight, so midnight
    reads as "that day" rather than as 00:00.
    """
    local = dt_util.as_local(due_date)
    return local.date() if local.time() == time(0) else local


def utc_due(due: date | datetime) -> datetime:
    """Inverse of local_due: a date becomes local midnight; naive times are local."""
    if not isinstance(due, datetime):
        due = datetime.combine(due, time(0))
    if due.tzinfo is None:
        due = due.replace(tzinfo=dt_util.get_default_time_zone())
    return dt_util.as_utc(due)
