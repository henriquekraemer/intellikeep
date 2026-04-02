import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, Task, TaskPriority } from "../types";
import { completeTask, reopenTask, deleteTask } from "../api";
import { t } from "../translations";
import "../components/task-card";
import "../components/confirm-dialog";

@customElement("ik-task-list-view")
export class IkTaskListView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) tasks: Task[] = [];
  @property({ type: Boolean }) enableAnimations = true;

  @state() private _filterTab: "pending" | "completed" = "pending";
  @state() private _filterPriority: TaskPriority | "all" = "all";
  @state() private _searchQuery = "";
  @state() private _upcomingRange: "all" | "week" | "2weeks" | "30" | "90" | "year" | "custom" =
    (localStorage.getItem("intellikeep.upcomingRange") as "all" | "week" | "2weeks" | "30" | "90" | "year" | "custom") ?? "all";
  @state() private _upcomingCustomFrom = localStorage.getItem("intellikeep.upcomingCustomFrom") ?? "";
  @state() private _upcomingCustomTo = localStorage.getItem("intellikeep.upcomingCustomTo") ?? "";

  connectedCallback() {
    super.connectedCallback();
    const saved = localStorage.getItem("intellikeep.filterTab");
    if (saved === "pending" || saved === "completed") {
      this._filterTab = saved;
    }
  }
  @state() private _deleteTarget: string | null = null;
  @state() private _completing: Set<string> = new Set();
  @state() private _reopening: Set<string> = new Set();
  @state() private _page = 0;
  @state() private _pageSize: 25 | 50 | 100 = 25;
  @state() private _exitingDone: Set<string> = new Set();
  @state() private _exitingDelete: Set<string> = new Set();
  @state() private _exitingUndo: Set<string> = new Set();
  @state() private _exitingEdit: Set<string> = new Set();

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: var(--ik-padding, 20px);
      box-sizing: border-box;
    }
    .filter-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 0 16px;
      flex-wrap: wrap;
    }
    .filter-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 13px;
      border-radius: 8px;
      border: 1.5px solid var(--divider-color);
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
      white-space: nowrap;
    }
    .filter-chip:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .filter-chip.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .filter-chip.active.chip-overdue {
      background: var(--error-color, #f44336);
      border-color: var(--error-color, #f44336);
    }
    .filter-chip.active.chip-completed {
      background: var(--success-color, #4caf50);
      border-color: var(--success-color, #4caf50);
    }
    .chip-badge {
      display: inline-block;
      background: rgba(0,0,0,0.15);
      border-radius: 10px;
      padding: 0 5px;
      font-size: 11px;
      min-width: 16px;
      text-align: center;
      line-height: 16px;
    }
    .filter-chip:not(.active) .chip-badge {
      background: var(--divider-color);
      color: var(--primary-text-color);
    }
    .priority-select {
      padding: 5px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .search-wrapper {
      position: relative;
      flex: 1;
      min-width: 160px;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 8px;
      color: var(--secondary-text-color);
      --mdc-icon-size: 16px;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 5px 10px 5px 30px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
      font-family: inherit;
      box-sizing: border-box;
    }
    .search-input::placeholder { color: var(--secondary-text-color); }

    .full-card { flex: 1; min-height: 0; overflow-y: auto; }
    .sections-scroll {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-bottom: 8px;
    }
    .section-header {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: var(--secondary-text-color);
      padding: 0 2px 8px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .section-header.urgent {
      color: var(--error-color, #f44336);
    }
    .upcoming-filter {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 0 10px;
      flex-wrap: wrap;
    }
    .upcoming-chip {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 6px;
      border: 1.5px solid var(--divider-color);
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
    }
    .upcoming-chip:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .upcoming-chip.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .custom-range {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      padding: 0 0 10px;
    }
    .custom-range input[type="date"] {
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 12px;
      font-family: inherit;
    }
    .custom-range span {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .empty {
      text-align: center;
      padding: 40px 24px;
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
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
      color: var(--primary-color);
      font-size: 14px;
      font-weight: 500;
    }
    .task-actions {
      display: flex;
      gap: 6px;
      justify-content: flex-end;
      align-items: center;
    }
    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: filter 0.15s, opacity 0.15s;
      --mdc-icon-size: 18px;
      color: #fff;
    }
    .icon-btn:hover { filter: brightness(1.15); }
    .icon-btn:disabled { opacity: 0.4; cursor: default; }
    .icon-btn.primary { background: var(--primary-color); }
    .icon-btn.undo    { background: var(--warning-color, #ff9800); }
    .icon-btn.edit    { background: var(--secondary-text-color, #757575); }
    .icon-btn.danger  { background: var(--error-color, #f44336); }
    .task-divider {
      border: none;
      border-top: 1px solid var(--divider-color);
      margin: 0;
    }
    .pagination {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      padding: 12px 0 0;
      flex-wrap: wrap;
    }
    .pagination select {
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .pagination span {
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .page-btn {
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 13px;
    }
    .page-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }
    @keyframes ik-done-exit {
      0%   { transform: translateX(0);    opacity: 1; background: transparent; }
      15%  { background: color-mix(in srgb, var(--primary-color) 18%, transparent); }
      100% { transform: translateX(56px); opacity: 0; background: transparent; }
    }
    @keyframes ik-delete-exit {
      0%   { transform: translateX(0);     opacity: 1; background: transparent; }
      15%  { background: rgba(244, 67, 54, 0.15); }
      100% { transform: translateX(-56px); opacity: 0; background: transparent; }
    }
    .task-wrapper { overflow: hidden; }
    .list-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px;
    }
    .list-item {
      border: 1.5px solid var(--divider-color);
      border-radius: 10px;
      overflow: hidden;
      background: var(--card-background-color);
    }
    .task-wrapper.exiting-done {
      animation: ik-done-exit 0.38s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      pointer-events: none;
    }
    .task-wrapper.exiting-delete {
      animation: ik-delete-exit 0.38s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      pointer-events: none;
    }
    @keyframes ik-undo-exit {
      0%   { transform: translateX(0);     opacity: 1; background: transparent; }
      15%  { background: color-mix(in srgb, var(--warning-color, #ff9800) 22%, transparent); }
      100% { transform: translateX(-56px); opacity: 0; background: transparent; }
    }
    .task-wrapper.exiting-undo {
      animation: ik-undo-exit 0.38s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      pointer-events: none;
    }
    @keyframes ik-edit-pulse {
      0%   { transform: scale(1);    box-shadow: none; }
      40%  { transform: scale(1.012); box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 30%, transparent); }
      100% { transform: scale(1);    box-shadow: none; }
    }
    .task-wrapper.exiting-edit {
      animation: ik-edit-pulse 0.32s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }
  `;

  private _resetPage() {
    this._page = 0;
  }

  private get _relaxSuggestion(): string {
    const tr = t(this.hass?.language);
    const d = new Date();
    const idx = (d.getDate() + d.getMonth()) % tr.relaxSuggestions.length;
    return tr.relaxSuggestions[idx];
  }

  private _navigateTo(path: string) {
    this.dispatchEvent(new CustomEvent("navigate", { detail: path, bubbles: true, composed: true }));
  }

  private async _edit(taskId: string) {
    if (this.enableAnimations) {
      this._exitingEdit = new Set([...this._exitingEdit, taskId]);
      await new Promise((r) => setTimeout(r, 320));
      this._exitingEdit = new Set([...this._exitingEdit].filter((id) => id !== taskId));
    }
    this._navigateTo(`/edit/${taskId}`);
  }

  private async _reopen(taskId: string) {
    this._reopening = new Set([...this._reopening, taskId]);
    if (this.enableAnimations) {
      this._exitingUndo = new Set([...this._exitingUndo, taskId]);
      await new Promise((r) => setTimeout(r, 380));
    }
    try {
      await reopenTask(this.hass, taskId);
    } catch (err) {
      console.error("[IntelliKeep] reopen_task failed:", err);
      alert(`Failed to reopen task: ${err}`);
    } finally {
      this._reopening = new Set([...this._reopening].filter((id) => id !== taskId));
      this._exitingUndo = new Set([...this._exitingUndo].filter((id) => id !== taskId));
    }
  }

  private async _complete(taskId: string) {
    this._completing = new Set([...this._completing, taskId]);
    if (this.enableAnimations) {
      this._exitingDone = new Set([...this._exitingDone, taskId]);
      await new Promise((r) => setTimeout(r, 380));
    }
    try {
      await completeTask(this.hass, taskId);
    } catch (err) {
      console.error("[IntelliKeep] complete_task failed:", err);
      alert(`Failed to complete task: ${err}`);
    } finally {
      this._completing = new Set([...this._completing].filter((id) => id !== taskId));
      this._exitingDone = new Set([...this._exitingDone].filter((id) => id !== taskId));
    }
  }

  private async _confirmDelete(confirmed: boolean) {
    const taskId = this._deleteTarget;
    this._deleteTarget = null;
    if (confirmed && taskId) {
      if (this.enableAnimations) {
        this._exitingDelete = new Set([...this._exitingDelete, taskId]);
        await new Promise((r) => setTimeout(r, 380));
      }
      try {
        await deleteTask(this.hass, taskId);
      } catch (err) {
        console.error("[IntelliKeep] delete_task failed:", err);
        alert(`Failed to delete task: ${err}`);
      } finally {
        this._exitingDelete = new Set([...this._exitingDelete].filter((id) => id !== taskId));
      }
    }
  }

  render() {
    const tr = t(this.hass?.language);
    const q = this._searchQuery.trim().toLowerCase();
    const matchesQ = (task: Task) =>
      !q || task.name.toLowerCase().includes(q) || (task.description ?? "").toLowerCase().includes(q);
    const matchesPr = (task: Task) =>
      this._filterPriority === "all" || task.priority === this._filterPriority;

    const countPending   = this.tasks.filter(t => t.status !== "completed").length;
    const countCompleted = this.tasks.filter(t => t.status === "completed").length;

    const chip = (tab: typeof this._filterTab, label: string, count: number, extra = "") => html`
      <button
        class="filter-chip ${extra} ${this._filterTab === tab ? "active" : ""}"
        @click=${() => { this._filterTab = tab; localStorage.setItem("intellikeep.filterTab", tab); this._resetPage(); }}
      >
        ${label}
        <span class="chip-badge">${count}</span>
      </button>
    `;

    const taskItem = (task: Task) => html`
      <div class="list-item task-wrapper ${this._exitingDone.has(task.task_id) ? "exiting-done" : this._exitingDelete.has(task.task_id) ? "exiting-delete" : this._exitingUndo.has(task.task_id) ? "exiting-undo" : this._exitingEdit.has(task.task_id) ? "exiting-edit" : ""}">
        <ik-task-card .task=${task} .hass=${this.hass}>
          <div class="task-actions" slot="actions">
            ${task.status !== "completed"
              ? html`<button class="icon-btn primary" title=${tr.done} ?disabled=${this._completing.has(task.task_id)} @click=${() => this._complete(task.task_id)}><ha-icon icon="mdi:check"></ha-icon></button>`
              : html`<button class="icon-btn undo" title=${tr.undo} ?disabled=${this._reopening.has(task.task_id)} @click=${() => this._reopen(task.task_id)}><ha-icon icon="mdi:undo"></ha-icon></button>`}
            <button class="icon-btn edit" title=${tr.edit} @click=${() => this._edit(task.task_id)}><ha-icon icon="mdi:pencil"></ha-icon></button>
            <button class="icon-btn danger" title=${tr.del} @click=${() => { this._deleteTarget = task.task_id; }}><ha-icon icon="mdi:delete"></ha-icon></button>
          </div>
        </ik-task-card>
      </div>
    `;

    const filterSection = html`
      <div class="filter-bar">
        ${chip("pending",   tr.pending,   countPending)}
        ${chip("completed", tr.completed, countCompleted, "chip-completed")}
        <select class="priority-select" .value=${this._filterPriority} @change=${(e: Event) => { this._filterPriority = (e.target as HTMLSelectElement).value as TaskPriority | "all"; this._resetPage(); }}>
          <option value="all">${tr.allPriorities}</option>
          <option value="critical">${tr.critical}</option>
          <option value="high">${tr.high}</option>
          <option value="medium">${tr.medium}</option>
          <option value="low">${tr.low}</option>
        </select>
      </div>
      <div class="filter-bar">
        <div class="search-wrapper">
          <ha-icon class="search-icon" icon="mdi:magnify"></ha-icon>
          <input
            class="search-input"
            type="search"
            .value=${this._searchQuery}
            placeholder=${tr.searchPlaceholder}
            @input=${(e: Event) => { this._searchQuery = (e.target as HTMLInputElement).value; this._resetPage(); }}
          />
        </div>
      </div>
    `;

    const confirmDialog = html`
      <ik-confirm-dialog
        heading=${tr.deleteHeading}
        .open=${this._deleteTarget !== null}
        @dialog-closed=${(e: CustomEvent) => this._confirmDelete(e.detail.confirmed)}
      >
        ${tr.deleteBody}
      </ik-confirm-dialog>
    `;

    const priorityRank: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    const sortUpcoming = (a: Task, b: Task) => {
      const aDate = a.due_date ? new Date(a.due_date).getTime() : Infinity;
      const bDate = b.due_date ? new Date(b.due_date).getTime() : Infinity;
      if (aDate !== bDate) return aDate - bDate;
      return (priorityRank[a.priority] ?? 99) - (priorityRank[b.priority] ?? 99);
    };

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const rangeEnd = (days: number) => { const d = new Date(today); d.setDate(d.getDate() + days); d.setHours(23, 59, 59, 999); return d; };
    const yearEnd = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
    let upcomingMax: Date | null = null;
    let upcomingMin: Date | null = null;
    if (this._upcomingRange === "week")    upcomingMax = rangeEnd(7);
    else if (this._upcomingRange === "2weeks") upcomingMax = rangeEnd(14);
    else if (this._upcomingRange === "30")  upcomingMax = rangeEnd(30);
    else if (this._upcomingRange === "90")  upcomingMax = rangeEnd(90);
    else if (this._upcomingRange === "year") upcomingMax = yearEnd;
    else if (this._upcomingRange === "custom") {
      upcomingMin = this._upcomingCustomFrom ? new Date(this._upcomingCustomFrom) : null;
      upcomingMax = this._upcomingCustomTo ? new Date(this._upcomingCustomTo + "T23:59:59") : null;
    }
    const inUpcomingRange = (task: Task) => {
      if (this._upcomingRange === "all") return true;
      if (!task.due_date) return false;
      const d = new Date(task.due_date);
      if (upcomingMin && d < upcomingMin) return false;
      if (upcomingMax && d > upcomingMax) return false;
      return true;
    };

    const setUpcomingRange = (v: typeof this._upcomingRange) => {
      this._upcomingRange = v;
      localStorage.setItem("intellikeep.upcomingRange", v);
    };

    if (this._filterTab === "pending") {
      const urgentTasks = this.tasks.filter(t =>
        (t.status === "due" || t.status === "overdue") && matchesPr(t) && matchesQ(t));
      const otherTasks = this.tasks.filter(t =>
        t.status !== "completed" && t.status !== "due" && t.status !== "overdue" && matchesPr(t) && matchesQ(t) && inUpcomingRange(t))
        .sort(sortUpcoming);

      const upcomingRangeChip = (v: typeof this._upcomingRange, label: string) => html`
        <button class="upcoming-chip ${this._upcomingRange === v ? "active" : ""}" @click=${() => setUpcomingRange(v)}>${label}</button>
      `;
      const upcomingFilterBar = html`
        <div class="upcoming-filter">
          ${upcomingRangeChip("all",    tr.rangeAll)}
          ${upcomingRangeChip("week",   tr.rangeWeek)}
          ${upcomingRangeChip("2weeks", tr.range2Weeks)}
          ${upcomingRangeChip("30",     tr.range30)}
          ${upcomingRangeChip("90",     tr.range90)}
          ${upcomingRangeChip("year",   tr.rangeYear)}
          ${upcomingRangeChip("custom", tr.rangeCustom)}
        </div>
        ${this._upcomingRange === "custom" ? html`
          <div class="custom-range">
            <input type="date" .value=${this._upcomingCustomFrom}
              @change=${(e: Event) => { this._upcomingCustomFrom = (e.target as HTMLInputElement).value; localStorage.setItem("intellikeep.upcomingCustomFrom", this._upcomingCustomFrom); }}
            />
            <span>${tr.rangeTo}</span>
            <input type="date" .value=${this._upcomingCustomTo}
              @change=${(e: Event) => { this._upcomingCustomTo = (e.target as HTMLInputElement).value; localStorage.setItem("intellikeep.upcomingCustomTo", this._upcomingCustomTo); }}
            />
          </div>` : ""
        }
      `;

      return html`
        ${filterSection}
        <div class="sections-scroll">
          <div>
            <div class="section-header urgent">
              <ha-icon icon="mdi:clock-alert-outline" style="--mdc-icon-size:15px"></ha-icon>
              ${tr.urgentSection}
            </div>
            <ha-card>
              ${urgentTasks.length === 0 && !q && this._filterPriority === "all"
                ? html`
                  <div class="all-clear">
                    <div class="all-clear-emoji">🎉</div>
                    <p class="all-clear-title">${tr.allClear}</p>
                    <p class="all-clear-sub">${tr.allClearSub}</p>
                    <span class="all-clear-suggestion">${this._relaxSuggestion}</span>
                  </div>`
                : urgentTasks.length === 0
                ? html`<div class="empty">${tr.noTasks}</div>`
                : html`<div class="list-container">${urgentTasks.map(taskItem)}</div>`}
            </ha-card>
          </div>
          ${otherTasks.length > 0 ? html`
          <div>
            <div class="section-header">
              <ha-icon icon="mdi:clock-outline" style="--mdc-icon-size:15px"></ha-icon>
              ${tr.otherPendingSection}
            </div>
            ${upcomingFilterBar}
            <ha-card>
              <div class="list-container">${otherTasks.map(taskItem)}</div>
            </ha-card>
          </div>` : html`
          <div>
            <div class="section-header">
              <ha-icon icon="mdi:clock-outline" style="--mdc-icon-size:15px"></ha-icon>
              ${tr.otherPendingSection}
            </div>
            ${upcomingFilterBar}
          </div>`}
        </div>
        ${confirmDialog}
      `;
    }

    // completed tab
    const completedTasks = this.tasks.filter(t =>
      t.status === "completed" && matchesPr(t) && matchesQ(t));
    const totalPages = Math.max(1, Math.ceil(completedTasks.length / this._pageSize));
    const page = Math.min(this._page, totalPages - 1);
    const start = page * this._pageSize;
    const pageTasks = completedTasks.slice(start, start + this._pageSize);

    return html`
      ${filterSection}
      <ha-card class="full-card">
        ${completedTasks.length === 0
          ? html`<div class="empty">${tr.noTasks}</div>`
          : html`<div class="list-container">${pageTasks.map(taskItem)}</div>`}
      </ha-card>
      ${completedTasks.length > 0 ? html`
      <div class="pagination">
        <span>${tr.rowsPerPage}</span>
        <select .value=${String(this._pageSize)} @change=${(e: Event) => { this._pageSize = Number((e.target as HTMLSelectElement).value) as 25 | 50 | 100; this._resetPage(); }}>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span>${start + 1}–${Math.min(start + this._pageSize, completedTasks.length)} ${tr.of} ${completedTasks.length}</span>
        <button class="page-btn" ?disabled=${page === 0} @click=${() => { this._page = page - 1; }}>&lt;</button>
        <button class="page-btn" ?disabled=${page >= totalPages - 1} @click=${() => { this._page = page + 1; }}>&gt;</button>
      </div>` : ""}
      ${confirmDialog}
    `;
  }
}
