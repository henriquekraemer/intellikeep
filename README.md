# IntelliKeep

<img width="933" height="256" alt="intellikeep_banner" src="https://github.com/user-attachments/assets/3d579c40-5bbd-4730-872f-45f464456593" />

[![Documentation](https://img.shields.io/badge/docs-intellikeep.intellilar.com-blue)](https://intellikeep.intellilar.com)
[![HACS](https://img.shields.io/badge/HACS-Custom-orange)](https://hacs.xyz)
[![Tests](https://github.com/intellilar/intellikeep/actions/workflows/tests.yml/badge.svg)](https://github.com/intellilar/intellikeep/actions/workflows/tests.yml)
[![Validate](https://github.com/intellilar/intellikeep/actions/workflows/validate.yml/badge.svg)](https://github.com/intellilar/intellikeep/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

IntelliKeep is a free, open-source Home Assistant integration for keeping track of home maintenance tasks. Use it to keep every household chore in one place, from a monthly HVAC filter swap to an annual boiler service, with reminders and a full history of what was done and when.

---

## Features

- One-time and recurring tasks that repeat every N days, weeks, months or years, counted from the completion or from the due date
- Weekly tasks can be pinned to specific days of the week, such as garbage collection on Mon/Wed/Fri
- Four priority levels (low, medium, high, critical), shown as an icon and a label
- An icon per task, picked from the Material Design Icons
- Link a task to a Home Assistant area or a specific device
- Timestamped notes per task, with author tracking, that you can add, view and delete
- An activity log per task covering edits, completions, reopens and note changes
- Calendar tab with month and week views laid out like Home Assistant's calendar, the future repeats of recurring tasks, filters by area, device and priority, and tasks added by clicking a day
- Execution history you can filter by area or device, with configurable columns, CSV export and print support
- Notifications through Home Assistant's persistent notifications, plus an optional mobile push service
- Three sensor entities: `tasks_due_today`, `tasks_overdue` and `next_due_task`
- A to-do list (`todo.intellikeep_tasks`) for Home Assistant's To-do lists and a calendar (`calendar.intellikeep_tasks`) for its Calendar, calendar cards and calendar triggers
- Responsive panel that works on desktop and mobile and follows the Home Assistant UI
- A Lovelace card for showing due and overdue tasks on a dashboard

---

## Installation

### Via HACS (recommended)

1. Open HACS, go to Integrations, then Custom repositories
2. Add `https://github.com/intellilar/intellikeep` with the category **Integration**
3. Install **IntelliKeep**
4. Restart Home Assistant
5. Go to **Settings → Devices & Services → Add Integration** and search for **IntelliKeep**

### Manual

Copy `custom_components/intellikeep/` into your Home Assistant `config/custom_components/` directory and restart.

---

## Setup

During setup you can configure:

| Option | Default | Description |
|---|---|---|
| Instance Name | `IntelliKeep` | Label shown in Home Assistant |
| Notify Days Before | `1` | How many days before the due date a reminder is sent |
| Notification Service | *(empty)* | Optional `notify.*` service, for example `notify.mobile_app_my_phone` |

You can change any of these later from the integration options or the reconfiguration flow.

---

## Usage

The IntelliKeep panel shows up in the Home Assistant sidebar once the integration is installed. It follows the language set in your Home Assistant profile.

### Lovelace Card

The card shows how many tasks are overdue and due today, the most urgent open tasks with a checkbox that completes them (with Undo), and a link to the panel.

```yaml
type: custom:intellikeep-card
title: Home maintenance
max_tasks: 3
show_description: false
show_linked_entities: false
```

| Option | Default | Description |
|---|---|---|
| `title` | "Home maintenance", in your language | Card title |
| `max_tasks` | `3` | How many tasks to list |
| `show_description` | `false` | Show each task's description under its name |
| `show_linked_entities` | `false` | Show the areas and devices each task is linked to |
| `filter_priority` | all | YAML only: list only these priorities, e.g. `[critical, high]` |
| `filter_status` | open tasks | YAML only: list only these statuses (`pending`, `due`, `overdue`, `completed`) |

> **YAML-mode dashboards**: the card resource is registered automatically only when dashboards are managed via the UI (storage mode). If your dashboards are configured in YAML, add the resource manually:
>
> ```yaml
> resources:
>   - url: /intellikeep_static/intellikeep-card.js
>     type: module
> ```

### Panel views

| View | Description |
|---|---|
| **Tasks** | Pending and completed tasks in one list, with search and filters by priority, area and device |
| **Calendar** | Month and week views of the tasks by due date, with the same area, device and priority filters; click a day to add a task due that day. Recurring tasks also show their future repeats as dashed outlines (a switch in Filters hides them). On phones, a small month with the chosen day's tasks under it |
| **History** | Execution log across every task, filterable by area or device and exportable to CSV. On phones, a list grouped by day |

### To-do list and calendar

**`todo.intellikeep_tasks`** shows the open tasks by due date in Home Assistant's To-do lists, followed by the tasks completed in the last 30 days.

- Checking an item completes the task, and a recurring task gets its next occurrence. Unchecking it reopens the task and removes that occurrence, like Undo in the panel.
- The history records the Home Assistant user who checked or unchecked the item.
- Items added to the list become one-time tasks. Name, description and due date can be edited from the list.
- Deleting an open item deletes the task. Completed tasks keep their history, so they can't be deleted here (Clear completed is refused); they leave the list 30 days after completion, or you can delete them in the panel.
- The `todo.*` actions work too, for example `todo.add_item` from a voice assistant or an automation.

**`calendar.intellikeep_tasks`** shows each open task on its due date, overdue ones included.

- A task with a due time is an event at that time; a task due at midnight (no time set in the panel) is an all-day event.
- Completed tasks are left out, and future repeats aren't projected: the next occurrence shows up once the current one is completed, so calendar triggers fire only for real tasks. The panel's Calendar tab does show the future repeats.
- The calendar is read-only; create and edit tasks in the panel or the to-do list.

Remind yourself when a task becomes due with a calendar trigger:

```yaml
automation:
  trigger:
    platform: calendar
    event: start
    entity_id: calendar.intellikeep_tasks
  action:
    service: notify.mobile_app_my_phone
    data:
      title: "Maintenance due"
      message: "{{ trigger.calendar_event.summary }}"
```

### Services

| Action | Description |
|---|---|
| `intellikeep.create_task` | Create a new task |
| `intellikeep.complete_task` | Mark a task as done and record the execution |
| `intellikeep.reopen_task` | Reopen a completed task and set it back to pending. Undoes the completion: its history record goes, and so does the next occurrence of a recurring task if nobody worked on it yet |
| `intellikeep.update_task` | Update task fields |
| `intellikeep.delete_task` | Permanently delete a task |
| `intellikeep.load_sample_data` | Fill the integration with sample maintenance tasks |

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

### Example: weekly task on specific days

Pick the days with `weekdays` (`mon` to `sun`). The next occurrence is always the next selected day after the current one, at the same time of day, so the schedule does not drift when a task is completed late. Leave `weekdays` empty to keep repeating every 7 days from the last completion.

```yaml
action: intellikeep.create_task
data:
  name: Take out the garbage
  frequency: weekly
  weekdays: [mon, wed, fri]
  due_date: "2026-09-07T07:00:00"
```

### Example: every 3 months on a fixed calendar

`repeat_interval` sets the N in "every N days, weeks, months or years", the unit coming from `frequency`. `schedule_anchor` decides what the next occurrence is counted from: `completion` (the default) counts from when the task gets done, so a late completion moves the next one too; `due_date` counts from the task's due date and skips periods already past, keeping a fixed calendar.

```yaml
action: intellikeep.create_task
data:
  name: Replace HVAC filter
  icon: mdi:air-filter
  frequency: monthly
  repeat_interval: 3
  schedule_anchor: due_date
  due_date: "2026-11-01T09:00:00"
```

`frequency: custom` with `custom_days_interval` from earlier versions still works: it is stored as `frequency: daily` with that `repeat_interval`.

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

IntelliKeep is a local task-management integration. It keeps task data inside Home Assistant and provides a panel, a Lovelace card, sensors, a to-do list, a calendar, diagnostics and service actions.

Common use cases:

- Track recurring maintenance like HVAC filters, gutters, smoke detectors and boiler service
- Create one-off repair or inspection tasks and keep a record of when they were completed
- Build automations on top of IntelliKeep notification events
- Show due and overdue tasks on a dashboard with the Lovelace card

Out of scope:

- Automatic device discovery
- Vendor firmware updates
- External account authentication or reauthentication flows
- Syncing with external task-management platforms

---

## Data Updates

Task state is stored locally in Home Assistant and refreshed in a few ways:

- An immediate refresh after any service action that changes a task
- WebSocket push updates to the panel and card whenever coordinator data refreshes
- A coordinator refresh every 5 minutes to keep sensor state in sync
- A notification check every hour for tasks that are approaching or overdue

## Troubleshooting

If the panel or card is not showing current data:

1. Open Settings → Devices & Services and confirm the IntelliKeep entry is loaded.
2. Download diagnostics from the config entry and check that the task counters look right.
3. If you just rebuilt the frontend, restart Home Assistant to reload the static assets.

If mobile notifications are not arriving:

1. Confirm the configured `notify.*` service exists under Developer Tools → Actions.
2. Leave the notification service empty to fall back to persistent notifications only.
3. Check the Home Assistant logs for IntelliKeep service validation errors.

If tasks look overdue when they shouldn't:

1. Check the Home Assistant system time and timezone.
2. Confirm the stored `due_date` value in diagnostics.
3. Review the task history to see whether the task was completed and reopened.

## Known Limitations

- The integration is single-instance by design.
- Task data lives locally and is not shared between Home Assistant installations.
- Tasks are not individual entities: sensors summarize them, and the to-do list and calendar list them.
- The `calendar.intellikeep_tasks` entity shows only the current occurrence of each recurring task. The panel's Calendar tab projects the ones after it, and for tasks counted from completion those dates are an estimate, since the real ones depend on when each occurrence gets done.
- Notification deduplication is kept in memory and resets when Home Assistant restarts.

## Removal

To remove IntelliKeep cleanly:

1. Go to Settings → Devices & Services.
2. Open IntelliKeep.
3. Choose Delete.
4. Remove any dashboard cards or automations that still reference IntelliKeep services or events.
5. If you installed it manually, delete `custom_components/intellikeep/` from your Home Assistant config directory.

---

## Building the Frontend

The frontend bundles (the Lovelace card and the sidebar panel) are built with a Docker-based script, so you don't need Node.js installed locally.

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

The script runs `npm install` and `rollup` inside a `node:20-alpine` container. Built files are written to:

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
