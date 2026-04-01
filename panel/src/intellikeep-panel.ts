import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, Route, Task } from "./types";
import { subscribeTasks } from "./api";
import "./views/task-list-view";
import "./views/task-form-view";
import "./views/task-history-view";
import "./views/settings-view";

// HA passes hass + panel + route to panel elements automatically.
@customElement("intellikeep-panel")
export class IntelliKeepPanel extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) panel?: { config?: Record<string, unknown> };
  @property({ attribute: false }) route?: Route;

  @state() private _tasks: Task[] = [];
  @state() private _currentPath = "/tasks";
  @state() private _loading = true;

  private _unsubscribe?: () => void;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--primary-background-color);
      --ik-padding: 20px;
    }

    /* Top app bar */
    .appbar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 var(--ik-padding);
      height: 56px;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, #fff);
      box-shadow: 0 2px 4px rgba(0,0,0,.2);
      flex-shrink: 0;
    }
    .appbar ha-icon { opacity: 0.9; }
    .appbar-title { font-size: 20px; font-weight: 500; flex: 1; }
    .appbar-actions { display: flex; gap: 4px; }
    .appbar-btn {
      background: rgba(255,255,255,.15);
      border: none;
      border-radius: 6px;
      color: inherit;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .appbar-btn:hover { background: rgba(255,255,255,.25); }
    .appbar-btn.active { background: rgba(255,255,255,.3); font-weight: 600; }

    /* Nav tabs */
    .tabs {
      display: flex;
      background: var(--card-background-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 0 var(--ik-padding);
      flex-shrink: 0;
    }
    .tab {
      padding: 12px 16px;
      font-size: 13px;
      font-weight: 500;
      color: var(--secondary-text-color);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: color 0.15s, border-color 0.15s;
    }
    .tab:hover { color: var(--primary-text-color); }
    .tab.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }

    /* Content */
    .content {
      flex: 1;
      overflow-y: auto;
      padding: var(--ik-padding);
    }

    .page-title {
      font-size: 22px;
      font-weight: 500;
      color: var(--primary-text-color);
      margin: 0 0 20px;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this._subscribe();
    this._restoreRoute();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) this._unsubscribe();
  }

  private async _subscribe() {
    try {
      this._unsubscribe = await subscribeTasks(this.hass, (tasks) => {
        this._tasks = tasks;
        this._loading = false;
      });
    } catch {
      this._loading = false;
    }
  }

  private _restoreRoute() {
    const hash = location.hash.replace("#", "") || "/tasks";
    this._currentPath = hash;
  }

  private _navigate(path: string) {
    this._currentPath = path;
    history.pushState(null, "", `#${path}`);
  }

  private _getEditTask(): Task | null {
    const match = this._currentPath.match(/^\/edit\/(.+)$/);
    if (!match) return null;
    return this._tasks.find((t) => t.task_id === match[1]) ?? null;
  }

  private _getHistoryTaskId(): string {
    const match = this._currentPath.match(/^\/history\/(.+)$/);
    return match ? match[1] : "";
  }

  protected render() {
    const path = this._currentPath;

    const isNew = path === "/new";
    const isEdit = path.startsWith("/edit/");
    const isHistory = path.startsWith("/history/");
    const isSettings = path === "/settings";
    const isTasks = !isNew && !isEdit && !isHistory && !isSettings;

    const dueCount = this._tasks.filter((t) => t.status === "due" || t.status === "overdue").length;

    return html`
      <div class="appbar">
        <ha-icon icon="mdi:clipboard-check-multiple-outline"></ha-icon>
        <span class="appbar-title">IntelliKeep</span>
        <div class="appbar-actions">
          <button class="appbar-btn" @click=${() => this._navigate("/new")}>
            <ha-icon icon="mdi:plus" style="--mdc-icon-size:16px"></ha-icon>
            New task
          </button>
        </div>
      </div>

      <div class="tabs">
        <div class="tab ${isTasks ? "active" : ""}" @click=${() => this._navigate("/tasks")}>
          Tasks
          ${dueCount > 0 ? html`<span style="background:var(--error-color,#f44336);color:#fff;font-size:10px;padding:1px 5px;border-radius:8px;margin-left:5px;font-weight:700">${dueCount}</span>` : nothing}
        </div>
        <div class="tab ${isSettings ? "active" : ""}" @click=${() => this._navigate("/settings")}>Settings</div>
      </div>

      <div class="content" @navigate=${(e: CustomEvent) => this._navigate(e.detail)}>
        ${this._loading
          ? html`<p>Loading IntelliKeep…</p>`
          : isTasks
          ? html`
              <ik-task-list-view
                .hass=${this.hass}
                .tasks=${this._tasks}
                @navigate=${(e: CustomEvent) => this._navigate(e.detail)}
              ></ik-task-list-view>
            `
          : isNew
          ? html`
              <div class="page-title">New Task</div>
              <ik-task-form-view
                .hass=${this.hass}
                @navigate=${(e: CustomEvent) => this._navigate(e.detail)}
              ></ik-task-form-view>
            `
          : isEdit
          ? html`
              <div class="page-title">Edit Task</div>
              <ik-task-form-view
                .hass=${this.hass}
                .task=${this._getEditTask()}
                @navigate=${(e: CustomEvent) => this._navigate(e.detail)}
              ></ik-task-form-view>
            `
          : isHistory
          ? html`
              <ik-task-history-view
                .hass=${this.hass}
                .taskId=${this._getHistoryTaskId()}
                @navigate=${(e: CustomEvent) => this._navigate(e.detail)}
              ></ik-task-history-view>
            `
          : isSettings
          ? html`
              <div class="page-title">Settings</div>
              <ik-settings-view .hass=${this.hass}></ik-settings-view>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "intellikeep-panel": IntelliKeepPanel;
  }
}
