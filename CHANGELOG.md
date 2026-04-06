# Changelog

All notable changes to this project will be documented in this file.

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