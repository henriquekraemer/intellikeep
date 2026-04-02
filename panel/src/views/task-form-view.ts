import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, Task, TaskFrequency, TaskPriority } from "../types";
import { createTask, updateTask, completeTask, reopenTask, deleteTask } from "../api";
import { t } from "../translations";
import "../components/confirm-dialog";

@customElement("ik-task-form-view")
export class IkTaskFormView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) task: Task | null = null;
  @property({ type: Boolean }) enableAnimations = true;

  @state() private _name = "";
  @state() private _description = "";
  @state() private _priority: TaskPriority = "medium";
  @state() private _frequency: TaskFrequency = "one_time";
  @state() private _customDays: number | null = null;
  @state() private _dueDate = "";
  @state() private _dueTime = "";
  @state() private _linkedEntities: string[] = [];
  @state() private _notifyDaysBefore = 1;
  @state() private _notifyOnOverdue = true;
  @state() private _saving = false;
  @state() private _completing = false;
  @state() private _deleting = false;
  @state() private _showDeleteConfirm = false;
  @state() private _error = "";
  @state() private _activeTab: "edit" | "history" = "edit";
  @state() private _historyPage = 0;
  @state() private _historyPageSize: 10 | 25 | 50 = 10;
  private static readonly _HISTORY_PAGE_SIZE = 10;

  connectedCallback() {
    super.connectedCallback();
    if (this.task) {
      this._name = this.task.name;
      this._description = this.task.description;
      this._priority = this.task.priority;
      this._frequency = this.task.frequency;
      this._customDays = this.task.custom_days_interval;
      this._dueDate = this.task.due_date ? this.task.due_date.substring(0, 10) : "";
      this._dueTime = this.task.due_date ? this.task.due_date.substring(11, 16) : "";
      this._linkedEntities = [...this.task.linked_entity_ids];
      this._notifyDaysBefore = this.task.notify_days_before;
      this._notifyOnOverdue = this.task.notify_on_overdue;
    } else {
      // Pre-fill due date with current local date/time for new tasks
      const now = new Date();
      now.setSeconds(0, 0);
      const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
      this._dueDate = local.substring(0, 10);
      this._dueTime = local.substring(11, 16);
    }
  }

  static styles = css`
    :host { display: block; }
    .form { display: flex; flex-direction: column; gap: 16px; max-width: 600px; }
    label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--secondary-text-color); }
    input, select, textarea {
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
      font-family: inherit;
    }
    textarea { resize: vertical; min-height: 72px; }
    .row { display: flex; gap: 12px; flex-wrap: wrap; }
    .row label { flex: 1; min-width: 160px; }
    .checkbox-label { flex-direction: row; align-items: center; gap: 8px; cursor: pointer; align-self: flex-end; padding-bottom: 8px; }
    .actions { display: flex; gap: 10px; margin-top: 8px; }
    button {
      padding: 10px 20px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: filter 0.15s, transform 0.15s;
    }
    @media (hover: hover) {
      button:not(:disabled):hover { filter: brightness(1.08); transform: translateY(-1px); }
      button:not(:disabled):active { transform: translateY(0); filter: brightness(0.97); }
    }
    .save { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    .cancel { background: var(--secondary-background-color); color: var(--primary-text-color); }
    .error { color: var(--error-color, #f44336); font-size: 13px; }
    .form-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      padding-top: 14px;
      border-top: 1px solid var(--divider-color);
    }
    .form-footer-spacer { flex: 1; }
    .cancel-mobile { display: none; }
    @media (hover: none) {
      .cancel-mobile { display: inline-flex; }
    }
    .btn-done {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .btn-undo {
      background: var(--warning-color, #ff9800);
      color: #fff;
    }
    .btn-delete {
      background: var(--error-color, #f44336);
      color: #fff;
      margin-left: auto;
    }
    .btn-done, .btn-undo, .btn-delete, .save, .cancel {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      --mdc-icon-size: 18px;
    }
    @media (max-width: 400px) {
      .form-footer .btn-label { display: none; }
      .form-footer button { padding: 10px 12px; }
    }
    .error { color: var(--error-color, #f44336); font-size: 13px; }
    .entity-list { display: flex; flex-direction: column; gap: 4px; }
    .entity-row { display: flex; gap: 6px; align-items: center; }
    .entity-row input { flex: 1; }
    .entity-row button { padding: 6px 10px; background: var(--secondary-background-color); color: var(--primary-text-color); border: 1px solid var(--divider-color); border-radius: 6px; cursor: pointer; }
    .add-entity { background: transparent; border: 1px dashed var(--divider-color); color: var(--secondary-text-color); border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 13px; align-self: flex-start; }
    :host([no-animations]) *, :host([no-animations]) *::before, :host([no-animations]) *::after {
      transition: none !important;
      animation: none !important;
    }
    :host([no-animations]) button:hover,
    :host([no-animations]) button:active {
      filter: none !important;
      transform: none !important;
    }
    .form-tabs {
      display: flex;
      border-bottom: 1px solid var(--divider-color);
      margin-bottom: -4px;
    }
    .form-tab {
      padding: 10px 16px;
      font-size: 13px;
      font-weight: 500;
      color: var(--secondary-text-color);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      user-select: none;
      transition: color 0.15s, border-color 0.15s;
    }
    .form-tab:hover { color: var(--primary-text-color); }
    .form-tab.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
    .history-empty {
      text-align: center;
      padding: 40px 20px;
      color: var(--secondary-text-color);
      font-size: 14px;
    }
    .exec-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .exec-table th {
      text-align: left;
      padding: 8px 12px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-weight: 500;
      border-bottom: 1px solid var(--divider-color);
    }
    .exec-table td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--divider-color);
      vertical-align: top;
    }
    .exec-table tbody tr:last-child td { border-bottom: none; }
    .history-pagination {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      padding: 12px 0 0;
      flex-wrap: wrap;
    }
    @media (max-width: 600px) {
      .history-pagination {
        justify-content: flex-end;
        margin-top: 8px;
      }
      .history-pagination .history-summary {
        width: auto;
        order: 0;
      }
    }
    .history-pagination select {
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .history-pagination span {
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .history-page-btn {
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 13px;
    }
    .history-page-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }
  `;

  private _navigate(path: string) {
    this.dispatchEvent(new CustomEvent("navigate", { detail: path, bubbles: true, composed: true }));
  }

  private _formatDate(iso: string): string {
    return new Date(iso).toLocaleString();
  }

  private async _complete() {
    if (!this.task) return;
    this._completing = true;
    try {
      if (this.task.status !== "completed") {
        await completeTask(this.hass, this.task.task_id, this.hass.user?.name ?? "");
      } else {
        await reopenTask(this.hass, this.task.task_id);
      }
      this._navigate("/tasks");
    } finally {
      this._completing = false;
    }
  }

  private async _handleDelete(confirmed: boolean) {
    this._showDeleteConfirm = false;
    if (!confirmed || !this.task) return;
    this._deleting = true;
    try {
      await deleteTask(this.hass, this.task.task_id);
      this._navigate("/tasks");
    } finally {
      this._deleting = false;
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
      const data: Partial<Task> = {
        name: this._name.trim(),
        description: this._description.trim(),
        priority: this._priority,
        frequency: this._frequency,
        custom_days_interval: this._frequency === "custom" ? this._customDays : null,
        due_date: this._dueDate ? new Date(`${this._dueDate}T${this._dueTime || "00:00"}`).toISOString() : null,
        linked_entity_ids: this._linkedEntities.filter(Boolean),
        notify_days_before: this._notifyDaysBefore,
        notify_on_overdue: this._notifyOnOverdue,
      };

      if (this.task) {
        await updateTask(this.hass, this.task.task_id, data);
      } else {
        await createTask(this.hass, data);
      }
      this._navigate("/tasks");
    } catch (err) {
      this._error = String(err);
    } finally {
      this._saving = false;
    }
  }

  render() {
    const isEdit = this.task !== null;
    const tr = t(this.hass?.language);
    if (!this.enableAnimations) {
      this.setAttribute("no-animations", "");
    } else {
      this.removeAttribute("no-animations");
    }
    const executions = isEdit ? [...(this.task!.executions || [])].reverse() : [];
    const showHistory = isEdit && this._activeTab === "history";
    const pageSize = this._historyPageSize;
    const totalPages = Math.max(1, Math.ceil(executions.length / pageSize));
    const histPage = Math.min(this._historyPage, totalPages - 1);
    const histStart = histPage * pageSize;
    const pageExecs = executions.slice(histStart, histStart + pageSize);
    return html`
      <div class="form">
        ${isEdit ? html`
          <div class="form-tabs">
            <div class="form-tab ${this._activeTab === "edit" ? "active" : ""}" @click=${() => { this._activeTab = "edit"; }}>${tr.editTab}</div>
            <div class="form-tab ${this._activeTab === "history" ? "active" : ""}" @click=${() => { this._activeTab = "history"; this._historyPage = 0; }}>${tr.historyTab(executions.length)}</div>
          </div>
        ` : nothing}
        ${!showHistory ? html`
        <label>
          ${tr.taskName}
          <input .value=${this._name} @input=${(e: Event) => { this._name = (e.target as HTMLInputElement).value; }} placeholder=${tr.taskNamePlaceholder} />
        </label>

        <label>
          ${tr.description}
          <textarea .value=${this._description} @input=${(e: Event) => { this._description = (e.target as HTMLTextAreaElement).value; }} placeholder=${tr.descriptionPlaceholder}></textarea>
        </label>

        <div class="row">
          <label>
            ${tr.priority}
            <select .value=${this._priority} @change=${(e: Event) => { this._priority = (e.target as HTMLSelectElement).value as TaskPriority; }}>
              <option value="low">${tr.low}</option>
              <option value="medium">${tr.medium}</option>
              <option value="high">${tr.high}</option>
              <option value="critical">${tr.critical}</option>
            </select>
          </label>

          <label>
            ${tr.frequency}
            <select .value=${this._frequency} @change=${(e: Event) => { this._frequency = (e.target as HTMLSelectElement).value as TaskFrequency; }}>
              <option value="one_time">${tr.freqOneTime}</option>
              <option value="daily">${tr.freqDaily}</option>
              <option value="weekly">${tr.freqWeekly}</option>
              <option value="monthly">${tr.freqMonthly}</option>
              <option value="yearly">${tr.freqYearly}</option>
              <option value="custom">${tr.freqCustom}</option>
            </select>
          </label>
        </div>

        ${this._frequency === "custom"
          ? html`
              <label>
                ${tr.intervalDays}
                <input type="number" min="1" .value=${String(this._customDays ?? 30)} @input=${(e: Event) => { this._customDays = parseInt((e.target as HTMLInputElement).value, 10); }} />
              </label>
            `
          : nothing}

        <label>
          ${tr.dueDate}
          <div style="display:flex;gap:8px;">
            <input type="date" style="flex:1" .value=${this._dueDate} @change=${(e: Event) => { this._dueDate = (e.target as HTMLInputElement).value; }} />
            <input type="time" style="width:110px" .value=${this._dueTime} @change=${(e: Event) => { this._dueTime = (e.target as HTMLInputElement).value; }} />
          </div>
        </label>

        <div>
          <div style="font-size:13px;color:var(--secondary-text-color);margin-bottom:6px;">${tr.linkedEntities}</div>
          <div class="entity-list">
            ${this._linkedEntities.map(
              (eid, i) => html`
                <div class="entity-row">
                  <input .value=${eid} placeholder="sensor.example" @input=${(e: Event) => {
                    const arr = [...this._linkedEntities];
                    arr[i] = (e.target as HTMLInputElement).value;
                    this._linkedEntities = arr;
                  }} />
                  <button @click=${() => { this._linkedEntities = this._linkedEntities.filter((_, idx) => idx !== i); }}>✕</button>
                </div>
              `
            )}
            <button class="add-entity" @click=${() => { this._linkedEntities = [...this._linkedEntities, ""]; }}>${tr.addEntity}</button>
          </div>
        </div>

        <div class="row">
          <label>
            ${tr.notifyBefore}
            <input type="number" min="0" max="365" .value=${String(this._notifyDaysBefore)} @input=${(e: Event) => { this._notifyDaysBefore = parseInt((e.target as HTMLInputElement).value, 10); }} />
          </label>
          <label class="checkbox-label">
            <input type="checkbox" .checked=${this._notifyOnOverdue} @change=${(e: Event) => { this._notifyOnOverdue = (e.target as HTMLInputElement).checked; }} />
            ${tr.notifyOverdue}
          </label>
        </div>

        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}

        ${isEdit ? html`
          <div class="form-footer">
            <button class="btn-delete" ?disabled=${this._deleting} @click=${() => { this._showDeleteConfirm = true; }}>
              <ha-icon icon="mdi:delete"></ha-icon><span class="btn-label"> ${tr.del}</span>
            </button>
            <div class="form-footer-spacer"></div>
            <button class="cancel cancel-mobile" @click=${() => this._navigate("/tasks")}>
              <ha-icon icon="mdi:close"></ha-icon><span class="btn-label"> ${tr.cancel}</span>
            </button>
            ${this.task!.status !== "completed"
              ? html`<button class="btn-done" ?disabled=${this._completing} @click=${this._complete}>
                  <ha-icon icon="mdi:check"></ha-icon><span class="btn-label"> ${tr.done}</span>
                </button>`
              : html`<button class="btn-undo" ?disabled=${this._completing} @click=${this._complete}>
                  <ha-icon icon="mdi:undo"></ha-icon><span class="btn-label"> ${tr.undo}</span>
                </button>`}
            <button class="save" ?disabled=${this._saving} @click=${this._save}>
              <ha-icon icon="mdi:content-save"></ha-icon><span class="btn-label"> ${this._saving ? tr.saving : tr.save}</span>
            </button>
          </div>
          <ik-confirm-dialog
            .heading=${tr.deleteHeading}
            .body=${tr.deleteBody}
            .open=${this._showDeleteConfirm}
            @dialog-closed=${(e: CustomEvent) => this._handleDelete(e.detail.confirmed)}
          ></ik-confirm-dialog>
        ` : html`
          <div class="form-footer">
            <div class="form-footer-spacer"></div>
            <button class="cancel" @click=${() => this._navigate("/tasks")}>
              <ha-icon icon="mdi:close"></ha-icon><span class="btn-label"> ${tr.cancel}</span>
            </button>
            <button class="save" ?disabled=${this._saving} @click=${this._save}>
              <ha-icon icon="mdi:content-save"></ha-icon><span class="btn-label"> ${this._saving ? tr.saving : tr.createTask}</span>
            </button>
          </div>
        `}
        ` : html`
          ${executions.length === 0
            ? html`<div class="history-empty">${tr.noExecutions}</div>`
            : html`
              <table class="exec-table">
                <thead>
                  <tr>
                    <th>${tr.completedAt}</th>
                    <th>${tr.completedBy}</th>
                    <th>${tr.notes}</th>
                  </tr>
                </thead>
                <tbody>
                  ${pageExecs.map((ex) => html`
                    <tr>
                      <td>${this._formatDate(ex.completed_at)}</td>
                      <td>${ex.completed_by || "—"}</td>
                      <td>${ex.notes || "—"}</td>
                    </tr>
                  `)}
                </tbody>
              </table>
              ${executions.length > 0 ? html`
                <div class="history-pagination">
                  <span>${tr.rowsPerPage}</span>
                  <select .value=${String(this._historyPageSize)} @change=${(e: Event) => { this._historyPageSize = Number((e.target as HTMLSelectElement).value) as 10 | 25 | 50; this._historyPage = 0; }}>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                  <span class="history-summary">${histStart + 1}–${Math.min(histStart + this._historyPageSize, executions.length)} ${tr.of} ${executions.length}</span>
                  <button class="history-page-btn" ?disabled=${histPage === 0} @click=${() => { this._historyPage = histPage - 1; }}>&lt;</button>
                  <button class="history-page-btn" ?disabled=${histPage >= totalPages - 1} @click=${() => { this._historyPage = histPage + 1; }}>&gt;</button>
                </div>
              ` : nothing}
            `}
        `}
      </div>
    `;
  }
}
