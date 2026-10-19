import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, OpenTaskRequest, Task, TaskPriority, TaskRepeat } from "../types";
import { t, Translations } from "../translations";
import { getRepeats } from "../api";
import { calendarDay, daysUntil, firstWeekday, formatDate, formatDateRange, formatTime, isMidnight, repeatLabel } from "../utils";
import { PRIORITY_ICON, urgencyOf } from "../components/task-card";
import "../components/link-filter";

type CalMode = "month" | "week";

type AreaRegistryEntry = { area_id: string; name: string };
type DeviceRegistryEntry = { id: string; area_id: string | null; name_by_user: string | null; name: string };

/**
 * A task on its due day, or on a day it will repeat on ("repeat"). `time` is
 * null for a task due all day (saved at midnight).
 */
type CalEvent = { task: Task; time: Date | null; tone: "overdue" | "today" | "done" | "repeat" | null };

const MODE_STORAGE_KEY = "intellikeep.calendar.mode";
const PRIORITY_STORAGE_KEY = "intellikeep.calendar.filterPriority";
const REPEATS_STORAGE_KEY = "intellikeep.calendar.showRepeats";
// Shared with task-list-view so area/device filters persist across views
const FILTER_AREAS_STORAGE_KEY = "intellikeep.filterAreas";
const FILTER_DEVICES_STORAGE_KEY = "intellikeep.filterDevices";
const FILTER_MODE_STORAGE_KEY = "intellikeep.filterMode";

const PRIORITIES: TaskPriority[] = ["critical", "high", "medium", "low"];
/** Lines a month cell shows; with more tasks the last line becomes "+N more". */
const CELL_LINES = 3;
const DAY_MS = 86400000;

// Days are UTC midnights (see calendarDay): plain dates, so adding days ignores DST.
// Formatting one with DAY_ONLY shows that date whatever Home Assistant's time zone is.
const DAY_ONLY: Intl.DateTimeFormatOptions = { timeZone: "UTC" };
const addDays = (day: Date, n: number): Date => new Date(day.getTime() + n * DAY_MS);
const dayKey = (day: Date): string => day.toISOString().slice(0, 10);
const sameDay = (a: Date, b: Date): boolean => a.getTime() === b.getTime();

const rank = (event: CalEvent): number => event.tone === "done" ? 2 : event.tone === "repeat" ? 1 : 0;

/** Open tasks, then future repeats, then completed ones; all-day before timed, then by time, then most important first. */
const compareEvents = (a: CalEvent, b: CalEvent): number =>
  rank(a) - rank(b)
  || Number(a.time !== null) - Number(b.time !== null)
  || (a.time && b.time ? a.time.getTime() - b.time.getTime() : 0)
  || PRIORITIES.indexOf(a.task.priority) - PRIORITIES.indexOf(b.task.priority)
  || a.task.task_number - b.task.task_number;

const loadStored = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const store = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage blocked: the choice just isn't remembered
  }
};

