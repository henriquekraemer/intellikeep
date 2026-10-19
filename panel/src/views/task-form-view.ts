import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, OpenTaskRequest, Task, TaskFrequency, TaskPriority, WEEKDAYS, Weekday } from "../types";
import { createTask, updateTask, completeTask, reopenTask, deleteTask, addTaskNote, deleteTaskNote } from "../api";
import { t } from "../translations";
import { errorText, formatDate, formatDateTime, localDate, localTime, repeatLabel, showToast, weekdayName } from "../utils";
import { MenuItem } from "../components/menu";
import { PRIORITY_ICON } from "../components/task-card";
import "../components/confirm-dialog";
import "../components/searchable-select";
import "../components/menu";

type FormTab = "edit" | "notes" | "history";
type AreaEntry = { area_id: string; name: string };
type DeviceEntry = { id: string; area_id: string | null; name_by_user: string | null; name: string };

const PRIORITIES: TaskPriority[] = ["low", "medium", "high", "critical"];
const REPEAT_UNITS: Exclude<TaskFrequency, "one_time">[] = ["daily", "weekly", "monthly", "yearly"];
/**
 * Icon of tasks without one. HA's picker shows a placeholder as a bare icon with
 * no name, so it gets this as its value instead, and `required` hides its clear
 * button, which would leave that bare icon behind.
 */
const DEFAULT_ICON = "mdi:wrench-outline";

/** Household icons suggested by the plain icon field (used until HA's icon picker is loaded); any MDI name works. */
const ICON_SUGGESTIONS = [
  "mdi:wrench-outline", "mdi:air-filter", "mdi:air-conditioner", "mdi:smoke-detector", "mdi:fire-extinguisher",
  "mdi:water-boiler", "mdi:water-pump", "mdi:water-filter", "mdi:fridge-outline", "mdi:washing-machine",
  "mdi:dishwasher", "mdi:stove", "mdi:garage", "mdi:home-roof", "mdi:weather-pouring", "mdi:lightbulb-outline",
  "mdi:battery-outline", "mdi:car", "mdi:mower", "mdi:flower-outline", "mdi:pool", "mdi:broom",
  "mdi:trash-can-outline", "mdi:paw", "mdi:pill", "mdi:shield-check-outline",
];

/**
 * The task dialog: details form, notes and history of one task, or the form
 * for a new one. It brings its own header, tabs and footer, so the panel only
 * provides the surface (a dialog on desktop, the whole page on phones).
 * Closing fires `navigate` with `returnPath`.
 */
