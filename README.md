# IntelliKeep

<img width="933" height="256" alt="intellikeep_banner" src="https://github.com/user-attachments/assets/3d579c40-5bbd-4730-872f-45f464456593" />

[![Documentation](https://img.shields.io/badge/docs-intellikeep.intellilar.com-blue)](https://intellikeep.intellilar.com)
[![HACS](https://img.shields.io/badge/HACS-Custom-orange)](https://hacs.xyz)
[![Tests](https://github.com/intellilar/intellikeep/actions/workflows/tests.yml/badge.svg)](https://github.com/intellilar/intellikeep/actions/workflows/tests.yml)
[![Validate](https://github.com/intellilar/intellikeep/actions/workflows/validate.yml/badge.svg)](https://github.com/intellilar/intellikeep/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**IntelliKeep** is a home maintenance task management system built as a free, open-source custom integration for Home Assistant. It centralizes all your household tasks—from simple filter replacements to periodic check-ups—offering automatic alerts and a complete task history.

---

## Features

- One-time and **recurring tasks** (daily, weekly, monthly, yearly, or custom interval)
- **Priority levels**: low, medium, high, critical — with color-coded priority bar
- Link tasks to **HA areas or specific devices**
- **Notes** per task — add, view and delete timestamped notes with author tracking
- **Activity log** per task — full audit trail of edits, completions, reopens and note changes
- **Calendar view** — week and month grids with task dots, area/device/priority filters, and today/period navigation
- **Execution history** — filterable by area/device, with configurable columns, CSV export, and print support
- **Notifications** via persistent notifications + optional mobile push service
- Three **sensor entities**: `tasks_due_today`, `tasks_overdue`, `next_due_task`
- Designed for **web and mobile** — responsive panel that follows HA UI patterns
- **Lovelace card** for compact dashboard display of due/overdue tasks

---

## Installation

### Via HACS (recommended)

1. Open HACS → Integrations → Custom repositories
2. Add `https://github.com/intellilar/intellikeep` with category **Integration**
3. Install **IntelliKeep**
4. Restart Home Assistant
5. Go to **Settings → Devices & Services → Add Integration** → search **IntelliKeep**

### Manual

Copy `custom_components/intellikeep/` into your HA `config/custom_components/` directory and restart.

---

## Setup

During setup you can configure:

| Option | Default | Description |
|---|---|---|
| Instance Name | `IntelliKeep` | Label shown in HA |
| Notify Days Before | `1` | Days before due date to send a reminder |
| Notification Service | *(empty)* | Optional `notify.*` service, e.g. `notify.mobile_app_my_phone` |

These same values can be changed later in Home Assistant via the integration options or the reconfiguration flow.

---

## Usage

The IntelliKeep panel appears automatically in the Home Assistant sidebar after installation. It supports multiple languages following your HA profile setting.

### Lovelace Card

```yaml
type: custom:intellikeep-card
title: IntelliKeep
max_tasks: 5
show_linked_entities: true
show_description: false
```

### Panel views

| View | Description |
|---|---|
| **Tasks** | Unified pending and completed task list with search, priority, area, and device filters |
| **Calendar** | Week and month grid showing tasks by due date; supports the same area/device/priority filters |
| **History** | Full execution log across all tasks, filterable by area/device, exportable to CSV |

### Services

| Action | Description |
|---|---|
| `intellikeep.create_task` | Create a new task |
| `intellikeep.complete_task` | Mark a task as done (records execution) |
| `intellikeep.reopen_task` | Reopen a completed task, marking it as pending again |
| `intellikeep.update_task` | Update task fields |
| `intellikeep.delete_task` | Permanently delete a task |
| `intellikeep.load_sample_data` | Populate with sample home maintenance tasks |

### Example: create a monthly recurring task

```yaml
action: intellikeep.create_task
data:
  name: Replace HVAC filter
  priority: high
  frequency: monthly
  due_date: "2025-02-01T09:00:00"
  linked_entity_ids:
    - area:living_room          # link to an area
    - device:abc123def456       # or a specific device ID
  notify_days_before: 3
```

### Example: reopen a completed task

```yaml
action: intellikeep.reopen_task
data:
  task_id: "<task_id>"
```

### Automation example

```yaml
automation:
  trigger:
    platform: event
    event_type: intellikeep_task_notification
    event_data:
      event_type: overdue
  action:
    service: notify.mobile_app_my_phone
    data:
      title: "{{ trigger.event.data.title }}"
      message: "{{ trigger.event.data.message }}"
```


---

## Supported Scope

IntelliKeep is a local Home Assistant task-management integration. It stores task data inside Home Assistant and provides a panel, a Lovelace card, sensors, diagnostics, and service actions for task management.

Common use cases:

- Track recurring household maintenance such as HVAC filters, gutters, smoke detectors and boiler service
- Create one-off repair or inspection tasks and keep a completion history
- Build automations on top of IntelliKeep notification events
- Show due and overdue tasks in dashboards using the Lovelace card

Not supported:

- Automatic device discovery
- Vendor firmware updates
- External account authentication or reauthentication flows
- Synchronization with external task-management platforms

---

## Data Updates

Task state is stored locally in Home Assistant storage and refreshed in three ways:

- Immediate refresh after every service action that changes tasks
- WebSocket push updates to the panel and card when coordinator data refreshes
- Scheduled coordinator refresh every 5 minutes for sensor state consistency
- Scheduled notification checks every hour for approaching or overdue tasks

## Troubleshooting

If the panel or card does not show current data:

1. Open Settings → Devices & Services and confirm the IntelliKeep entry is loaded.
2. Download diagnostics from the config entry and verify the task counters match expectations.
3. If you recently rebuilt the frontend, restart Home Assistant to reload the static assets.

If mobile notifications are not delivered:

1. Verify the configured `notify.*` service exists in Developer Tools → Actions.
2. Leave the notification service empty to fall back to persistent notifications only.
3. Check Home Assistant logs for translated IntelliKeep service validation errors.

If tasks appear overdue unexpectedly:

1. Check the Home Assistant system time and timezone.
2. Confirm the stored `due_date` value in diagnostics.
3. Review the task history to see whether the task was completed and reopened.

## Known Limitations

- The integration is intentionally single-instance.
- Task data is stored locally and is not shared between Home Assistant installations.
- Sensors summarize task state; the full task list is exposed through the UI and diagnostics rather than individual task entities.
- Notification deduplication is in-memory for the current Home Assistant runtime and resets after restart.

## Removal

To remove IntelliKeep cleanly:

1. Go to Settings → Devices & Services.
2. Open IntelliKeep.
3. Choose Delete.
4. Remove any dashboard cards or automations that still reference IntelliKeep services or events.
5. If installed manually, delete `custom_components/intellikeep/` from your Home Assistant config directory.

---

## Building the Frontend

The frontend bundles (Lovelace card and sidebar panel) are built via a Docker-based script — no local Node.js required.

### Requirements

- Docker running locally

### Build all (card + panel)

```bash
./build-frontend.sh
```

### Build only the card or panel

```bash
./build-frontend.sh card
./build-frontend.sh panel
```

The script uses `node:20-alpine` to run `npm install` and `rollup` inside a container. Built files are written to:

```
custom_components/intellikeep/frontend/intellikeep-card.js
custom_components/intellikeep/frontend/intellikeep-panel.js
```

### Deploying to a Docker-based HA instance

After building, copy the updated files into the running container:

```bash
# Copy the entire integration
docker cp custom_components/intellikeep/ homeassistant:/config/custom_components/

# Or copy only specific files, e.g. after a frontend-only change:
docker cp custom_components/intellikeep/frontend/intellikeep-panel.js \
  homeassistant:/config/custom_components/intellikeep/frontend/intellikeep-panel.js

docker restart homeassistant
```

---

## Development

### Run tests via Docker (recommended, no local Python required)

```bash
# All tests
./run-tests.sh

# Specific file
./run-tests.sh tests/test_task_manager.py

# With filter
./run-tests.sh -k test_complete_recurring
```

### Run tests locally

```bash
pip install -r requirements_test.txt
pytest tests/ -v
```

---

## License

MIT © [Intellilar](https://intellilar.com)
