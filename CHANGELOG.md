# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-10-19

### Upgrading from 1.x

The panel and the dashboard card were redesigned, and a few things work differently from 1.x. Back up Home Assistant before updating: stored tasks are converted on the first start, and going back to 1.x afterwards is not supported.

- The card lists 3 tasks by default instead of 10 and leaves completed tasks out. Add `max_tasks: 10` to keep the old length and `filter_status: [pending, due, overdue, completed]` to keep showing completed tasks.
- `intellikeep.reopen_task` undoes the completion: the record leaves the history, and the next occurrence of a recurring task is removed unless someone already worked on it. Check automations that reopen tasks.
- `frequency: custom` is stored as `frequency: daily` with a `repeat_interval`. Actions that send `custom` keep working, but the `next_due_task` sensor and the panel report `daily`, so templates that compare the frequency with `custom` need updating.
- 1.x ignores the new task fields. Back on 1.x, a task that repeats every 3 days would repeat every day, and one counted from its due date would count from completion again.

### Added

- Tasks can be duplicated from their ⋮ menu. The new-task form opens with the same fields filled in.
- Recurring tasks can repeat every N days, weeks, months or years with `repeat_interval`, including weekly tasks on chosen weekdays every N weeks.
- `schedule_anchor` sets what the next due date is counted from: the completion (`completion`, the default and the behavior so far) or the task's own due date (`due_date`), which keeps a fixed calendar and skips periods already past.
- A to-do list entity, `todo.intellikeep_tasks`, puts the tasks in Home Assistant's To-do lists. It shows the open tasks by due date and the tasks completed in the last 30 days. Checking an item completes the task, recording who did it, and unchecking it reopens the task. Items added there become one-time tasks, and name, description and due date can be edited. Completed tasks can't be deleted from the list, so Clear completed doesn't erase their history.
- A calendar entity, `calendar.intellikeep_tasks`, shows the open tasks on their due dates in Home Assistant's Calendar and calendar cards, and calendar triggers can start automations when a task becomes due. Tasks without a time (due at midnight) are all-day events.
- Tasks can have an icon (`icon`), shown in the task list. The task dialog picks it with Home Assistant's icon picker (search by name or keyword, with a preview of each icon). A task without an icon uses the wrench (`mdi:wrench-outline`), which the picker shows by name like any other icon. The sample data comes with icons.
- The panel's Calendar tab shows the future repeats of recurring tasks, not only the open occurrence, as dashed outlines with a repeat icon. They are projected the way completing creates the next occurrence, each one assumed done on its due date (an overdue one, today): exact for tasks counted from their due date, an estimate for tasks counted from completion. Clicking one opens the task, and Filters has a switch to hide them. The new `intellikeep/get_repeats` WebSocket command returns them for a date range; the `calendar.intellikeep_tasks` entity still lists only the open occurrences, so calendar triggers fire only for real tasks.

### Changed