@customElement("ik-task-form-view")
export class IkTaskFormView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) task: Task | null = null;
  @property({ attribute: false }) tasks: Task[] = [];
  @property({ type: Boolean }) enableAnimations = true;
  @property({ type: String }) returnPath = "/tasks";
  /** New tasks only: a task whose fields the form starts from (Duplicate). */
  @property({ attribute: false }) template: Task | null = null;
  /** New tasks without a template: the due day (YYYY-MM-DD), picked on the calendar. */
  @property() dueDate = "";
  /** Existing tasks only: the tab shown when the form opens. */
  @property() initialTab: FormTab = "edit";

  @state() private _name = "";
  @state() private _description = "";
  @state() private _icon = "";
  @state() private _priority: TaskPriority = "medium";
  @state() private _frequency: TaskFrequency = "one_time";
  @state() private _repeatInterval = 1;
  @state() private _scheduleAnchor: Task["schedule_anchor"] = "completion";
  @state() private _weekdays: Weekday[] = [];
  @state() private _dueDateSnapped = false;
  @state() private _dueDate = "";
  @state() private _dueTime = "";
  @state() private _linkedEntities: string[] = [];
  @state() private _notifyDaysBefore = 1;
  @state() private _notifyOnOverdue = true;
  @state() private _saving = false;
  @state() private _completing = false;
  @state() private _showDeleteConfirm = false;
  @state() private _error = "";
  @state() private _activeTab: FormTab = "edit";
  @state() private _linkPickerOpen = false;
  @state() private _pickArea = "";
  @state() private _pickDevice = "";
  @state() private _newNoteContent = "";
  @state() private _addingNote = false;
  @state() private _showDeleteNoteConfirm = false;
  @state() private _deleteNoteTarget: string | null = null;
  @state() private _notesPage = 0;
  @state() private _prevOccPage = 0;
  @state() private _activityPage = 0;
  @state() private _areas: AreaEntry[] = [];
  @state() private _deviceRegistry: DeviceEntry[] = [];
  /** HA loads ha-icon-picker lazily (it comes with the more-info dialog); until then the form shows a plain text field. */
  @state() private _haIconPicker = !!customElements.get("ha-icon-picker");

  private static readonly _NOTES_PAGE_SIZE = 5;
  private static readonly _PREV_OCC_PAGE_SIZE = 5;
  private static readonly _ACTIVITY_PAGE_SIZE = 5;

  connectedCallback() {
    super.connectedCallback();
    const source = this.task ?? this.template;
    if (this.task) this._activeTab = this.initialTab;
    if (source) {
      this._name = source.name;
      this._description = source.description;
      this._icon = source.icon ?? "";
      this._priority = source.priority;
      this._frequency = source.frequency;
      this._repeatInterval = Math.max(1, source.repeat_interval || 1);
      this._scheduleAnchor = source.schedule_anchor ?? "completion";
      this._weekdays = [...(source.weekdays ?? [])];
      // due_date comes in UTC; the inputs (and the save below) work in local time
      const due = source.due_date ? new Date(source.due_date) : null;
      this._dueDate = due ? localDate(due) : "";
      // A due date without a time is saved at midnight: it opens as all day again, with no time
      this._dueTime = due && localTime(due) !== "00:00" ? localTime(due) : "";
      this._linkedEntities = [...source.linked_entity_ids];
      this._notifyDaysBefore = source.notify_days_before;
      this._notifyOnOverdue = source.notify_on_overdue;
    } else if (this.dueDate) {
      // Added from a calendar day: due that day, all day
      this._dueDate = this.dueDate;
      this._dueTime = "";
    } else {
      // Pre-fill due date with current local date/time for new tasks
      const now = new Date();
      this._dueDate = localDate(now);
      this._dueTime = localTime(now);
    }
    this._loadRegistries();
    if (!this._haIconPicker) {
      customElements.whenDefined("ha-icon-picker").then(() => { this._haIconPicker = true; });
    }
  }

  protected willUpdate(changed: PropertyValues) {
    if (changed.has("enableAnimations")) this.toggleAttribute("no-animations", !this.enableAnimations);
  }

  protected updated() {
    // The description grows with its text instead of scrolling inside a small box
    const textarea = this.renderRoot.querySelector<HTMLTextAreaElement>("#description");
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight + 2}px`;
    }
  }

  private async _loadRegistries() {
    const [areas, devices] = await Promise.all([
      this.hass.connection.sendMessagePromise<AreaEntry[]>({ type: "config/area_registry/list" }),
      this.hass.connection.sendMessagePromise<DeviceEntry[]>({ type: "config/device_registry/list" }),
    ]);
    this._areas = areas.sort((a, b) => a.name.localeCompare(b.name));
    this._deviceRegistry = devices.sort((a, b) => (a.name_by_user || a.name).localeCompare(b.name_by_user || b.name));
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 0;
      max-height: inherit;
      height: 100%;
      color: var(--primary-text-color);
    }
    :host([no-animations]) *, :host([no-animations]) *::before, :host([no-animations]) *::after {
      transition: none !important;
      animation: none !important;
    }
    button { font: inherit; }
    button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, a:focus-visible {
      outline: 2px solid var(--ik-focus-ring);
      outline-offset: 2px;
    }

    /* Header and tabs */
    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 12px 0;
    }
    .icon-btn {
      width: var(--ik-hit-target);
      height: var(--ik-hit-target);
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      --mdc-icon-size: 22px;
    }
    .icon-btn:hover { background: var(--ik-subtle-fill); color: var(--primary-text-color); }
    .titles { flex: 1; min-width: 0; padding-inline-start: 4px; }
    .title {
      margin: 0;
      font-size: 20px;
      font-weight: 400;
      line-height: 1.3;
      overflow-wrap: anywhere;
    }
    .subtitle { margin-top: 2px; font-size: 13px; color: var(--secondary-text-color); }
    .tabs {
      display: flex;
      gap: 4px;
      padding: 4px 16px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .tab {
      height: 48px;
      padding: 0 16px;
      border: none;
      border-bottom: 2px solid transparent;
      background: none;
      color: var(--secondary-text-color);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    .tab:hover { color: var(--primary-text-color); }
    .tab[aria-selected="true"] { color: var(--primary-color); border-bottom-color: var(--primary-color); }

    /* Body */
    .body {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }
    .header + .body { padding-top: 16px; }
    .label {
      display: block;
      margin-bottom: 6px;
      font-size: 13px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .field {
      width: 100%;
      box-sizing: border-box;
      min-height: 48px;
      padding: 0 14px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-field);
      background: var(--ik-field-fill);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 15px;
    }
    .field:focus { outline: none; border-color: var(--primary-color); }
    .field:disabled { opacity: 0.6; cursor: not-allowed; }
    textarea.field {
      padding: 12px 14px;
      min-height: 84px;
      line-height: 1.45;
      resize: none;
      overflow: hidden;
    }
    select.field {
      appearance: none;
      padding-inline-end: 40px;
      cursor: pointer;
    }
    .select-wrap { position: relative; }
    .select-wrap ha-icon {
      position: absolute;
      inset-inline-end: 12px;
      top: 14px;
      color: var(--secondary-text-color);
      pointer-events: none;
      --mdc-icon-size: 20px;
    }
    .hint { margin-top: 6px; font-size: 12px; color: var(--secondary-text-color); }
    .error { color: var(--ik-error-text); font-size: 13px; }
    .readonly-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: var(--ik-radius-field);
      background: var(--ik-subtle-fill);
      font-size: 13px;
      color: var(--secondary-text-color);
      --mdc-icon-size: 16px;
    }
    .name-row { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }
    .name-row > :first-child { flex: 3 1 260px; }
    /* Grows to the full row when it wraps under the name */
    .icon-field { flex: 1 1 230px; min-width: 200px; position: relative; }
    .icon-field ha-icon {
      position: absolute;
      inset-inline-start: 14px;
      bottom: 13px;
      color: var(--secondary-text-color);
      --mdc-icon-size: 20px;
    }
    .icon-field .field { padding-inline-start: 44px; font-size: 14px; }
    /* HA's picker field is taller than ours: the box crops it to our field height, centered */
    .icon-box {
      display: flex;
      align-items: center;
      height: 48px;
      box-sizing: border-box;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-field);
      background: var(--ik-field-fill);
      overflow: hidden;
    }
    .icon-box:focus-within { border-color: var(--primary-color); }
    .icon-box ha-icon-picker {
      flex: 1 1 auto;
      min-width: 0;
      --ha-color-form-background: transparent;
    }

    /* Priority segmented control */
    fieldset { border: 0; margin: 0; padding: 0; min-width: 0; }
    legend { padding: 0; }
    .segmented {
      display: flex;
      gap: 4px;
      padding: 4px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      background: var(--ik-field-fill);
    }
    .segment {
      flex: 1 1 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-width: 0;
      height: 44px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--secondary-text-color);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      --mdc-icon-size: 16px;
    }
    .segment:hover:not(:disabled) { color: var(--primary-text-color); }
    .segment[aria-pressed="true"] {
      /* A step towards the text color: lighter on dark themes, darker on light ones */
      background: color-mix(in srgb, var(--primary-text-color) 10%, var(--ik-field-fill));
      color: var(--primary-text-color);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    .segment.critical[aria-pressed="true"] { color: var(--ik-error-text); }
    .segment:disabled { cursor: not-allowed; opacity: 0.6; }

    /* Sections */
    .section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 22px;
      border-top: 1px solid var(--divider-color);
    }
    .section-title {
      margin: 0;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .two-cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .date-field {
      display: flex;
      align-items: center;
      gap: 8px;
      text-align: start;
      cursor: pointer;
    }
    .date-wrap .date-field { padding-inline-end: 48px; }
    .date-field .date-text {
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .date-field.empty .date-text { color: var(--secondary-text-color); }
    .date-wrap { position: relative; }
    .date-native {
      position: absolute;
      inset: 0;
      opacity: 0;
      pointer-events: none;
    }
    .clear-date {
      position: absolute;
      inset-inline-end: 4px;
      top: 2px;
    }
    /* No time means all day: "All day" stands in for the empty time's --:-- until the field is focused */
    .time-field.all-day:not(:focus) { color: transparent; }
    .time-field.all-day:not(:focus)::-webkit-datetime-edit { color: transparent; }
    .all-day-text {
      position: absolute;
      inset-inline-start: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      color: var(--secondary-text-color);
      pointer-events: none;
    }
    .time-field.all-day:focus + .all-day-text { display: none; }
    /* Left of the native clock button */
    .clear-time {
      position: absolute;
      inset-inline-end: 36px;
      top: 2px;
    }
    .date-wrap .time-field:not(.all-day) { padding-inline-end: 80px; }
    .repeat-row { display: flex; align-items: flex-end; gap: 12px; }
    .repeat-row .every { width: 96px; flex: none; }
    .repeat-row .unit { flex: 1; }
    .weekday-chips { display: flex; gap: 6px; flex-wrap: wrap; }
    .weekday-chip {
      flex: 1 1 0;
      min-width: 44px;
      max-width: 72px;
      height: 40px;
      border-radius: 20px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
    }
    .weekday-chip[aria-pressed="true"] {
      background: var(--ik-primary-fill);
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .weekday-chip:disabled { opacity: 0.6; cursor: not-allowed; }
    .radio {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 44px;
      font-size: 14px;
      cursor: pointer;
    }
    .radio input {
      width: 20px;
      height: 20px;
      margin: 0;
      flex: none;
      accent-color: var(--primary-color);
    }
    .muted { color: var(--secondary-text-color); }

    /* Linked to */
    .chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      max-width: 100%;
      height: 32px;
      padding: 0 4px 0 12px;
      border-radius: 16px;
      background: var(--ik-subtle-fill);
      font-size: 13px;
      --mdc-icon-size: 16px;
    }
    .chip > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .chip button {
      width: 24px;
      height: 24px;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .chip button:hover { background: var(--divider-color); color: var(--primary-text-color); }
    .add-link {
      display: flex;
      align-items: center;
      gap: 10px;
      height: 48px;
      padding: 0 14px;
      border: 1px dashed var(--divider-color);
      border-radius: var(--ik-radius-field);
      background: transparent;
      color: var(--primary-color);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      --mdc-icon-size: 18px;
    }
    .add-link:disabled { opacity: 0.6; cursor: not-allowed; }
    .link-picker {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      padding: 12px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-field);
    }
    .link-picker ik-searchable-select { flex: 1 1 180px; min-width: 0; }

    /* Notifications */
    .inline-field { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 14px; }
    .inline-field .field { width: 72px; text-align: center; }
    .switch-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 44px;
      font-size: 14px;
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
    .switch:disabled { opacity: 0.6; cursor: not-allowed; }

    /* Footer and buttons */
    .footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      padding: 16px 24px 20px;
      border-top: 1px solid var(--divider-color);
    }
    .spacer { flex: 1; }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 20px;
      border: none;
      border-radius: var(--ik-radius-pill);
      background: transparent;
      color: var(--primary-color);
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      --mdc-icon-size: 18px;
    }
    .btn:disabled { opacity: 0.5; cursor: default; }
    .btn.filled { background: var(--primary-color); color: var(--text-primary-color); }
    .btn.filled:hover:not(:disabled) { filter: brightness(1.08); }
    .btn.plain:hover:not(:disabled) { background: var(--ik-primary-fill); }
    .btn.success {
      padding-inline-start: 16px;
      border: 1px solid color-mix(in srgb, var(--success-color) 45%, transparent);
      background: var(--ik-success-fill);
      color: var(--ik-success-text);
    }
    .btn.outlined {
      padding-inline-start: 16px;
      border: 1px solid var(--divider-color);
      color: var(--primary-text-color);
    }

    /* Notes and history tabs */
    .empty { padding: 32px 16px; text-align: center; color: var(--secondary-text-color); font-size: 14px; }
    .note-form { display: flex; flex-direction: column; gap: 10px; }
    .note-form .btn { align-self: flex-end; }
    .list { display: flex; flex-direction: column; gap: 10px; }
    .note {
      padding: 12px 14px;
      border-radius: var(--ik-radius-field);
      background: var(--ik-subtle-fill);
    }
    .note-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .note-meta { flex: 1; font-size: 12px; color: var(--secondary-text-color); }
    .note-header .icon-btn { width: 32px; height: 32px; --mdc-icon-size: 16px; }
    .note-content { font-size: 14px; white-space: pre-wrap; word-break: break-word; }
    .pager { display: flex; align-items: center; justify-content: flex-end; gap: 4px; font-size: 13px; color: var(--secondary-text-color); }
    .pager .icon-btn { width: 36px; height: 36px; --mdc-icon-size: 20px; }
    .activity { display: flex; align-items: flex-start; gap: 12px; font-size: 14px; }
    .activity > ha-icon { flex: none; margin-top: 1px; color: var(--secondary-text-color); --mdc-icon-size: 18px; }
    .activity-meta, .activity-details { margin-top: 2px; font-size: 12px; color: var(--secondary-text-color); }
    .activity-details { font-style: italic; }
    .occurrence {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: var(--ik-radius-field);
      background: var(--ik-subtle-fill);
      font-size: 14px;
    }
    .occurrence-number { min-width: 40px; color: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
    .occurrence-info { flex: 1; min-width: 0; }
    .occurrence-meta { font-size: 12px; color: var(--secondary-text-color); }
    .status-chip {
      display: inline-flex;
      align-items: center;
      height: 24px;
      padding: 0 10px;
      border-radius: 12px;
      background: var(--ik-surface);
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
    }
    .status-chip.overdue { background: var(--ik-error-fill); color: var(--ik-error-text); }
    .status-chip.due { background: var(--ik-warning-fill); color: var(--ik-warning-text); }
    .status-chip.completed { background: var(--ik-success-fill); color: var(--ik-success-text); }

    @media (max-width: 480px) {
      .body { padding: 16px; }
      .footer { padding: 12px 16px 16px; }
      .segment { flex-direction: column; gap: 2px; height: 52px; font-size: 12px; }
      /* The date ("Mon, Oct 19, 2026") needs more room than the time */
      .two-cols.date-time { grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); }
    }
  `;

  private _navigate(path: string) {
    this.dispatchEvent(new CustomEvent("navigate", { detail: path, bubbles: true, composed: true }));
  }

  private _close() {
    this._navigate(this.returnPath);
  }

  private _formatDate(iso: string): string {
    return formatDateTime(iso, this.hass);
  }

  private _areaName(areaId: string | null | undefined): string | undefined {
    return this._areas.find((a) => a.area_id === areaId)?.name;
  }

  private _deviceLabel(device: DeviceEntry): string {
    return device.name_by_user || device.name;
  }

  private _resolveActivityDetails(details: string): string {
    return details.replace(/\b(area|device):([a-zA-Z0-9_-]+)/g, (_match, type, id) => {
      if (type === "area") return this._areaName(id) ?? id;
      const device = this._deviceRegistry.find((d) => d.id === id);
      return device ? this._deviceLabel(device) : id;
    });
  }

  /** Chip text and icon of one linked item (area:…, device:… or an entity id). */
  private _linkInfo(link: string): { label: string; icon: string } {
    if (link.startsWith("area:")) {
      return { label: this._areaName(link.slice(5)) ?? link.slice(5), icon: "mdi:texture-box" };
    }
    if (link.startsWith("device:")) {
      const device = this._deviceRegistry.find((d) => d.id === link.slice(7));
      if (!device) return { label: link.slice(7), icon: "mdi:devices" };
      const area = this._areaName(device.area_id);
      return { label: area ? `${area} · ${this._deviceLabel(device)}` : this._deviceLabel(device), icon: "mdi:devices" };
    }
    const name = this.hass?.states?.[link]?.attributes?.friendly_name;
    return { label: typeof name === "string" ? name : link, icon: "mdi:shape-outline" };
  }

  private _addLink() {
    const link = this._pickDevice ? `device:${this._pickDevice}` : this._pickArea ? `area:${this._pickArea}` : "";
    if (link && !this._linkedEntities.includes(link)) this._linkedEntities = [...this._linkedEntities, link];
    this._closeLinkPicker();
  }

  private _closeLinkPicker() {
    this._linkPickerOpen = false;
    this._pickArea = "";
    this._pickDevice = "";
  }

  private async _complete() {
    if (!this.task) return;
    const tr = t(this.hass.language);
    const task = this.task;
    const user = this.hass.user?.name ?? "";
    this._completing = true;
    try {
      if (task.status !== "completed") {
        await completeTask(this.hass, task.task_id, user);
        showToast(this, tr.taskCompleted, {
          text: tr.undoAction,
          action: () => void reopenTask(this.hass, task.task_id, user).catch((err) => showToast(this, tr.actionFailed(errorText(err)))),
        }, 8000);
      } else {
        await reopenTask(this.hass, task.task_id, user);
      }
      this._close();
    } catch (err) {
      this._error = tr.actionFailed(errorText(err));
    } finally {
      this._completing = false;
    }
  }

  private async _handleDelete(confirmed: boolean) {
    this._showDeleteConfirm = false;
    if (!confirmed || !this.task) return;
    try {
      await deleteTask(this.hass, this.task.task_id);
      this._close();
    } catch (err) {
      this._error = t(this.hass.language).actionFailed(errorText(err));
    }
  }

  private _onMenuAction(action: string) {
    if (!this.task) return;
    if (action === "duplicate") {
      this.dispatchEvent(new CustomEvent<OpenTaskRequest>("open-task", {
        detail: { taskId: null, template: this.task },
        bubbles: true,
        composed: true,
      }));
    } else if (action === "delete") {
      this._showDeleteConfirm = true;
    }
  }

  private _toggleWeekday(code: Weekday) {
    const next = this._weekdays.includes(code)
      ? this._weekdays.filter(c => c !== code)
      : [...this._weekdays, code];
    this._weekdays = WEEKDAYS.filter(c => next.includes(c));
    this._snapDueDateToWeekdays();
  }

  /**
   * Weekly tasks pinned to weekdays must start on one of those days. If the
   * chosen due date does not match, move it forward to the next selected day
   * and flag it so the form can explain the change.
   */
  private _snapDueDateToWeekdays() {
    this._dueDateSnapped = false;
    if (this._frequency !== "weekly" || this._weekdays.length === 0 || !this._dueDate) return;
    const [y, m, d] = this._dueDate.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const codeOf = (dt: Date): Weekday => WEEKDAYS[(dt.getDay() + 6) % 7];
    if (this._weekdays.includes(codeOf(date))) return;
    for (let i = 1; i <= 7; i++) {
      const candidate = new Date(y, m - 1, d + i);
      if (this._weekdays.includes(codeOf(candidate))) {
        this._dueDate = localDate(candidate);
        this._dueDateSnapped = true;
        return;
      }
    }
  }

  /** The chosen due day in the profile language; it is a local calendar day, so no time zone applies. */
  private _formatDueDay(options: Intl.DateTimeFormatOptions = { weekday: "short" }): string {
    const [y, m, d] = this._dueDate.split("-").map(Number);
    return formatDate(new Date(y, m - 1, d), this.hass, { ...options, timeZone: undefined });
  }

  private _openDatePicker() {
    const input = this.renderRoot.querySelector<HTMLInputElement>(".date-native");
    try {
      input?.showPicker();
    } catch {
      input?.focus();
    }
  }

  private async _save() {
    const tr = t(this.hass?.language);
    if (!this._name.trim()) {
      this._error = tr.taskNameRequired;
      return;
    }
    this._saving = true;
    this._error = "";
    try {
      const recurring = this._frequency !== "one_time";
      const data: Partial<Task> = {
        name: this._name.trim(),
        description: this._description.trim(),
        icon: this._icon.trim() || null,
        priority: this._priority,
        frequency: this._frequency,
        repeat_interval: recurring ? Math.max(1, this._repeatInterval || 1) : 1,
        schedule_anchor: this._scheduleAnchor,
        weekdays: this._frequency === "weekly" ? this._weekdays : [],
        due_date: this._dueDate ? new Date(`${this._dueDate}T${this._dueTime || "00:00"}`).toISOString() : null,
        linked_entity_ids: this._linkedEntities.filter(Boolean),
        notify_days_before: this._notifyDaysBefore,
        notify_on_overdue: this._notifyOnOverdue,
      };
      if (this.task) {
        await updateTask(this.hass, this.task.task_id, data, this.hass.user?.name ?? "");
      } else {
        await createTask(this.hass, data);
      }
      this._close();
    } catch (err) {
      this._error = tr.actionFailed(errorText(err));
    } finally {
      this._saving = false;
    }
  }

  private _renderHeader(isEdit: boolean) {
    const tr = t(this.hass?.language);
    const task = this.task;
    const repeat = task ? repeatLabel(task, this.hass) : null;
    const number = task?.task_number ? `#${String(task.task_number).padStart(3, "0")}` : "";
    const menuItems: MenuItem[] = [
      { action: "duplicate", label: tr.duplicate, icon: "mdi:content-copy" },
      { divider: true },
      { action: "delete", label: tr.deleteAction, icon: "mdi:delete-outline", danger: true },
    ];
    return html`
      <div class="header">
        <button class="icon-btn" aria-label=${tr.close} title=${tr.close} @click=${this._close}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
        <div class="titles">
          <h2 class="title">${task ? task.name : tr.newTaskTitle}</h2>
          ${number || repeat ? html`<div class="subtitle">${[number, repeat].filter(Boolean).join(" · ")}</div>` : nothing}
        </div>
        ${isEdit ? html`
          <ik-menu .items=${menuItems} .label=${tr.moreActions(task!.name)} @menu-select=${(e: CustomEvent<string>) => this._onMenuAction(e.detail)}></ik-menu>
        ` : nothing}
      </div>
      ${isEdit ? html`
        <div class="tabs" role="tablist">
          ${([["edit", tr.detailsTab], ["notes", tr.notesTab], ["history", tr.historyNavTab]] as [FormTab, string][]).map(([tab, label]) => html`
            <button
              class="tab"
              role="tab"
              aria-selected=${this._activeTab === tab ? "true" : "false"}
              @click=${() => { this._activeTab = tab; }}
            >${label}</button>
          `)}
        </div>
      ` : nothing}
    `;
  }

  private _renderDetails(readonly: boolean) {
    const tr = t(this.hass?.language);
    const recurring = this._frequency !== "one_time";
    const unitValue = recurring ? this._frequency : "one_time";
    const devicesForPick = this._deviceRegistry.filter((d) => !this._pickArea || d.area_id === this._pickArea);
    return html`
      ${readonly ? html`
        <div class="readonly-banner"><ha-icon icon="mdi:lock-outline"></ha-icon>${tr.taskCompletedReadonly}</div>
      ` : nothing}

      <div class="name-row">
        <div>
          <label class="label" for="name">${tr.nameLabel}</label>
          <input
            id="name"
            class="field"
            required
            .value=${this._name}
            ?disabled=${readonly}
            placeholder=${tr.taskNamePlaceholder}
            @input=${(e: Event) => { this._name = (e.target as HTMLInputElement).value; }}
          />
        </div>
        ${this._haIconPicker ? html`
          <div class="icon-field">
            <span class="label" id="icon-label">${tr.iconLabel}</span>
            <div class="icon-box" role="group" aria-labelledby="icon-label">
              <ha-icon-picker
                .hass=${this.hass}
                .value=${this._icon || DEFAULT_ICON}
                .required=${true}
                .disabled=${readonly}
                @value-changed=${(e: CustomEvent<{ value?: string }>) => { this._icon = e.detail.value ?? ""; }}
              ></ha-icon-picker>
            </div>
          </div>
        ` : html`
          <div class="icon-field">
            <label class="label" for="icon">${tr.iconLabel}</label>
            <ha-icon icon=${this._icon.trim() || DEFAULT_ICON}></ha-icon>
            <input
              id="icon"
              class="field"
              list="icon-suggestions"
              autocomplete="off"
              spellcheck="false"
              .value=${this._icon}
              ?disabled=${readonly}
              placeholder=${DEFAULT_ICON}
              @input=${(e: Event) => { this._icon = (e.target as HTMLInputElement).value; }}
            />
            <datalist id="icon-suggestions">${ICON_SUGGESTIONS.map((icon) => html`<option value=${icon}></option>`)}</datalist>
          </div>
        `}
      </div>

      <div>
        <label class="label" for="description">${tr.description}</label>
        <textarea
          id="description"
          class="field"
          .value=${this._description}
          ?disabled=${readonly}
          placeholder=${tr.descriptionPlaceholder}
          @input=${(e: Event) => { this._description = (e.target as HTMLTextAreaElement).value; }}
        ></textarea>
      </div>

      <fieldset>
        <legend class="label">${tr.priority}</legend>
        <div class="segmented">
          ${PRIORITIES.map((p) => html`
            <button
              type="button"
              class="segment ${p}"
              aria-pressed=${this._priority === p ? "true" : "false"}
              ?disabled=${readonly}
              @click=${() => { this._priority = p; }}
            ><ha-icon icon=${PRIORITY_ICON[p]}></ha-icon>${tr[p]}</button>
          `)}
        </div>
      </fieldset>

      <div class="section">
        <h3 class="section-title">${tr.scheduleSection}</h3>
        <div class="two-cols date-time">
          <div>
            <span class="label" id="due-label">${recurring ? tr.nextDue : tr.dueDate}</span>
            <div class="date-wrap">
              <button
                type="button"
                class="field date-field ${this._dueDate ? "" : "empty"}"
                aria-labelledby="due-label due-value"
                ?disabled=${readonly}
                @click=${this._openDatePicker}
              ><span class="date-text" id="due-value">${this._dueDate ? this._formatDueDay({ weekday: "short", year: "numeric" }) : tr.noDueDate}</span></button>
              <input
                class="date-native"
                type="date"
                tabindex="-1"
                aria-hidden="true"
                .value=${this._dueDate}
                @change=${(e: Event) => { this._dueDate = (e.target as HTMLInputElement).value; this._snapDueDateToWeekdays(); }}
              />
              ${this._dueDate && !readonly ? html`
                <button type="button" class="icon-btn clear-date" aria-label=${tr.clearDueDate} title=${tr.clearDueDate}
                  @click=${() => { this._dueDate = ""; this._dueTime = ""; }}><ha-icon icon="mdi:close"></ha-icon></button>
              ` : nothing}
            </div>
          </div>
          <div>
            <label class="label" for="due-time">${tr.timeLabel}</label>
            <div class="date-wrap">
              <input
                id="due-time"
                class="field time-field ${this._dueDate && !this._dueTime ? "all-day" : ""}"
                type="time"
                .value=${this._dueTime}
                aria-describedby=${this._dueDate && !this._dueTime ? "all-day-text" : nothing}
                ?disabled=${readonly || !this._dueDate}
                @change=${(e: Event) => { this._dueTime = (e.target as HTMLInputElement).value; }}
              />
              ${this._dueDate && !this._dueTime ? html`<span class="all-day-text" id="all-day-text">${tr.allDay}</span>` : nothing}
              ${this._dueTime && !readonly ? html`
                <button type="button" class="icon-btn clear-time" aria-label=${tr.clearTime} title=${tr.clearTime}
                  @click=${() => { this._dueTime = ""; }}><ha-icon icon="mdi:close"></ha-icon></button>
              ` : nothing}
            </div>
          </div>
        </div>

        <div class="repeat-row">
          ${recurring ? html`
            <div class="every">
              <label class="label" for="repeat-every">${tr.repeatEvery}</label>
              <input
                id="repeat-every"
                class="field"
                type="number"
                min="1"
                max="3650"
                inputmode="numeric"
                .value=${String(this._repeatInterval)}
                ?disabled=${readonly}
                @input=${(e: Event) => { this._repeatInterval = Math.max(1, parseInt((e.target as HTMLInputElement).value, 10) || 1); }}
              />
            </div>
          ` : nothing}
          <div class="unit">
            ${recurring ? nothing : html`<label class="label" for="repeat-unit">${tr.repeatLabel}</label>`}
            <div class="select-wrap">
              <select
                id="repeat-unit"
                class="field"
                aria-label=${tr.repeatUnitLabel}
                .value=${unitValue}
                ?disabled=${readonly}
                @change=${(e: Event) => { this._frequency = (e.target as HTMLSelectElement).value as TaskFrequency; this._snapDueDateToWeekdays(); }}
              >
                <option value="one_time" ?selected=${unitValue === "one_time"}>${tr.doesNotRepeat}</option>
                ${REPEAT_UNITS.map((unit) => html`
                  <option value=${unit} ?selected=${unitValue === unit}>${tr.repeatUnit(unit, this._repeatInterval)}</option>
                `)}
              </select>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </div>
          </div>
        </div>

        ${this._frequency === "weekly" ? html`
          <div>
            <span class="label" id="weekdays-label">${tr.repeatOn}</span>
            <div class="weekday-chips" role="group" aria-labelledby="weekdays-label">
              ${WEEKDAYS.map((code) => html`
                <button
                  type="button"
                  class="weekday-chip"
                  aria-pressed=${this._weekdays.includes(code) ? "true" : "false"}
                  ?disabled=${readonly}
                  @click=${() => this._toggleWeekday(code)}
                >${weekdayName(code, this.hass)}</button>
              `)}
            </div>
            ${this._weekdays.length === 0
              ? html`<div class="hint">${tr.weekdaysNoneHint}</div>`
              : this._dueDateSnapped && this._dueDate
                ? html`<div class="hint">${tr.dueDateSnapped(this._formatDueDay({ weekday: "short", day: "2-digit", month: "2-digit", year: undefined }))}</div>`
                : nothing}
          </div>
        ` : nothing}

        ${recurring ? html`
          <fieldset>
            <legend class="label">${tr.anchorLegend}</legend>
            ${([["completion", tr.anchorCompletion, tr.anchorCompletionHint], ["due_date", tr.anchorDueDate, tr.anchorDueDateHint]] as [Task["schedule_anchor"], string, string][]).map(([value, label, hint]) => html`
              <label class="radio">
                <input
                  type="radio"
                  name="anchor"
                  .checked=${this._scheduleAnchor === value}
                  ?disabled=${readonly}
                  @change=${() => { this._scheduleAnchor = value; }}
                />
                <span>${label} <span class="muted">· ${hint}</span></span>
              </label>
            `)}
          </fieldset>
        ` : nothing}
      </div>

      <div class="section">
        <h3 class="section-title">${tr.linkedSection}</h3>
        ${this._linkedEntities.length ? html`
          <div class="chips">
            ${this._linkedEntities.filter(Boolean).map((link) => {
              const { label, icon } = this._linkInfo(link);
              return html`
                <span class="chip">
                  <ha-icon icon=${icon}></ha-icon><span>${label}</span>
                  ${readonly ? nothing : html`
                    <button type="button" aria-label=${tr.removeLink(label)} title=${tr.removeLink(label)}
                      @click=${() => { this._linkedEntities = this._linkedEntities.filter((l) => l !== link); }}>
                      <ha-icon icon="mdi:close"></ha-icon>
                    </button>
                  `}
                </span>
              `;
            })}
          </div>
        ` : nothing}
        ${this._linkPickerOpen ? html`
          <div class="link-picker">
            <ik-searchable-select
              .items=${[{ value: "", label: tr.allAreas }, ...this._areas.map((a) => ({ value: a.area_id, label: a.name }))]}
              .value=${this._pickArea}
              .placeholder=${tr.allAreas}
              .noResultsText=${tr.noResults}
              @value-changed=${(e: CustomEvent) => { this._pickArea = e.detail.value; this._pickDevice = ""; }}
            ></ik-searchable-select>
            <ik-searchable-select
              .items=${[{ value: "", label: tr.noSpecificDevice }, ...devicesForPick.map((d) => ({ value: d.id, label: this._deviceLabel(d) }))]}
              .value=${this._pickDevice}
              .placeholder=${tr.noSpecificDevice}
              .noResultsText=${tr.noResults}
              @value-changed=${(e: CustomEvent) => { this._pickDevice = e.detail.value; }}
            ></ik-searchable-select>
            <button type="button" class="btn plain" @click=${this._closeLinkPicker}>${tr.cancel}</button>
            <button type="button" class="btn filled" ?disabled=${!this._pickArea && !this._pickDevice} @click=${this._addLink}>${tr.add}</button>
          </div>
        ` : html`
          <button type="button" class="add-link" ?disabled=${readonly} @click=${() => { this._linkPickerOpen = true; }}>
            <ha-icon icon="mdi:plus"></ha-icon>${tr.addLink}
          </button>
        `}
        <div class="hint">${tr.linkHint}</div>
      </div>

      <div class="section">
        <h3 class="section-title">${tr.notificationsSection}</h3>
        <div class="inline-field">
          <label for="remind">${tr.remindMe}</label>
          <input
            id="remind"
            class="field"
            type="number"
            min="0"
            max="365"
            inputmode="numeric"
            .value=${String(this._notifyDaysBefore)}
            ?disabled=${readonly}
            @input=${(e: Event) => { this._notifyDaysBefore = Math.max(0, parseInt((e.target as HTMLInputElement).value, 10) || 0); }}
          />
          <span>${tr.daysBeforeDue(this._notifyDaysBefore)}</span>
        </div>
        <div class="switch-row">
          <span id="notify-overdue">${tr.notifyOverdue}</span>
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${this._notifyOnOverdue ? "true" : "false"}
            aria-labelledby="notify-overdue"
            ?disabled=${readonly}
            @click=${() => { this._notifyOnOverdue = !this._notifyOnOverdue; }}
          ></button>
        </div>
      </div>

      ${this._error ? html`<div class="error" role="alert">${this._error}</div>` : nothing}
    `;
  }

  private _pager(page: number, total: number, pageSize: number, onPage: (page: number) => void) {
    const tr = t(this.hass?.language);
    if (total <= pageSize) return nothing;
    const pages = Math.ceil(total / pageSize);
    const start = page * pageSize;
    return html`
      <div class="pager">
        <span>${start + 1}–${Math.min(start + pageSize, total)} ${tr.of} ${total}</span>
        <button class="icon-btn" aria-label="‹" ?disabled=${page === 0} @click=${() => onPage(page - 1)}><ha-icon icon="mdi:chevron-left"></ha-icon></button>
        <button class="icon-btn" aria-label="›" ?disabled=${page >= pages - 1} @click=${() => onPage(page + 1)}><ha-icon icon="mdi:chevron-right"></ha-icon></button>
      </div>
    `;
  }

  private _renderNotes() {
    const tr = t(this.hass?.language);
    const task = this.task!;
    const all = [...(task.notes || [])].reverse();
    const size = IkTaskFormView._NOTES_PAGE_SIZE;
    const page = Math.min(this._notesPage, Math.max(0, Math.ceil(all.length / size) - 1));
    return html`
      <div class="note-form">
        <label class="label" for="new-note">${tr.taskNotesLabel}</label>
        <textarea
          id="new-note"
          class="field"
          rows="4"
          .value=${this._newNoteContent}
          placeholder=${tr.taskNotesPlaceholder}
          @input=${(e: Event) => { this._newNoteContent = (e.target as HTMLTextAreaElement).value; }}
        ></textarea>
        <button
          class="btn filled"
          ?disabled=${this._addingNote || !this._newNoteContent.trim()}
          @click=${async () => {
            if (!this._newNoteContent.trim()) return;
            this._addingNote = true;
            try {
              await addTaskNote(this.hass, task.task_id, this._newNoteContent.trim(), this.hass.user?.name ?? "");
              this._newNoteContent = "";
              this._notesPage = 0;
            } catch (err) {
              showToast(this, tr.actionFailed(errorText(err)));
            } finally {
              this._addingNote = false;
            }
          }}
        ><ha-icon icon="mdi:plus"></ha-icon>${tr.addNoteBtn}</button>
      </div>
      ${all.length === 0 ? html`<div class="empty">${tr.noNotes}</div>` : html`
        <div class="list">
          ${all.slice(page * size, page * size + size).map((note) => html`
            <div class="note">
              <div class="note-header">
                <span class="note-meta">${this._formatDate(note.created_at)}${note.added_by ? ` · ${note.added_by}` : ""}</span>
                <button class="icon-btn" aria-label=${tr.deleteAction} title=${tr.deleteAction}
                  @click=${() => { this._deleteNoteTarget = note.note_id; this._showDeleteNoteConfirm = true; }}>
                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                </button>
              </div>
              <div class="note-content">${note.content}</div>
            </div>
          `)}
        </div>
        ${this._pager(page, all.length, size, (p) => { this._notesPage = p; })}
      `}
      <ik-confirm-dialog
        heading=${tr.deleteNoteHeading}
        confirmText=${tr.deleteAction}
        cancelText=${tr.cancel}
        .open=${this._showDeleteNoteConfirm}
        @dialog-closed=${async (e: CustomEvent) => {
          this._showDeleteNoteConfirm = false;
          const noteId = this._deleteNoteTarget;
          this._deleteNoteTarget = null;
          if (!e.detail.confirmed || !noteId) return;
          try {
            await deleteTaskNote(this.hass, task.task_id, noteId);
          } catch (err) {
            showToast(this, tr.actionFailed(errorText(err)));
          }
        }}
      >${tr.deleteNoteBody}</ik-confirm-dialog>
    `;
  }

  private _renderHistory() {
    const tr = t(this.hass?.language);
    const task = this.task!;
    const activities = [...(task.activities || [])].reverse();
    const actSize = IkTaskFormView._ACTIVITY_PAGE_SIZE;
    const actPage = Math.min(this._activityPage, Math.max(0, Math.ceil(activities.length / actSize) - 1));
    const actionIcon: Record<string, string> = {
      edited: "mdi:pencil-outline",
      completed: "mdi:check-circle-outline",
      reopened: "mdi:undo-variant",
      note_added: "mdi:note-plus-outline",
      note_deleted: "mdi:note-remove-outline",
    };
    const actionLabel: Record<string, string> = {
      edited: tr.activityEdited,
      completed: tr.activityCompleted,
      reopened: tr.activityReopened,
      note_added: tr.activityNoteAdded,
      note_deleted: tr.activityNoteDeleted,
    };
    // Every occurrence links to the family's first task; list the ones created before this one
    const rootId = task.previous_task_id;
    const created = Date.parse(task.created_at);
    const previous = rootId
      ? this.tasks
          .filter((t) => (t.task_id === rootId || t.previous_task_id === rootId) && Date.parse(t.created_at) < created)
          .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
      : [];
    const occSize = IkTaskFormView._PREV_OCC_PAGE_SIZE;
    const occPage = Math.min(this._prevOccPage, Math.max(0, Math.ceil(previous.length / occSize) - 1));
    const statusLabel: Record<string, string> = {
      pending: tr.pending, due: tr.groupToday, overdue: tr.overdue, completed: tr.completed,
    };
    return html`
      <h3 class="section-title">${tr.activityLog}</h3>
      ${activities.length === 0 ? html`<div class="empty">${tr.noActivity}</div>` : html`
        <div class="list">
          ${activities.slice(actPage * actSize, actPage * actSize + actSize).map((a) => html`
            <div class="activity">
              <ha-icon icon=${actionIcon[a.action] ?? "mdi:history"}></ha-icon>
              <div>
                <div>${actionLabel[a.action] ?? a.action}${a.performed_by ? html` <span class="muted">${tr.activityBy} ${a.performed_by}</span>` : nothing}</div>
                <div class="activity-meta">${this._formatDate(a.timestamp)}</div>
                ${a.details ? html`<div class="activity-details">${this._resolveActivityDetails(a.details)}</div>` : nothing}
              </div>
            </div>
          `)}
        </div>
        ${this._pager(actPage, activities.length, actSize, (p) => { this._activityPage = p; })}
      `}
      ${rootId ? html`
        <div class="section">
          <h3 class="section-title">${tr.relatedTasksTitle}</h3>
          ${previous.length === 0 ? html`<div class="empty">${tr.noRelatedTasks}</div>` : html`
            <div class="list">
              ${previous.slice(occPage * occSize, occPage * occSize + occSize).map((rt) => html`
                <div class="occurrence">
                  <span class="occurrence-number">${rt.task_number ? `#${String(rt.task_number).padStart(3, "0")}` : "—"}</span>
                  <div class="occurrence-info">
                    <div>${rt.due_date ? formatDate(rt.due_date, this.hass) : "—"}</div>
                    ${rt.executions.length > 0 ? html`
                      <div class="occurrence-meta">${tr.completedBy}: ${rt.executions[rt.executions.length - 1].completed_by || "—"}</div>
                    ` : nothing}
                  </div>
                  <span class="status-chip ${rt.status}">${statusLabel[rt.status] ?? rt.status}</span>
                </div>
              `)}
            </div>
            ${this._pager(occPage, previous.length, occSize, (p) => { this._prevOccPage = p; })}
          `}
        </div>
      ` : nothing}
    `;
  }

  private _renderFooter(isEdit: boolean, completed: boolean) {
    const tr = t(this.hass?.language);
    if (isEdit && completed) {
      return html`
        <div class="footer">
          <button class="btn outlined" ?disabled=${this._completing} @click=${this._complete}>
            <ha-icon icon="mdi:undo"></ha-icon>${tr.reopenAction}
          </button>
          <span class="spacer"></span>
          <button class="btn plain" @click=${this._close}>${tr.close}</button>
        </div>
      `;
    }
    return html`
      <div class="footer">
        ${isEdit ? html`
          <button class="btn success" ?disabled=${this._completing} @click=${this._complete}>
            <ha-icon icon="mdi:check"></ha-icon>${tr.markCompleteAction}
          </button>
        ` : nothing}
        <span class="spacer"></span>
        <button class="btn plain" @click=${this._close}>${tr.cancel}</button>
        <button class="btn filled" ?disabled=${this._saving} @click=${this._save}>${isEdit ? tr.save : tr.createTask}</button>
      </div>
    `;
  }

  render() {
    const tr = t(this.hass?.language);
    const isEdit = this.task !== null;
    const completed = isEdit && this.task!.status === "completed";
    const tab = isEdit ? this._activeTab : "edit";
    return html`
      ${this._renderHeader(isEdit)}
      <div class="body" role=${isEdit ? "tabpanel" : nothing}>
        ${tab === "edit" ? this._renderDetails(completed) : tab === "notes" ? this._renderNotes() : this._renderHistory()}
      </div>
      ${tab === "edit" ? this._renderFooter(isEdit, completed) : nothing}
      <ik-confirm-dialog
        heading=${tr.deleteHeading}
        confirmText=${tr.deleteAction}
        cancelText=${tr.cancel}
        .open=${this._showDeleteConfirm}
        @dialog-closed=${(e: CustomEvent) => this._handleDelete(e.detail.confirmed)}
      >${tr.deleteBody}</ik-confirm-dialog>
    `;
  }
}
