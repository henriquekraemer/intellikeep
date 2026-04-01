import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, Task, TaskPriority, TaskStatus } from "../types";
import { completeTask, deleteTask } from "../api";
import "../components/task-card";
import "../components/confirm-dialog";

@customElement("ik-task-list-view")
export class IkTaskListView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) tasks: Task[] = [];

  @state() private _filterStatus: TaskStatus | "all" = "all";
  @state() private _filterPriority: TaskPriority | "all" = "all";
  @state() private _deleteTarget: string | null = null;
  @state() private _completing: Set<string> = new Set();

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
  `;

  private get _filtered(): Task[] {
    return this.tasks.filter((t) => {
      if (this._filterStatus !== "all" && t.status !== this._filterStatus) return false;
      if (this._filterPriority !== "all" && t.priority !== this._filterPriority) return false;
      return true;
    });
  }

  private _navigateTo(path: string) {
    this.dispatchEvent(new CustomEvent("navigate", { detail: path, bubbles: true, composed: true }));
  }

  private async _complete(taskId: string) {
    this._completing = new Set([...this._completing, taskId]);
    try {
      await completeTask(this.hass, taskId);
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
    return html`
      <div class="toolbar">
        <select @change=${(e: Event) => { this._filterStatus = (e.target as HTMLSelectElement).value as TaskStatus | "all"; }}>
          <option value="all">All statuses</option>
          <option value="overdue">Overdue</option>
          <option value="due">Due today</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select @change=${(e: Event) => { this._filterPriority = (e.target as HTMLSelectElement).value as TaskPriority | "all"; }}>
          <option value="all">All priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <span class="count">${tasks.length} task${tasks.length !== 1 ? "s" : ""}</span>
      </div>

      <ha-card>
        ${tasks.length === 0
          ? html`<div class="empty">No tasks match the current filters.</div>`
          : tasks.map(
              (task) => html`
                <ik-task-card .task=${task}>
                  <div class="task-actions" slot="actions">
                    ${task.status !== "completed"
                      ? html`<button class="btn primary" ?disabled=${this._completing.has(task.task_id)} @click=${() => this._complete(task.task_id)}>Done</button>`
                      : nothing}
                    <button class="btn" @click=${() => this._navigateTo(`/edit/${task.task_id}`)}>Edit</button>
                    <button class="btn danger" @click=${() => { this._deleteTarget = task.task_id; }}>Del</button>
                  </div>
                </ik-task-card>
              `
            )}
      </ha-card>

      <ik-confirm-dialog
        heading="Delete task?"
        .open=${this._deleteTarget !== null}
        @dialog-closed=${(e: CustomEvent) => this._confirmDelete(e.detail.confirmed)}
      >
        This action cannot be undone.
      </ik-confirm-dialog>
    `;
  }
}