const loadStoredList = (key: string): string[] => {
  try {
    const parsed = JSON.parse(loadStored(key) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
};

/**
 * The Calendar tab: tasks on their due days, laid out like Home Assistant's
 * calendar (Today, previous and next, the period, Month or Week). Clicking a
 * task opens it and clicking a day's empty space adds a task due that day.
 * Recurring tasks also show their future repeats, which the backend projects
 * for the period shown, as dashed outlines. The narrow layout shows a small month with dots and lists the chosen day's
 * tasks under it; its week is a list of days.
 */
@customElement("ik-calendar-view")
export class IkCalendarView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) tasks: Task[] = [];
  @property({ type: Boolean, reflect: true }) narrow = false;

  @state() private _mode: CalMode = loadStored(MODE_STORAGE_KEY) === "week" ? "week" : "month";
  /** A day in the period shown. */
  @state() private _ref: Date = calendarDay(new Date(), undefined);
  /** Narrow month: the day whose tasks are listed under the grid. */
  @state() private _selected: Date = this._ref;
  @state() private _showFilters = false;
  @state() private _filterPriority: TaskPriority | "all" = (() => {
    const stored = loadStored(PRIORITY_STORAGE_KEY);
    return PRIORITIES.includes(stored as TaskPriority) ? stored as TaskPriority : "all";
  })();
  @state() private _filterMode: "or" | "and" = loadStored(FILTER_MODE_STORAGE_KEY) === "and" ? "and" : "or";
  @state() private _selectedAreaIds: string[] = loadStoredList(FILTER_AREAS_STORAGE_KEY);
  @state() private _selectedDeviceIds: string[] = loadStoredList(FILTER_DEVICES_STORAGE_KEY);
  @state() private _areas: AreaRegistryEntry[] = [];
  @state() private _devices: DeviceRegistryEntry[] = [];
  @state() private _showRepeats = loadStored(REPEATS_STORAGE_KEY) !== "false";
  /** Future repeats of the open recurring tasks around the period shown. */
  @state() private _repeats: TaskRepeat[] = [];
  /** First and last day the repeats were last asked for, so they reload when the period changes. */
  private _repeatsSpan = "";
  /** Counts requests, so a slow answer for an earlier period doesn't replace a newer one. */
  private _repeatsRequest = 0;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: var(--ik-padding, 20px) var(--ik-padding, 20px) 0;
      box-sizing: border-box;
      --ik-repeat-outline: color-mix(in srgb, var(--primary-color) 55%, transparent);
    }
    button { font: inherit; }
    button:focus-visible, select:focus-visible {
      outline: 2px solid var(--ik-focus-ring);
      outline-offset: 2px;
    }
    .toolbar, .period-row, .filters, .month, .week, .mini, .agenda {
      width: 100%;
      max-width: 1120px;
      margin-inline: auto;
      box-sizing: border-box;
    }

    /* ── Toolbar ── */
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 12px;
      padding-bottom: 16px;
    }
    .today-btn {
      height: 40px;
      padding: 0 18px;
      border: none;
      border-radius: var(--ik-radius-pill);
      background: var(--ik-primary-fill);
      color: var(--primary-color);
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
    }
    .today-btn:hover { background: color-mix(in srgb, var(--primary-color) 26%, transparent); }
    .round {
      width: var(--ik-hit-target);
      height: var(--ik-hit-target);
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: none;
      color: var(--primary-text-color);
      cursor: pointer;
      --mdc-icon-size: 24px;
    }
    .round:hover { background: var(--ik-subtle-fill); }
    .toolbar .round + .round { margin-inline-start: -8px; }
    .period {
      flex: 1 1 auto;
      min-width: 0;
      margin: 0;
      font-size: 20px;
      font-weight: 400;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .count {
      display: inline-block;
      min-width: 8px;
      padding: 1px 7px;
      border-radius: 9px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }
    .segmented {
      display: inline-flex;
      gap: 2px;
      padding: 2px;
      border-radius: 21px;
      border: 1px solid var(--divider-color);
      background: var(--ik-surface);
    }
    .segment {
      height: 38px;
      padding: 0 16px;
      border: none;
      border-radius: 19px;
      background: transparent;
      color: var(--secondary-text-color);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    .segment:hover { color: var(--primary-text-color); }
    .segment[aria-pressed="true"] { background: var(--ik-primary-fill); color: var(--primary-color); }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 16px;
      border-radius: var(--ik-radius-pill);
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      --mdc-icon-size: 18px;
    }
    .pill:hover { background: var(--ik-subtle-fill); }
    .pill[aria-expanded="true"] { border-color: var(--primary-color); color: var(--primary-color); }
    .add {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 20px 0 16px;
      border: none;
      border-radius: var(--ik-radius-pill);
      background: var(--primary-color);
      color: var(--text-primary-color);
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      --mdc-icon-size: 18px;
    }
    .add:hover { filter: brightness(1.08); }
    .spacer { flex: 1; }
    .icon-pill {
      position: relative;
      width: var(--ik-hit-target);
      height: var(--ik-hit-target);
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border-radius: 50%;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      --mdc-icon-size: 20px;
    }
    .icon-pill:hover { background: var(--ik-subtle-fill); }
    .icon-pill[aria-expanded="true"] { border-color: var(--primary-color); color: var(--primary-color); }
    .icon-pill .count { position: absolute; top: -4px; inset-inline-end: -4px; }
    .period-row {
      display: flex;
      align-items: center;
      gap: 4px;
      padding-bottom: 12px;
    }
    .period-row .period { text-align: center; font-size: 18px; }
    .fab {
      position: fixed;
      right: calc(16px + env(safe-area-inset-right));
      bottom: calc(16px + env(safe-area-inset-bottom));
      z-index: 2;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      height: 52px;
      padding: 0 22px 0 18px;
      border: none;
      border-radius: 26px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.32);
      --mdc-icon-size: 22px;
    }
    .fab:hover { filter: brightness(1.08); }
    .filters { padding-bottom: 8px; }
    .priority-filter {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 8px;
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .filter-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 24px;
      padding-bottom: 8px;
    }
    .filter-row .priority-filter { padding-bottom: 0; }
    .switch-row {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-height: var(--ik-hit-target);
      font-size: 13px;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .switch {
      width: 44px;
      height: 26px;
      flex: none;
      display: flex;
      padding: 3px;
      border: none;
      border-radius: 13px;
      background: var(--divider-color);
      cursor: pointer;
      transition: background 0.15s;
    }
    .switch::after {
      content: "";
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--text-primary-color);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      transition: transform 0.15s;
    }
    .switch[aria-checked="true"] { background: var(--primary-color); }
    .switch[aria-checked="true"]::after { transform: translateX(18px); }
    .priority-filter select {
      padding: 5px 10px;
      border-radius: var(--ik-radius-field);
      border: 1px solid var(--divider-color);
      background: var(--ik-field-fill);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
    }

    .body {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      padding-bottom: 24px;
    }
    /* Room for the floating Add task button under the last row */
    :host([narrow]) .body { padding-bottom: 88px; }

    /* ── Month and week grids: 1px gaps over a divider-colored background draw the lines ── */
    .month, .week {
      flex: 1 0 auto;
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      gap: 1px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-card);
      background: var(--divider-color);
      overflow: hidden;
    }
    /* The panel grows with its content, so the grid asks for the screen height left under the toolbar */
    .month, .week { min-height: calc(100vh - 210px); }
    .month { grid-template-rows: auto repeat(var(--weeks), minmax(108px, 1fr)); }
    .week { grid-template-rows: auto minmax(360px, 1fr); }
    .weekday {
      padding: 10px 4px;
      background: var(--ik-surface);
      text-align: center;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: var(--ik-group-header-spacing);
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .day-num {
      width: 26px;
      height: 26px;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      align-self: center;
      border-radius: 50%;
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .day-num.today { background: var(--primary-color); color: var(--text-primary-color); }
    .other .day-num:not(.today) { color: var(--secondary-text-color); opacity: 0.6; }
    .cell, .week-col {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      background: var(--ik-surface);
      cursor: pointer;
    }
    .cell { padding: 4px 4px 6px; }
    .cell:hover, .week-col:hover { background: color-mix(in srgb, var(--primary-text-color) 3%, var(--ik-surface)); }
    .critical { flex: none; color: var(--ik-error-text); }

    /* Month: a dot and the time for timed tasks, a tinted bar for all-day ones, as in HA's calendar */
    .event {
      display: flex;
      align-items: center;
      gap: 5px;
      width: 100%;
      min-width: 0;
      height: 22px;
      padding: 0 6px;
      box-sizing: border-box;
      border: none;
      border-radius: 6px;
      background: none;
      color: var(--primary-text-color);
      font-size: 12px;
      text-align: start;
      cursor: pointer;
      --mdc-icon-size: 14px;
    }
    .event:hover .name { text-decoration: underline; }
    .event .name {
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight: 500;
    }
    .event .time { flex: none; color: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
    .event .dot {
      width: 8px;
      height: 8px;
      flex: none;
      border-radius: 50%;
      background: var(--primary-color);
    }
    .event.overdue .dot { background: var(--error-color); }
    .event.overdue .time { color: var(--ik-error-text); }
    .event.today .dot { background: var(--warning-color); }
    .event.today .time { color: var(--ik-warning-text); }
    .event.all-day { background: var(--ik-primary-fill); }
    .event.all-day.overdue { background: var(--ik-error-fill); color: var(--ik-error-text); }
    .event.all-day.today { background: var(--ik-warning-fill); color: var(--ik-warning-text); }
    .event.done { background: none; color: var(--secondary-text-color); }
    .event.done .name { font-weight: 400; }
    .event .mark { flex: none; color: var(--ik-success-text); }
    /* Future repeats are dashed outlines in secondary text: there is no task yet, only the date it will have */
    .event.repeat { color: var(--secondary-text-color); }
    .event.repeat .name { font-weight: 400; }
    .event.repeat .mark { color: var(--secondary-text-color); }
    .event.all-day.repeat { background: none; border: 1px dashed var(--ik-repeat-outline); }
    .more {
      align-self: flex-start;
      padding: 2px 6px;
      border: none;
      border-radius: 6px;
      background: none;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
    }
    .more:hover { background: var(--ik-subtle-fill); color: var(--primary-text-color); }

    /* Week: one column per day, each task a tinted block */
    .week-head {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 10px 4px;
      background: var(--ik-surface);
    }
    .week-head .weekday { padding: 0; }
    .week-head .day-num { width: 36px; height: 36px; font-size: 20px; font-weight: 400; }
    .week-col { gap: 6px; padding: 8px 6px; }
    .block {
      display: flex;
      flex-direction: column;
      gap: 2px;
      width: 100%;
      padding: 6px 8px;
      box-sizing: border-box;
      border: none;
      border-radius: 8px;
      background: var(--ik-primary-fill);
      color: var(--primary-text-color);
      text-align: start;
      cursor: pointer;
      --mdc-icon-size: 14px;
    }
    .block.overdue { background: var(--ik-error-fill); }
    .block.today { background: var(--ik-warning-fill); }
    .block.done { background: var(--ik-subtle-fill); color: var(--secondary-text-color); }
    .block.repeat {
      padding: 5px 7px;
      border: 1px dashed var(--ik-repeat-outline);
      background: none;
      color: var(--secondary-text-color);
    }
    .block.repeat .block-name { font-weight: 400; }
    .block:hover .block-name { text-decoration: underline; }
    .block-time {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .block.overdue .block-time { color: var(--ik-error-text); }
    .block.today .block-time { color: var(--ik-warning-text); }
    .block.done .block-time ha-icon { color: var(--ik-success-text); }
    .block-name {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-size: 13px;
      font-weight: 500;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }
    .block-name .critical { vertical-align: -2px; margin-inline-end: 3px; }

    /* ── Narrow: small month with dots ── */
    .mini {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      padding: 4px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-card);
      background: var(--ik-surface);
    }
    .mini .weekday { padding: 6px 0 2px; background: none; letter-spacing: 0; }
    .mini-day {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      min-width: 0;
      height: 50px;
      padding: 5px 0 0;
      border: none;
      border-radius: 12px;
      background: none;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .mini-day .day-num { width: 30px; height: 30px; font-size: 14px; }
    .mini-day[aria-pressed="true"] { background: var(--ik-primary-fill); }
    .dots { display: flex; gap: 3px; height: 6px; }
    .dots .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary-color); }
    .dots .dot.overdue { background: var(--error-color); }
    .dots .dot.today { background: var(--warning-color); }
    .dots .dot.done { background: var(--secondary-text-color); opacity: 0.6; }
    .dots .dot.repeat { background: none; box-shadow: inset 0 0 0 1.5px var(--primary-color); }

    /* ── Narrow: the chosen day, or the week, as a list ── */
    .agenda {
      display: flex;
      flex-direction: column;
      gap: 18px;
      padding-top: 18px;
    }
    .group-header {
      margin: 0;
      padding: 0 4px 10px;
      font-size: var(--ik-group-header-size);
      font-weight: var(--ik-group-header-weight);
      letter-spacing: var(--ik-group-header-spacing);
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .group-header.today { color: var(--primary-color); }
    .group {
      padding: 0 4px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-card);
      background: var(--ik-surface);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      min-height: 64px;
      padding: 8px 4px;
      box-sizing: border-box;
      border: none;
      background: none;
      color: inherit;
      text-align: start;
      cursor: pointer;
    }
    .row + .row { border-top: 1px solid var(--divider-color); }
    .row .icon {
      width: 40px;
      height: 40px;
      box-sizing: border-box;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--ik-subtle-fill);
      color: var(--primary-text-color);
      --mdc-icon-size: 20px;
    }
    .row.overdue .icon { background: var(--ik-error-fill); color: var(--ik-error-text); }
    .row.today .icon { background: var(--ik-warning-fill); color: var(--ik-warning-text); }
    .row.done .icon { background: var(--ik-success-fill); color: var(--ik-success-text); }
    .row.repeat .icon { background: none; border: 1px dashed var(--ik-repeat-outline); color: var(--secondary-text-color); }
    .row .text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
    .row .name {
      font-size: var(--ik-row-title-size);
      font-weight: var(--ik-row-title-weight);
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .row.done .name, .row.repeat .name { color: var(--secondary-text-color); }
    .meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 2px 6px;
      font-size: var(--ik-row-secondary-size);
      color: var(--secondary-text-color);
      --mdc-icon-size: 14px;
    }
    .meta-item { display: inline-flex; align-items: center; gap: 4px; }
    .row.overdue .when { color: var(--ik-error-text); font-weight: 500; }
    .row.today .when { color: var(--ik-warning-text); font-weight: 500; }
    .row.done .when { color: var(--ik-success-text); font-weight: 500; }
    .meta .high ha-icon { color: var(--primary-text-color); }
    .meta .critical ha-icon { color: var(--ik-error-text); }
    .chevron { flex: none; color: var(--secondary-text-color); --mdc-icon-size: 20px; }
    .empty {
      padding: 20px 16px;
      text-align: center;
      font-size: 14px;
      color: var(--secondary-text-color);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    void this._loadRegistries();
  }

  protected willUpdate(changed: PropertyValues) {
    // Open on today in Home Assistant's time zone, known once hass arrives
    if (changed.has("hass") && !changed.get("hass") && this.hass) this._go(this._today);
  }

  protected updated(changed: PropertyValues) {
    if (!this.hass || !this._showRepeats) return;
    const [first, last] = this._shownDays();
    const span = `${dayKey(first)}|${dayKey(last)}`;
    // Completing or editing a task moves its repeats, and every change comes with a new task list
    if (span !== this._repeatsSpan || changed.has("tasks") || changed.has("_showRepeats")) {
      this._repeatsSpan = span;
      // Days are UTC midnights: a day more on each side covers any time zone
      void this._loadRepeats(addDays(first, -1), addDays(last, 2));
    }
  }

  private async _loadRepeats(start: Date, end: Date) {
    const request = ++this._repeatsRequest;
    let repeats: TaskRepeat[] = [];
    try {
      repeats = await getRepeats(this.hass, start, end);
    } catch {
      // Backend without get_repeats yet (HA not restarted after an update): open occurrences only
    }
    if (request === this._repeatsRequest) this._repeats = repeats;
  }

  private _setShowRepeats(show: boolean) {
    this._showRepeats = show;
    store(REPEATS_STORAGE_KEY, String(show));
  }

  private async _loadRegistries() {
    try {
      const [areas, devices] = await Promise.all([
        this.hass.connection.sendMessagePromise<AreaRegistryEntry[]>({ type: "config/area_registry/list" }),
        this.hass.connection.sendMessagePromise<DeviceRegistryEntry[]>({ type: "config/device_registry/list" }),
      ]);
      this._areas = areas.sort((a, b) => a.name.localeCompare(b.name));
      this._devices = devices.sort((a, b) => (a.name_by_user || a.name).localeCompare(b.name_by_user || b.name));
    } catch {
      // registries unavailable — area/device filters just won't work
    }
  }

  private _onFilterChanged(e: CustomEvent) {
    const { selectedAreaIds, selectedDeviceIds, filterMode } = e.detail;
    this._selectedAreaIds = selectedAreaIds;
    this._selectedDeviceIds = selectedDeviceIds;
    this._filterMode = filterMode;
    store(FILTER_MODE_STORAGE_KEY, filterMode);
    store(FILTER_AREAS_STORAGE_KEY, JSON.stringify(selectedAreaIds));
    store(FILTER_DEVICES_STORAGE_KEY, JSON.stringify(selectedDeviceIds));
  }

  private _setPriority(priority: TaskPriority | "all") {
    this._filterPriority = priority;
    store(PRIORITY_STORAGE_KEY, priority);
  }

  private _matchesLinkedFilters(task: Task): boolean {
    if (this._selectedAreaIds.length === 0 && this._selectedDeviceIds.length === 0) return true;

    const taskAreaIds = new Set(
      task.linked_entity_ids.filter(v => v.startsWith("area:")).map(v => v.slice(5))
    );
    const taskDeviceIds = new Set(
      task.linked_entity_ids.filter(v => v.startsWith("device:")).map(v => v.slice(7))
    );

    const matchesArea = this._selectedAreaIds.length === 0 ? null
      : this._selectedAreaIds.some(areaId => {
          if (taskAreaIds.has(areaId)) return true;
          return [...taskDeviceIds].some(deviceId => {
            const dev = this._devices.find(d => d.id === deviceId);
            return dev?.area_id === areaId;
          });
        });

    const matchesDevice = this._selectedDeviceIds.length === 0 ? null
      : this._selectedDeviceIds.some(deviceId => taskDeviceIds.has(deviceId));

    if (matchesArea === null) return Boolean(matchesDevice);
    if (matchesDevice === null) return matchesArea;
    return this._filterMode === "and" ? matchesArea && matchesDevice : matchesArea || matchesDevice;
  }

  private _matchesFilters(task: Task): boolean {
    return (this._filterPriority === "all" || task.priority === this._filterPriority) && this._matchesLinkedFilters(task);
  }

  /** The filtered tasks and their future repeats by due day (YYYY-MM-DD), each day sorted. */
  private _eventsByDay(): Map<string, CalEvent[]> {
    const byDay = new Map<string, CalEvent[]>();
    const add = (task: Task, due: string, tone: CalEvent["tone"]) => {
      const event: CalEvent = { task, time: isMidnight(due, this.hass) ? null : new Date(due), tone };
      const key = dayKey(calendarDay(due, this.hass));
      const events = byDay.get(key);
      if (events) events.push(event);
      else byDay.set(key, [event]);
    };
    for (const task of this.tasks) {
      if (!task.due_date || !this._matchesFilters(task)) continue;
      add(task, task.due_date, task.status === "completed" ? "done" : urgencyOf(task, this.hass));
    }
    if (this._showRepeats) {
      const byId = new Map(this.tasks.map(task => [task.task_id, task]));
      for (const repeat of this._repeats) {
        const task = byId.get(repeat.task_id);
        if (task && this._matchesFilters(task)) add(task, repeat.due_date, "repeat");
      }
    }
    for (const events of byDay.values()) events.sort(compareEvents);
    return byDay;
  }

  private get _today(): Date {
    return calendarDay(new Date(), this.hass);
  }

  /** First day of the week holding `day`, following the profile's first weekday. */
  private _weekStart(day: Date): Date {
    return addDays(day, -((day.getUTCDay() - firstWeekday(this.hass) + 7) % 7));
  }

  /** First and last day on screen: the whole weeks of the month, or the week. */
  private _shownDays(): [Date, Date] {
    if (this._mode === "week") {
      const start = this._weekStart(this._ref);
      return [start, addDays(start, 6)];
    }
    const days = this._monthDays();
    return [days[0], days[days.length - 1]];
  }

  /** Whole weeks covering the month shown. */
  private _monthDays(): Date[] {
    const year = this._ref.getUTCFullYear();
    const month = this._ref.getUTCMonth();
    const start = this._weekStart(new Date(Date.UTC(year, month, 1)));
    const last = new Date(Date.UTC(year, month + 1, 0));
    const weeks = Math.ceil(((last.getTime() - start.getTime()) / DAY_MS + 1) / 7);
    return Array.from({ length: weeks * 7 }, (_, i) => addDays(start, i));
  }

  private _go(day: Date) {
    this._ref = day;
    this._selected = day;
  }

  private _navigate(delta: number) {
    const ref = this._ref;
    this._go(this._mode === "week"
      ? addDays(ref, 7 * delta)
      : new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() + delta, 1)));
  }

  private _setMode(mode: CalMode) {
    this._mode = mode;
    this._ref = this._selected;
    store(MODE_STORAGE_KEY, mode);
  }

  private _showWeek(day: Date) {
    this._go(day);
    this._setMode("week");
  }

  private _openTask(request: OpenTaskRequest) {
    this.dispatchEvent(new CustomEvent<OpenTaskRequest>("open-task", { detail: request, bubbles: true, composed: true }));
  }

  private _addOn(day: Date) {
    this._openTask({ taskId: null, dueDate: dayKey(day) });
  }

  private _periodLabel(): string {
    let label: string;
    if (this._mode === "month") {
      label = formatDate(this._ref, this.hass, { ...DAY_ONLY, day: undefined, month: "long" });
    } else {
      const start = this._weekStart(this._ref);
      label = formatDateRange(start, addDays(start, 6), this.hass, DAY_ONLY);
    }
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  private _weekdayLabel(day: Date, weekday: "short" | "narrow"): string {
    return formatDate(day, this.hass, { ...DAY_ONLY, weekday, year: undefined, month: undefined, day: undefined })
      .replace(/\.$/, "");
  }

  /** "Tuesday, October 20", with the year only when it isn't the current one. */
  private _dayLabel(day: Date): string {
    const year = day.getUTCFullYear() === this._today.getUTCFullYear() ? undefined : "numeric";
    return formatDate(day, this.hass, { ...DAY_ONLY, weekday: "long", month: "long", year });
  }

  private _criticalMark(event: CalEvent, tr: Translations) {
    return event.task.priority === "critical" && event.tone !== "done"
      ? html`<ha-icon class="critical" icon=${PRIORITY_ICON.critical} role="img" aria-label=${tr.critical}></ha-icon>`
      : nothing;
  }

  /** Marks a future repeat; opening one opens the task's open occurrence. */
  private _repeatMark(tr: Translations, className = "") {
    return html`<ha-icon class=${className} icon="mdi:repeat" role="img" aria-label=${tr.futureRepeat}></ha-icon>`;
  }

  private _renderChip(event: CalEvent, tr: Translations) {
    const { task, time, tone } = event;
    return html`
      <button
        class="event ${time ? "timed" : "all-day"} ${tone ?? ""}"
        title=${tone === "repeat" ? `${task.name} · ${tr.futureRepeat}` : task.name}
        @click=${(e: Event) => { e.stopPropagation(); this._openTask({ taskId: task.task_id }); }}
      >
        ${tone === "done"
          ? html`<ha-icon class="mark" icon="mdi:check"></ha-icon>`
          : tone === "repeat" ? this._repeatMark(tr, "mark")
          : time ? html`<span class="dot"></span>` : nothing}
        ${time ? html`<span class="time">${formatTime(time, this.hass)}</span>` : nothing}
        ${this._criticalMark(event, tr)}
        <span class="name">${task.name}</span>
      </button>
    `;
  }

  private _renderMonth(byDay: Map<string, CalEvent[]>, tr: Translations) {
    const today = this._today;
    const days = this._monthDays();
    const month = this._ref.getUTCMonth();
    return html`
      <div class="month" style="--weeks: ${days.length / 7}">
        ${days.slice(0, 7).map(day => html`<div class="weekday">${this._weekdayLabel(day, "short")}</div>`)}
        ${days.map(day => {
          const events = byDay.get(dayKey(day)) ?? [];
          const shown = events.length > CELL_LINES ? events.slice(0, CELL_LINES - 1) : events;
          return html`
            <div class="cell ${day.getUTCMonth() !== month ? "other" : ""}" @click=${() => this._addOn(day)}>
              <span class="day-num ${sameDay(day, today) ? "today" : ""}">${day.getUTCDate()}</span>
              ${shown.map(event => this._renderChip(event, tr))}
              ${events.length > shown.length ? html`
                <button class="more" @click=${(e: Event) => { e.stopPropagation(); this._showWeek(day); }}>
                  ${tr.moreTasks(events.length - shown.length)}
                </button>
              ` : nothing}
            </div>
          `;
        })}
      </div>
    `;
  }

  private _renderBlock(event: CalEvent, tr: Translations) {
    const { task, time, tone } = event;
    return html`
      <button class="block ${tone ?? ""}" @click=${(e: Event) => { e.stopPropagation(); this._openTask({ taskId: task.task_id }); }}>
        <span class="block-time">
          ${tone === "done" ? html`<ha-icon icon="mdi:check"></ha-icon>` : tone === "repeat" ? this._repeatMark(tr) : nothing}${time ? formatTime(time, this.hass) : tr.allDay}
        </span>
        <span class="block-name">${this._criticalMark(event, tr)}${task.name}</span>
      </button>
    `;
  }

  private _renderWeek(byDay: Map<string, CalEvent[]>, tr: Translations) {
    const today = this._today;
    const start = this._weekStart(this._ref);
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    return html`
      <div class="week">
        ${days.map(day => html`
          <div class="week-head">
            <span class="weekday">${this._weekdayLabel(day, "short")}</span>
            <span class="day-num ${sameDay(day, today) ? "today" : ""}">${day.getUTCDate()}</span>
          </div>
        `)}
        ${days.map(day => html`
          <div class="week-col" @click=${() => this._addOn(day)}>
            ${(byDay.get(dayKey(day)) ?? []).map(event => this._renderBlock(event, tr))}
          </div>
        `)}
      </div>
    `;
  }

  /** A narrow list row: icon, name, then "19:14 · High · Monthly" ("· Future repeat" for a repeat). */
  private _renderRow(event: CalEvent, tr: Translations) {
    const { task, time, tone } = event;
    const dot = html`<span aria-hidden="true">·</span>`;
    let when: string;
    if (tone === "done") {
      when = tr.listCompleted;
    } else if (tone === "overdue") {
      const days = -daysUntil(new Date(task.due_date!), this.hass);
      when = days > 0 ? tr.daysOverdue(days) : tr.overdue;
    } else {
      when = time ? formatTime(time, this.hass) : tr.allDay;
    }
    const repeat = tone === "repeat" ? tr.futureRepeat : repeatLabel(task, this.hass, true);
    return html`
      <button class="row ${tone ?? ""}" @click=${() => this._openTask({ taskId: task.task_id })}>
        <span class="icon" aria-hidden="true">
          <ha-icon icon=${tone === "done" ? "mdi:check" : task.icon || "mdi:wrench-outline"}></ha-icon>
        </span>
        <span class="text">
          <span class="name">${task.name}</span>
          <span class="meta">
            <span class="meta-item when">${when}</span>${dot}
            <span class="meta-item ${task.priority}">
              <ha-icon icon=${PRIORITY_ICON[task.priority] ?? PRIORITY_ICON.medium}></ha-icon>${tr[task.priority] ?? task.priority}
            </span>
            ${repeat ? html`${dot}<span class="meta-item"><ha-icon icon="mdi:repeat"></ha-icon>${repeat}</span>` : nothing}
          </span>
        </span>
        <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
      </button>
    `;
  }

  private _renderDay(day: Date, events: CalEvent[], tr: Translations) {
    return html`
      <section>
        <h2 class="group-header ${sameDay(day, this._today) ? "today" : ""}">${this._dayLabel(day)}</h2>
        <div class="group">
          ${events.length ? events.map(event => this._renderRow(event, tr)) : html`<div class="empty">${tr.noTasksDay}</div>`}
        </div>
      </section>
    `;
  }

  private _renderMiniMonth(byDay: Map<string, CalEvent[]>, tr: Translations) {
    const today = this._today;
    const days = this._monthDays();
    const month = this._ref.getUTCMonth();
    const select = (day: Date) => {
      // A day of the next or previous month brings that month in
      if (day.getUTCMonth() !== month) this._ref = day;
      this._selected = day;
    };
    return html`
      <div class="mini">
        ${days.slice(0, 7).map(day => html`<div class="weekday" aria-hidden="true">${this._weekdayLabel(day, "narrow")}</div>`)}
        ${days.map(day => html`
          <button
            class="mini-day ${day.getUTCMonth() !== month ? "other" : ""}"
            aria-pressed=${sameDay(day, this._selected) ? "true" : "false"}
            aria-label=${this._dayLabel(day)}
            @click=${() => select(day)}
          >
            <span class="day-num ${sameDay(day, today) ? "today" : ""}">${day.getUTCDate()}</span>
            <span class="dots">
              ${(byDay.get(dayKey(day)) ?? []).slice(0, 3).map(event => html`<span class="dot ${event.tone ?? ""}"></span>`)}
            </span>
          </button>
        `)}
      </div>
      <div class="agenda">${this._renderDay(this._selected, byDay.get(dayKey(this._selected)) ?? [], tr)}</div>
    `;
  }

  private _renderWeekList(byDay: Map<string, CalEvent[]>, tr: Translations) {
    const start = this._weekStart(this._ref);
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i))
      .filter(day => byDay.has(dayKey(day)));
    return html`
      <div class="agenda">
        ${days.length
          ? days.map(day => this._renderDay(day, byDay.get(dayKey(day))!, tr))
          : html`<div class="group empty">${tr.noTasksWeek}</div>`}
      </div>
    `;
  }

  private _renderToolbar(tr: Translations, activeFilterCount: number) {
    const segment = (mode: CalMode, label: string) => html`
      <button class="segment" aria-pressed=${this._mode === mode ? "true" : "false"} @click=${() => this._setMode(mode)}>${label}</button>
    `;
    const views = html`
      <div class="segmented" role="group" aria-label=${tr.calendarViewLabel}>
        ${segment("month", tr.calendarMonth)}${segment("week", tr.calendarWeek)}
      </div>
    `;
    const today = html`<button class="today-btn" @click=${() => this._go(this._today)}>${tr.calendarToday}</button>`;
    const step = (delta: number, label: string, icon: string) => html`
      <button class="round" aria-label=${label} title=${label} @click=${() => this._navigate(delta)}>
        <ha-icon icon=${icon}></ha-icon>
      </button>
    `;
    const prev = step(-1, tr.calendarPrevious, "mdi:chevron-left");
    const next = step(1, tr.calendarNext, "mdi:chevron-right");
    const period = html`<h2 class="period" aria-live="polite">${this._periodLabel()}</h2>`;
    const expanded = this._showFilters ? "true" : "false";
    const toggleFilters = () => { this._showFilters = !this._showFilters; };
    const count = activeFilterCount ? html`<span class="count">${activeFilterCount}</span>` : nothing;

    if (this.narrow) {
      return html`
        <div class="toolbar">
          ${views}
          <span class="spacer"></span>
          ${today}
          <button class="icon-pill" aria-label=${tr.filters} title=${tr.filters} aria-expanded=${expanded} @click=${toggleFilters}>
            <ha-icon icon="mdi:filter-variant"></ha-icon>${count}
          </button>
        </div>
        <div class="period-row">${prev}${period}${next}</div>
      `;
    }
    return html`
      <div class="toolbar">
        ${today}${prev}${next}${period}
        <button class="pill" aria-expanded=${expanded} @click=${toggleFilters}>
          <ha-icon icon="mdi:filter-variant"></ha-icon>${tr.filters}${count}
        </button>
        ${views}
        <button class="add" @click=${() => this._openTask({ taskId: null })}>
          <ha-icon icon="mdi:plus"></ha-icon>${tr.addTask}
        </button>
      </div>
    `;
  }

  render() {
    const tr = t(this.hass?.language);
    const byDay = this._eventsByDay();
    const activeFilterCount =
      this._selectedAreaIds.length + this._selectedDeviceIds.length + (this._filterPriority !== "all" ? 1 : 0);

    let body;
    if (this.narrow) body = this._mode === "month" ? this._renderMiniMonth(byDay, tr) : this._renderWeekList(byDay, tr);
    else body = this._mode === "month" ? this._renderMonth(byDay, tr) : this._renderWeek(byDay, tr);

    return html`
      ${this._renderToolbar(tr, activeFilterCount)}
      <div class="filters">
        ${this._showFilters ? html`
          <div class="filter-row">
            <label class="priority-filter">
              ${tr.priority}
              <select .value=${this._filterPriority} @change=${(e: Event) => this._setPriority((e.target as HTMLSelectElement).value as TaskPriority | "all")}>
                <option value="all">${tr.allPriorities}</option>
                ${PRIORITIES.map(p => html`<option value=${p} ?selected=${p === this._filterPriority}>${tr[p]}</option>`)}
              </select>
            </label>
            <label class="switch-row">
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${this._showRepeats ? "true" : "false"}
                @click=${() => this._setShowRepeats(!this._showRepeats)}
              ></button>
              ${tr.showFutureRepeats}
            </label>
          </div>
        ` : nothing}
        <ik-link-filter
          .hass=${this.hass}
          .areas=${this._areas}
          .devices=${this._devices}
          .selectedAreaIds=${this._selectedAreaIds}
          .selectedDeviceIds=${this._selectedDeviceIds}
          .filterMode=${this._filterMode}
          ?open=${this._showFilters}
          @filter-changed=${(e: CustomEvent) => this._onFilterChanged(e)}
        ></ik-link-filter>
      </div>
      <div class="body">${body}</div>
      ${this.narrow ? html`
        <button
          class="fab"
          @click=${() => this._openTask(this._mode === "month" ? { taskId: null, dueDate: dayKey(this._selected) } : { taskId: null })}
        >
          <ha-icon icon="mdi:plus"></ha-icon>${tr.addTask}
        </button>
      ` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ik-calendar-view": IkCalendarView;
  }
}
