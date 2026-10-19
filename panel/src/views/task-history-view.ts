import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, OpenTaskRequest, Task, TaskExecution } from "../types";
import { t, Translations } from "../translations";
import { daysBetween, formatDate, formatDateTime, formatRelative, formatShortDate, formatTime, relativeDay } from "../utils";
import { MenuItem } from "../components/menu";
import "../components/link-filter";
import "../components/menu";

type AreaRegistryEntry = { area_id: string; name: string };
type DeviceRegistryEntry = { id: string; area_id: string | null; name_by_user: string | null; name: string };
type ColumnKey = "task" | "completed" | "by" | "timing" | "area" | "device";
type RangeKey = "7" | "30" | "90" | "365" | "all";
/** One completion record and the task (occurrence) it belongs to. */
type Row = { execution: TaskExecution; task: Task };

const ALL_COLUMNS: ColumnKey[] = ["task", "completed", "by", "timing", "area", "device"];
// Areas and devices were mostly "—", so they start hidden
const DEFAULT_COLUMNS: ColumnKey[] = ["task", "completed", "by", "timing"];
// Column names stored by earlier versions
const LEGACY_COLUMNS: Record<string, ColumnKey> = { date: "completed", late: "timing" };
const RANGES: RangeKey[] = ["7", "30", "90", "365", "all"];
const PAGE_SIZES = [10, 25, 50];

