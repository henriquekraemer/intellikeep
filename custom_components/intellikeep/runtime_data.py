"""Runtime objects stored on the config entry."""
from __future__ import annotations

from dataclasses import dataclass

from homeassistant.config_entries import ConfigEntry

from .coordinator import IntelliKeepCoordinator
from .notifications import NotificationManager
from .storage import IntelliKeepStorage
from .task_manager import TaskManager


@dataclass(slots=True)
class IntelliKeepRuntimeData:
    """Runtime state for a loaded IntelliKeep config entry."""

    storage: IntelliKeepStorage
    task_manager: TaskManager
    coordinator: IntelliKeepCoordinator
    notification_manager: NotificationManager


type IntelliKeepConfigEntry = ConfigEntry[IntelliKeepRuntimeData]
