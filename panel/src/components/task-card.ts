import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HomeAssistant, Task, TaskExecution, TaskPriority } from "../types";
import { t } from "../translations";
import { daysUntil, formatRelative, formatRelativeDue, formatShortDate, formatTime, isMidnight, repeatLabel } from "../utils";
import { MenuItem } from "./menu";
import "./menu";

export const PRIORITY_ICON: Record<TaskPriority, string> = {
  critical: "mdi:chevron-double-up",
  high: "mdi:chevron-up",
  medium: "mdi:equal",
  low: "mdi:chevron-down",
};

/** Overdue and due-today rows are tinted; nothing else is. */
export const urgencyOf = (task: Task, hass: HomeAssistant | undefined): "overdue" | "today" | null => {
  if (task.status === "overdue") return "overdue";
  if (task.status !== "completed" && task.due_date && daysUntil(new Date(task.due_date), hass) <= 0) return "today";
  return null;
};

/**
 * One task in the list: checkbox, icon, name and description, priority, due
 * chip and a ⋮ menu. With `completion` set the row stands for that completion
 * record instead, checked, with the completion time in the chip.
 * `narrow` keeps only the checkbox and the name, with due, priority and
 * repeat in one line under it.
 * Fires `task-toggle` from the checkbox, `task-open` from the name and
 * `menu-select` (detail: "edit" | "duplicate" | "history" | "delete") from the menu.
 */
