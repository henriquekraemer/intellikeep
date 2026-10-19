import { LitElement, html, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  HomeAssistant,
  IntelliKeepCardConfig,
  Task,
  TaskPriority,
  TaskStatus,
} from "./types";
import { cardStyles } from "./styles";
import { t } from "./translations";
import { daysUntil, errorText, formatRelativeDue, formatShortDate, urgencyOf } from "./utils";

/** The IntelliKeep panel; "View all" opens it. */
const PANEL_PATH = "/intellikeep";
const DEFAULT_MAX_TASKS = 3;
const PRIORITIES: TaskPriority[] = ["critical", "high", "medium", "low"];

/** Editor label in the frontend's language. getConfigForm is static, so there is no `hass` to read it from. */
function configLabel(name: string): string | undefined {
  const root = document.querySelector("home-assistant") as (Element & { hass?: HomeAssistant }) | null;
  const tr = t(root?.hass?.language);
  // `title` has no entry: Home Assistant labels that field with its own translation
  const labels: Record<string, string> = {
    max_tasks: tr.editorMaxTasks,
    show_linked_entities: tr.editorShowLinkedEntities,
    show_description: tr.editorShowDescription,
  };
  return labels[name];
}

/**
 * Dashboard card: a header with how many tasks are overdue and due today,
 * the next open tasks with a checkbox that completes them (with Undo), and
 * a link to the panel.
 */
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

  static getConfigForm() {
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        { name: "max_tasks", selector: { number: { min: 1, max: 50, mode: "box" } } },
        { name: "show_linked_entities", selector: { boolean: {} } },
        { name: "show_description", selector: { boolean: {} } },
      ],
      computeLabel: (field: { name: string }) => configLabel(field.name),
    };
  }

  // No title: the card then shows its default one in the user's language
  static getStubConfig() {
    return {
      max_tasks: DEFAULT_MAX_TASKS,
      show_linked_entities: false,
      show_description: false,
    };
  }

  /** Height in 50px units, for masonry dashboards: header, one per row, footer. */
  getCardSize(): number {
    return 2 + (this.config?.max_tasks ?? DEFAULT_MAX_TASKS);
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

  /** Open tasks (or the configured statuses and priorities), most urgent first. */
  private get _openTasks(): Task[] {
    const statuses = this.config.filter_status;
    const priorities = this.config.filter_priority;
    const dueTime = (task: Task) => (task.due_date ? Date.parse(task.due_date) : Infinity);
    return this._tasks
      .filter((task) => (statuses?.length ? statuses.includes(task.status as TaskStatus) : task.status !== "completed"))
      .filter((task) => !priorities?.length || priorities.includes(task.priority))
      .sort((a, b) =>
        dueTime(a) - dueTime(b)
        || PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority)
        || a.task_number - b.task_number);
  }

  private _toast(message: string, action?: { text: string; action: () => void }, duration = 4000) {
    this.dispatchEvent(new CustomEvent("hass-notification", {
      detail: { message, action, duration },
      bubbles: true,
      composed: true,
    }));
  }

  private _setCompleting(taskId: string, busy: boolean) {
    const next = new Set(this._completing);
    if (busy) next.add(taskId);
    else next.delete(taskId);
    this._completing = next;
  }

  private async _completeTask(task: Task) {
    const tr = t(this.hass.language);
    this._setCompleting(task.task_id, true);
    try {
      await this.hass.callService("intellikeep", "complete_task", {
        task_id: task.task_id,
        completed_by: this.hass.user?.name ?? "",
      });
      this._toast(tr.taskCompleted, { text: tr.undoAction, action: () => void this._reopenTask(task) }, 8000);
    } catch (err) {
      this._toast(tr.actionFailed(errorText(err)));
    } finally {
      this._setCompleting(task.task_id, false);
    }
  }

  private async _reopenTask(task: Task) {
    try {
      await this.hass.callService("intellikeep", "reopen_task", {
        task_id: task.task_id,
        performed_by: this.hass.user?.name ?? "",
      });
    } catch (err) {
      this._toast(t(this.hass.language).actionFailed(errorText(err)));
    }
  }

  /** Same-tab navigation inside Home Assistant; modified clicks keep the browser's handling. */
  private _openPanel(e: MouseEvent) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    history.pushState(null, "", PANEL_PATH);
    window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
  }

  private _linkedLabel(entry: string): string {
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

  private _renderSummary(tasks: Task[]) {
    const tr = t(this.hass?.language);
    if (this._loading) return tr.loading;
    if (tasks.length === 0) return tr.allClear;
    const overdue = tasks.filter((task) => urgencyOf(task, this.hass) === "overdue").length;
    const today = tasks.filter((task) => urgencyOf(task, this.hass) === "today").length;
    const parts = [
      overdue ? html`<span class="overdue">${tr.overdueCount(overdue)}</span>` : null,
      today ? html`<span class="today">${tr.dueTodayCount(today)}</span>` : null,
    ].filter((part) => part !== null);
    if (parts.length === 0) return tr.openCount(tasks.length);
    return parts.map((part, i) => html`${i > 0 ? " · " : ""}${part}`);
  }

  private _renderChip(task: Task) {
    const tr = t(this.hass?.language);
    if (!task.due_date) return nothing;
    const urgency = urgencyOf(task, this.hass);
    if (urgency === "overdue") {
      const days = -daysUntil(new Date(task.due_date), this.hass);
      return html`<span class="chip overdue">${days > 0 ? tr.daysOverdue(days) : tr.overdue}</span>`;
    }
    if (urgency === "today") {
      return html`<span class="chip today">${formatRelativeDue(task.due_date, this.hass)}</span>`;
    }
    return html`<span class="chip">${formatShortDate(task.due_date, this.hass)}</span>`;
  }

  private _renderTask(task: Task) {
    const tr = t(this.hass?.language);
    const completing = this._completing.has(task.task_id);
    const description = this.config.show_description ? task.description : "";
    const links = this.config.show_linked_entities
      ? task.linked_entity_ids.map((entry) => this._linkedLabel(entry)).join(", ")
      : "";
    return html`
      <div class="row">
        <button
          class="check"
          role="checkbox"
          aria-checked=${completing ? "true" : "false"}
          aria-label=${tr.markComplete(task.name)}
          ?disabled=${completing || task.status === "completed"}
          @click=${() => this._completeTask(task)}
        >
          <span class="box">${completing ? html`<ha-icon icon="mdi:check"></ha-icon>` : nothing}</span>
        </button>
        <div class="text">
          <div class="name">${task.name}</div>
          ${description ? html`<div class="secondary">${description}</div>` : nothing}
          ${links ? html`<div class="secondary">${links}</div>` : nothing}
        </div>
        ${this._renderChip(task)}
      </div>
    `;
  }

  protected render() {
    const tr = t(this.hass?.language);
    const title = this.config?.title || tr.defaultTitle;
    const open = this._openTasks;
    const shown = open.slice(0, this.config.max_tasks ?? DEFAULT_MAX_TASKS);

    return html`
      <ha-card>
        <div class="header">
          <div class="header-icon" aria-hidden="true"><ha-icon icon="mdi:wrench-outline"></ha-icon></div>
          <div class="header-text">
            <h2 class="title">${title}</h2>
            <div class="summary">${this._renderSummary(open)}</div>
          </div>
        </div>
        ${shown.map((task) => this._renderTask(task))}
        ${open.length > 0 ? html`
          <div class="footer">
            <a href=${PANEL_PATH} @click=${this._openPanel}>${tr.viewAll(open.length)}</a>
          </div>
        ` : nothing}
      </ha-card>
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
  description: "Overdue and upcoming IntelliKeep tasks, completed with one click.",
  documentationURL: "https://github.com/henriquekraemer/intellikeep",
});
