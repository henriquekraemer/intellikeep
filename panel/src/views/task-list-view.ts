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

  @state() private _filterGroup: "pending" | "completed" = "pending";
  @state() private _filterUrgency: "overdue" | "due" | "all" = "all";
  @state() private _filterPriority: TaskPriority | "all" = "all";
  @state() private _deleteTarget: string | null = null;
  @state() private _completing: Set<string> = new Set();
  @state() private _reopening: Set<string> = new Set();
  @state() private _page = 0;
  @state() private _pageSize: 25 | 50 | 100 = 25;

  static styles = css`
    :host { display: block; }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 0 16px;
      flex-wrap: wrap;
    }
    .toolbar select {
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .count {
      margin-left: auto;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    ha-card {
      overflow: hidden;
    }
    .empty {
      text-align: center;
      padding: 40px 24px;
      color: var(--secondary-text-color);
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
  `;

  private _resetPage() {
    this._page = 0;
  }

  private get _filtered(): Task[] {
    return this.tasks.filter((t) => {
      // Group: pending = not completed, completed = completed
      if (this._filterGroup === "pending" && t.status === "completed") return false;
      if (this._filterGroup === "completed" && t.status !== "completed") return false;
      // Urgency subfiltro (só aplicável em pending)
      if (this._filterGroup === "pending" && this._filterUrgency !== "all") {
        if (t.status !== this._filterUrgency) return false;
      }
      if (this._filterPriority !== "all" && t.priority !== this._filterPriority) return false;
      return true;
    });
  }

  private _navigateTo(path: string) {
    this.dispatchEvent(new CustomEvent("navigate", { detail: path, bubbles: true, composed: true }));
  }

  private async _reopen(taskId: string) {
    this._reopening = new Set([...this._reopening, taskId]);
    try {
      await reopenTask(this.hass, taskId);
    } catch (err) {
      console.error("[IntelliKeep] reopen_task failed:", err);
      alert(`Failed to reopen task: ${err}`);
    } finally {
      this._reopening = new Set([...this._reopening].filter((id) => id !== taskId));
    }
  }

  private async _complete(taskId: string) {
    this._completing = new Set([...this._completing, taskId]);
    try {
      await completeTask(this.hass, taskId);
    } catch (err) {
      console.error("[IntelliKeep] complete_task failed:", err);
      alert(`Failed to complete task: ${err}`);
    } finally {
      this._completing = new Set([...this._completing].filter((id) => id !== taskId));
    }
  }

  private async _confirmDelete(confirmed: boolean) {
    if (confirmed && this._deleteTarget) {
      await deleteTask(this.hass, this._deleteTarget);
    }
    this._deleteTarget = null;
  }

  render() {
    const tasks = this._filtered;
    const tr = t(this.hass?.language);
    const totalPages = Math.max(1, Math.ceil(tasks.length / this._pageSize));
    const page = Math.min(this._page, totalPages - 1);
    const start = page * this._pageSize;
    const pageTasks = tasks.slice(start, start + this._pageSize);
    return html`
      <div class="toolbar">
        <select @change=${(e: Event) => { this._filterGroup = (e.target as HTMLSelectElement).value as "pending" | "completed"; this._filterUrgency = "all"; this._resetPage(); }}>
          <option value="pending">${tr.pending}</option>
          <option value="completed">${tr.completed}</option>
        </select>
        ${this._filterGroup === "pending" ? html`
        <select @change=${(e: Event) => { this._filterUrgency = (e.target as HTMLSelectElement).value as "overdue" | "due" | "all"; this._resetPage(); }}>
          <option value="all">${tr.allUrgencies}</option>
          <option value="overdue">${tr.overdue}</option>
          <option value="due">${tr.dueToday}</option>
        </select>` : ""}
        <select @change=${(e: Event) => { this._filterPriority = (e.target as HTMLSelectElement).value as TaskPriority | "all"; this._resetPage(); }}>
          <option value="all">${tr.allPriorities}</option>
          <option value="critical">${tr.critical}</option>
          <option value="high">${tr.high}</option>
          <option value="medium">${tr.medium}</option>
          <option value="low">${tr.low}</option>
        </select>
        <span class="count">${tasks.length} task${tasks.length !== 1 ? "s" : ""}</span>
      </div>

      <ha-card>
        ${tasks.length === 0
          ? html`<div class="empty">${tr.noTasks}</div>`
          : pageTasks.map(
              (task, i) => html`
                ${i > 0 ? html`<hr class="task-divider" />` : ""}
                <ik-task-card .task=${task} .hass=${this.hass}>
                  <div class="task-actions" slot="actions">
                    ${task.status !== "completed"
                      ? html`<button class="btn primary" ?disabled=${this._completing.has(task.task_id)} @click=${() => this._complete(task.task_id)}>${tr.done}</button>`
                      : html`<button class="btn" ?disabled=${this._reopening.has(task.task_id)} @click=${() => this._reopen(task.task_id)}>${tr.undo}</button>`}
                    <button class="btn" @click=${() => this._navigateTo(`/edit/${task.task_id}`)}>${tr.edit}</button>
                    <button class="btn danger" @click=${() => { this._deleteTarget = task.task_id; }}>${tr.del}</button>
                  </div>
                </ik-task-card>
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