const HISTORY_FILTER_MODE_KEY = "intellikeep.historyFilterMode";
const HISTORY_FILTER_AREAS_KEY = "intellikeep.historyFilterAreas";
const HISTORY_FILTER_DEVICES_KEY = "intellikeep.historyFilterDevices";
const HISTORY_COLUMNS_KEY = "intellikeep.historyColumns";
const HISTORY_RANGE_KEY = "intellikeep.historyRange";

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 336 416" height="40"><path fill="#000" d="M292.085,275.543C294.886,277,295.348,279.164,295.347,281.645C295.325,315.301,295.372,348.957,295.294,382.613C295.28,388.929,292.366,391.331,285.198,391.337C238.711,391.373,192.224,391.381,145.737,391.383C117.744,391.384,89.752,391.372,61.76,391.338C52.998,391.327,50.684,389.06,50.679,380.502C50.66,348.345,50.66,316.187,50.672,284.029C50.675,276.321,52.218,274.831,60.105,274.712C74.264,274.499,74.276,274.499,74.281,288.852C74.29,313.345,74.38,337.839,74.197,362.33C74.163,366.986,75.349,368.728,80.342,368.692C110.826,368.476,141.319,368.967,171.796,368.439C193.28,368.067,214.74,368.713,236.211,368.615C245.861,368.572,255.494,367.96,265.164,368.535C271.299,368.9,271.738,368.131,271.741,362.094C271.754,336.435,271.738,310.775,271.748,285.116C271.752,276.257,273.215,274.788,282.272,274.737C285.416,274.719,288.61,274.25,292.085,275.543z"/><path fill="#000" d="M320.53,252.723C324.286,259.571,323.451,265.254,318.429,268.988C313.15,272.914,307.521,272.273,301.916,266.689C278.307,243.165,254.779,219.561,231.214,195.992C213.423,178.198,195.629,160.407,177.823,142.628C173.271,138.083,172.813,138.093,168.221,142.681C128.256,182.607,88.297,222.539,48.336,262.468C46.921,263.881,45.523,265.313,44.07,266.686C38.204,272.228,31.425,272.392,26.385,267.138C21.725,262.279,22.113,256.061,27.791,250.309C38.21,239.756,48.781,229.354,59.281,218.879C93.962,184.281,128.635,149.675,163.32,115.08C170.895,107.526,175.581,107.627,183.172,115.229C228.863,160.979,274.576,206.706,320.53,252.723z"/><path fill="#000" d="M156.557,299.525C160.166,295.201,163.61,293.158,169.639,294.584C188.024,298.934,202.203,278.403,195.773,264.969C191.913,266.43,189.825,269.979,187.009,272.568C182.092,277.087,177.339,277.472,173.526,273.318C169.779,269.236,170.283,263.932,174.822,259.711C177.585,257.141,180.352,254.576,183.233,251.902C170.99,244.815,153.777,253.19,151.394,266.927C150.864,269.979,149.961,273.067,151.083,276.274C151.425,277.252,151.101,278.62,150.704,279.666C149.946,281.662,137.044,293.377,133.971,294.688C133.681,285.538,126.866,285.16,120.151,282.742C114.014,280.532,118.691,272.931,117.727,267.826C117.243,265.263,118.846,263.837,121.486,263.62C122.641,263.526,123.774,263.175,124.925,262.992C133.809,261.58,136.709,254.209,131.268,246.85C126.987,241.059,127.051,240.303,132.346,235.224C133.307,234.302,134.406,233.517,135.31,232.546C138.794,228.804,142.381,228.471,146.093,232.144C149.484,235.501,152.877,235.731,157.272,233.559C160.724,231.853,162.316,229.797,162.78,226.125C163.134,223.321,162.531,219.364,166.19,218.519C171.178,217.368,176.475,216.846,181.348,219.095C183.268,219.981,183.115,222.479,183.339,224.484C183.681,227.533,183.168,231.265,186.962,232.483C191.091,233.807,195.296,237.25,199.659,232.296C201.401,230.318,204.219,227.906,207.119,229.88C211.043,232.551,215.395,235.136,217.096,239.996C217.941,242.408,215.652,243.833,214.56,245.642C212.962,248.291,209.523,250.215,211.586,254.354C213.777,258.746,215.417,263.246,221.712,262.839C226.698,262.516,229.147,265.016,228.365,270.214C228.218,271.191,228.351,272.21,228.352,273.21C228.365,282.781,228.365,282.781,219.095,284.28C214.023,285.101,210.057,293.711,213.037,297.829C219.4,306.62,219.14,305.42,211.119,313.586C207.521,317.248,204.313,317.986,199.993,314.391C195.228,310.426,190.997,310.642,185.99,314.197C183.352,316.069,183.55,319.213,183.431,321.895C183.217,326.712,181.234,329.019,176.291,328.379C175.635,328.294,174.959,328.378,174.292,328.364C164.372,328.15,164,330.187,162.549,318.557C161.772,312.323,155.906,312.984,151.746,311.527C150.326,311.029,148.113,312.422,147.466,310.154C146.913,308.213,148.863,307.326,149.972,306.171C152.05,304.009,154.19,301.907,156.557,299.525z"/><path fill="#000" d="M187.924,40.781C205.599,43.236,221.527,49.142,236.326,58.295C239.911,60.513,241.081,62.498,238.145,66.093C235.942,68.791,233.966,71.722,232.238,74.748C230.315,78.116,228.374,78.323,225.038,76.4C214.334,70.231,203.171,65.211,190.839,62.966C167.933,58.798,146.534,63.005,126.185,73.783C124.42,74.718,122.629,75.632,120.973,76.739C118.387,78.469,116.544,78.228,114.861,75.388C112.828,71.955,110.482,68.702,108.193,65.427C106.166,62.526,106.48,60.446,109.688,58.503C132.412,44.741,156.758,37.761,183.492,40.471C184.816,40.605,186.149,40.647,187.924,40.781z"/><path fill="#000" d="M249.011,121.883C257.669,121.869,265.833,121.736,273.991,121.886C281.088,122.017,282.31,123.418,282.315,130.551C282.327,150.037,282.339,169.524,282.293,189.011C282.288,190.743,282.888,192.665,281.228,194.426C277.668,193.409,276.164,189.866,273.427,187.893C263.098,180.447,258.608,170.705,260.525,157.832C261.166,153.531,262.538,147.803,259.723,144.809C256.842,141.747,251.207,144.022,246.801,143.972C230.856,143.788,233.06,145.359,232.957,130.084C232.904,122.165,233.218,121.898,241.018,121.839C243.516,121.82,246.015,121.869,249.011,121.883z"/><path fill="#000" d="M82.143,171.044C84.154,175.714,83.172,178.934,79.275,181.722C74.754,184.956,71.094,189.342,66.515,192.12C64.384,191.171,64.222,189.57,63.768,188.198C55.428,162.95,55.684,137.621,62.993,112.198C63.977,108.774,65.532,107.412,69.078,108.985C72.873,110.668,76.729,112.241,80.644,113.619C84.002,114.8,84.733,116.54,83.668,120.052C78.615,136.733,77.489,153.612,82.143,171.044z"/><path fill="#000" d="M64.331,91.478C59.424,81.825,60.131,73.819,66.226,67.22C72.174,60.78,81.1,59.016,89.529,62.614C96.86,65.744,101.61,73.692,100.771,81.428C99.82,90.211,93.526,97.565,85.744,99.288C77.061,101.21,70.053,98.692,64.331,91.478z"/><path fill="#000" d="M278.435,66.513C285.689,74.329,286.806,82.963,281.826,90.845C277.285,98.032,267.981,101.683,260.2,99.33C251.19,96.606,245.216,88.625,245.767,79.543C246.201,72.378,249.594,66.785,256.202,63.726C263.926,60.15,271.373,60.818,278.435,66.513z"/><path fill="#000" d="M101.244,112.328C102.895,105.379,107.409,101.405,113.707,101.001C119.431,100.635,125.066,104.316,126.983,109.673C128.768,114.664,126.993,120.768,122.626,123.969C118.201,127.212,113.259,127.318,108.428,125.259C103.044,122.964,101.095,118.352,101.244,112.328z"/></svg>`;

