import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, Task, TaskPriority } from "../types";
import { t } from "../translations";
import { isDesktop } from "../utils";
import "../components/link-filter";

type CalMode = "week" | "month";

type AreaRegistryEntry = { area_id: string; name: string };
type DeviceRegistryEntry = { id: string; area_id: string | null; name_by_user: string | null; name: string };

// Shared with task-list-view so area/device filters persist across views
const FILTER_AREAS_KEY  = "intellikeep.filterAreas";
const FILTER_DEVICES_KEY = "intellikeep.filterDevices";
const FILTER_MODE_KEY   = "intellikeep.filterMode";

const PRIORITY_COLOR: Record<string, string> = {
  low:      "var(--success-color, #4caf50)",
  medium:   "var(--warning-color, #ff9800)",
  high:     "var(--error-color, #f44336)",
  critical: "#9c27b0",
};

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

function startOfWeek(d: Date): Date {
  const day = d.getDay(); // 0 = Sun, ISO week starts Monday
  return addDays(d, day === 0 ? -6 : 1 - day);
}

function loadStoredList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

@customElement("ik-calendar-view")
export class IkCalendarView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) tasks: Task[] = [];

  @state() private _mode: CalMode = (() => {
    const s = localStorage.getItem("intellikeep.calendar.mode");
    return s === "week" ? "week" : "month";
  })();

  @state() private _refDate: Date = (() => {
    const s = localStorage.getItem("intellikeep.calendar.refDate");
    if (s) {
      const [y, m, d] = s.split("-").map(Number);
      if (y && m && d) return new Date(y, m - 1, d);
    }
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  })();

  // ── Filters ──────────────────────────────────────────────────────────────
  @state() private _showFilters = false;
  @state() private _filterPriority: TaskPriority | "all" = (() => {
    const s = localStorage.getItem("intellikeep.calendar.filterPriority");
    return (s === "critical" || s === "high" || s === "medium" || s === "low") ? s : "all";
  })();
  @state() private _filterMode: "or" | "and" =
    (localStorage.getItem(FILTER_MODE_KEY) as "or" | "and") ?? "or";
  @state() private _selectedAreaIds: string[] = loadStoredList(FILTER_AREAS_KEY);
  @state() private _selectedDeviceIds: string[] = loadStoredList(FILTER_DEVICES_KEY);
  @state() private _areas: AreaRegistryEntry[] = [];
  @state() private _devices: DeviceRegistryEntry[] = [];

  // ─────────────────────────────────────────────────────────────────────────

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    /* ── Toolbar ── */
    .cal-toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px 8px;
      flex-shrink: 0;
      flex-wrap: wrap;
    }

    .mode-group {
      display: flex;
      background: var(--secondary-background-color);
      border-radius: 8px;
      padding: 2px;
      gap: 2px;
    }

    .mode-btn {
      background: none;
      border: none;
      padding: 5px 14px;
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
      color: var(--secondary-text-color);
      font-weight: 500;
      transition: background 0.15s, color 0.15s;
    }
    .mode-btn.active {
      background: var(--card-background-color);
      color: var(--primary-color);
      box-shadow: 0 1px 3px rgba(0,0,0,.15);
    }

    .nav-group {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .nav-btn {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      width: 32px;
      height: 32px;
      cursor: pointer;
      color: var(--primary-text-color);
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }
    .nav-btn:hover { background: var(--secondary-background-color); }

    .today-btn {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 5px 12px;
      height: 32px;
      cursor: pointer;
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 500;
    }
    .today-btn:hover { background: var(--secondary-background-color); }

    .period-label {
      font-size: 15px;
      font-weight: 500;
      color: var(--primary-text-color);
      margin-left: 4px;
      text-transform: capitalize;
      flex: 1;
    }

    .filter-btn {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      width: 32px;
      height: 32px;
      cursor: pointer;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      flex-shrink: 0;
    }
    .filter-btn:hover { background: var(--secondary-background-color); }
    .filter-btn.active, .filter-btn.has-filters { color: var(--primary-color); border-color: var(--primary-color); }

    .filter-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: var(--primary-color);
      color: #fff;
      font-size: 9px;
      font-weight: 700;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    /* ── Filter panel ── */
    .filter-panel {
      padding: 0 20px 10px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .priority-select {
      height: 30px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 12px;
      padding: 0 8px;
      cursor: pointer;
    }

    /* ── Scrollable body ── */
    .cal-body {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 4px 20px 20px;
      display: flex;
      flex-direction: column;
    }

    /* ── Month grid ── */
    .month-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
      background: var(--divider-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      overflow: hidden;
      flex: 1;
    }

    .weekday-header {
      background: var(--secondary-background-color);
      text-align: center;
      padding: 8px 4px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--secondary-text-color);
    }

    .month-cell {
      background: var(--card-background-color);
      min-height: 70px;
      padding: 5px 4px;
      overflow: hidden;
    }
    .month-cell.other-month { background: var(--primary-background-color); }

    .day-num {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      margin-bottom: 4px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .month-cell.today .day-num {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }

    .month-task-pill {
      font-size: 10px;
      padding: 1px 4px;
      border-radius: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      color: #fff;
      font-weight: 500;
      line-height: 1.6;
      margin-bottom: 2px;
      display: block;
    }
    .month-task-pill:hover { opacity: 0.82; }
    .month-task-pill.completed { opacity: 0.45; text-decoration: line-through; }

    .more-tasks {
      font-size: 10px;
      color: var(--secondary-text-color);
      padding: 0 2px;
      font-weight: 500;
    }

    /* ── Week grid ── */
    .week-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-template-rows: auto 1fr;
      gap: 1px;
      background: var(--divider-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      overflow: hidden;
      flex: 1;
      min-height: calc(56px + 200px);
    }

    .week-day-header {
      background: var(--secondary-background-color);
      text-align: center;
      padding: 6px 4px;
    }
    .wdh-name {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--secondary-text-color);
    }
    .wdh-num {
      font-size: 18px;
      font-weight: 700;
      color: var(--primary-text-color);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 2px auto 0;
    }
    .week-day-header.today .wdh-num {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }

    .week-col {
      background: var(--card-background-color);
      padding: 6px 4px;
      overflow-y: auto;
    }
    .week-col.today { background: var(--secondary-background-color); }

    .week-task-pill {
      font-size: 11px;
      padding: 3px 6px;
      border-radius: 4px;
      margin-bottom: 3px;
      cursor: pointer;
      color: #fff;
      font-weight: 500;
      line-height: 1.4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
    }
    .week-task-pill:hover { opacity: 0.82; }
    .week-task-pill.completed { opacity: 0.45; text-decoration: line-through; }
  `;

  override connectedCallback() {
    super.connectedCallback();
    void this._loadRegistries();
  }

  override updated(changed: Map<PropertyKey, unknown>) {
    if (changed.has("_refDate")) {
      localStorage.setItem("intellikeep.calendar.refDate", isoDate(this._refDate));
    }
    if (changed.has("_mode")) {
      localStorage.setItem("intellikeep.calendar.mode", this._mode);
    }
    if (changed.has("_filterPriority")) {
      localStorage.setItem("intellikeep.calendar.filterPriority", this._filterPriority);
    }
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
    localStorage.setItem(FILTER_MODE_KEY, filterMode);
    localStorage.setItem(FILTER_AREAS_KEY, JSON.stringify(selectedAreaIds));
    localStorage.setItem(FILTER_DEVICES_KEY, JSON.stringify(selectedDeviceIds));
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

  private _filteredTaskMap(): Map<string, Task[]> {
    const map = new Map<string, Task[]>();
    for (const task of this.tasks) {
      if (!task.due_date) continue;
      if (this._filterPriority !== "all" && task.priority !== this._filterPriority) continue;
      if (!this._matchesLinkedFilters(task)) continue;
      const key = task.due_date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(task);
    }
    return map;
  }

  private get _today(): Date {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  private _openTask(taskId: string) {
    if (isDesktop()) {
      this.dispatchEvent(new CustomEvent("open-task-modal", { detail: taskId, bubbles: true, composed: true }));
    } else {
      this.dispatchEvent(new CustomEvent("navigate", { detail: `/edit/${taskId}`, bubbles: true, composed: true }));
    }
  }

  private _navigate(delta: number) {
    const d = new Date(this._refDate);
    if (this._mode === "week") d.setDate(d.getDate() + delta * 7);
    else d.setMonth(d.getMonth() + delta);
    this._refDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  private _periodLabel(): string {
    const lang = this.hass?.language ?? "en";
    if (this._mode === "month") {
      return this._refDate.toLocaleDateString(lang, { month: "long", year: "numeric" });
    }
    const ws = startOfWeek(this._refDate);
    const we = addDays(ws, 6);
    const wsStr = ws.toLocaleDateString(lang, { day: "numeric", month: "short" });
    const weStr = we.toLocaleDateString(lang, { day: "numeric", month: "short", year: "numeric" });
    return `${wsStr} – ${weStr}`;
  }

  private _taskColor(task: Task): string {
    if (task.status === "completed") return "var(--secondary-text-color)";
    return PRIORITY_COLOR[task.priority] ?? "var(--secondary-text-color)";
  }

  private _renderMonthView(taskMap: Map<string, Task[]>) {
    const lang = this.hass?.language ?? "en";
    const today = this._today;
    const firstDay = new Date(this._refDate.getFullYear(), this._refDate.getMonth(), 1);
    const lastDay = new Date(this._refDate.getFullYear(), this._refDate.getMonth() + 1, 0);
    const gridStart = startOfWeek(firstDay);
    const gridEnd = addDays(startOfWeek(lastDay), 6);

    const days: Date[] = [];
    let cur = gridStart;
    while (cur <= gridEnd) { days.push(cur); cur = addDays(cur, 1); }

    const weekdays = Array.from({ length: 7 }, (_, i) =>
      addDays(gridStart, i).toLocaleDateString(lang, { weekday: "short" })
    );
    const weekRows = days.length / 7;
    const gridStyle = `grid-template-rows: auto repeat(${weekRows}, 1fr); min-height: calc(33px + ${weekRows} * 70px)`;

    return html`
      <div class="month-grid" style="${gridStyle}">
        ${weekdays.map(w => html`<div class="weekday-header">${w}</div>`)}
        ${days.map(d => {
          const key = isoDate(d);
          const dayTasks = (taskMap.get(key) ?? []).sort((a, b) => {
            const aU = a.status === "due" || a.status === "overdue";
            const bU = b.status === "due" || b.status === "overdue";
            if (aU && !bU) return -1; if (!aU && bU) return 1; return 0;
          });
          const isToday = sameDay(d, today);
          const isOtherMonth = d.getMonth() !== this._refDate.getMonth();
          const shown = dayTasks.slice(0, 3);
          const overflow = dayTasks.length - 3;
          return html`
            <div class="month-cell ${isToday ? "today" : ""} ${isOtherMonth ? "other-month" : ""}">
              <div class="day-num">${d.getDate()}</div>
              ${shown.map(task => html`
                <div
                  class="month-task-pill ${task.status === "completed" ? "completed" : ""}"
                  style="background:${this._taskColor(task)}"
                  title="${task.name}"
                  @click=${() => this._openTask(task.task_id)}
                >${task.name}</div>
              `)}
              ${overflow > 0 ? html`<div class="more-tasks">+${overflow}</div>` : ""}
            </div>
          `;
        })}
      </div>
    `;
  }

  private _renderWeekView(taskMap: Map<string, Task[]>) {
    const lang = this.hass?.language ?? "en";
    const today = this._today;
    const ws = startOfWeek(this._refDate);
    const days = Array.from({ length: 7 }, (_, i) => addDays(ws, i));

    return html`
      <div class="week-grid">
        ${days.map(d => {
          const isToday = sameDay(d, today);
          return html`
            <div class="week-day-header ${isToday ? "today" : ""}">
              <div class="wdh-name">${d.toLocaleDateString(lang, { weekday: "short" })}</div>
              <div class="wdh-num">${d.getDate()}</div>
            </div>
          `;
        })}
        ${days.map(d => {
          const key = isoDate(d);
          const dayTasks = taskMap.get(key) ?? [];
          const isToday = sameDay(d, today);
          return html`
            <div class="week-col ${isToday ? "today" : ""}">
              ${dayTasks.map(task => html`
                <div
                  class="week-task-pill ${task.status === "completed" ? "completed" : ""}"
                  style="background:${this._taskColor(task)}"
                  title="${task.name}"
                  @click=${() => this._openTask(task.task_id)}
                >${task.name}</div>
              `)}
            </div>
          `;
        })}
      </div>
    `;
  }

  render() {
    const tr = t(this.hass?.language);
    const taskMap = this._filteredTaskMap();

    const activeFilterCount =
      this._selectedAreaIds.length +
      this._selectedDeviceIds.length +
      (this._filterPriority !== "all" ? 1 : 0);
    const hasFilters = activeFilterCount > 0;

    return html`
      <div class="cal-toolbar">
        <div class="mode-group">
          <button class="mode-btn ${this._mode === "week" ? "active" : ""}" @click=${() => { this._mode = "week"; }}>${tr.calendarWeek}</button>
          <button class="mode-btn ${this._mode === "month" ? "active" : ""}" @click=${() => { this._mode = "month"; }}>${tr.calendarMonth}</button>
        </div>
        <div class="nav-group">
          <button class="nav-btn" title="Previous" @click=${() => this._navigate(-1)}>‹</button>
          <button class="today-btn" @click=${() => { this._refDate = this._today; }}>${tr.calendarToday}</button>
          <button class="nav-btn" title="Next" @click=${() => this._navigate(1)}>›</button>
        </div>
        <span class="period-label">${this._periodLabel()}</span>
        <button
          class="filter-btn ${this._showFilters ? "active" : ""} ${hasFilters ? "has-filters" : ""}"
          title=${tr.filterToggleTitle}
          @click=${() => { this._showFilters = !this._showFilters; }}
        >
          <ha-icon icon="mdi:filter" style="--mdc-icon-size:18px"></ha-icon>
          ${hasFilters ? html`<span class="filter-badge">${activeFilterCount}</span>` : ""}
        </button>
      </div>

      ${this._showFilters ? html`
        <div class="filter-panel">
          <ik-link-filter
            .hass=${this.hass}
            .areas=${this._areas}
            .devices=${this._devices}
            .selectedAreaIds=${this._selectedAreaIds}
            .selectedDeviceIds=${this._selectedDeviceIds}
            .filterMode=${this._filterMode}
            ?open=${true}
            @filter-changed=${(e: CustomEvent) => this._onFilterChanged(e)}
          ></ik-link-filter>
          <select
            class="priority-select"
            .value=${this._filterPriority}
            @change=${(e: Event) => { this._filterPriority = (e.target as HTMLSelectElement).value as TaskPriority | "all"; }}
          >
            <option value="all">${tr.allPriorities}</option>
            <option value="critical">${tr.critical}</option>
            <option value="high">${tr.high}</option>
            <option value="medium">${tr.medium}</option>
            <option value="low">${tr.low}</option>
          </select>
        </div>
      ` : ""}

      <div class="cal-body">
        ${this._mode === "month"
          ? this._renderMonthView(taskMap)
          : this._renderWeekView(taskMap)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ik-calendar-view": IkCalendarView;
  }
}