@customElement("ik-task-card")
export class IkTaskCard extends LitElement {
  @property({ attribute: false }) task!: Task;
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) completion: TaskExecution | null = null;
  /** An action on this task is in flight. */
  @property({ type: Boolean }) busy = false;
  /** Completed rows only: whether unchecking may reopen the task. */
  @property({ type: Boolean }) canReopen = false;
  @property({ type: Boolean, reflect: true }) narrow = false;
  /** Narrow only: the row sits under a "Today" header, so a due time alone is enough. */
  @property({ type: Boolean }) timeOnly = false;

  static styles = css`
    :host { display: block; }
    .row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      min-height: 72px;
      padding: 6px 4px;
      box-sizing: border-box;
    }
    button { font: inherit; }
    button:focus-visible, a:focus-visible {
      outline: 2px solid var(--ik-focus-ring);
      outline-offset: 2px;
    }
    .check {
      width: var(--ik-hit-target);
      height: var(--ik-hit-target);
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: none;
      cursor: pointer;
    }
    .check:hover:not(:disabled) { background: var(--ik-subtle-fill); }
    .check:disabled { cursor: default; }
    .box {
      width: 20px;
      height: 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--secondary-text-color);
      border-radius: 6px;
      color: var(--text-primary-color);
      --mdc-icon-size: 16px;
    }
    .check:hover:not(:disabled) .box { border-color: var(--primary-color); }
    .check[aria-checked="true"] .box {
      background: var(--primary-color);
      border-color: var(--primary-color);
    }
    .check:disabled .box { opacity: 0.6; }
    .icon {
      width: 40px;
      height: 40px;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--ik-subtle-fill);
      color: var(--primary-text-color);
      --mdc-icon-size: 20px;
    }
    .overdue .icon { background: var(--ik-error-fill); color: var(--ik-error-text); }
    .today .icon { background: var(--ik-warning-fill); color: var(--ik-warning-text); }
    .text { flex: 1 1 260px; min-width: 0; cursor: pointer; }
    .name {
      font-size: var(--ik-row-title-size);
      font-weight: var(--ik-row-title-weight);
      color: var(--primary-text-color);
      text-decoration: none;
      overflow-wrap: anywhere;
    }
    .name:hover { text-decoration: underline; }
    .number {
      margin-inline-start: 8px;
      font-size: 12px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .desc {
      margin-top: 3px;
      font-size: var(--ik-row-secondary-size);
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .priority {
      width: 96px;
      flex: none;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: var(--ik-row-secondary-size);
      color: var(--secondary-text-color);
      --mdc-icon-size: 16px;
    }
    .priority.high { color: var(--primary-text-color); }
    .priority.critical { color: var(--ik-error-text); }
    .due {
      width: 168px;
      flex: none;
      display: flex;
      justify-content: flex-end;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: var(--ik-chip-height);
      padding: 0 12px;
      border-radius: var(--ik-radius-chip);
      background: var(--ik-subtle-fill);
      color: var(--primary-text-color);
      font-size: var(--ik-row-secondary-size);
      font-weight: 500;
      white-space: nowrap;
      --mdc-icon-size: 14px;
    }
    .chip.overdue { background: var(--ik-error-fill); color: var(--ik-error-text); }
    .chip.today { background: var(--ik-warning-fill); color: var(--ik-warning-text); }
    .chip.done { background: var(--ik-success-fill); color: var(--ik-success-text); }

    :host([narrow]) .row {
      flex-wrap: nowrap;
      gap: 6px;
      min-height: 64px;
      padding: 4px 8px 4px 0;
    }
    :host([narrow]) .text { flex: 1 1 auto; }
    :host([narrow]) .name {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 2px 6px;
      margin-top: 3px;
      font-size: var(--ik-row-secondary-size);
      color: var(--secondary-text-color);
      --mdc-icon-size: 14px;
    }
    .meta-item { display: inline-flex; align-items: center; gap: 4px; }
    .meta .overdue { color: var(--ik-error-text); font-weight: 500; }
    .meta .today { color: var(--ik-warning-text); font-weight: 500; }
    .meta .done { color: var(--ik-success-text); font-weight: 500; }
    .meta .high ha-icon { color: var(--primary-text-color); }
    .meta .critical ha-icon { color: var(--ik-error-text); }
  `;

  private _fire(type: string) {
    this.dispatchEvent(new CustomEvent(type));
  }

  /** The name and the text under it open the task. */
  private _onTextClick(e: MouseEvent) {
    // Modified clicks keep the browser's own handling (open in a new tab)
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    this._fire("task-open");
  }

  /** Narrow rows: "3 days overdue · High · Monthly" under the name. */
  private _renderMeta(urgency: "overdue" | "today" | null) {
    const { task } = this;
    const tr = t(this.hass?.language);
    const dot = html`<span aria-hidden="true">·</span>`;
    let due: unknown = nothing;
    if (this.completion) {
      due = html`<span class="meta-item done"><ha-icon icon="mdi:check"></ha-icon>${formatRelative(this.completion.completed_at, this.hass)}</span>`;
    } else if (task.due_date && urgency === "overdue") {
      const days = -daysUntil(new Date(task.due_date), this.hass);
      due = html`<span class="meta-item overdue">${days > 0 ? tr.daysOverdue(days) : tr.overdue}</span>`;
    } else if (task.due_date && urgency === "today") {
      // Under the Today header only the time is left to say; a task due all day has none
      const when = !this.timeOnly ? formatRelativeDue(task.due_date, this.hass)
        : isMidnight(task.due_date, this.hass) ? tr.allDay : formatTime(task.due_date, this.hass);
      due = html`<span class="meta-item today">${when}</span>`;
    } else if (task.due_date) {
      due = html`<span class="meta-item">${formatShortDate(task.due_date, this.hass)}</span>`;
    }
    const repeat = repeatLabel(task, this.hass, true);
    return html`
      <div class="meta">
        ${due}${due !== nothing ? dot : nothing}
        <span class="meta-item ${task.priority}">
          <ha-icon icon=${PRIORITY_ICON[task.priority] ?? PRIORITY_ICON.medium}></ha-icon>${tr[task.priority] ?? task.priority}
        </span>
        ${repeat ? html`${dot}<span class="meta-item"><ha-icon icon="mdi:repeat"></ha-icon>${repeat}</span>` : nothing}
      </div>
    `;
  }

  private _renderChip(urgency: "overdue" | "today" | null) {
    const tr = t(this.hass?.language);
    if (this.completion) {
      return html`<span class="chip done"><ha-icon icon="mdi:check"></ha-icon>${formatRelative(this.completion.completed_at, this.hass)}</span>`;
    }
    const { due_date } = this.task;
    if (!due_date) return nothing;
    if (urgency === "overdue") {
      const days = -daysUntil(new Date(due_date), this.hass);
      return html`<span class="chip overdue"><ha-icon icon="mdi:alert-outline"></ha-icon>${days > 0 ? tr.daysOverdue(days) : tr.overdue}</span>`;
    }
    if (urgency === "today") {
      return html`<span class="chip today"><ha-icon icon="mdi:clock-outline"></ha-icon>${formatRelativeDue(due_date, this.hass)}</span>`;
    }
    return html`<span class="chip">${formatShortDate(due_date, this.hass)}</span>`;
  }

  render() {
    const { task } = this;
    const tr = t(this.hass?.language);
    const checked = this.completion !== null || this.busy;
    const urgency = this.completion ? null : urgencyOf(task, this.hass);
    const menuItems: MenuItem[] = [
      { action: "edit", label: tr.edit, icon: "mdi:pencil-outline" },
      { action: "duplicate", label: tr.duplicate, icon: "mdi:content-copy" },
      { action: "history", label: tr.historyNavTab, icon: "mdi:history" },
      { divider: true },
      { action: "delete", label: tr.deleteAction, icon: "mdi:delete-outline", danger: true },
    ];
    return html`
      <div class="row ${urgency ?? ""}">
        <button
          class="check"
          role="checkbox"
          aria-checked=${checked ? "true" : "false"}
          aria-label=${this.completion ? tr.reopenTask(task.name) : tr.markComplete(task.name)}
          ?disabled=${this.busy || (this.completion !== null && !this.canReopen)}
          @click=${() => this._fire("task-toggle")}
        >
          <span class="box">${checked ? html`<ha-icon icon="mdi:check"></ha-icon>` : nothing}</span>
        </button>
        ${this.narrow ? html`
          <div class="text" @click=${this._onTextClick}>
            <a class="name" href="#/edit/${task.task_id}">${task.name}</a>
            ${this._renderMeta(urgency)}
          </div>
        ` : html`
          <div class="icon" aria-hidden="true"><ha-icon icon=${task.icon || "mdi:wrench-outline"}></ha-icon></div>
          <div class="text" @click=${this._onTextClick}>
            <a class="name" href="#/edit/${task.task_id}">${task.name}</a>${task.task_number
              ? html`<span class="number">#${String(task.task_number).padStart(3, "0")}</span>`
              : nothing}
            ${task.description ? html`<div class="desc">${task.description}</div>` : nothing}
          </div>
          <div class="priority ${task.priority}">
            <ha-icon icon=${PRIORITY_ICON[task.priority] ?? PRIORITY_ICON.medium}></ha-icon>${tr[task.priority] ?? task.priority}
          </div>
          <div class="due">${this._renderChip(urgency)}</div>
          <ik-menu .items=${menuItems} .label=${tr.moreActions(task.name)}></ik-menu>
        `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ik-task-card": IkTaskCard;
  }
}
