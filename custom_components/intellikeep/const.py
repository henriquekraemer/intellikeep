"""Constants for IntelliKeep."""
from __future__ import annotations

DOMAIN = "intellikeep"
STORAGE_VERSION = 1
STORAGE_KEY = DOMAIN

# Config entry keys
CONF_INSTANCE_NAME = "instance_name"
CONF_NOTIFY_DAYS_BEFORE_DEFAULT = "notify_days_before_default"
CONF_NOTIFICATION_SERVICE = "notification_service"

# Defaults
DEFAULT_INSTANCE_NAME = "IntelliKeep"
DEFAULT_NOTIFY_DAYS_BEFORE = 1

# Sensor unique IDs
SENSOR_TASKS_DUE = "tasks_due_count"
SENSOR_TASKS_OVERDUE = "tasks_overdue_count"
SENSOR_NEXT_DUE = "next_due_task"

# Service names
SERVICE_CREATE_TASK = "create_task"
SERVICE_LOAD_SAMPLE_DATA = "load_sample_data"
SERVICE_COMPLETE_TASK = "complete_task"
SERVICE_REOPEN_TASK = "reopen_task"
SERVICE_DELETE_TASK = "delete_task"
SERVICE_UPDATE_TASK = "update_task"
SERVICE_ADD_TASK_NOTE = "add_task_note"
SERVICE_DELETE_TASK_NOTE = "delete_task_note"
SERVICE_DELETE_ALL_DATA = "delete_all_data"

# WebSocket commands
WS_GET_TASKS = "get_tasks"
WS_GET_TASK = "get_task"
WS_SUBSCRIBE = "subscribe"
WS_GET_VERSION = "get_version"

# Events
EVENT_TASK_NOTIFICATION = f"{DOMAIN}_task_notification"
EVENT_TASK_UPDATED = f"{DOMAIN}_task_updated"

# Platforms
PLATFORMS = ["sensor"]

# Frontend
FRONTEND_STATIC_PATH = "intellikeep_static"
FRONTEND_CARD_URL = f"/{FRONTEND_STATIC_PATH}/intellikeep-card.js"
FRONTEND_PANEL_URL = f"/{FRONTEND_STATIC_PATH}/intellikeep-panel.js"
PANEL_URL = DOMAIN
PANEL_TITLE = "IntelliKeep"
PANEL_ICON = "intellikeep:icon"

VERSION = "0.0.2"
