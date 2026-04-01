import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, Task, TaskFrequency, TaskPriority } from "../types";
import { createTask, updateTask } from "../api";

@customElement("ik-task-form-view")
export class IkTaskFormView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) task: Task | null = null; // null = create mode

  @state() private _name = "";
  @state() private _description = "";
  @state() private _priority: TaskPriority = "medium";
  @state() private _frequency: TaskFrequency = "one_time";
  @state() private _customDays: number | null = null;
  @state() private _dueDate = "";
  @state() private _linkedEntities: string[] = [];
  @state() private _notifyDaysBefore = 1;
  @state() private _notifyOnOverdue = true;
  @state() private _saving = false;
  @state() private _error = "";

  connectedCallback() {
    super.connectedCallback();
    if (this.task) {
      this._name = this.task.name;
      this._description = this.task.description;
      this._priority = this.task.priority;
      this._frequency = this.task.frequency;
      this._customDays = this.task.custom_days_interval;
      this._dueDate = this.task.due_date
        ? this.task.due_date.substring(0, 16)
        : "";
      this._linkedEntities = [...this.task.linked_entity_ids];
      this._notifyDaysBefore = this.task.notify_days_before;
      this._notifyOnOverdue = this.task.notify_on_overdue;
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
    .checkbox-label { flex-direction: row; align-items: center; gap: 8px; cursor: pointer; }
    .actions { display: flex; gap: 10px; margin-top: 8px; }
    button {
      padding: 10px 20px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }
    .save { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    .cancel { background: var(--secondary-background-color); color: var(--primary-text-color); }
    .error { color: var(--error-color, #f44336); font-size: 13px; }
    .entity-list { display: flex; flex-direction: column; gap: 4px; }
    .entity-row { display: flex; gap: 6px; align-items: center; }
    .entity-row input { flex: 1; }
    .entity-row button { padding: 6px 10px; background: var(--secondary-background-color); color: var(--primary-text-color); border: 1px solid var(--divider-color); border-radius: 6px; cursor: pointer; }
    .add-entity { background: transparent; border: 1px dashed var(--divider-color); color: var(--secondary-text-color); border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 13px; align-self: flex-start; }
  `;

  private _navigate(path: string) {
    this.dispatchEvent(new CustomEvent("navigate", { detail: path, bubbles: true, composed: true }));
  }

  private async _save() {
    if (!this._name.trim()) {
      this._error = "Task name is required.";
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
        due_date: this._dueDate ? new Date(this._dueDate).toISOString() : null,
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
    return html`
      <div class="form">
        <label>
          Task name *
          <input .value=${this._name} @input=${(e: Event) => { this._name = (e.target as HTMLInputElement).value; }} placeholder="e.g. Replace HVAC filter" />
        </label>

        <label>
          Description
          <textarea .value=${this._description} @input=${(e: Event) => { this._description = (e.target as HTMLTextAreaElement).value; }} placeholder="Optional details…"></textarea>
        </label>

        <div class="row">
          <label>
            Priority
            <select .value=${this._priority} @change=${(e: Event) => { this._priority = (e.target as HTMLSelectElement).value as TaskPriority; }}>
              <option value="low">Low</option>
              <option value="medium" selected>Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </label>

          <label>
            Frequency
            <select .value=${this._frequency} @change=${(e: Event) => { this._frequency = (e.target as HTMLSelectElement).value as TaskFrequency; }}>
              <option value="one_time">One-time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom interval</option>
            </select>
          </label>
        </div>

        ${this._frequency === "custom"
          ? html`
              <label>
                Interval (days)
                <input type="number" min="1" .value=${String(this._customDays ?? 30)} @input=${(e: Event) => { this._customDays = parseInt((e.target as HTMLInputElement).value, 10); }} />
              </label>
            `
          : nothing}

        <label>
          Due date
          <input type="datetime-local" .value=${this._dueDate} @change=${(e: Event) => { this._dueDate = (e.target as HTMLInputElement).value; }} />
        </label>

        <div>
          <div style="font-size:13px;color:var(--secondary-text-color);margin-bottom:6px;">Linked entities</div>
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
            <button class="add-entity" @click=${() => { this._linkedEntities = [...this._linkedEntities, ""]; }}>+ Add entity</button>
          </div>
        </div>

        <div class="row">
          <label>
            Notify N days before due
            <input type="number" min="0" max="365" .value=${String(this._notifyDaysBefore)} @input=${(e: Event) => { this._notifyDaysBefore = parseInt((e.target as HTMLInputElement).value, 10); }} />
          </label>
          <label class="checkbox-label">
            <input type="checkbox" .checked=${this._notifyOnOverdue} @change=${(e: Event) => { this._notifyOnOverdue = (e.target as HTMLInputElement).checked; }} />
            Notify when overdue
          </label>
        </div>

        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}

        <div class="actions">
          <button class="save" ?disabled=${this._saving} @click=${this._save}>
            ${this._saving ? "Saving…" : isEdit ? "Save changes" : "Create task"}
          </button>
          <button class="cancel" @click=${() => this._navigate("/tasks")}>Cancel</button>
        </div>
      </div>
    `;
  }
}
