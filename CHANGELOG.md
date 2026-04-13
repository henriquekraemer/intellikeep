# Changelog

All notable changes to this project will be documented in this file.

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