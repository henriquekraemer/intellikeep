import { LitElement, html, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  HomeAssistant,
  IntelliKeepCardConfig,
  Task,
  TaskStatus,
} from "./types";
import { cardStyles } from "./styles";
import {
  priorityColor,
  relativeDueDate,
  statusColor,
  statusIcon,
  frequencyLabel,
} from "./utils";

@customElement("intellikeep-card")
export class IntelliKeepCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) config!: IntelliKeepCardConfig;

  @state() private _tasks: Task[] = [];
  @state() private _loading = true;
  @state() private _completing: Set<string> = new Set();

  private _unsubscribe?: () => void;

  static get styles() {
    return cardStyles;
  }

  setConfig(config: IntelliKeepCardConfig) {
    this.config = config;
  }

  // Called by HA Lovelace editor for the graphical config UI
  static getConfigElement() {
    return document.createElement("intellikeep-card-editor");
  }

  static getStubConfig() {
    return {
      title: "IntelliKeep",
      max_tasks: 5,
      show_linked_entities: true,
      show_description: false,
    };
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this._subscribe();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  private async _subscribe() {
    try {
      this._unsubscribe = await (this.hass as any).connection.subscribeMessage(
        (msg: { tasks: Task[] }) => {
          this._tasks = msg.tasks;
          this._loading = false;
        },
        { type: "intellikeep/subscribe" }
      );
    } catch (_err) {
      // Fallback: fetch once
      await this._fetchTasks();
    }
  }

  private async _fetchTasks() {
    try {
      const result = await (this.hass as any).callWS({ type: "intellikeep/get_tasks" }) as { tasks: Task[] };
      this._tasks = result.tasks;
    } finally {
      this._loading = false;
    }
  }

  private get _filteredTasks(): Task[] {
    let tasks = [...this._tasks];

    if (this.config.filter_status?.length) {
      tasks = tasks.filter((t) =>
        this.config.filter_status!.includes(t.status as TaskStatus)
      );
    }

    if (this.config.filter_priority?.length) {
      tasks = tasks.filter((t) =>
        this.config.filter_priority!.includes(t.priority)
      );
    }

    // Sort: overdue first, then by due date
    tasks.sort((a, b) => {
      const order: Record<string, number> = {
        overdue: 0,
        due: 1,
        pending: 2,
        snoozed: 3,
        completed: 4,
      };
      const statusDiff = (order[a.status] ?? 5) - (order[b.status] ?? 5);
      if (statusDiff !== 0) return statusDiff;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });

    const max = this.config.max_tasks ?? 10;
    return tasks.slice(0, max);
  }

  private async _completeTask(taskId: string) {
    this._completing = new Set([...this._completing, taskId]);
    try {
      await this.hass.callService("intellikeep", "complete_task", {
        task_id: taskId,
      });
    } finally {
      this._completing = new Set(
        [...this._completing].filter((id) => id !== taskId)
      );
    }
  }

  private _resolveLinkedLabel(entry: string): string {
    if (entry.startsWith("area:")) {
      const areaId = entry.slice(5);
      return this.hass.areas?.[areaId]?.name ?? areaId;
    }
    if (entry.startsWith("device:")) {
      const deviceId = entry.slice(7);
      const device = this.hass.devices?.[deviceId];
      if (!device) return deviceId;
      const deviceName = device.name_by_user || device.name;
      const area = device.area_id ? this.hass.areas?.[device.area_id] : undefined;
      return area ? `${area.name} · ${deviceName}` : deviceName;
    }
    return entry;
  }

  private _renderEntityChips(task: Task) {
    if (!this.config.show_linked_entities || task.linked_entity_ids.length === 0) {
      return nothing;
    }

    return html`
      <div class="entity-chips">
        ${task.linked_entity_ids.map((entry) => html`
          <span class="entity-chip">
            <ha-icon icon="mdi:devices" style="--mdc-icon-size:12px"></ha-icon>
            ${this._resolveLinkedLabel(entry)}
          </span>
        `)}
      </div>
    `;
  }

  protected render() {
    const title = this.config?.title ?? "IntelliKeep";
    const tasks = this._filteredTasks;

    return html`
      <ha-card>
        <div class="card-header">
          <span>
            <ha-icon icon="mdi:clipboard-check-multiple-outline"></ha-icon>
            ${title}
          </span>
          ${tasks.length > 0
            ? html`<span style="font-size:13px;color:var(--secondary-text-color);">
                ${tasks.length} task${tasks.length !== 1 ? "s" : ""}
              </span>`
            : nothing}
        </div>

        ${this._loading
          ? html`<div class="empty-state">Loading tasks…</div>`
          : tasks.length === 0
          ? html`
              <div class="empty-state">
                <ha-icon icon="mdi:check-all"></ha-icon>
                All caught up!
              </div>
            `
          : html`
              <div class="task-list">
                ${tasks.map((task, i) => html`
                  ${i > 0 ? html`<div class="divider"></div>` : nothing}
                  ${this._renderTask(task)}
                `)}
              </div>
            `}
      </ha-card>
    `;
  }

  private _renderTask(task: Task) {
    const isCompleting = this._completing.has(task.task_id);
    const iconColor = statusColor(task.status as TaskStatus);

    return html`
      <div class="task-item">
        <ha-icon
          class="task-status-icon"
          icon=${statusIcon(task.status as TaskStatus)}
          style="color: ${iconColor}"
        ></ha-icon>

        <div class="task-body">
          <div class="task-name">${task.name}</div>

          ${this.config.show_description && task.description
            ? html`<div class="task-description">${task.description}</div>`
            : nothing}

          <div class="task-meta">
            <span
              class="priority-badge"
              style="background-color: ${priorityColor(task.priority)}"
            >
              ${task.priority}
            </span>
            <span style="color: ${iconColor}">
              ${relativeDueDate(task.due_date)}
            </span>
            <span>${frequencyLabel(task.frequency, task.custom_days_interval)}</span>
          </div>

          ${this._renderEntityChips(task)}
        </div>

        ${task.status !== "completed"
          ? html`
              <ha-icon-button
                class="complete-btn"
                .label=${"Mark as done"}
                .path=${"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"}
                ?disabled=${isCompleting}
                @click=${() => this._completeTask(task.task_id)}
              ></ha-icon-button>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "intellikeep-card": IntelliKeepCard;
  }
  interface Window {
    customCards?: object[];
  }
}

// Register in the Lovelace card picker
window.customCards = window.customCards || [];
window.customCards.push({
  type: "intellikeep-card",
  name: "IntelliKeep Card",
  description: "Compact list of due and overdue IntelliKeep tasks.",
  documentationURL: "https://github.com/henriquekraemer/intellikeep",
});
