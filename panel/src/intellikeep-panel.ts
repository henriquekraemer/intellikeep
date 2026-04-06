import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, Route, Task } from "./types";
import { subscribeTasks } from "./api";
import { t } from "./translations";
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
  @property({ type: Boolean }) narrow = false;

  @state() private _tasks: Task[] = [];
  @state() private _currentPath = "/tasks";
  @state() private _loading = true;
  @state() private _enableAnimations = true;
  @state() private _modalStack: string[] = [];

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
    .appbar-back {
      margin-right: -8px;
      color: var(--app-header-text-color, #fff);
      --mdc-icon-button-size: 40px;
      --mdc-ripple-color: var(--app-header-text-color, #fff);
    }

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
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .content-scroll {
      flex: 1;
      overflow-y: auto;
      padding: var(--ik-padding);
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.48);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }
    .modal-container {
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 24px;
      width: 100%;
      max-width: 640px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 8px 40px rgba(0,0,0,0.28);
    }
    .modal-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    .modal-title {
      font-size: 18px;
      font-weight: 500;
      flex: 1;
      color: var(--primary-text-color);
    }
    .modal-close {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 4px;
      border-radius: 6px;
      display: flex;
      align-items: center;
    }
    .modal-close:hover { background: var(--secondary-background-color); }

    .page-title {
      font-size: 22px;
      font-weight: 500;
      color: var(--primary-text-color);
      margin: 0 0 20px;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    this._enableAnimations = localStorage.getItem("intellikeep.animations") !== "false";
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
    history.replaceState(null, "", location.pathname + "#" + path);
  }

  private _getEditTask(): Task | null {
    const match = this._currentPath.match(/^\/edit\/(.+)$/);
    if (!match) return null;
    return this._tasks.find((t) => t.task_id === match[1]) ?? null;
  }

  protected render() {
    const path = this._currentPath;
    const tr = t(this.hass?.language);
    const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    const isNew = path === "/new";
    const isEdit = path.startsWith("/edit/");
    const isSettings = path === "/settings";
    const isTasks = !isNew && !isEdit && !isSettings;

    const dueCount = this._tasks.filter((t) => t.status === "due" || t.status === "overdue").length;

    return html`
      <div class="appbar">
        ${isMobile && (isNew || isEdit) ? html`
          <ha-icon-button class="appbar-back" .label=${tr.back} @click=${() => this._navigate("/tasks")} path="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z">
          </ha-icon-button>
        ` : html`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`}
        <span class="appbar-title">IntelliKeep</span>
        <div class="appbar-actions">
          <button class="appbar-btn" @click=${() => {
            if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
              this._modalStack = ["__new__"];
            } else {
              this._navigate("/new");
            }
          }}>
            <ha-icon icon="mdi:plus" style="--mdc-icon-size:16px"></ha-icon>
            ${tr.newTask}
          </button>
        </div>
      </div>

      ${!(isMobile && (isNew || isEdit)) ? html`
        <div class="tabs">
          <div class="tab ${isTasks ? "active" : ""}" @click=${() => this._navigate("/tasks")}>
            ${tr.tasks}
            ${dueCount > 0 ? html`<span style="background:var(--error-color,#f44336);color:#fff;font-size:10px;padding:1px 5px;border-radius:8px;margin-left:5px;font-weight:700">${dueCount}</span>` : nothing}
          </div>
          <div class="tab ${isSettings ? "active" : ""}" @click=${() => this._navigate("/settings")}>${tr.settings}</div>
        </div>
      ` : nothing}

      <div class="content" @navigate=${(e: CustomEvent) => this._navigate(e.detail)} @open-task-modal=${(e: CustomEvent) => { this._modalStack = [e.detail]; }}>
        ${isTasks && !this._loading
          ? html`
              <ik-task-list-view
                .hass=${this.hass}
                .tasks=${this._tasks}
                .enableAnimations=${this._enableAnimations}
                @navigate=${(e: CustomEvent) => this._navigate(e.detail)}
              ></ik-task-list-view>
            `
          : html`<div class="content-scroll">
            ${this._loading
              ? html`<p>${tr.loading}</p>`
              : isNew
              ? html`
                  <div class="page-title">${tr.newTaskTitle}</div>
                  <ik-task-form-view
                    .hass=${this.hass}
                    .tasks=${this._tasks}
                    .enableAnimations=${this._enableAnimations}
                    @navigate=${(e: CustomEvent) => this._navigate(e.detail)}
                  ></ik-task-form-view>
                `
              : isEdit
              ? html`
                  <div class="page-title">${(() => { const t2 = this._getEditTask(); return t2?.task_number ? `${tr.editTask} #${String(t2.task_number).padStart(3,'0')}` : tr.editTask; })()}</div>
                  <ik-task-form-view
                    .hass=${this.hass}
                    .task=${this._getEditTask()}
                    .tasks=${this._tasks}
                    .enableAnimations=${this._enableAnimations}
                    @navigate=${(e: CustomEvent) => this._navigate(e.detail)}
                  ></ik-task-form-view>
                `
              : isSettings
              ? html`
                  <div class="page-title">${tr.settingsTitle}</div>
                  <ik-settings-view
                    .hass=${this.hass}
                    .enableAnimations=${this._enableAnimations}
                    @animations-changed=${(e: CustomEvent) => {
                      this._enableAnimations = e.detail;
                      localStorage.setItem("intellikeep.animations", String(e.detail));
                    }}
                  ></ik-settings-view>
                `
              : nothing}
          </div>`}
      </div>

      ${this._modalStack.length > 0 ? html`
        <div class="modal-overlay" @click=${(e: MouseEvent) => { if (e.target === e.currentTarget) this._modalStack = []; }}>
          <div class="modal-container">
            <div class="modal-header">
              <span class="modal-title">${(() => {
                const top = this._modalStack[this._modalStack.length - 1];
                if (top === "__new__") return tr.newTaskTitle;
                const mt = this._tasks.find(t => t.task_id === top);
                return mt?.task_number ? `${tr.editTask} #${String(mt.task_number).padStart(3,'0')}` : tr.editTask;
              })()}</span>
              <button class="modal-close" @click=${() => { this._modalStack = []; }}><ha-icon icon="mdi:close" style="--mdc-icon-size:20px"></ha-icon></button>
            </div>
            <ik-task-form-view
              .hass=${this.hass}
              .task=${(() => { const top = this._modalStack[this._modalStack.length - 1]; return top === "__new__" ? null : (this._tasks.find(t => t.task_id === top) ?? null); })()}
              .tasks=${this._tasks}
              .enableAnimations=${this._enableAnimations}
              @navigate=${(e: CustomEvent) => { e.stopPropagation(); this._modalStack = []; }}
            ></ik-task-form-view>
          </div>
        </div>
      ` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "intellikeep-panel": IntelliKeepPanel;
  }
}