const loadStoredList = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch { return []; }
};

const loadStoredColumns = (): Set<ColumnKey> => {
  const stored = loadStoredList(HISTORY_COLUMNS_KEY)
    .map((key) => LEGACY_COLUMNS[key] ?? key)
    .filter((key): key is ColumnKey => ALL_COLUMNS.includes(key as ColumnKey));
  return new Set(stored.length ? stored : DEFAULT_COLUMNS);
};

const loadStoredRange = (): RangeKey => {
  try {
    const value = localStorage.getItem(HISTORY_RANGE_KEY) as RangeKey | null;
    return value && RANGES.includes(value) ? value : "30";
  } catch { return "30"; }
};

/**
 * The History tab: every completion record, newest first, as a table with
 * configurable columns. The narrow layout lists the records by day instead.
 */
@customElement("ik-task-history-view")
export class IkTaskHistoryView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) tasks: Task[] = [];
  @property({ type: Boolean, reflect: true }) narrow = false;

  @state() private _search = "";
  @state() private _range: RangeKey = loadStoredRange();
  @state() private _page = 0;
  @state() private _pageSize = 25;
  @state() private _areas: AreaRegistryEntry[] = [];
  @state() private _devices: DeviceRegistryEntry[] = [];
  @state() private _selectedAreaIds: string[] = loadStoredList(HISTORY_FILTER_AREAS_KEY);
  @state() private _selectedDeviceIds: string[] = loadStoredList(HISTORY_FILTER_DEVICES_KEY);
  @state() private _filterMode: "or" | "and" = (localStorage.getItem(HISTORY_FILTER_MODE_KEY) as "or" | "and") ?? "or";
  @state() private _showFilters = false;
  @state() private _showColumns = false;
  @state() private _columns: Set<ColumnKey> = loadStoredColumns();

  connectedCallback() {
    super.connectedCallback();
    void this._loadRegistries();
  }

  private async _loadRegistries() {
    try {
      const [areas, devices] = await Promise.all([
        this.hass.connection.sendMessagePromise<AreaRegistryEntry[]>({ type: "config/area_registry/list" }),
        this.hass.connection.sendMessagePromise<DeviceRegistryEntry[]>({ type: "config/device_registry/list" }),
      ]);
      this._areas = areas.sort((a, b) => a.name.localeCompare(b.name));
      this._devices = devices.sort((a, b) => (a.name_by_user || a.name).localeCompare(b.name_by_user || b.name));
    } catch (error) {
      console.error("[IntelliKeep] Failed to load registries for history filters:", error);
    }
  }

  private _onFilterChanged(e: CustomEvent) {
    const { selectedAreaIds, selectedDeviceIds, filterMode } = e.detail;
    this._selectedAreaIds = selectedAreaIds;
    this._selectedDeviceIds = selectedDeviceIds;
    this._filterMode = filterMode;
    localStorage.setItem(HISTORY_FILTER_MODE_KEY, filterMode);
    localStorage.setItem(HISTORY_FILTER_AREAS_KEY, JSON.stringify(selectedAreaIds));
    localStorage.setItem(HISTORY_FILTER_DEVICES_KEY, JSON.stringify(selectedDeviceIds));
    this._page = 0;
  }

  private _toggleColumn(key: ColumnKey) {
    const next = new Set(this._columns);
    if (next.has(key)) {
      if (next.size > 1) next.delete(key);
    } else {
      next.add(key);
    }
    this._columns = next;
    localStorage.setItem(HISTORY_COLUMNS_KEY, JSON.stringify(ALL_COLUMNS.filter((k) => next.has(k))));
  }

  private _setRange(range: string) {
    if (!RANGES.includes(range as RangeKey)) return;
    this._range = range as RangeKey;
    this._page = 0;
    localStorage.setItem(HISTORY_RANGE_KEY, range);
  }

  private _matchesLinkedFilters(linkedEntityIds: string[]): boolean {
    if (this._selectedAreaIds.length === 0 && this._selectedDeviceIds.length === 0) return true;

    const taskAreaIds = new Set(linkedEntityIds.filter((v) => v.startsWith("area:")).map((v) => v.slice(5)));
    const taskDeviceIds = new Set(linkedEntityIds.filter((v) => v.startsWith("device:")).map((v) => v.slice(7)));

    const matchesArea = this._selectedAreaIds.length === 0 ? null
      : this._selectedAreaIds.some((areaId) => {
          if (taskAreaIds.has(areaId)) return true;
          return [...taskDeviceIds].some((deviceId) => {
            const device = this._devices.find((d) => d.id === deviceId);
            return device?.area_id === areaId;
          });
        });

    const matchesDevice = this._selectedDeviceIds.length === 0 ? null
      : this._selectedDeviceIds.some((deviceId) => taskDeviceIds.has(deviceId));

    if (matchesArea === null) return Boolean(matchesDevice);
    if (matchesDevice === null) return matchesArea;
    return this._filterMode === "and" ? matchesArea && matchesDevice : matchesArea || matchesDevice;
  }

  private _openTask(taskId: string) {
    // The record's details live in the task's own History tab
    this.dispatchEvent(new CustomEvent<OpenTaskRequest>("open-task", {
      detail: { taskId, tab: "history" },
      bubbles: true,
      composed: true,
    }));
  }

  private _linkedAreas(linkedEntityIds: string[]): string {
    return linkedEntityIds
      .filter((v) => v.startsWith("area:"))
      .map((v) => this._areas.find((a) => a.area_id === v.slice(5))?.name ?? v.slice(5))
      .join(", ") || "—";
  }

  private _linkedDevices(linkedEntityIds: string[]): string {
    return linkedEntityIds
      .filter((v) => v.startsWith("device:"))
      .map((v) => {
        const d = this._devices.find((device) => device.id === v.slice(7));
        return d ? (d.name_by_user || d.name) : v.slice(7);
      })
      .join(", ") || "—";
  }

  /** "On time", or how late: days from the occurrence's due date to the completion. */
  private _timing(row: Row): { late: boolean; label: string } {
    const tr = t(this.hass?.language);
    if (!row.execution.was_late) return { late: false, label: tr.onTime };
    const days = row.task.due_date ? daysBetween(row.task.due_date, row.execution.completed_at, this.hass) : 0;
    return { late: true, label: days > 0 ? tr.daysLate(days) : tr.lateLabel };
  }

  private _number(task: Task): string {
    return task.task_number ? `#${String(task.task_number).padStart(3, "0")}` : "";
  }

  /** Completion records in the chosen range that match the search and filters, newest first. */
  private _rows(): Row[] {
    const since = this._range === "all" ? -Infinity : Date.now() - Number(this._range) * 86400000;
    const q = this._search.trim().toLowerCase();
    const rows: Row[] = [];
    for (const task of this.tasks) {
      if (!this._matchesLinkedFilters(task.linked_entity_ids ?? [])) continue;
      for (const execution of task.executions ?? []) {
        if (Date.parse(execution.completed_at) < since) continue;
        if (q && ![task.name, this._number(task), execution.completed_by].some((text) => text?.toLowerCase().includes(q))) continue;
        rows.push({ execution, task });
      }
    }
    return rows.sort((a, b) => Date.parse(b.execution.completed_at) - Date.parse(a.execution.completed_at));
  }

  private _columnLabels(): Record<ColumnKey, string> {
    const tr = t(this.hass?.language);
    return {
      task: tr.taskHeader,
      completed: tr.colCompleted,
      by: tr.colBy,
      timing: tr.colTiming,
      area: tr.filterAreasLabel,
      device: tr.filterDevicesLabel,
    };
  }

  /** Plain-text cell values for CSV and print. */
  private _exportValues(row: Row): Record<ColumnKey, string> {
    return {
      task: row.task.name,
      completed: formatDateTime(row.execution.completed_at, this.hass, { second: "2-digit" }),
      by: row.execution.completed_by || "",
      timing: this._timing(row).label,
      area: this._linkedAreas(row.task.linked_entity_ids).replace("—", ""),
      device: this._linkedDevices(row.task.linked_entity_ids).replace("—", ""),
    };
  }

  private _escapeHtml(text: string): string {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  private _exportCsv() {
    const labels = this._columnLabels();
    const keys = ALL_COLUMNS.filter((k) => this._columns.has(k));
    const lines = [
      ["#", ...keys.map((k) => labels[k])],
      ...this._rows().map((row) => {
        const values = this._exportValues(row);
        return [this._number(row.task), ...keys.map((k) => values[k])];
      }),
    ];
    const csv = lines.map((line) => line.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "intellikeep-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  private _printHistory() {
    const tr = t(this.hass?.language);
    const e = (s: string) => this._escapeHtml(s);
    const labels = this._columnLabels();
    const keys = ALL_COLUMNS.filter((k) => this._columns.has(k));
    const rows = this._rows().map((row) => {
      const values = this._exportValues(row);
      return `<tr><td>${e(this._number(row.task))}</td>${keys.map((k) => `<td>${e(values[k] || "—")}</td>`).join("")}</tr>`;
    }).join("");
    const headerCells = keys.map((k) => `<th>${e(labels[k])}</th>`).join("");
    const doc = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${e(tr.globalHistoryTitle)}</title>
<style>
  @page { margin: 0; }
  body { font-family: sans-serif; font-size: 12px; padding: 1.5cm; box-sizing: border-box; }
  .print-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #000; }
  .print-brand { display: flex; align-items: center; gap: 10px; }
  .print-brand svg { height: 36px; width: auto; }
  .print-brand-name { font-size: 18px; font-weight: 700; letter-spacing: 0.02em; }
  .print-report-title { font-size: 13px; color: #555; text-align: right; }
  .print-date { font-size: 11px; color: #888; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 6px 8px; border: 1px solid #ccc; text-align: left; }
  th { background: #f5f5f5; font-weight: 600; }
</style></head><body>
<div class="print-header">
  <div class="print-brand">
    ${LOGO_SVG}
    <span class="print-brand-name">IntelliKeep</span>
  </div>
  <div class="print-report-title">
    <div>${e(tr.globalHistoryTitle)}</div>
    <div class="print-date">${e(formatDate(new Date(), this.hass))}</div>
  </div>
</div>
<table><thead><tr>
  <th>#</th>${headerCells}
</tr></thead><tbody>${rows}</tbody></table>
</body></html>`;
    const blob = new Blob([doc], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    win?.addEventListener("load", () => {
      win.print();
      URL.revokeObjectURL(url);
    });
  }

  private _onMenuAction(action: string) {
    if (action === "columns") this._showColumns = !this._showColumns;
    else if (action === "csv") this._exportCsv();
    else if (action === "print") this._printHistory();
  }

  static styles = css`
    :host { display: block; }
    button { font: inherit; }
    button:focus-visible, input:focus-visible, select:focus-visible, tr:focus-visible {
      outline: 2px solid var(--ik-focus-ring);
      outline-offset: 2px;
    }
    .toolbar, .panel, .table-card, .empty {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;
      box-sizing: border-box;
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      padding-bottom: 16px;
    }
    .search {
      flex: 1 1 280px;
      display: flex;
      align-items: center;
      gap: 10px;
      height: 42px;
      padding: 0 16px;
      box-sizing: border-box;
      border-radius: 21px;
      border: 1px solid var(--divider-color);
      background: var(--ik-surface);
      color: var(--secondary-text-color);
      --mdc-icon-size: 18px;
    }
    .search:focus-within { border-color: var(--primary-color); }
    .search input {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 14px;
    }
    .search input::placeholder { color: var(--secondary-text-color); }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 16px;
      border-radius: var(--ik-radius-pill);
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      --mdc-icon-size: 18px;
    }
    .pill:hover { background: var(--ik-subtle-fill); }
    .pill[aria-expanded="true"] { border-color: var(--primary-color); color: var(--primary-color); }
    .count {
      display: inline-block;
      min-width: 8px;
      padding: 1px 7px;
      border-radius: 9px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      font-size: 12px;
      text-align: center;
    }
    .panel { padding-bottom: 12px; }
    .columns {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }
    .columns-title { margin-inline-end: 4px; font-size: 13px; font-weight: 500; color: var(--secondary-text-color); }
    .column-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 32px;
      padding: 0 12px;
      border-radius: 16px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font-size: 13px;
      cursor: pointer;
      --mdc-icon-size: 16px;
    }
    .column-chip[aria-pressed="true"] {
      border-color: var(--primary-color);
      background: var(--ik-primary-fill);
      color: var(--primary-color);
    }
    .column-chip:disabled { opacity: 0.6; cursor: default; }
    .table-card {
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-card);
      background: var(--ik-surface);
      overflow: hidden;
    }
    .table-scroll { overflow-x: auto; }
    table { width: 100%; min-width: 760px; border-collapse: collapse; }
    th {
      height: 48px;
      padding: 0 16px;
      border-bottom: 1px solid var(--divider-color);
      font-size: 13px;
      font-weight: 500;
      color: var(--secondary-text-color);
      text-align: start;
      white-space: nowrap;
    }
    td {
      height: 64px;
      padding: 0 16px;
      border-bottom: 1px solid var(--divider-color);
      font-size: 14px;
    }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr { cursor: pointer; }
    tbody tr:hover { background: var(--ik-subtle-fill); }
    .task-cell { display: flex; align-items: center; gap: 12px; }
    .ico {
      width: 36px;
      height: 36px;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--ik-subtle-fill);
      --mdc-icon-size: 18px;
    }
    .name { font-weight: 500; }
    .number, .muted { font-size: 12px; color: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
    .by { display: flex; align-items: center; gap: 10px; }
    .avatar {
      width: 28px;
      height: 28px;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--ik-primary-fill);
      color: var(--primary-color);
      font-size: 13px;
      font-weight: 500;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 26px;
      padding: 0 10px;
      border-radius: 13px;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      --mdc-icon-size: 14px;
    }
    .chip.on-time { background: var(--ik-success-fill); color: var(--ik-success-text); }
    .chip.late { background: var(--ik-error-fill); color: var(--ik-error-text); }
    .open-col { width: 60px; text-align: end; }
    .icon-btn {
      width: var(--ik-hit-target);
      height: var(--ik-hit-target);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      --mdc-icon-size: 20px;
    }
    .icon-btn:hover { background: var(--ik-subtle-fill); color: var(--primary-text-color); }
    .icon-btn:disabled { opacity: 0.4; cursor: default; }
    .pagination {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      padding: 8px 12px;
      border-top: 1px solid var(--divider-color);
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .pagination select {
      padding: 4px 8px;
      border-radius: var(--ik-radius-field);
      border: 1px solid var(--divider-color);
      background: var(--ik-field-fill);
      color: var(--primary-text-color);
      font: inherit;
    }
    .empty { padding: 48px 24px; text-align: center; color: var(--secondary-text-color); }

    /* ── Narrow: the records listed by day ── */
    .days { display: flex; flex-direction: column; gap: 18px; }
    .group-header {
      margin: 0;
      padding: 0 4px 10px;
      font-size: var(--ik-group-header-size);
      font-weight: var(--ik-group-header-weight);
      letter-spacing: var(--ik-group-header-spacing);
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .group {
      padding: 0 4px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-card);
      background: var(--ik-surface);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      min-height: 64px;
      padding: 8px 4px;
      box-sizing: border-box;
      border: none;
      background: none;
      color: inherit;
      text-align: start;
      cursor: pointer;
    }
    .row + .row { border-top: 1px solid var(--divider-color); }
    .row .ico { width: 40px; height: 40px; --mdc-icon-size: 20px; }
    .row .text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
    .row .title { display: flex; align-items: baseline; gap: 6px; min-width: 0; }
    .row .name {
      min-width: 0;
      font-size: var(--ik-row-title-size);
      font-weight: var(--ik-row-title-weight);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .row .number { flex: none; }
    .meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 2px 6px;
      font-size: var(--ik-row-secondary-size);
      color: var(--secondary-text-color);
      --mdc-icon-size: 14px;
    }
    .timing { display: inline-flex; align-items: center; gap: 4px; font-weight: 500; }
    .timing.on-time { color: var(--ik-success-text); }
    .timing.late { color: var(--ik-error-text); }
    .chevron { flex: none; color: var(--secondary-text-color); --mdc-icon-size: 20px; }
    :host([narrow]) .pagination { justify-content: center; padding: 12px 0 0; border-top: none; }
  `;

  render() {
    const tr = t(this.hass?.language);
    const labels = this._columnLabels();
    const cols = this._columns;
    const rows = this._rows();
    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / this._pageSize));
    const page = Math.min(this._page, totalPages - 1);
    const start = page * this._pageSize;
    const filterCount = this._selectedAreaIds.length + this._selectedDeviceIds.length;
    const rangeLabels: Record<RangeKey, string> = {
      "7": tr.rangeLast7,
      "30": tr.rangeLast30,
      "90": tr.rangeLast90,
      "365": tr.rangeLast365,
      all: tr.rangeAllTime,
    };
    const rangeItems: MenuItem[] = RANGES.map((r) => ({ action: r, label: rangeLabels[r], selected: r === this._range }));
    const menuItems: MenuItem[] = [
      // The narrow list has no columns to pick
      ...(this.narrow ? [] : [{ action: "columns", label: tr.columns, icon: "mdi:table-column" }]),
      { action: "csv", label: tr.exportCsv, icon: "mdi:download" },
      { action: "print", label: tr.printHistory, icon: "mdi:printer-outline" },
    ];
    const pageRows = rows.slice(start, start + this._pageSize);
    const pagination = total > PAGE_SIZES[0] ? html`
      <div class="pagination">
        <label>${tr.rowsPerPage}
          <select .value=${String(this._pageSize)} @change=${(e: Event) => { this._pageSize = Number((e.target as HTMLSelectElement).value); this._page = 0; }}>
            ${PAGE_SIZES.map((size) => html`<option value=${size} ?selected=${size === this._pageSize}>${size}</option>`)}
          </select>
        </label>
        <span>${start + 1}–${Math.min(start + this._pageSize, total)} ${tr.of} ${total}</span>
        <button class="icon-btn" aria-label="‹" ?disabled=${page === 0} @click=${() => { this._page = page - 1; }}><ha-icon icon="mdi:chevron-left"></ha-icon></button>
        <button class="icon-btn" aria-label="›" ?disabled=${page >= totalPages - 1} @click=${() => { this._page = page + 1; }}><ha-icon icon="mdi:chevron-right"></ha-icon></button>
      </div>
    ` : nothing;
    const hasAny = this.tasks.some((task) => (task.executions ?? []).length > 0);

    return html`
      <div class="toolbar">
        <label class="search">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="search"
            .value=${this._search}
            placeholder=${tr.searchHistory}
            aria-label=${tr.searchHistory}
            @input=${(e: Event) => { this._search = (e.target as HTMLInputElement).value; this._page = 0; }}
          />
        </label>
        <ik-menu
          pill
          pillIcon="mdi:calendar-blank-outline"
          .label=${rangeLabels[this._range]}
          .items=${rangeItems}
          @menu-select=${(e: CustomEvent<string>) => this._setRange(e.detail)}
        ></ik-menu>
        <button class="pill" aria-expanded=${this._showFilters ? "true" : "false"} @click=${() => { this._showFilters = !this._showFilters; }}>
          <ha-icon icon="mdi:filter-variant"></ha-icon>${tr.filters}
          ${filterCount ? html`<span class="count">${filterCount}</span>` : nothing}
        </button>
        <ik-menu .items=${menuItems} .label=${tr.moreHistoryActions} @menu-select=${(e: CustomEvent<string>) => this._onMenuAction(e.detail)}></ik-menu>
      </div>

      <div class="panel">
        ${this._showColumns && !this.narrow ? html`
          <div class="columns" role="group" aria-label=${tr.columnPickerTitle}>
            <span class="columns-title">${tr.columnPickerTitle}</span>
            ${ALL_COLUMNS.map((key) => {
              const on = cols.has(key);
              return html`
                <button
                  class="column-chip"
                  aria-pressed=${on ? "true" : "false"}
                  ?disabled=${on && cols.size === 1}
                  @click=${() => this._toggleColumn(key)}
                >${on ? html`<ha-icon icon="mdi:check"></ha-icon>` : nothing}${labels[key]}</button>
              `;
            })}
          </div>
        ` : nothing}
        <ik-link-filter
          .hass=${this.hass}
          .areas=${this._areas}
          .devices=${this._devices}
          .selectedAreaIds=${this._selectedAreaIds}
          .selectedDeviceIds=${this._selectedDeviceIds}
          .filterMode=${this._filterMode}
          ?open=${this._showFilters}
          @filter-changed=${(e: CustomEvent) => this._onFilterChanged(e)}
        ></ik-link-filter>
      </div>

      ${total === 0
        ? html`<div class="empty">${hasAny ? tr.noCompletionsInRange : tr.globalHistoryEmpty}</div>`
        : this.narrow
        ? html`${this._renderDays(pageRows, tr)}${pagination}`
        : html`
          <div class="table-card">
            <div class="table-scroll">
              <table>
                <thead>
                  <tr>
                    ${ALL_COLUMNS.filter((k) => cols.has(k)).map((k) => html`<th scope="col">${labels[k]}</th>`)}
                    <th class="open-col"><span hidden>${tr.viewTask}</span></th>
                  </tr>
                </thead>
                <tbody>
                  ${pageRows.map((row) => this._renderRow(row))}
                </tbody>
              </table>
            </div>
            ${pagination}
          </div>
        `}
    `;
  }

  /** "Today", "Yesterday" or "Tue, Oct 13": the header over one day's records. */
  private _dayLabel(date: string): string {
    return relativeDay(date, this.hass) ?? formatShortDate(date, this.hass);
  }

  /** Narrow layout: the page's records grouped under the day they were completed. */
  private _renderDays(rows: Row[], tr: Translations) {
    const days: { label: string; rows: Row[] }[] = [];
    for (const row of rows) {
      // Rows come newest first, so a day's records are next to each other
      const label = this._dayLabel(row.execution.completed_at);
      const last = days[days.length - 1];
      if (last?.label === label) last.rows.push(row);
      else days.push({ label, rows: [row] });
    }
    return html`
      <div class="days">
        ${days.map((day) => html`
          <section>
            <h2 class="group-header">${day.label}</h2>
            <div class="group">${day.rows.map((row) => this._renderListRow(row, tr))}</div>
          </section>
        `)}
      </div>
    `;
  }

  /** Narrow row: task icon, name and number, then "19:16 · Dev · On time". */
  private _renderListRow(row: Row, tr: Translations) {
    const { task, execution } = row;
    const timing = this._timing(row);
    const dot = html`<span aria-hidden="true">·</span>`;
    return html`
      <button class="row" @click=${() => this._openTask(task.task_id)}>
        <span class="ico" aria-hidden="true"><ha-icon icon=${task.icon || "mdi:wrench-outline"}></ha-icon></span>
        <span class="text">
          <span class="title"><span class="name">${task.name}</span><span class="number">${this._number(task)}</span></span>
          <span class="meta">
            <span title=${formatDateTime(execution.completed_at, this.hass, { second: "2-digit" })}>${formatTime(execution.completed_at, this.hass)}</span>
            ${execution.completed_by ? html`${dot}<span>${execution.completed_by}</span>` : nothing}
            ${dot}
            <span class="timing ${timing.late ? "late" : "on-time"}">
              <ha-icon icon=${timing.late ? "mdi:clock-alert-outline" : "mdi:check"}></ha-icon>${timing.label}
            </span>
          </span>
        </span>
        <ha-icon class="chevron" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
      </button>
    `;
  }

  private _renderRow(row: Row) {
    const tr = t(this.hass?.language);
    const { task, execution } = row;
    const cols = this._columns;
    const timing = this._timing(row);
    const by = execution.completed_by;
    const cells: Record<ColumnKey, unknown> = {
      task: html`
        <div class="task-cell">
          <div class="ico" aria-hidden="true"><ha-icon icon=${task.icon || "mdi:wrench-outline"}></ha-icon></div>
          <div><div class="name">${task.name}</div><div class="number">${this._number(task)}</div></div>
        </div>`,
      completed: html`<span title=${formatDateTime(execution.completed_at, this.hass, { second: "2-digit" })}>${formatRelative(execution.completed_at, this.hass)}</span>`,
      by: by
        ? html`<div class="by"><span class="avatar" aria-hidden="true">${by.trim().charAt(0).toUpperCase()}</span>${by}</div>`
        : html`<span class="muted">—</span>`,
      timing: html`
        <span class="chip ${timing.late ? "late" : "on-time"}">
          <ha-icon icon=${timing.late ? "mdi:clock-alert-outline" : "mdi:check"}></ha-icon>${timing.label}
        </span>`,
      area: this._linkedAreas(task.linked_entity_ids),
      device: this._linkedDevices(task.linked_entity_ids),
    };
    return html`
      <tr @click=${() => this._openTask(task.task_id)}>
        ${ALL_COLUMNS.filter((k) => cols.has(k)).map((k) => html`<td>${cells[k]}</td>`)}
        <td class="open-col">
          <button class="icon-btn" aria-label=${tr.openRecord(task.name)} title=${tr.openRecord(task.name)}
            @click=${(e: Event) => { e.stopPropagation(); this._openTask(task.task_id); }}>
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        </td>
      </tr>
    `;
  }
}
