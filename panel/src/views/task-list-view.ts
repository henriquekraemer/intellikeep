import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { HomeAssistant, OpenTaskRequest, Task, TaskExecution, TaskPriority } from "../types";
import { completeTask, reopenTask, deleteTask } from "../api";
import { daysUntil, daysUntilNextWeek, errorText, showToast } from "../utils";
import { t, Translations } from "../translations";
import { MenuItem } from "../components/menu";
import { urgencyOf } from "../components/task-card";
import "../components/task-card";
import "../components/menu";
import "../components/confirm-dialog";
import "../components/link-filter";

type AreaRegistryEntry = { area_id: string; name: string };
type DeviceRegistryEntry = { id: string; area_id: string | null; name_by_user: string | null; name: string };

type ListMode = "open" | "completed";
type GroupBy = "due" | "priority" | "area" | "none";
/** A list row: an open task, or one completion record of a task. */
type Row = { task: Task; completion: TaskExecution | null };
type Group = { key: string; label: string | null; tone?: "overdue" | "today"; rows: Row[] };

const MODE_STORAGE_KEY = "intellikeep.listMode";
const GROUP_BY_STORAGE_KEY = "intellikeep.groupBy";
const FILTER_MODE_STORAGE_KEY = "intellikeep.filterMode";
const FILTER_AREAS_STORAGE_KEY = "intellikeep.filterAreas";
const FILTER_DEVICES_STORAGE_KEY = "intellikeep.filterDevices";

/** Completed lists the completion records of the last 30 days, the History tab's default range. */
const COMPLETED_WINDOW_DAYS = 30;
const PRIORITIES: TaskPriority[] = ["critical", "high", "medium", "low"];
const GROUP_BYS: GroupBy[] = ["due", "priority", "area", "none"];

const loadStoredList = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
};

const loadStoredChoice = <T extends string>(key: string, choices: readonly T[], fallback: T): T => {
  try {
    const value = localStorage.getItem(key) as T | null;
    return value && choices.includes(value) ? value : fallback;
  } catch {
    return fallback;
  }
};

/**
 * The Tasks tab: toolbar, then the open tasks or recent completions in groups.
 * The search text belongs to the panel (narrow layouts search from the app
 * bar), so typing here fires `search-changed` instead of keeping it.
 */
