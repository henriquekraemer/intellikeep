import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, Task, TaskPriority } from "../types";
import { completeTask, reopenTask, deleteTask } from "../api";
import { isDesktop } from "../utils";
import { t } from "../translations";
import "../components/task-card";
import "../components/confirm-dialog";
import "../components/link-filter";

type AreaRegistryEntry = { area_id: string; name: string };
type DeviceRegistryEntry = { id: string; area_id: string | null; name_by_user: string | null; name: string };

const FILTER_MODE_STORAGE_KEY = "intellikeep.filterMode";
const FILTER_AREAS_STORAGE_KEY = "intellikeep.filterAreas";
const FILTER_DEVICES_STORAGE_KEY = "intellikeep.filterDevices";

const loadStoredList = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
};

@customElement("ik-task-list-view")
export class IkTaskListView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) tasks: Task[] = [];
  @property({ type: Boolean }) enableAnimations = true;

  @state() private _filterTab: "pending" | "completed" = "pending";
  @state() private _filterPriority: TaskPriority | "all" = "all";
  @state() private _searchQuery = "";
  @state() private _upcomingRange: "week" | "nextweek" | "month" | "all" | "custom" =
    (localStorage.getItem("intellikeep.upcomingRange") as "week" | "nextweek" | "month" | "all" | "custom") ?? "week";
  @state() private _upcomingCustomFrom = localStorage.getItem("intellikeep.upcomingCustomFrom") ?? "";
  @state() private _upcomingCustomTo = localStorage.getItem("intellikeep.upcomingCustomTo") ?? "";
  @state() private _customFromDraft = localStorage.getItem("intellikeep.upcomingCustomFrom") ?? "";
  @state() private _customToDraft = localStorage.getItem("intellikeep.upcomingCustomTo") ?? "";
  @state() private _filterMode: "or" | "and" = (localStorage.getItem(FILTER_MODE_STORAGE_KEY) as "or" | "and") ?? "or";
  @state() private _selectedAreaIds: string[] = loadStoredList(FILTER_AREAS_STORAGE_KEY);
  @state() private _selectedDeviceIds: string[] = loadStoredList(FILTER_DEVICES_STORAGE_KEY);
  @state() private _areas: AreaRegistryEntry[] = [];
  @state() private _devices: DeviceRegistryEntry[] = [];
  @state() private _showLinkFilters = false;
  @state() private _deleteTarget: string | null = null;
  @state() private _completing: Set<string> = new Set();
  @state() private _reopening: Set<string> = new Set();
  @state() private _page = 0;
  @state() private _pageSize: 25 | 50 | 100 = 25;
  @state() private _pendingPage = 0;
  @state() private _exitingDone: Set<string> = new Set();
  @state() private _exitingDelete: Set<string> = new Set();
  @state() private _exitingUndo: Set<string> = new Set();
  @state() private _exitingEdit: Set<string> = new Set();

  connectedCallback() {
    super.connectedCallback();
    const saved = localStorage.getItem("intellikeep.filterTab");
    if (saved === "pending" || saved === "completed") {
      this._filterTab = saved;
    }
    void this._loadRegistries();
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: var(--ik-padding, 20px);
      box-sizing: border-box;
    }
    .filter-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 0 16px;
      flex-wrap: wrap;
    }
    .filter-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 13px;
      border-radius: 8px;
      border: 1.5px solid var(--divider-color);
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
      white-space: nowrap;
    }
    .filter-chip:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .filter-chip.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .filter-chip.active.chip-completed {
      background: var(--success-color, #4caf50);
      border-color: var(--success-color, #4caf50);
    }
    .chip-badge {
      display: inline-block;
      background: rgba(0,0,0,0.15);
      border-radius: 10px;
      padding: 0 5px;
      font-size: 11px;
      min-width: 16px;
      text-align: center;
      line-height: 16px;
    }
    .filter-chip:not(.active) .chip-badge {
      background: var(--divider-color);
      color: var(--primary-text-color);
    }
    .priority-select {
      padding: 5px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .filter-toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 10px;
      border-radius: 8px;
      border: 1.5px solid var(--divider-color);
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 13px;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
      margin-left: auto;
      --mdc-icon-size: 18px;
    }
    .filter-toggle-btn:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .filter-toggle-btn.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .filter-toggle-btn.has-filters:not(.active) {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .filter-toggle-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      border-radius: 8px;
      background: rgba(0,0,0,0.2);
      font-size: 10px;
      font-weight: 700;
      padding: 0 4px;
      line-height: 1;
    }
    .filter-toggle-btn:not(.active) .filter-toggle-badge {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .search-wrapper {
      position: relative;
      flex: 1;
      min-width: 160px;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 8px;
      color: var(--secondary-text-color);
      --mdc-icon-size: 16px;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 5px 10px 5px 30px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
      font-family: inherit;
      box-sizing: border-box;
    }
    .search-input::placeholder { color: var(--secondary-text-color); }

    .full-card { display: block; }
    .list-scroll {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
    }
    .extended-filters {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 0 12px;
    }
    .upcoming-filter {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 0 10px;
      flex-wrap: wrap;
    }
    .upcoming-chip {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 6px;
      border: 1.5px solid var(--divider-color);
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
    }
    .upcoming-chip:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .upcoming-chip.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .custom-range {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      padding: 0 0 10px;
    }
    .custom-range input[type="date"] {
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 12px;
      font-family: inherit;
    }
    .custom-range span {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .custom-range-btn {
      padding: 3px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 12px;
      font-family: inherit;
      cursor: pointer;
    }
    .custom-range-btn:hover {
      background: var(--secondary-background-color);
    }
    .apply-btn {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color);
    }
    .apply-btn:hover {
      opacity: 0.9;
    }
    .empty {
      text-align: center;
      padding: 40px 24px;
      color: var(--secondary-text-color);
    }
    .all-clear {
      text-align: center;
      padding: 48px 24px 40px;
    }
    .all-clear-emoji {
      font-size: 64px;
      line-height: 1;
      margin-bottom: 16px;
    }
    .all-clear-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin: 0 0 8px;
    }
    .all-clear-sub {
      font-size: 14px;
      color: var(--secondary-text-color);
      margin: 0 0 20px;
    }
    .all-clear-suggestion {
      display: inline-block;
      padding: 10px 20px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
      color: var(--primary-color);
      font-size: 14px;
      font-weight: 500;
    }
    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      align-self: stretch;
      border-radius: 0;
      border: none;
      cursor: pointer;
      transition: filter 0.15s, opacity 0.15s;
      --mdc-icon-size: 20px;
      color: #fff;
    }
    .icon-btn + .icon-btn { border-left: 1px solid rgba(255,255,255,0.2); }
    .icon-btn:hover { filter: brightness(1.12); }
    .icon-btn:disabled { opacity: 0.4; cursor: default; }
    .icon-btn.primary { background: var(--primary-color); }
    .icon-btn.undo    { background: var(--warning-color, #ff9800); }
    .icon-btn.edit    { background: var(--secondary-text-color, #757575); }
    .icon-btn.danger  { background: var(--error-color, #f44336); }
    .task-actions {
      display: flex;
      align-self: stretch;
      flex-shrink: 0;
      opacity: 0;
      transition: opacity 0.18s ease;
      border-left: 1px solid var(--divider-color, rgba(0,0,0,0.08));
    }
    @media (hover: hover) {
      .task-wrapper:hover .task-actions { opacity: 1; }
    }
    @media (hover: none) {
      .task-actions { display: none; }
    }
    :host([no-animations]) *, :host([no-animations]) *::before, :host([no-animations]) *::after {
      transition: none !important;
      animation: none !important;
    }
    :host([no-animations]) .icon-btn:hover,
    :host([no-animations]) .icon-btn:active {
      filter: none !important;
      transform: none !important;
    }
    .task-divider {
      border: none;
      border-top: 1px solid var(--divider-color);
      margin: 0;
    }
    .pagination {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      padding: 12px 0;
      flex-wrap: wrap;
    }
    .pagination select {
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .pagination span {
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .page-btn {
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 13px;
    }
    .page-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }
    @keyframes ik-done-exit {
      0%   { transform: translateX(0);    opacity: 1; background: transparent; }
      15%  { background: color-mix(in srgb, var(--primary-color) 18%, transparent); }
      100% { transform: translateX(56px); opacity: 0; background: transparent; }
    }
    @keyframes ik-delete-exit {
      0%   { transform: translateX(0);     opacity: 1; background: transparent; }
      15%  { background: rgba(244, 67, 54, 0.15); }
      100% { transform: translateX(-56px); opacity: 0; background: transparent; }
    }
    .task-wrapper { overflow: hidden; }
    .list-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px;
    }
    .list-item {
      position: relative;
      border: 1.5px solid var(--divider-color);
      border-radius: 10px;
      overflow: hidden;
    }
    .swipe-bg {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      opacity: 0;
      pointer-events: none;
      --mdc-icon-size: 26px;
    }
    .swipe-bg-done {
      justify-content: flex-start;
      padding-left: 18px;
    }
    .swipe-bg-delete {
      background: var(--error-color, #f44336);
      justify-content: flex-end;
      padding-right: 18px;
    }
    .swipe-bg ha-icon { color: #fff; }
    .swipe-content {
      position: relative;
      background: var(--card-background-color);
      touch-action: pan-y;
      will-change: transform;
      cursor: pointer;
    }
    .task-wrapper.exiting-done {
      animation: ik-done-exit 0.38s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      pointer-events: none;
    }
    .task-wrapper.exiting-delete {
      animation: ik-delete-exit 0.38s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      pointer-events: none;
    }
    @keyframes ik-undo-exit {
      0%   { transform: translateX(0);     opacity: 1; background: transparent; }
      15%  { background: color-mix(in srgb, var(--warning-color, #ff9800) 22%, transparent); }
      100% { transform: translateX(-56px); opacity: 0; background: transparent; }
    }
    .task-wrapper.exiting-undo {
      animation: ik-undo-exit 0.38s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      pointer-events: none;
    }
    @keyframes ik-edit-pulse {
      0%   { transform: scale(1);    box-shadow: none; }
      40%  { transform: scale(1.012); box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 30%, transparent); }
      100% { transform: scale(1);    box-shadow: none; }
    }
    .task-wrapper.exiting-edit {
      animation: ik-edit-pulse 0.32s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }
  `;

  private _swipeData = new Map<string, { startX: number; startY: number; decided: boolean; canceled: boolean }>();
  private _swipeMoved = new Set<string>();

  private _onPointerDown(id: string, e: PointerEvent) {
    if (e.pointerType !== "touch") return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this._swipeData.set(id, { startX: e.clientX, startY: e.clientY, decided: false, canceled: false });
  }

  private _onPointerMove(id: string, e: PointerEvent) {
    if (e.pointerType !== "touch") return;
    const s = this._swipeData.get(id);
    if (!s || s.canceled) return;
    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    if (!s.decided) {
      if (Math.abs(dy) > Math.abs(dx) + 8) {
        s.canceled = true;
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        return;
      }
      if (Math.abs(dx) < 8) return;
      s.decided = true;
    }
    const el = e.currentTarget as HTMLElement;
    const clamped = Math.max(-120, Math.min(120, dx));
    el.style.transform = `translateX(${clamped}px)`;
    el.style.transition = "none";
    const container = el.parentElement;
    if (container) {
      const bgDone = container.querySelector<HTMLElement>(".swipe-bg-done");
      const bgDel  = container.querySelector<HTMLElement>(".swipe-bg-delete");
      if (bgDone) bgDone.style.opacity = dx > 0 ? String(Math.min(1, dx / 80)) : "0";
      if (bgDel)  bgDel.style.opacity  = dx < 0 ? String(Math.min(1, -dx / 80)) : "0";
    }
  }

  private _onPointerUp(id: string, task: Task, e: PointerEvent) {
    if (e.pointerType !== "touch") return;
    const s = this._swipeData.get(id);
    this._swipeData.delete(id);
    const el = e.currentTarget as HTMLElement;
    const match = el.style.transform.match(/translateX\((-?\d+\.?\d*)px\)/);
    const offset = match ? parseFloat(match[1]) : 0;
    el.style.transition = "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)";
    el.style.transform = "translateX(0)";
    const container = el.parentElement;
    if (container) {
      const bgDone = container.querySelector<HTMLElement>(".swipe-bg-done");
      const bgDel  = container.querySelector<HTMLElement>(".swipe-bg-delete");
      if (bgDone) { bgDone.style.transition = "opacity 0.25s"; bgDone.style.opacity = "0"; }
      if (bgDel)  { bgDel.style.transition  = "opacity 0.25s"; bgDel.style.opacity  = "0"; }
    }
    if (s?.decided) {
      this._swipeMoved.add(id);
      setTimeout(() => this._swipeMoved.delete(id), 500);
    }
    if (!s || s.canceled || !s.decided) return;
    if (offset >= 80)  { task.status !== "completed" ? this._complete(id) : this._reopen(id); }
    else if (offset <= -80) { this._deleteTarget = id; }
  }

  private _resetPage() {
    this._page = 0;
    this._pendingPage = 0;
  }

  private async _loadRegistries() {
    try {
      const [areas, devices] = await Promise.all([
        this.hass.connection.sendMessagePromise<AreaRegistryEntry[]>({ type: "config/area_registry/list" }),
        this.hass.connection.sendMessagePromise<DeviceRegistryEntry[]>({ type: "config/device_registry/list" }),
      ]);
      this._areas = areas.sort((left, right) => left.name.localeCompare(right.name));
      this._devices = devices.sort((left, right) => this._getDeviceLabel(left).localeCompare(this._getDeviceLabel(right)));
    } catch (error) {
      console.error("[IntelliKeep] Failed to load registries for task filters:", error);
    }
  }

  private _onFilterChanged(e: CustomEvent) {
    const { selectedAreaIds, selectedDeviceIds, filterMode } = e.detail;
    this._selectedAreaIds = selectedAreaIds;
    this._selectedDeviceIds = selectedDeviceIds;
    this._filterMode = filterMode;
    localStorage.setItem(FILTER_MODE_STORAGE_KEY, filterMode);
    localStorage.setItem(FILTER_AREAS_STORAGE_KEY, JSON.stringify(selectedAreaIds));
    localStorage.setItem(FILTER_DEVICES_STORAGE_KEY, JSON.stringify(selectedDeviceIds));
    this._resetPage();
  }

  private _getDeviceLabel(device: DeviceRegistryEntry): string {
    return device.name_by_user || device.name;
  }

  private _matchesLinkedFilters(task: Task): boolean {
    if (this._selectedAreaIds.length === 0 && this._selectedDeviceIds.length === 0) {
      return true;
    }

    const taskAreaIds = new Set(
      task.linked_entity_ids.filter((value) => value.startsWith("area:")).map((value) => value.slice(5))
    );
    const taskDeviceIds = new Set(
      task.linked_entity_ids.filter((value) => value.startsWith("device:")).map((value) => value.slice(7))
    );

    const matchesArea = this._selectedAreaIds.length === 0
      ? null
      : this._selectedAreaIds.some((areaId) => {
          if (taskAreaIds.has(areaId)) {
            return true;
          }
          return [...taskDeviceIds].some((deviceId) => {
            const device = this._devices.find((entry) => entry.id === deviceId);
            return device?.area_id === areaId;
          });
        });

    const matchesDevice = this._selectedDeviceIds.length === 0
      ? null
      : this._selectedDeviceIds.some((deviceId) => taskDeviceIds.has(deviceId));

    if (matchesArea === null) {
      return Boolean(matchesDevice);
    }
    if (matchesDevice === null) {
      return matchesArea;
    }
    return this._filterMode === "and" ? matchesArea && matchesDevice : matchesArea || matchesDevice;
  }

  private get _relaxSuggestion(): string {
    const tr = t(this.hass?.language);
    const d = new Date();
    const idx = (d.getDate() + d.getMonth()) % tr.relaxSuggestions.length;
    return tr.relaxSuggestions[idx];
  }

  private _navigateTo(path: string) {
    this.dispatchEvent(new CustomEvent("navigate", { detail: path, bubbles: true, composed: true }));
  }

  private async _edit(taskId: string) {
    if (isDesktop()) {
      this.dispatchEvent(new CustomEvent("open-task-modal", { detail: taskId, bubbles: true, composed: true }));
      return;
    }
    if (this.enableAnimations) {
      this._exitingEdit = new Set([...this._exitingEdit, taskId]);
      await new Promise((r) => setTimeout(r, 320));
      this._exitingEdit = new Set([...this._exitingEdit].filter((id) => id !== taskId));
    }
    this._navigateTo(`/edit/${taskId}`);
  }

  private async _reopen(taskId: string) {
    this._reopening = new Set([...this._reopening, taskId]);
    if (this.enableAnimations) {
      this._exitingUndo = new Set([...this._exitingUndo, taskId]);
      await new Promise((r) => setTimeout(r, 380));
    }
    try {
      await reopenTask(this.hass, taskId);
    } catch (err) {
      console.error("[IntelliKeep] reopen_task failed:", err);
      alert(`Failed to reopen task: ${err}`);
    } finally {
      this._reopening = new Set([...this._reopening].filter((id) => id !== taskId));
      this._exitingUndo = new Set([...this._exitingUndo].filter((id) => id !== taskId));
    }
  }

  private async _complete(taskId: string) {
    this._completing = new Set([...this._completing, taskId]);
    if (this.enableAnimations) {
      this._exitingDone = new Set([...this._exitingDone, taskId]);
      await new Promise((r) => setTimeout(r, 380));
    }
    try {
      await completeTask(this.hass, taskId, this.hass.user?.name ?? "");
    } catch (err) {
      console.error("[IntelliKeep] complete_task failed:", err);
      alert(`Failed to complete task: ${err}`);
    } finally {
      this._completing = new Set([...this._completing].filter((id) => id !== taskId));
      this._exitingDone = new Set([...this._exitingDone].filter((id) => id !== taskId));
    }
  }

  private async _confirmDelete(confirmed: boolean) {
    const taskId = this._deleteTarget;
    this._deleteTarget = null;
    if (confirmed && taskId) {
      if (this.enableAnimations) {
        this._exitingDelete = new Set([...this._exitingDelete, taskId]);
        await new Promise((r) => setTimeout(r, 380));
      }
      try {
        await deleteTask(this.hass, taskId);
      } catch (err) {
        console.error("[IntelliKeep] delete_task failed:", err);
        alert(`Failed to delete task: ${err}`);
      } finally {
        this._exitingDelete = new Set([...this._exitingDelete].filter((id) => id !== taskId));
      }
    }
  }

  render() {
    if (!this.enableAnimations) {
      this.setAttribute("no-animations", "");
    } else {
      this.removeAttribute("no-animations");
    }
    const tr = t(this.hass?.language);
    const q = this._searchQuery.trim().toLowerCase();
    const matchesQ = (task: Task) =>
      !q || task.name.toLowerCase().includes(q) || (task.description ?? "").toLowerCase().includes(q) ||
      (task.task_number ? String(task.task_number).padStart(3, '0').includes(q) : false);
    const matchesPr = (task: Task) =>
      this._filterPriority === "all" || task.priority === this._filterPriority;
    const matchesLinked = (task: Task) => this._matchesLinkedFilters(task);

    const countPending   = this.tasks.filter(t => t.status !== "completed").length;
    const countCompleted = this.tasks.filter(t => t.status === "completed").length;
    const hasLinkFilters = this._selectedAreaIds.length > 0 || this._selectedDeviceIds.length > 0 || this._filterPriority !== "all";

    const chip = (tab: typeof this._filterTab, label: string, count: number, extra = "") => html`
      <button
        class="filter-chip ${extra} ${this._filterTab === tab ? "active" : ""}"
        @click=${() => { this._filterTab = tab; localStorage.setItem("intellikeep.filterTab", tab); this._resetPage(); }}
      >
        ${label}
        <span class="chip-badge">${count}</span>
      </button>
    `;

    const swipeDoneColor = (task: Task) =>
      task.status !== "completed"
        ? "var(--success-color, #4caf50)"
        : "var(--warning-color, #ff9800)";
    const swipeDoneIcon = (task: Task) =>
      task.status !== "completed" ? "mdi:check-bold" : "mdi:undo";

    const taskItem = (task: Task) => html`
      <div class="list-item task-wrapper ${this._exitingDone.has(task.task_id) ? "exiting-done" : this._exitingDelete.has(task.task_id) ? "exiting-delete" : this._exitingUndo.has(task.task_id) ? "exiting-undo" : this._exitingEdit.has(task.task_id) ? "exiting-edit" : ""}">
        <div class="swipe-bg swipe-bg-done" style="background:${swipeDoneColor(task)}">
          <ha-icon icon=${swipeDoneIcon(task)}></ha-icon>
        </div>
        <div class="swipe-bg swipe-bg-delete">
          <ha-icon icon="mdi:trash-can"></ha-icon>
        </div>
        <div class="swipe-content"
          @pointerdown=${(e: PointerEvent) => this._onPointerDown(task.task_id, e)}
          @pointermove=${(e: PointerEvent) => this._onPointerMove(task.task_id, e)}
          @pointerup=${(e: PointerEvent) => this._onPointerUp(task.task_id, task, e)}
          @pointercancel=${(e: PointerEvent) => this._onPointerUp(task.task_id, task, e)}
          @click=${() => { if (!this._swipeMoved.delete(task.task_id)) this._edit(task.task_id); }}>
          <ik-task-card .task=${task} .hass=${this.hass}>
            <div class="task-actions" slot="actions">
              <button class="icon-btn danger" title=${tr.del} @click=${(e: Event) => { e.stopPropagation(); this._deleteTarget = task.task_id; }}><ha-icon icon="mdi:delete"></ha-icon></button>
              ${task.status !== "completed"
                ? html`<button class="icon-btn primary" title=${tr.done} ?disabled=${this._completing.has(task.task_id)} @click=${(e: Event) => { e.stopPropagation(); this._complete(task.task_id); }}><ha-icon icon="mdi:check"></ha-icon></button>`
                : html`<button class="icon-btn undo" title=${tr.undo} ?disabled=${this._reopening.has(task.task_id)} @click=${(e: Event) => { e.stopPropagation(); this._reopen(task.task_id); }}><ha-icon icon="mdi:undo"></ha-icon></button>`}
            </div>
          </ik-task-card>
        </div>
      </div>
    `;

    const activeFilterCount = this._selectedAreaIds.length + this._selectedDeviceIds.length + (this._filterPriority !== "all" ? 1 : 0);
    const filterSection = html`
      <div class="filter-bar">
        ${chip("pending",   tr.pending,   countPending)}
        ${chip("completed", tr.completed, countCompleted, "chip-completed")}
        <button
          class="filter-toggle-btn ${this._showLinkFilters ? "active" : ""} ${hasLinkFilters ? "has-filters" : ""}"
          title=${tr.filterToggleTitle}
          @click=${() => { this._showLinkFilters = !this._showLinkFilters; }}
        >
          <ha-icon icon="mdi:filter"></ha-icon>
          ${hasLinkFilters ? html`<span class="filter-toggle-badge">${activeFilterCount}</span>` : ""}
        </button>
      </div>
      <ik-link-filter
        .hass=${this.hass}
        .areas=${this._areas}
        .devices=${this._devices}
        .selectedAreaIds=${this._selectedAreaIds}
        .selectedDeviceIds=${this._selectedDeviceIds}
        .filterMode=${this._filterMode}
        ?open=${this._showLinkFilters}
        @filter-changed=${(e: CustomEvent) => this._onFilterChanged(e)}
      ></ik-link-filter>
      ${this._showLinkFilters ? html`
        <div class="extended-filters">
          <select class="priority-select" .value=${this._filterPriority} @change=${(e: Event) => { this._filterPriority = (e.target as HTMLSelectElement).value as TaskPriority | "all"; this._resetPage(); }}>
            <option value="all">${tr.allPriorities}</option>
            <option value="critical">${tr.critical}</option>
            <option value="high">${tr.high}</option>
            <option value="medium">${tr.medium}</option>
            <option value="low">${tr.low}</option>
          </select>
        </div>
      ` : ""}
      <div class="filter-bar">
        <div class="search-wrapper">
          <ha-icon class="search-icon" icon="mdi:magnify"></ha-icon>
          <input
            class="search-input"
            type="search"
            .value=${this._searchQuery}
            placeholder=${tr.searchPlaceholder}
            @input=${(e: Event) => { this._searchQuery = (e.target as HTMLInputElement).value; this._resetPage(); }}
          />
        </div>
      </div>
    `;

    const confirmDialog = html`
      <ik-confirm-dialog
        heading=${tr.deleteHeading}
        .open=${this._deleteTarget !== null}
        @dialog-closed=${(e: CustomEvent) => this._confirmDelete(e.detail.confirmed)}
      >
        ${tr.deleteBody}
      </ik-confirm-dialog>
    `;

    const priorityRank: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    const sortPending = (a: Task, b: Task) => {
      const aUrgent = a.status === "due" || a.status === "overdue";
      const bUrgent = b.status === "due" || b.status === "overdue";
      if (aUrgent && !bUrgent) return -1;
      if (!aUrgent && bUrgent) return 1;
      if (aUrgent && bUrgent) {
        const prDiff = (priorityRank[a.priority] ?? 99) - (priorityRank[b.priority] ?? 99);
        if (prDiff !== 0) return prDiff;
        return a.task_number - b.task_number;
      }
      const aDate = a.due_date ? new Date(a.due_date).getTime() : Infinity;
      const bDate = b.due_date ? new Date(b.due_date).getTime() : Infinity;
      if (aDate !== bDate) return aDate - bDate;
      const prDiff = (priorityRank[a.priority] ?? 99) - (priorityRank[b.priority] ?? 99);
      if (prDiff !== 0) return prDiff;
      return a.task_number - b.task_number;
    };

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const rangeEnd = (days: number) => { const d = new Date(today); d.setDate(d.getDate() + days); d.setHours(23, 59, 59, 999); return d; };
    // next week: Monday–Sunday of the calendar week after this one
    const nextMonday = new Date(today); nextMonday.setDate(today.getDate() + (8 - today.getDay()) % 7 || 7);
    const nextSunday = new Date(nextMonday); nextSunday.setDate(nextMonday.getDate() + 6); nextSunday.setHours(23, 59, 59, 999);
    // this month: rest of current calendar month
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    let upcomingMax: Date | null = null;
    let upcomingMin: Date | null = null;
    if (this._upcomingRange === "week")         upcomingMax = rangeEnd(7);
    else if (this._upcomingRange === "nextweek") { upcomingMin = nextMonday; upcomingMax = nextSunday; }
    else if (this._upcomingRange === "month")    upcomingMax = monthEnd;
    else if (this._upcomingRange === "custom") {
      upcomingMin = this._upcomingCustomFrom ? new Date(this._upcomingCustomFrom) : null;
      upcomingMax = this._upcomingCustomTo ? new Date(this._upcomingCustomTo + "T23:59:59") : null;
    }
    const inUpcomingRange = (task: Task) => {
      if (this._upcomingRange === "all") return true;
      if (!task.due_date) return false;
      const d = new Date(task.due_date);
      if (upcomingMin && d < upcomingMin) return false;
      if (upcomingMax && d > upcomingMax) return false;
      return true;
    };

    const setUpcomingRange = (v: typeof this._upcomingRange) => {
      this._upcomingRange = v;
      localStorage.setItem("intellikeep.upcomingRange", v);
    };

    if (this._filterTab === "pending") {
      const pendingTasksAll = this.tasks
        .filter(t => {
          if (t.status === "completed") return false;
          if (!matchesPr(t) || !matchesQ(t) || !matchesLinked(t)) return false;
          const isUrgent = t.status === "due" || t.status === "overdue";
          if (!isUrgent && !inUpcomingRange(t)) return false;
          return true;
        })
        .sort(sortPending);

      const pendingTotalPages = Math.max(1, Math.ceil(pendingTasksAll.length / this._pageSize));
      const pendingPage = Math.min(this._pendingPage, pendingTotalPages - 1);
      const pendingStart = pendingPage * this._pageSize;
      const pendingTasks = pendingTasksAll.slice(pendingStart, pendingStart + this._pageSize);

      const upcomingRangeChip = (v: typeof this._upcomingRange, label: string) => html`
        <button class="upcoming-chip ${this._upcomingRange === v ? "active" : ""}" @click=${() => setUpcomingRange(v)}>${label}</button>
      `;
      const upcomingFilterBar = html`
        <div class="upcoming-filter">
          ${upcomingRangeChip("week",     tr.rangeWeek)}
          ${upcomingRangeChip("nextweek", tr.rangeNextWeek)}
          ${upcomingRangeChip("month",    tr.rangeMonth)}
          ${upcomingRangeChip("all",      tr.rangeAll)}
          ${upcomingRangeChip("custom",   tr.rangeCustom)}
        </div>
        ${this._upcomingRange === "custom" ? html`
          <div class="custom-range">
            <input type="date" .value=${this._customFromDraft}
              @change=${(e: Event) => { this._customFromDraft = (e.target as HTMLInputElement).value; }}
            />
            <span>${tr.rangeTo}</span>
            <input type="date" .value=${this._customToDraft}
              @change=${(e: Event) => { this._customToDraft = (e.target as HTMLInputElement).value; }}
            />
            <button class="custom-range-btn apply-btn" @click=${() => {
              this._upcomingCustomFrom = this._customFromDraft;
              this._upcomingCustomTo = this._customToDraft;
              localStorage.setItem("intellikeep.upcomingCustomFrom", this._upcomingCustomFrom);
              localStorage.setItem("intellikeep.upcomingCustomTo", this._upcomingCustomTo);
              this._pendingPage = 0;
            }}>${tr.rangeApply}</button>
            <button class="custom-range-btn" ?disabled=${!this._customFromDraft && !this._customToDraft} @click=${() => {
              this._customFromDraft = "";
              this._customToDraft = "";
              this._upcomingCustomFrom = "";
              this._upcomingCustomTo = "";
              localStorage.removeItem("intellikeep.upcomingCustomFrom");
              localStorage.removeItem("intellikeep.upcomingCustomTo");
              this._pendingPage = 0;
            }}>${tr.rangeClear}</button>
          </div>` : ""
        }
      `;

      return html`
        ${filterSection}
        <div class="list-scroll">
          ${upcomingFilterBar}
          <ha-card class="full-card">
            ${pendingTasksAll.length === 0 && !q && this._filterPriority === "all"
              && this._selectedAreaIds.length === 0 && this._selectedDeviceIds.length === 0
              ? html`
                <div class="all-clear">
                  <div class="all-clear-emoji">🎉</div>
                  <p class="all-clear-title">${tr.allClear}</p>
                  <p class="all-clear-sub">${tr.allClearSub}</p>
                  <span class="all-clear-suggestion">${this._relaxSuggestion}</span>
                </div>`
              : pendingTasksAll.length === 0
              ? html`<div class="empty">${tr.noTasks}</div>`
              : html`<div class="list-container">${pendingTasks.map(taskItem)}</div>`}
          </ha-card>
          ${pendingTasksAll.length > 0 ? html`
          <div class="pagination">
            <span>${tr.rowsPerPage}</span>
            <select .value=${String(this._pageSize)} @change=${(e: Event) => { this._pageSize = Number((e.target as HTMLSelectElement).value) as 25 | 50 | 100; this._pendingPage = 0; }}>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>${pendingStart + 1}–${Math.min(pendingStart + this._pageSize, pendingTasksAll.length)} ${tr.of} ${pendingTasksAll.length}</span>
            <button class="page-btn" ?disabled=${pendingPage === 0} @click=${() => { this._pendingPage = pendingPage - 1; }}>&lt;</button>
            <button class="page-btn" ?disabled=${pendingPage >= pendingTotalPages - 1} @click=${() => { this._pendingPage = pendingPage + 1; }}>&gt;</button>
          </div>` : ""}
        </div>
        ${confirmDialog}
      `;
    }

    // completed tab
    const completedTasks = this.tasks
      .filter(t => t.status === "completed" && matchesPr(t) && matchesQ(t) && matchesLinked(t))
      .sort((a, b) => new Date(b.last_completed_at ?? b.updated_at).getTime() - new Date(a.last_completed_at ?? a.updated_at).getTime());
    const totalPages = Math.max(1, Math.ceil(completedTasks.length / this._pageSize));
    const page = Math.min(this._page, totalPages - 1);
    const start = page * this._pageSize;
    const pageTasks = completedTasks.slice(start, start + this._pageSize);

    return html`
      ${filterSection}
      <div class="list-scroll">
        <ha-card class="full-card">
          ${completedTasks.length === 0
            ? html`<div class="empty">${tr.noTasks}</div>`
            : html`<div class="list-container">${pageTasks.map(taskItem)}</div>`}
        </ha-card>
        ${completedTasks.length > 0 ? html`
        <div class="pagination">
          <span>${tr.rowsPerPage}</span>
          <select .value=${String(this._pageSize)} @change=${(e: Event) => { this._pageSize = Number((e.target as HTMLSelectElement).value) as 25 | 50 | 100; this._resetPage(); }}>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>${start + 1}–${Math.min(start + this._pageSize, completedTasks.length)} ${tr.of} ${completedTasks.length}</span>
          <button class="page-btn" ?disabled=${page === 0} @click=${() => { this._page = page - 1; }}>&lt;</button>
          <button class="page-btn" ?disabled=${page >= totalPages - 1} @click=${() => { this._page = page + 1; }}>&gt;</button>
        </div>` : ""}
      </div>
      ${confirmDialog}
    `;
  }
}
