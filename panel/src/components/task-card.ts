import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HomeAssistant, Task } from "../types";
import { t } from "../translations";

function priorityColor(p: string): string {
  const m: Record<string, string> = {
    low: "var(--success-color, #4caf50)",
    medium: "var(--warning-color, #ff9800)",
    high: "var(--error-color, #f44336)",
    critical: "#9c27b0",
  };
  return m[p] ?? "var(--secondary-text-color)";
}

function statusColor(s: string): string {
  const m: Record<string, string> = {
    pending: "var(--secondary-text-color)",
    due: "var(--warning-color, #ff9800)",
    overdue: "var(--error-color, #f44336)",
    completed: "var(--success-color, #4caf50)",
    snoozed: "var(--disabled-color)",
  };
  return m[s] ?? "var(--secondary-text-color)";
}

@customElement("ik-task-card")
export class IkTaskCard extends LitElement {
  @property({ attribute: false }) task!: Task;
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) completing = false;

  static styles = css`
    :host {
      display: block;
    }
    .row {
      display: flex;
      align-items: stretch;
      gap: 12px;
      overflow: hidden;
    }
    .priority-bar {
      width: 28px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .priority-bar span {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #fff;
      white-space: nowrap;
    }
    .row-content {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px 12px 0;
    }
    .body {
      flex: 1;
      min-width: 0;
    }
    .name {
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .desc {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
      font-size: 12px;
      align-items: center;
    }
    .badge {
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #fff;
    }
    .actions {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
      justify-content: flex-end;
    }

  `;

  private _relativeDue(iso: string | null): string {
    const tr = t(this.hass?.language);
    if (!iso) return tr.noDueDate;
    const days = Math.round((new Date(iso).getTime() - Date.now()) / 86400000);
    if (days === 0) return tr.dueTodayCard;
    if (days === 1) return tr.dueTomorrow;
    if (days === -1) return tr.daysOverdue(1);
    if (days > 0) return tr.dueInDays(days);
    return tr.daysOverdue(Math.abs(days));
  }

  render() {
    const { task } = this;
    return html`
      <div class="row">
        <div class="priority-bar" style="background:${priorityColor(task.priority)}">
          <span>${task.priority}</span>
        </div>
        <div class="row-content">
          <div class="body">
            <div class="name">${task.name}</div>
            ${task.description ? html`<div class="desc">${task.description}</div>` : ""}
            <div class="meta">
              <span style="color:${statusColor(task.status)}">${this._relativeDue(task.due_date)}</span>
              ${task.linked_entity_ids.length
                ? html`<span>· ${task.linked_entity_ids.length} entit${task.linked_entity_ids.length > 1 ? "ies" : "y"}</span>`
                : ""}
            </div>
          </div>
          <div class="actions">
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    `;
  }
}