@customElement("ik-task-list-view")
export class IkTaskListView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) tasks: Task[] = [];
  @property({ type: Boolean }) enableAnimations = true;
  /** Phone layout: compact toolbar and rows, Group by inside Filters, a floating Add task button. */
  @property({ type: Boolean, reflect: true }) narrow = false;
  @property() searchQuery = "";

  @state() private _mode: ListMode = loadStoredChoice(MODE_STORAGE_KEY, ["open", "completed"], "open");
  @state() private _groupBy: GroupBy = loadStoredChoice(GROUP_BY_STORAGE_KEY, GROUP_BYS, "due");
  @state() private _filterPriority: TaskPriority | "all" = "all";
  @state() private _filterMode: "or" | "and" = (localStorage.getItem(FILTER_MODE_STORAGE_KEY) as "or" | "and") ?? "or";
  @state() private _selectedAreaIds: string[] = loadStoredList(FILTER_AREAS_STORAGE_KEY);
  @state() private _selectedDeviceIds: string[] = loadStoredList(FILTER_DEVICES_STORAGE_KEY);
  @state() private _areas: AreaRegistryEntry[] = [];
  @state() private _devices: DeviceRegistryEntry[] = [];
  @state() private _showFilters = false;
  @state() private _deleteTarget: Task | null = null;
  /** Tasks with a complete, reopen or delete call in flight. */
  @state() private _busy: Set<string> = new Set();

  connectedCallback() {
    super.connectedCallback();
    void this._loadRegistries();
  }

  protected willUpdate(changed: PropertyValues) {
    if (changed.has("enableAnimations")) this.toggleAttribute("no-animations", !this.enableAnimations);
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: var(--ik-padding, 20px) var(--ik-padding, 20px) 0;
      box-sizing: border-box;
    }
    :host([no-animations]) *, :host([no-animations]) *::before, :host([no-animations]) *::after {
      transition: none !important;
      animation: none !important;
    }
    button { font: inherit; }
    button:focus-visible, input:focus-visible, select:focus-visible {
      outline: 2px solid var(--ik-focus-ring);
      outline-offset: 2px;
    }
    .toolbar, .filters, .groups {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;
      box-sizing: border-box;
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      padding-bottom: 16px;
    }
    .count {
      display: inline-block;
      min-width: 8px;
      padding: 1px 7px;
      border-radius: 9px;
      background: color-mix(in srgb, currentColor 14%, transparent);
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
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 38px;
      padding: 0 14px;
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
    .search {
      flex: 1 1 280px;
      display: flex;
      align-items: center;
      gap: 10px;
      height: 42px;
      padding: 0 16px;
      box-sizing: border-box;
      border-radius: 21px;
      border: 1px solid var(--divider-color);
      background: var(--ik-surface);
      color: var(--secondary-text-color);
      --mdc-icon-size: 18px;
    }
    .search:focus-within { border-color: var(--primary-color); }
    .search input {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 14px;
    }
    .search input::placeholder { color: var(--secondary-text-color); }
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
    .pill .count { background: var(--primary-color); color: var(--text-primary-color); }
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
    .filters { padding-bottom: 8px; }
    .icon-pill {
      position: relative;
      width: var(--ik-hit-target);
      height: var(--ik-hit-target);
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-inline-start: auto;
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
    .icon-pill .count {
      position: absolute;
      top: -4px;
      inset-inline-end: -4px;
      background: var(--primary-color);
      color: var(--text-primary-color);
    }
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
    .priority-filter {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 8px;
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .priority-filter select {
      padding: 5px 10px;
      border-radius: var(--ik-radius-field);
      border: 1px solid var(--divider-color);
      background: var(--ik-field-fill);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
    }
    .list-scroll {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding-bottom: 32px;
    }
    /* Room for the floating Add task button under the last row */
    :host([narrow]) .list-scroll { padding-bottom: 88px; }
    :host([narrow]) .groups { gap: 18px; }
    :host([narrow]) .group { padding: 0 4px; }
    .groups {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .group-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      padding: 0 4px 10px;
      font-size: var(--ik-group-header-size);
      font-weight: var(--ik-group-header-weight);
      letter-spacing: var(--ik-group-header-spacing);
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .group-header .count { color: var(--secondary-text-color); }
    .group-header.overdue { color: var(--ik-error-text); }
    .group-header.today { color: var(--ik-warning-text); }
    .group {
      padding: 4px 8px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-card);
      background: var(--ik-surface);
    }
    .group ik-task-card + ik-task-card { border-top: 1px solid var(--divider-color); }
    ik-task-card { transition: opacity 0.2s ease; }
    ik-task-card.leaving { opacity: 0.5; }
    .empty {
      padding: 40px 24px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .all-clear {
      text-align: center;
      padding: 48px 24px 40px;
    }
    .all-clear-emoji {
      font-size: 64px;
      line-height: 1;
      margin-bottom: 16px;
    }
    .all-clear-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin: 0 0 8px;
    }
    .all-clear-sub {
      font-size: 14px;
      color: var(--secondary-text-color);
      margin: 0 0 20px;
    }
    .all-clear-suggestion {
      display: inline-block;
      padding: 10px 20px;
      border-radius: 12px;
      background: var(--ik-primary-fill);
      color: var(--primary-color);
      font-size: 14px;
      font-weight: 500;
    }
  `;

  private async _loadRegistries() {
    try {
      const [areas, devices] = await Promise.all([
        this.hass.connection.sendMessagePromise<AreaRegistryEntry[]>({ type: "config/area_registry/list" }),
        this.hass.connection.sendMessagePromise<DeviceRegistryEntry[]>({ type: "config/device_registry/list" }),
      ]);
      this._areas = areas.sort((left, right) => left.name.localeCompare(right.name));
      this._devices = devices.sort((left, right) => this._getDeviceLabel(left).localeCompare(this._getDeviceLabel(right)));
    } catch (error) {
      console.error("[IntelliKeep] Failed to load registries for task filters:", error);
    }
  }

  private _onFilterChanged(e: CustomEvent) {
    const { selectedAreaIds, selectedDeviceIds, filterMode } = e.detail;
    this._selectedAreaIds = selectedAreaIds;
    this._selectedDeviceIds = selectedDeviceIds;
    this._filterMode = filterMode;
    localStorage.setItem(FILTER_MODE_STORAGE_KEY, filterMode);
    localStorage.setItem(FILTER_AREAS_STORAGE_KEY, JSON.stringify(selectedAreaIds));
    localStorage.setItem(FILTER_DEVICES_STORAGE_KEY, JSON.stringify(selectedDeviceIds));
  }

  private _getDeviceLabel(device: DeviceRegistryEntry): string {
    return device.name_by_user || device.name;
  }

  private _matchesLinkedFilters(task: Task): boolean {
    if (this._selectedAreaIds.length === 0 && this._selectedDeviceIds.length === 0) {
      return true;
    }

    const taskAreaIds = new Set(
      task.linked_entity_ids.filter((value) => value.startsWith("area:")).map((value) => value.slice(5))
    );
    const taskDeviceIds = new Set(
      task.linked_entity_ids.filter((value) => value.startsWith("device:")).map((value) => value.slice(7))
    );

    const matchesArea = this._selectedAreaIds.length === 0
      ? null
      : this._selectedAreaIds.some((areaId) => {
          if (taskAreaIds.has(areaId)) {
            return true;
          }
          return [...taskDeviceIds].some((deviceId) => {
            const device = this._devices.find((entry) => entry.id === deviceId);
            return device?.area_id === areaId;
          });
        });

    const matchesDevice = this._selectedDeviceIds.length === 0
      ? null
      : this._selectedDeviceIds.some((deviceId) => taskDeviceIds.has(deviceId));

    if (matchesArea === null) {
      return Boolean(matchesDevice);
    }
    if (matchesDevice === null) {
      return matchesArea;
    }
    return this._filterMode === "and" ? matchesArea && matchesDevice : matchesArea || matchesDevice;
  }

  /** Area a task belongs to for grouping: a linked area, or the area of a linked device (first by name). */
  private _areaOf(task: Task): string | null {
    const areaName = (areaId: string | null | undefined) => this._areas.find((a) => a.area_id === areaId)?.name;
    const names = task.linked_entity_ids
      .map((link) => link.startsWith("area:")
        ? areaName(link.slice(5))
        : link.startsWith("device:")
        ? areaName(this._devices.find((d) => d.id === link.slice(7))?.area_id)
        : undefined)
      .filter((name): name is string => Boolean(name))
      .sort((a, b) => a.localeCompare(b));
    return names[0] ?? null;
  }

  private get _relaxSuggestion(): string {
    const tr = t(this.hass?.language);
    const d = new Date();
    const idx = (d.getDate() + d.getMonth()) % tr.relaxSuggestions.length;
    return tr.relaxSuggestions[idx];
  }

  private _setMode(mode: ListMode) {
    this._mode = mode;
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  }

  private _setGroupBy(groupBy: string) {
    if (!GROUP_BYS.includes(groupBy as GroupBy)) return;
    this._groupBy = groupBy as GroupBy;
    localStorage.setItem(GROUP_BY_STORAGE_KEY, groupBy);
  }

  private _searchChanged(query: string) {
    this.dispatchEvent(new CustomEvent<string>("search-changed", { detail: query, bubbles: true, composed: true }));
  }

  private _setBusy(taskId: string, busy: boolean) {
    const next = new Set(this._busy);
    if (busy) next.add(taskId);
    else next.delete(taskId);
    this._busy = next;
  }

  private _openTask(request: OpenTaskRequest) {
    this.dispatchEvent(new CustomEvent<OpenTaskRequest>("open-task", { detail: request, bubbles: true, composed: true }));
  }

  /** A completion can be taken back only while it is the task's latest and the task is still done. */
  private _canReopen(row: Row): boolean {
    const { task, completion } = row;
    return completion !== null && task.status === "completed"
      && task.executions[task.executions.length - 1]?.execution_id === completion.execution_id;
  }

  private _toggle(row: Row) {
    if (row.completion === null) void this._complete(row.task);
    else if (this._canReopen(row)) void this._reopen(row.task);
  }

  private async _complete(task: Task) {
    const tr = t(this.hass.language);
    this._setBusy(task.task_id, true);
    try {
      await completeTask(this.hass, task.task_id, this.hass.user?.name ?? "");
      showToast(this, tr.taskCompleted, { text: tr.undoAction, action: () => void this._reopen(task) }, 8000);
    } catch (err) {
      console.error("[IntelliKeep] complete_task failed:", err);
      showToast(this, tr.actionFailed(errorText(err)));
    } finally {
      this._setBusy(task.task_id, false);
    }
  }

  private async _reopen(task: Task) {
    const tr = t(this.hass.language);
    this._setBusy(task.task_id, true);
    try {
      await reopenTask(this.hass, task.task_id, this.hass.user?.name ?? "");
    } catch (err) {
      console.error("[IntelliKeep] reopen_task failed:", err);
      showToast(this, tr.actionFailed(errorText(err)));
    } finally {
      this._setBusy(task.task_id, false);
    }
  }

  private async _confirmDelete(confirmed: boolean) {
    const task = this._deleteTarget;
    this._deleteTarget = null;
    if (!confirmed || !task) return;
    this._setBusy(task.task_id, true);
    try {
      await deleteTask(this.hass, task.task_id);
    } catch (err) {
      console.error("[IntelliKeep] delete_task failed:", err);
      showToast(this, t(this.hass.language).actionFailed(errorText(err)));
    } finally {
      this._setBusy(task.task_id, false);
    }
  }

  private _onMenuAction(task: Task, action: string) {
    if (action === "edit") this._openTask({ taskId: task.task_id });
    else if (action === "duplicate") this._openTask({ taskId: null, template: task });
    else if (action === "history") this._openTask({ taskId: task.task_id, tab: "history" });
    else if (action === "delete") this._deleteTarget = task;
  }

  private _groups(rows: Row[], tr: Translations): Group[] {
    const priorityRank = (row: Row) => PRIORITIES.indexOf(row.task.priority);
    const dueTime = (row: Row) => (row.task.due_date ? Date.parse(row.task.due_date) : Infinity);
    // Open: by due date, then most important first. Completed: most recent first.
    const compare = this._mode === "open"
      ? (a: Row, b: Row) => dueTime(a) - dueTime(b) || priorityRank(a) - priorityRank(b) || a.task.task_number - b.task.task_number
      : (a: Row, b: Row) => Date.parse(b.completion!.completed_at) - Date.parse(a.completion!.completed_at);

    let groups: Group[];
    let groupOf: (row: Row) => string;
    if (this._groupBy === "priority") {
      groups = PRIORITIES.map((p) => ({ key: p, label: tr[p], rows: [] }));
      groupOf = (row) => row.task.priority;
    } else if (this._groupBy === "area") {
      const names = [...new Set(rows.map((row) => this._areaOf(row.task)).filter((n): n is string => n !== null))];
      groups = [
        ...names.sort((a, b) => a.localeCompare(b)).map((name) => ({ key: `area:${name}`, label: name, rows: [] })),
        { key: "no-area", label: tr.groupNoArea, rows: [] },
      ];
      groupOf = (row) => {
        const name = this._areaOf(row.task);
        return name === null ? "no-area" : `area:${name}`;
      };
    } else if (this._groupBy === "due" && this._mode === "open") {
      const nextWeek = daysUntilNextWeek(this.hass);
      groups = [
        { key: "overdue", label: tr.groupOverdue, tone: "overdue", rows: [] },
        { key: "today", label: tr.groupToday, tone: "today", rows: [] },
        { key: "week", label: tr.groupThisWeek, rows: [] },
        { key: "later", label: tr.groupLater, rows: [] },
        { key: "none", label: tr.noDueDate, rows: [] },
      ];
      groupOf = ({ task }) => {
        if (!task.due_date) return "none";
        const urgency = urgencyOf(task, this.hass);
        if (urgency) return urgency;
        return daysUntil(new Date(task.due_date), this.hass) < nextWeek ? "week" : "later";
      };
    } else {
      // No grouping; completion records have no due-date groups either
      groups = [{ key: "all", label: null, rows: [] }];
      groupOf = () => "all";
    }

    const byKey = new Map(groups.map((group) => [group.key, group]));
    for (const row of rows) byKey.get(groupOf(row))?.rows.push(row);
    return groups.filter((group) => group.rows.length > 0).map((group) => ({ ...group, rows: group.rows.sort(compare) }));
  }

  private _renderGroup(group: Group) {
    return html`
      <section>
        ${group.label !== null ? html`
          <h2 class="group-header ${group.tone ?? ""}">${group.label}<span class="count">${group.rows.length}</span></h2>
        ` : nothing}
        <div class="group">
          ${repeat(group.rows, (row) => row.completion?.execution_id ?? row.task.task_id, (row) => html`
            <ik-task-card
              class=${this._busy.has(row.task.task_id) ? "leaving" : ""}
              .task=${row.task}
              .hass=${this.hass}
              .completion=${row.completion}
              .busy=${this._busy.has(row.task.task_id)}
              .canReopen=${this._canReopen(row)}
              .narrow=${this.narrow}
              .timeOnly=${group.key === "today"}
              @task-toggle=${() => this._toggle(row)}
              @task-open=${() => this._openTask({ taskId: row.task.task_id })}
              @menu-select=${(e: CustomEvent<string>) => this._onMenuAction(row.task, e.detail)}
            ></ik-task-card>
          `)}
        </div>
      </section>
    `;
  }

  render() {
    const tr = t(this.hass?.language);
    const q = this.searchQuery.trim().toLowerCase();
    const matches = (task: Task) =>
      (!q || task.name.toLowerCase().includes(q) || (task.description ?? "").toLowerCase().includes(q)
        || (task.task_number ? String(task.task_number).padStart(3, "0").includes(q) : false))
      && (this._filterPriority === "all" || task.priority === this._filterPriority)
      && this._matchesLinkedFilters(task);

    const since = Date.now() - COMPLETED_WINDOW_DAYS * 86400000;
    const recent = (ex: TaskExecution) => Date.parse(ex.completed_at) >= since;
    const openTasks = this.tasks.filter((task) => task.status !== "completed");
    const completedCount = this.tasks.reduce((n, task) => n + (task.executions ?? []).filter(recent).length, 0);

    const rows: Row[] = this._mode === "open"
      ? openTasks.filter(matches).map((task) => ({ task, completion: null }))
      : this.tasks.filter(matches).flatMap((task) =>
          (task.executions ?? []).filter(recent).map((completion) => ({ task, completion })));

    const activeFilterCount = this._selectedAreaIds.length + this._selectedDeviceIds.length + (this._filterPriority !== "all" ? 1 : 0);
    const groupByLabel: Record<GroupBy, string> = {
      due: tr.groupByDue,
      priority: tr.priority,
      area: tr.groupByArea,
      none: tr.groupByNone,
    };
    const groupByItems: MenuItem[] = GROUP_BYS.map((g) => ({ action: g, label: groupByLabel[g], selected: g === this._groupBy }));

    const segment = (mode: ListMode, label: string, count: number) => html`
      <button class="segment" aria-pressed=${this._mode === mode ? "true" : "false"} @click=${() => this._setMode(mode)}>
        ${label}<span class="count">${count}</span>
      </button>
    `;

    let content;
    if (this._mode === "open" && openTasks.length === 0) {
      content = html`
        <div class="all-clear">
          <div class="all-clear-emoji">🎉</div>
          <p class="all-clear-title">${tr.allClear}</p>
          <p class="all-clear-sub">${tr.allClearSub}</p>
          <span class="all-clear-suggestion">${this._relaxSuggestion}</span>
        </div>`;
    } else if (this._mode === "completed" && completedCount === 0) {
      content = html`<div class="empty">${tr.noCompletedRecently}</div>`;
    } else if (rows.length === 0) {
      content = html`<div class="empty">${tr.noTasks}</div>`;
    } else {
      content = this._groups(rows, tr).map((group) => this._renderGroup(group));
    }

    return html`
      <div class="toolbar">
        <div class="segmented" role="group" aria-label=${tr.listModeLabel}>
          ${segment("open", tr.listOpen, openTasks.length)}
          ${segment("completed", tr.listCompleted, completedCount)}
        </div>
        ${this.narrow ? html`
          <button
            class="icon-pill"
            aria-label=${tr.filters}
            title=${tr.filters}
            aria-expanded=${this._showFilters ? "true" : "false"}
            @click=${() => { this._showFilters = !this._showFilters; }}
          >
            <ha-icon icon="mdi:filter-variant"></ha-icon>
            ${activeFilterCount ? html`<span class="count">${activeFilterCount}</span>` : nothing}
          </button>
        ` : html`
          <label class="search">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input
              type="search"
              .value=${this.searchQuery}
              placeholder=${tr.searchPlaceholder}
              aria-label=${tr.searchPlaceholder}
              @input=${(e: Event) => this._searchChanged((e.target as HTMLInputElement).value)}
            />
          </label>
          <button
            class="pill"
            aria-expanded=${this._showFilters ? "true" : "false"}
            @click=${() => { this._showFilters = !this._showFilters; }}
          >
            <ha-icon icon="mdi:filter-variant"></ha-icon>${tr.filters}
            ${activeFilterCount ? html`<span class="count">${activeFilterCount}</span>` : nothing}
          </button>
          <ik-menu
            pill
            .label=${`${tr.groupBy}: ${groupByLabel[this._groupBy]}`}
            .items=${groupByItems}
            @menu-select=${(e: CustomEvent<string>) => this._setGroupBy(e.detail)}
          ></ik-menu>
          <button class="add" @click=${() => this._openTask({ taskId: null })}>
            <ha-icon icon="mdi:plus"></ha-icon>${tr.addTask}
          </button>
        `}
      </div>
      <div class="filters">
        ${this._showFilters && this.narrow ? html`
          <label class="priority-filter">
            ${tr.groupBy}
            <select .value=${this._groupBy} @change=${(e: Event) => this._setGroupBy((e.target as HTMLSelectElement).value)}>
              ${GROUP_BYS.map((g) => html`<option value=${g} ?selected=${g === this._groupBy}>${groupByLabel[g]}</option>`)}
            </select>
          </label>
        ` : nothing}
        ${this._showFilters ? html`
          <label class="priority-filter">
            ${tr.priority}
            <select .value=${this._filterPriority} @change=${(e: Event) => { this._filterPriority = (e.target as HTMLSelectElement).value as TaskPriority | "all"; }}>
              <option value="all">${tr.allPriorities}</option>
              ${PRIORITIES.map((p) => html`<option value=${p}>${tr[p]}</option>`)}
            </select>
          </label>
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
      <div class="list-scroll">
        <div class="groups">${content}</div>
      </div>
      ${this.narrow ? html`
        <button class="fab" @click=${() => this._openTask({ taskId: null })}>
          <ha-icon icon="mdi:plus"></ha-icon>${tr.addTask}
        </button>
      ` : nothing}
      <ik-confirm-dialog
        heading=${tr.deleteHeading}
        confirmText=${tr.deleteAction}
        cancelText=${tr.cancel}
        .open=${this._deleteTarget !== null}
        @dialog-closed=${(e: CustomEvent) => this._confirmDelete(e.detail.confirmed)}
      >
        ${tr.deleteBody}
      </ik-confirm-dialog>
    `;
  }
}
