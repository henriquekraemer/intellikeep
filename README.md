# IntelliKeep

**Home maintenance task management for Home Assistant.**

An [Intellilar](https://intellilar.com.br) product.

---

## Features

- One-time and **recurring tasks** (daily, weekly, monthly, yearly, or custom interval)
- Link tasks to **Home Assistant entities** (e.g., track which A/C unit needs a filter change)
- **Notifications** via persistent notifications + optional mobile push service
- Full **execution history** with timestamps and notes
- **Lovelace card** for dashboards
- **Sidebar panel** (full management UI embedded in HA)
- Three **sensor entities**: `tasks_due_count`, `tasks_overdue_count`, `next_due_task`

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

## Services

| Service | Description |
|---|---|
| `intellikeep.create_task` | Create a new task |
| `intellikeep.complete_task` | Mark a task as done (records execution) |
| `intellikeep.update_task` | Update task fields |
| `intellikeep.delete_task` | Permanently delete a task |

### Example: create a monthly recurring task

```yaml
service: intellikeep.create_task
data:
  name: Replace HVAC filter
  priority: high
  frequency: monthly
  due_date: "2025-02-01T09:00:00"
  linked_entity_ids:
    - climate.living_room
  notify_days_before: 3
```

---

## Lovelace Card

```yaml
type: custom:intellikeep-card
title: Home Maintenance
max_tasks: 5
show_linked_entities: true
show_description: false
```

### Build the card

```bash
cd lovelace-card
npm install
npm run build
```

---

## Panel

The IntelliKeep panel appears automatically in the HA sidebar after installation.

### Build the panel

```bash
cd panel
npm install
npm run build
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

```bash
# Install test dependencies
pip install -r requirements_test.txt

# Run tests
pytest tests/ -v
```

---

## License

MIT © [Intellilar](https://intellilar.com.br)
