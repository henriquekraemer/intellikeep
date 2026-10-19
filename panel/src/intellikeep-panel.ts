import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { HomeAssistant, OpenTaskRequest, Route, Task } from "./types";
import { subscribeTasks } from "./api";
import { isDesktop } from "./utils";
import { tokens } from "./styles";

const MDI_COG_OUTLINE = "M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z";
const MDI_MAGNIFY = "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z";
const MDI_CLOSE = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z";
import { t } from "./translations";
import "./views/task-list-view";
import "./views/task-form-view";
import "./views/task-history-view";
import "./views/settings-view";
import "./views/calendar-view";

// HA passes hass + panel + route to panel elements automatically.
@customElement("intellikeep-panel")
export class IntelliKeepPanel extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) panel?: { config?: Record<string, unknown> };
  @property({ attribute: false }) route?: Route;
  @property({ type: Boolean }) narrow = false;

  @state() private _tasks: Task[] = [];
  @state() private _currentPath = "/tasks";
  @state() private _returnPath = "/tasks";
  @state() private _loading = true;
  @state() private _enableAnimations = true;
  @state() private _modalStack: string[] = [];
  @state() private _showSettings = false;
  /** Form tab, copied task and due day for the next form opened (see OpenTaskRequest). */
  @state() private _formTab: NonNullable<OpenTaskRequest["tab"]> = "edit";
  @state() private _formTemplate: Task | null = null;
  @state() private _formDueDate = "";
  /** The panel is under 600px wide, even if HA isn't narrow (a docked sidebar on a small window). */
  @state() private _smallWidth = false;
  /** Tasks tab search text; narrow layouts type it in the app bar. */
  @state() private _taskSearch = "";
  @state() private _searchOpen = false;

  private _unsubscribe?: () => void;
  private _resizeObserver?: ResizeObserver;
  /** Where keyboard focus was before the task dialog opened, to give it back on close. */
  private _focusBeforeDialog: HTMLElement | null = null;

  static styles = [tokens, css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--primary-background-color);
      --ik-padding: 20px;
    }
    :host([narrow-layout]) { --ik-padding: 16px; }

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
    .appbar-title { font-size: 20px; font-weight: 400; flex: 1; }
    .appbar-actions ha-icon-button {
      --ha-icon-button-size: 44px;
      --mdc-icon-button-size: 44px;
    }
    :host([narrow-layout]) .appbar { gap: 4px; padding: 0 4px; }
    :host([narrow-layout]) .appbar-actions ha-icon-button { margin: 0; }
    :host([narrow-layout]) .appbar-title { margin-inline-start: 8px; }
    .appbar-search {
      flex: 1;
      min-width: 0;
      height: 40px;
      padding: 0 8px;
      border: none;
      outline: none;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 18px;
    }
    .appbar-search::placeholder { color: inherit; opacity: 0.7; }
    .appbar-search::-webkit-search-cancel-button { display: none; }
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
      /* Current Home Assistant sizes ha-icon-button from --ha-icon-button-size; 2026.1 still reads the --mdc- one */
      --ha-icon-button-size: 40px;
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
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
      padding: 0 16px;
      box-sizing: border-box;
      font-size: 14px;
      font-weight: 500;
      color: var(--secondary-text-color);
      text-decoration: none;
      border-bottom: 2px solid transparent;
      transition: color 0.15s, border-color 0.15s;
    }
    .tab:hover { color: var(--primary-text-color); }
    .tab:focus-visible { outline: 2px solid var(--ik-focus-ring); outline-offset: -2px; }
    .tab[aria-current="page"] {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
    :host([narrow-layout]) .tabs { padding: 0; }
    :host([narrow-layout]) .tab { flex: 1 1 0; }

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
      background: var(--mdc-dialog-scrim-color, rgba(0, 0, 0, 0.48));
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

    /* Task dialog: the form brings its own header, tabs and footer */
    .modal-container.task-dialog {
      display: flex;
      flex-direction: column;
      max-width: 600px;
      padding: 0;
      overflow: hidden;
      border-radius: var(--ik-radius-dialog);
      background: var(--ik-dialog-surface);
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
    }
    .task-dialog:focus { outline: none; }
    .task-dialog > ik-task-form-view, .form-page > ik-task-form-view { flex: 1 1 auto; min-height: 0; }
    .form-page {
      flex: 1;
      min-height: 0;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: var(--ik-padding);
    }
    .form-page > ik-task-form-view {
      width: 100%;
      max-width: 600px;
      max-height: 100%;
      overflow: hidden;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-dialog);
      background: var(--ik-dialog-surface);
    }
    @media (max-width: 600px) {
      .form-page { padding: 0; align-items: stretch; }
      .form-page > ik-task-form-view { max-width: none; max-height: none; border: none; border-radius: 0; }
    }

    .page-title {
      font-size: 22px;
      font-weight: 500;
      color: var(--primary-text-color);
      margin: 0 0 20px;
    }
  `];

  async connectedCallback() {
    super.connectedCallback();
    this._resizeObserver = new ResizeObserver((entries) => {
      this._smallWidth = entries[0].contentRect.width < 600;
    });
    this._resizeObserver.observe(this);
    this._enableAnimations = localStorage.getItem("intellikeep.animations") !== "false";
    await this._subscribe();
    this._restoreRoute();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) this._unsubscribe();
    this._resizeObserver?.disconnect();
  }

  /** Phone layout: HA's narrow flag, or a panel under 600px wide. */
  private get _narrowLayout(): boolean {
    return this.narrow || this._smallWidth;
  }

  protected willUpdate() {
    this.toggleAttribute("narrow-layout", this._narrowLayout);
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
    if (path.startsWith("/edit/") || path === "/new") {
      this._returnPath = this._currentPath;
    }
    this._currentPath = path;
    this._formTab = "edit";
    this._formTemplate = null;
    this._formDueDate = "";
    history.replaceState(null, "", location.pathname + "#" + path);
  }

  protected updated(changed: PropertyValues) {
    if (changed.has("_searchOpen") && this._searchOpen) {
      this.renderRoot.querySelector<HTMLInputElement>(".appbar-search")?.focus();
    }
    if (!changed.has("_modalStack")) return;
    const wasOpen = ((changed.get("_modalStack") as string[] | undefined) ?? []).length > 0;
    if (this._modalStack.length > 0 && !wasOpen) {
      this.renderRoot.querySelector<HTMLElement>(".task-dialog")?.focus();
    } else if (this._modalStack.length === 0 && wasOpen) {
      this._focusBeforeDialog?.focus();
      this._focusBeforeDialog = null;
    }
  }

  private _openModal(top: string) {
    if (this._modalStack.length === 0) {
      let active = document.activeElement;
      while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
      this._focusBeforeDialog = active as HTMLElement | null;
    }
    this._modalStack = [top];
  }

  /** Opens the task form as a dialog on desktop, or as its own page on touch devices (after _navigate's reset). */
  private _openTask(request: OpenTaskRequest) {
    if (isDesktop()) {
      this._openModal(request.taskId ?? "__new__");
    } else {
      this._navigate(request.taskId ? `/edit/${request.taskId}` : "/new");
    }
    this._formTab = request.tab ?? "edit";
    this._formTemplate = request.template ?? null;
    this._formDueDate = request.dueDate ?? "";
  }

  private _closeSearch() {
    this._searchOpen = false;
    this._taskSearch = "";
  }

  /** Tab links: plain clicks switch tabs in place, modified clicks open a new browser tab. */
  private _onTabClick(e: MouseEvent, path: string) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    this._navigate(path);
  }

  private _getEditTask(): Task | null {
    const match = this._currentPath.match(/^\/edit\/(.+)$/);
    if (!match) return null;
    return this._tasks.find((t) => t.task_id === match[1]) ?? null;
  }

  private _renderTaskDialog() {
    const tr = t(this.hass?.language);
    const top = this._modalStack[this._modalStack.length - 1];
    const task = top === "__new__" ? null : (this._tasks.find((t) => t.task_id === top) ?? null);
    const close = () => { this._modalStack = []; };
    return html`
      <div
        class="modal-overlay"
        @click=${(e: MouseEvent) => { if (e.target === e.currentTarget) close(); }}
        @keydown=${(e: KeyboardEvent) => { if (e.key === "Escape") close(); }}
      >
        <div class="modal-container task-dialog" role="dialog" aria-modal="true" aria-label=${task?.name ?? tr.newTaskTitle} tabindex="-1">
          ${keyed(`${top}|${this._formTemplate?.task_id ?? ""}|${this._formDueDate}`, html`
            <ik-task-form-view
              .hass=${this.hass}
              .task=${task}
              .tasks=${this._tasks}
              .template=${this._formTemplate}
              .dueDate=${this._formDueDate}
              .initialTab=${this._formTab}
              .enableAnimations=${this._enableAnimations}
              @navigate=${(e: CustomEvent) => { e.stopPropagation(); close(); }}
              @open-task=${(e: CustomEvent<OpenTaskRequest>) => { e.stopPropagation(); this._openTask(e.detail); }}
            ></ik-task-form-view>
          `)}
        </div>
      </div>
    `;
  }

  protected render() {
    const path = this._currentPath;
    const tr = t(this.hass?.language);
    const isMobile = !isDesktop();

    const isNew = path === "/new";
    const isEdit = path.startsWith("/edit/");
    const isSettings = path === "/settings";
    const isHistory = path === "/history";
    const isCalendar = path === "/calendar";
    const isTasks = !isNew && !isEdit && !isSettings && !isHistory && !isCalendar;
    const showTabs = isTasks || isHistory || isCalendar;
    const isFormPage = (isNew || isEdit) && !this._loading;
    // The form page has its own close button and title; phones give it the whole screen
    const showAppbar = !(isMobile && isFormPage);
    const narrow = this._narrowLayout;
    const searchInAppbar = narrow && isTasks;
    const searchOpen = searchInAppbar && (this._searchOpen || this._taskSearch !== "");

return html`
      ${showAppbar ? html`<div class="appbar">
        ${isMobile && (isNew || isEdit || isSettings) ? html`
          <ha-icon-button class="appbar-back" .label=${tr.back} @click=${() => this._navigate(this._returnPath)} path="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z">
          </ha-icon-button>
        ` : html`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`}
        ${searchOpen ? html`
          <input
            class="appbar-search"
            type="search"
            .value=${this._taskSearch}
            placeholder=${tr.searchPlaceholder}
            aria-label=${tr.searchPlaceholder}
            @input=${(e: Event) => { this._taskSearch = (e.target as HTMLInputElement).value; }}
            @keydown=${(e: KeyboardEvent) => { if (e.key === "Escape") this._closeSearch(); }}
          />
        ` : html`
          <span class="appbar-title">${isMobile && (isNew || isEdit || isSettings)
            ? isNew ? tr.newTaskTitle
            : isSettings ? tr.settingsTitle
            : (() => { const t2 = this._getEditTask(); return t2?.task_number ? `${tr.editTask} #${String(t2.task_number).padStart(3, "0")}` : tr.editTask; })()
            : "IntelliKeep"}</span>
        `}
        <div class="appbar-actions">
          ${searchInAppbar ? html`
            <ha-icon-button
              class="appbar-back"
              .label=${searchOpen ? tr.closeSearch : tr.searchPlaceholder}
              .path=${searchOpen ? MDI_CLOSE : MDI_MAGNIFY}
              @click=${() => { if (searchOpen) this._closeSearch(); else this._searchOpen = true; }}
            ></ha-icon-button>
          ` : nothing}
          ${showTabs && !searchOpen ? html`
            <ha-icon-button class="appbar-back" .label=${tr.settings} @click=${() => {
              if (isMobile) {
                this._navigate("/settings");
              } else {
                this._showSettings = true;
              }
            }} .path=${MDI_COG_OUTLINE}>
            </ha-icon-button>
          ` : nothing}
        </div>
      </div>` : nothing}

      <div class="content"
        @navigate=${(e: CustomEvent) => this._navigate(e.detail)}
        @open-task=${(e: CustomEvent<OpenTaskRequest>) => this._openTask(e.detail)}>
        ${showTabs ? html`
          <nav class="tabs" aria-label=${tr.navLabel}>
            ${([["/tasks", tr.tasks, isTasks], ["/calendar", tr.calendarNavTab, isCalendar], ["/history", tr.historyNavTab, isHistory]] as const).map(([tabPath, label, active]) => html`
              <a
                class="tab"
                href="#${tabPath}"
                aria-current=${active ? "page" : "false"}
                @click=${(e: MouseEvent) => this._onTabClick(e, tabPath)}
              >${label}</a>
            `)}
          </nav>
        ` : nothing}
        ${isTasks && !this._loading
          ? html`
              <ik-task-list-view
                .hass=${this.hass}
                .tasks=${this._tasks}
                .enableAnimations=${this._enableAnimations}
                .narrow=${narrow}
                .searchQuery=${this._taskSearch}
                @search-changed=${(e: CustomEvent<string>) => { this._taskSearch = e.detail; }}
              ></ik-task-list-view>
            `
          : isCalendar && !this._loading
          ? html`
              <ik-calendar-view
                .hass=${this.hass}
                .tasks=${this._tasks}
                .narrow=${narrow}
              ></ik-calendar-view>
            `
          : isFormPage
          ? html`
              <div class="form-page">
                ${keyed(`${path}|${this._formTemplate?.task_id ?? ""}|${this._formDueDate}`, html`
                  <ik-task-form-view
                    .hass=${this.hass}
                    .task=${isEdit ? this._getEditTask() : null}
                    .tasks=${this._tasks}
                    .template=${this._formTemplate}
                    .dueDate=${this._formDueDate}
                    .initialTab=${this._formTab}
                    .enableAnimations=${this._enableAnimations}
                    .returnPath=${this._returnPath}
                  ></ik-task-form-view>
                `)}
              </div>
            `
          : html`<div class="content-scroll">
            ${this._loading
              ? html`<p>${tr.loading}</p>`
              : isSettings
              ? html`
                  ${!isMobile ? html`<div class="page-title">${tr.settingsTitle}</div>` : nothing}
                  <ik-settings-view
                    .hass=${this.hass}
                    .enableAnimations=${this._enableAnimations}
                    @animations-changed=${(e: CustomEvent) => {
                      this._enableAnimations = e.detail;
                      localStorage.setItem("intellikeep.animations", String(e.detail));
                    }}
                  ></ik-settings-view>
                `
              : isHistory
              ? html`
                  <ik-task-history-view
                    .hass=${this.hass}
                    .tasks=${this._tasks}
                    .narrow=${narrow}
                  ></ik-task-history-view>
                `
              : nothing}
          </div>`}
      </div>

      ${this._modalStack.length > 0 ? this._renderTaskDialog() : nothing}

      ${this._showSettings ? html`
        <div class="modal-overlay" @click=${(e: MouseEvent) => { if (e.target === e.currentTarget) this._showSettings = false; }}>
          <div class="modal-container">
            <div class="modal-header">
              <span class="modal-title">${tr.settingsTitle}</span>
              <button class="modal-close" @click=${() => { this._showSettings = false; }}><ha-icon icon="mdi:close" style="--mdc-icon-size:20px"></ha-icon></button>
            </div>
            <ik-settings-view
              .hass=${this.hass}
              .enableAnimations=${this._enableAnimations}
              @animations-changed=${(e: CustomEvent) => {
                this._enableAnimations = e.detail;
                localStorage.setItem("intellikeep.animations", String(e.detail));
              }}
            ></ik-settings-view>
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