- Open tasks are grouped by due date (Overdue, Today, This week, Later, No due date), or by priority or area, instead of being filtered by the This week / Next week / This month / Custom chips.
- A checkbox on each task completes it, and the "Task completed" toast offers Undo. Edit, Duplicate, History and Delete moved to a ⋮ menu; the hover buttons and the swipe gestures are gone, and Delete always asks for confirmation.
- Red and amber mark only overdue tasks, tasks due today and Critical priority. Priority shows as an icon and a label instead of a colored strip with rotated text.
- A due date without a time (saved at midnight, as dates from the calendar and from Home Assistant's To-do lists are) means all day throughout the panel. Due today, such a task shows "Today" in the task list and the dashboard card instead of "Today, 12:00 AM", and "All day" under the Today group on phones, as the calendar shows it. The task dialog shows its time as "All day" instead of 00:00, and a × on a time removes it, making the task all day.
- Open and Completed replace Pending and Done. Open counts every open task; Completed lists the completions of the last 30 days, so its count matches the History tab.
- Add task moved from the header to the list toolbar.
- On phones and narrow windows (under 600px, or when Home Assistant hides the sidebar), the Tasks, Calendar and History tabs fill the width, and search moves to a magnifier in the header. Each task row keeps only the checkbox and the name, with due date, priority and repeat in a line below. Group by moves into Filters, and Add task becomes a floating button. The header settings icon is now `mdi:cog-outline`.
- The task dialog has a header with the task name, its number and how it repeats, plus a ⋮ menu for Duplicate and Delete; Delete is no longer a footer button. The footer holds Mark complete, Cancel and Save. Priority is a four-option control, the schedule reads "Repeat every [N] [days/weeks/months/years]", linked areas and devices show as removable chips, and "Notify when overdue" is a switch. The Edit tab is now Details.
- History lists each completion with the task icon and number, a relative time ("Today, 19:16", full timestamp on hover), who completed it and an On time / N days late chip. It shows the last 30 days by default, with 7 and 90 days, 12 months and all time to choose from; Columns, Export CSV and Print moved to a ⋮ menu, and the Areas and Devices columns start hidden. On phones the records are a list grouped by day (Today, Yesterday, then the date), each with the time, who completed it and On time / N days late, instead of a table that scrolled sideways.
- The Calendar tab follows Home Assistant's calendar: Today, previous and next, and the month or week in the toolbar, next to Filters, Month / Week and Add task. Tasks with a time show it with a dot and all-day tasks show as a tinted bar; color marks only overdue tasks and tasks due today, Critical tasks get their priority icon, and completed ones are greyed with a check. A day with more tasks than fit shows "+N more", which opens its week. Clicking a day's empty space adds a task due that day. Days and weeks follow the time zone and first weekday of the user profile, and the tab opens on the current month instead of the last one viewed. On phones, the month is a small grid with a dot per task and the chosen day's tasks listed under it, and the week is a list of days.
- The dashboard card was redesigned. Its header shows the title (by default "Home maintenance", in the user's language) and how many tasks are overdue and due today. Each task has a checkbox that completes it, with Undo, and the same due chip as the panel. "View all N tasks" opens the panel. It lists 3 tasks by default instead of 10 and leaves completed tasks out unless `filter_status` asks for them. The priority badges, status icons and frequency labels are gone, and `show_linked_entities` shows the linked areas and devices as a line under the task.
- `frequency: custom` with `custom_days_interval` is stored as `frequency: daily` with a `repeat_interval`. Existing tasks are converted on load and automations that send `custom` keep working, but the option no longer shows in the action editor.
- `intellikeep.reopen_task` undoes the completion: its record leaves the history, and the next occurrence it created for a recurring task is removed unless it was already edited, noted or completed. Reopening a recurring task used to leave two open occurrences.

### Fixed

- Repeats are counted on the local calendar. The time of day no longer shifts after a daylight-saving change, and month ends follow the local date: a task done on Mar 30 at 22:00 in UTC−3 got its next occurrence on Apr 29 instead of Apr 30.
- Dates and times in the panel follow the language, time zone and 12/24-hour clock of the Home Assistant user profile. History, the CSV export and print, notes, the activity log and the list of previous occurrences used the browser's locale instead, so History showed `10/18/2026, 7:19:16 PM` while the form showed `18/10/2026`.
- Tasks completed from the dashboard card record who completed them; the History tab showed an empty "By" for them.
- The "Due today" and "N days overdue" labels in the panel and the card count days in the server's time zone when the user profile is set to use it.
- Confirmation dialogs (delete a task, a note or all data) work from the keyboard. Focus moves to Cancel when one opens and stays on its two buttons, Escape cancels without closing the task dialog under it, and focus goes back to where it was. Before, Tab moved through the page behind the dialog.
- The red Delete buttons and the Settings switch take their light color from the theme instead of a fixed white.

## [1.1.1] - 2026-10-08

### Added

- The dashboard card follows the Home Assistant language. Its texts (due labels, priority, frequency, task count, empty state) are available in English, Portuguese and Spanish, like the panel; it used to be English only.

### Changed

- Tests now run against the current Home Assistant release (Python 3.14) and the oldest supported line (2026.2.x, Python 3.13), with a weekly scheduled run to catch breakage from new Home Assistant releases ([#33](https://github.com/henriquekraemer/intellikeep/issues/33)).

### Fixed

- Editing a task no longer shifts its due time. Outside UTC, every save moved the time by the timezone offset (3 hours per save in UTC−3) ([#30](https://github.com/henriquekraemer/intellikeep/issues/30)).
- Tasks become due and overdue at local midnight. Status, the due-today and overdue sensors and the notifications used to switch at UTC midnight, which is 21:00 in UTC−3 ([#30](https://github.com/henriquekraemer/intellikeep/issues/30)).
- The calendar shows each task on its local day, and the "Due today" / "Due tomorrow" labels in the panel and the card count calendar days instead of 24-hour blocks ([#30](https://github.com/henriquekraemer/intellikeep/issues/30)).
- A `due_date` sent to `intellikeep.create_task` or `intellikeep.update_task` without a UTC offset is read as Home Assistant local time right away. It used to be kept without a timezone until the next restart ([#30](https://github.com/henriquekraemer/intellikeep/issues/30)).
- The card can be configured from the dashboard's visual editor. Home Assistant showed "Visual editor not supported" because the card's editor element was never shipped in the bundle; the card now describes its options as a form that Home Assistant renders itself, with labels in English, Portuguese and Spanish ([#31](https://github.com/henriquekraemer/intellikeep/issues/31)).
- The complete button on the card and the back button in the panel header are back to their intended size. Home Assistant renamed the CSS variable that sets it ([#31](https://github.com/henriquekraemer/intellikeep/issues/31)).
- The card is registered as a dashboard resource again on Home Assistant 2026.2 and later. Registration failed silently there, so on a fresh install the card did not load ("Custom element doesn't exist: intellikeep-card") unless the resource was added by hand ([#34](https://github.com/henriquekraemer/intellikeep/issues/34)).
- Reconfiguring the integration reloaded it twice. Home Assistant 2026.6 started warning about this and 2026.12 turns it into an error ([#32](https://github.com/henriquekraemer/intellikeep/issues/32)).

## [1.1.0] - 2026-09-05

### Added

- Weekly tasks can now repeat on specific days of the week. Pick the days in the task form or pass `weekdays: [mon, wed, fri]` to `intellikeep.create_task` / `intellikeep.update_task`. The next occurrence lands on the next selected day at the original time, anchored on the due date rather than on the completion time ([#28](https://github.com/henriquekraemer/intellikeep/issues/28)).

## [1.0.4] - 2026-07-27

### Added

- The Lovelace card now registers itself in the card picker, so it can be added from the dashboard UI with a proper name and description ([#24](https://github.com/henriquekraemer/intellikeep/issues/24)).
- README instructions for adding the card resource manually on YAML-mode dashboards ([#24](https://github.com/henriquekraemer/intellikeep/issues/24)).

### Changed

- The `intellikeep.delete_all_data` action now requires an admin user ([#23](https://github.com/henriquekraemer/intellikeep/issues/23)).
- Integration settings are now written to the config entry options everywhere (setup, reconfigure and options flow), with fallback reads so existing installs keep working without migration ([#22](https://github.com/henriquekraemer/intellikeep/issues/22)).
- Internal modernization: runtime data is single-sourced on the config entry, the coordinator receives the config entry (removing a Home Assistant deprecation path), and storage/notification internals are encapsulated behind public `TaskManager`/`NotificationManager` APIs ([#22](https://github.com/henriquekraemer/intellikeep/issues/22), [#23](https://github.com/henriquekraemer/intellikeep/issues/23)).

## [1.0.3] - 2026-07-27

### Fixed

- The `overdue_tasks` attribute on `sensor.tasks_overdue` listed every enabled task instead of only the overdue ones ([#20](https://github.com/henriquekraemer/intellikeep/issues/20)).
- Completing a yearly recurring task on Feb 29 raised an error when scheduling the next occurrence ([#20](https://github.com/henriquekraemer/intellikeep/issues/20)).
- Tasks now become overdue the day after their due date. Previously there was an undocumented one-day grace period where a task past its due date still reported as due ([#20](https://github.com/henriquekraemer/intellikeep/issues/20)).
- The "Notify Days Before" default from the integration options is now applied to tasks created without an explicit value ([#20](https://github.com/henriquekraemer/intellikeep/issues/20)).
- The sidebar panel is removed when the integration unloads, so reloading after an options change re-registers it cleanly ([#20](https://github.com/henriquekraemer/intellikeep/issues/20)).

### Added

- New `intellikeep_task_updated` event fired on every task mutation (`created`, `updated`, `completed`, `reopened`, `deleted`, `note_added`, `note_deleted`), usable as an automation trigger ([#20](https://github.com/henriquekraemer/intellikeep/issues/20)).

### Changed

- Lovelace card resource registration now waits for Home Assistant to finish starting instead of using a fixed delay ([#20](https://github.com/henriquekraemer/intellikeep/issues/20)).

## [1.0.2] - 2026-04-13

### Changed

- Task list now displays the area and device name instead of a raw entity count for tasks with a single linked entity. When only an area is linked, the area name is shown; when a device is linked, the label shows "Area · Device" (or just the device name if it has no area assigned). Multiple linked entities still show a count, now translated into EN, PT, and ES.
- Lovelace card entity chips now resolve `area:` and `device:` references to human-readable names instead of displaying the raw internal IDs.

### Changed

- Removed `HassEntityRegistryEntry` type and the `entities` property from the Lovelace card's `HomeAssistant` interface — they were added in a previous attempt with incorrect logic and were never used correctly.
- Added `name` and `name_by_user` fields to `HassDeviceRegistryEntry` in the Lovelace card types, required for resolving device display names.
- Added `linkedEntitiesCount` translation key (EN, PT, ES) for the entity count label shown in the task card meta row.

## [1.0.1] - 2026-04-09

### Fixed

- Back navigation from a task edit form to the task list tab now works correctly on mobile. Tapping the back arrow in the app bar returns to the task list instead of staying on the form. This was broken when the calendar view was introduced.
- Action buttons (delete, complete, reopen) no longer occupy space on mobile devices. The buttons were invisible but still reserved layout space, causing task names to be truncated with `…`. Swipe gestures remain the interaction method on touch devices.

## [1.0.0] - 2026-04-09

### Added

- **Calendar view** with Week and Month modes ([#7](https://github.com/intellilar/intellikeep/issues/7)).
  - New Calendar tab in the main navigation, alongside Tasks and History.
  - Month and Week grids fill available screen height, with scroll when tasks overflow.
  - Navigate between periods with forward/back arrows and jump to today with a single tap.
  - Task dots on each day; overdue tasks displayed in red.
  - Calendar supports the same area, device, and priority filters as the task list.
  - On mobile, tapping a task navigates directly to its edit form; on desktop a modal opens.
  - Calendar mode, current period, and active filters are persisted in `localStorage` and restored on return.
- **History view filtering** by Area and/or Device ([#15](https://github.com/intellilar/intellikeep/issues/15)).
  - Reusable `ik-link-filter` component extracted and shared between task list and history views.
  - History view supports configurable visible columns with distinct desktop and mobile presets.
  - CSV export and print actions added to the history view.

### Changed

- Task list pending tab now shows a unified list instead of separate "Due Today & Overdue" and "Upcoming" sections. Urgent tasks float to the top, sorted by priority.
- Priority filter moved into the expanded filter panel, consistent with area and device filters. Active priority filter is reflected in the filter badge count.
- "Undo" action renamed to "Reopen" across all supported languages (EN, PT, ES).
- Back navigation from a task opened via the calendar correctly returns to the calendar instead of the task list.

## [0.0.2] - 2026-04-08

### Added

- Task filtering by Area and/or Device in the panel task list view ([#6](https://github.com/intellilar/intellikeep/issues/6)).
  - Toggle button (`mdi:filter`) in the filter bar to show/hide the area/device filter controls.
  - Searchable area and device pickers; selecting an area narrows the device picker to devices in that area.
  - Active filters shown as removable chips; individual removal and bulk clear supported.
  - Combined filter mode: Area OR Device / Area AND Device, persisted across sessions.
  - Filter state persisted in `localStorage` and restored on reload.

### Changed

- Integration quality raised to Gold / Platinum on the Home Assistant Quality Scale ([#9](https://github.com/intellilar/intellikeep/issues/9)).

### Fixed

- HACS displayed "Icon not available" for IntelliKeep due to missing brands entry; branding assets now registered correctly ([#5](https://github.com/intellilar/intellikeep/issues/5)).
- `VERSION` constant in `const.py` was `"1.0.0"`, inconsistent with `manifest.json`; both now track the same release version.

## [0.0.1] - 2026-04-06

### Added

- Initial public release of the IntelliKeep custom integration for Home Assistant.
- Config flow based setup for a single IntelliKeep instance.
- Sidebar panel for task management, history, notes, filters, and responsive mobile usage.
- Lovelace card for compact dashboard visibility of due and overdue tasks.
- Recurring and one-time maintenance tasks with priorities and linked Home Assistant entities.
- Persistent task numbering system using `#NNN`, preserved across deletions.
- Execution history tab and activity log style timeline with pagination.
- Task note deletion support.
- Custom date range filter with explicit Apply and Clear actions.
- Pagination for urgent, upcoming, history, and previous occurrence sections.
- Spanish (`es`) localization.
- Persistent notifications and optional notify service integration.
- Sensor entities for due tasks, overdue tasks, and next due task.
- Frontend assets and custom sidebar icon support packaged for HACS distribution.

### Changed

- Completed tasks are now read-only, with disabled fields, readonly banner, and hidden save actions.
- Completed tasks are sorted by `last_completed_at` in descending order.
- Current Home Assistant user is stored as `completed_by` when tasks are completed.
- Recurring task occurrences now follow a flat-star model linked to the root task.
- Pending badge count now reflects only due and overdue tasks.
- Panel header and navigation were refactored to align with Home Assistant UI patterns.
- Settings access moved to the header gear action, with modal on desktop and navigation on mobile.
- New Task action migrated into the header controls and redundant main tab navigation was removed.
- Device linking flow for tasks was rebuilt.
- Branding was finalized around the IntelliKeep name and sidebar icon.

### Fixed

- Empty state messaging for the upcoming section when no tasks match the active filter.
- Notes pagination visibility issues.
- Pagination controls placement inside scrollable panel areas.
- Task ordering consistency after updates.
- Header and menu button behavior on mobile and Home Assistant styled navigation.