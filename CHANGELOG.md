# Changelog

All notable changes to this project will be documented in this file.

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