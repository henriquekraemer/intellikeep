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

  @state() private _filterTab: "due" | "overdue" | "pending" | "completed" = "due";
  @state() private _filterPriority: TaskPriority | "all" = "all";

  connectedCallback() {
    super.connectedCallback();
    const saved = localStorage.getItem("intellikeep.filterTab");
    if (saved === "due" || saved === "overdue" || saved === "pending" || saved === "completed") {
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
    :host { display: block; }
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
      border-radius: 20px;
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
      margin-left: auto;
      padding: 5px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    ha-card { overflow: hidden; }
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
      gap: 4px;
    }
    .btn {
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 12px;
    }
    .btn.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color);
    }
    .btn.undo {
      color: var(--warning-color, #ff9800);
      border-color: var(--warning-color, #ff9800);
    }
    .btn.edit {
      color: var(--primary-color);
      border-color: var(--primary-color);
    }
    .btn.danger {
      color: var(--error-color, #f44336);
      border-color: var(--error-color, #f44336);
    }
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

  private get _filtered(): Task[] {
    return this.tasks.filter((task) => {
      const tabMatch = (() => {
        switch (this._filterTab) {
          case "due":       return task.status === "due";
          case "overdue":   return task.status === "overdue";
          case "pending":   return task.status !== "completed";
          case "completed": return task.status === "completed";
        }
      })();
      if (!tabMatch) return false;
      if (this._filterPriority !== "all" && task.priority !== this._filterPriority) return false;
      return true;
    });
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
    const tasks = this._filtered;
    const tr = t(this.hass?.language);
    const totalPages = Math.max(1, Math.ceil(tasks.length / this._pageSize));
    const page = Math.min(this._page, totalPages - 1);
    const start = page * this._pageSize;
    const pageTasks = tasks.slice(start, start + this._pageSize);

    const countDue       = this.tasks.filter(t => t.status === "due").length;
    const countOverdue   = this.tasks.filter(t => t.status === "overdue").length;
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

    const isDueClear = this._filterTab === "due" && tasks.length === 0;

    return html`
      <div class="filter-bar">
        ${chip("due",       tr.dueToday,  countDue)}
        ${chip("overdue",   tr.overdue,   countOverdue,  "chip-overdue")}
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

      <ha-card>
        ${isDueClear
          ? html`
            <div class="all-clear">
              <div class="all-clear-emoji">🎉</div>
              <p class="all-clear-title">${tr.allClear}</p>
              <p class="all-clear-sub">${tr.allClearSub}</p>
              <span class="all-clear-suggestion">${this._relaxSuggestion}</span>
            </div>`
          : tasks.length === 0
          ? html`<div class="empty">${tr.noTasks}</div>`
          : pageTasks.map(
              (task, i) => html`
                <div class="task-wrapper ${this._exitingDone.has(task.task_id) ? "exiting-done" : this._exitingDelete.has(task.task_id) ? "exiting-delete" : this._exitingUndo.has(task.task_id) ? "exiting-undo" : this._exitingEdit.has(task.task_id) ? "exiting-edit" : ""}">
                  ${i > 0 ? html`<hr class="task-divider" />` : ""}
                  <ik-task-card .task=${task} .hass=${this.hass}>
                    <div class="task-actions" slot="actions">
                      ${task.status !== "completed"
                        ? html`<button class="btn primary" ?disabled=${this._completing.has(task.task_id)} @click=${() => this._complete(task.task_id)}>${tr.done}</button>`
                        : html`<button class="btn undo" ?disabled=${this._reopening.has(task.task_id)} @click=${() => this._reopen(task.task_id)}>${tr.undo}</button>`}
                      <button class="btn edit" @click=${() => this._edit(task.task_id)}>${tr.edit}</button>
                      <button class="btn danger" @click=${() => { this._deleteTarget = task.task_id; }}>${tr.del}</button>
                    </div>
                  </ik-task-card>
                </div>
              `
            )}
      </ha-card>

      ${tasks.length > 0 ? html`
      <div class="pagination">
        <span>${tr.rowsPerPage}</span>
        <select .value=${String(this._pageSize)} @change=${(e: Event) => { this._pageSize = Number((e.target as HTMLSelectElement).value) as 25 | 50 | 100; this._resetPage(); }}>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span>${start + 1}–${Math.min(start + this._pageSize, tasks.length)} ${tr.of} ${tasks.length}</span>
        <button class="page-btn" ?disabled=${page === 0} @click=${() => { this._page = page - 1; }}>&lt;</button>
        <button class="page-btn" ?disabled=${page >= totalPages - 1} @click=${() => { this._page = page + 1; }}>&gt;</button>
      </div>` : ""}

      <ik-confirm-dialog
        heading=${tr.deleteHeading}
        .open=${this._deleteTarget !== null}
        @dialog-closed=${(e: CustomEvent) => this._confirmDelete(e.detail.confirmed)}
      >
        ${tr.deleteBody}
      </ik-confirm-dialog>
    `;
  }
}
