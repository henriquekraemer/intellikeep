# IntelliKeep

<img width="933" height="256" alt="intellikeep_banner" src="https://github.com/user-attachments/assets/3d579c40-5bbd-4730-872f-45f464456593" />

**IntelliKeep** is a home maintenance task management system built as a free, open-source custom integration for Home Assistant. It centralizes all your household tasks—from simple filter replacements to periodic check-ups—offering automatic alerts and a complete task history.

---

## Features

- One-time and **recurring tasks** (daily, weekly, monthly, yearly, or custom interval)
- **Priority levels**: low, medium, high, critical — with color-coded priority bar
- Link tasks to **HA areas or specific devices**
- **Notes** per task — add, view and delete timestamped notes with author tracking
- **Activity log** per task — full audit trail of edits, completions, reopens and note changes
- **Notifications** via persistent notifications + optional mobile push service
- Full **execution history** with timestamps, completion notes and late flag
- Three **sensor entities**: `tasks_due_today`, `tasks_overdue`, `next_due_task`
- Designed for **web and mobile** — responsive panel that follows HA UI patterns
- **Mobile swipe gestures**: swipe right → done/undo · swipe left → delete
- **Upcoming range filter**: All / This week / Next week / This month / Custom date range
- **Completed tab** with pagination, priority filter, and search bar
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
| Instance Name | `Home Maintenance` | Label shown in HA |
| Notify Days Before | `1` | Days before due date to send a reminder |
| Notification Service | *(empty)* | Optional `notify.*` service, e.g. `notify.mobile_app_my_phone` |

---

## Actions (Services)

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

---

## Lovelace Card

```yaml
type: custom:intellikeep-card
title: IntelliKeep
max_tasks: 5
show_linked_entities: true
show_description: false
```

---

## Panel

The IntelliKeep panel appears automatically in the HA sidebar after installation. It supports multiple languages following your HA profile setting.

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

## Automation example: act on notifications

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
