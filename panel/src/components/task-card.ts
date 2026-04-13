import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HomeAssistant, Task } from "../types";
import { t } from "../translations";

type AreaEntry = { area_id: string; name: string };
type DeviceEntry = { id: string; area_id: string | null; name_by_user: string | null; name: string };

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
  @property({ attribute: false }) areas: AreaEntry[] = [];
  @property({ attribute: false }) devices: DeviceEntry[] = [];
  @property({ type: Boolean }) completing = false;

  static styles = css`
    :host {
      display: block;
    }
    .row {
      display: flex;
      align-items: stretch;
      gap: 0;
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
    .task-num-col {
      flex-shrink: 0;
      align-self: stretch;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      padding: 0 10px;
      border-right: 1px solid var(--divider-color, rgba(0,0,0,0.12));
    }
    .task-num-col span {
      font-size: 18px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      letter-spacing: 0.01em;
      color: var(--secondary-text-color);
    }
    .row-content {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
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
    .actions {
      align-self: stretch;
      display: flex;
      flex-shrink: 0;
      overflow: hidden;
    }

  `;

  private _linkedLabel(): string | null {
    const { linked_entity_ids } = this.task;
    if (linked_entity_ids.length === 0) return null;
    if (linked_entity_ids.length > 1) {
      return t(this.hass?.language).linkedEntitiesCount(linked_entity_ids.length);
    }
    const entry = linked_entity_ids[0];
    if (entry.startsWith("area:")) {
      const areaId = entry.slice(5);
      const area = this.areas.find(a => a.area_id === areaId);
      return area ? area.name : null;
    }
    if (entry.startsWith("device:")) {
      const deviceId = entry.slice(7);
      const device = this.devices.find(d => d.id === deviceId);
      if (!device) return null;
      const deviceName = device.name_by_user || device.name;
      if (device.area_id) {
        const area = this.areas.find(a => a.area_id === device.area_id);
        return area ? `${area.name} · ${deviceName}` : deviceName;
      }
      return deviceName;
    }
    return null;
  }

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
    const linkedLabel = this._linkedLabel();
    return html`
      <div class="row">
        <div class="priority-bar" style="background:${priorityColor(task.priority)}">
          <span>${task.priority}</span>
        </div>
        ${task.task_number ? html`
          <div class="task-num-col">
            <span>#${String(task.task_number).padStart(3, '0')}</span>
          </div>` : ""}
        <div class="row-content">
          <div class="body">
            <div class="name">
              ${task.name}
            </div>
            ${task.description ? html`<div class="desc">${task.description}</div>` : ""}
            <div class="meta">
              <span style="color:${statusColor(task.status)}">${this._relativeDue(task.due_date)}</span>
              ${linkedLabel
                ? html`<span>· ${linkedLabel}</span>`
                : ""}
            </div>
          </div>
        </div>
        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </div>
    `;
  }
}
