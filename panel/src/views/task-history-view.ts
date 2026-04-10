import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, Task, TaskExecution } from "../types";
import { t } from "../translations";
import { isDesktop } from "../utils";
import "../components/link-filter";

type AreaRegistryEntry = { area_id: string; name: string };
type DeviceRegistryEntry = { id: string; area_id: string | null; name_by_user: string | null; name: string };
type ColumnKey = "task" | "area" | "device" | "by" | "date" | "late";

const ALL_COLUMNS: ColumnKey[] = ["task", "area", "device", "by", "date", "late"];
const MOBILE_MAX = 3;

const HISTORY_FILTER_MODE_KEY = "intellikeep.historyFilterMode";
const HISTORY_FILTER_AREAS_KEY = "intellikeep.historyFilterAreas";
const HISTORY_FILTER_DEVICES_KEY = "intellikeep.historyFilterDevices";
const HISTORY_COLUMNS_KEY = "intellikeep.historyColumns";
const HISTORY_COLUMNS_MOBILE_KEY = "intellikeep.historyColumnsMobile";

const loadStoredList = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch { return []; }
};

const loadStoredColumns = (key: string, defaults: ColumnKey[]): Set<ColumnKey> => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set(defaults);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return new Set(defaults);
    return new Set(parsed.filter((v): v is ColumnKey => ALL_COLUMNS.includes(v)));
  } catch { return new Set(defaults); }
};

interface FlatExecution extends TaskExecution {
  _taskId: string;
  _taskNumber: number;
  _taskName: string;
  _linkedEntityIds: string[];
}

@customElement("ik-task-history-view")
export class IkTaskHistoryView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) tasks: Task[] = [];

  @state() private _page = 0;
  @state() private _pageSize: 10 | 25 | 50 = 25;

  @state() private _areas: AreaRegistryEntry[] = [];
  @state() private _devices: DeviceRegistryEntry[] = [];
  @state() private _selectedAreaIds: string[] = loadStoredList(HISTORY_FILTER_AREAS_KEY);
  @state() private _selectedDeviceIds: string[] = loadStoredList(HISTORY_FILTER_DEVICES_KEY);
  @state() private _filterMode: "or" | "and" = (localStorage.getItem(HISTORY_FILTER_MODE_KEY) as "or" | "and") ?? "or";
  @state() private _showLinkFilters = false;

  @state() private _visibleColumns: Set<ColumnKey> = loadStoredColumns(HISTORY_COLUMNS_KEY, ALL_COLUMNS);
  @state() private _visibleColumnsMobile: Set<ColumnKey> = loadStoredColumns(HISTORY_COLUMNS_MOBILE_KEY, ["task", "date"]);
  @state() private _showColumnPicker = false;
  @state() private _isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  private _mql = window.matchMedia("(hover: none) and (pointer: coarse)");
  private _onMqlChange = () => { this._isMobile = this._mql.matches; };

  connectedCallback() {
    super.connectedCallback();
    this._mql.addEventListener("change", this._onMqlChange);
    void this._loadRegistries();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._mql.removeEventListener("change", this._onMqlChange);
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

  private _colLabels(): Record<ColumnKey, string> {
    const tr = t(this.hass?.language);
    return {
      task: tr.taskHeader,
      area: tr.filterAreasLabel,
      device: tr.filterDevicesLabel,
      by: tr.completedBy,
      date: tr.completedAt,
      late: tr.lateLabel,
    };
  }

  private _toggleColumn(key: ColumnKey) {
    if (this._isMobile) {
      const next = new Set(this._visibleColumnsMobile);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else if (next.size < MOBILE_MAX) {
        next.add(key);
      }
      this._visibleColumnsMobile = next;
      localStorage.setItem(HISTORY_COLUMNS_MOBILE_KEY, JSON.stringify([...next]));
    } else {
      const next = new Set(this._visibleColumns);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      this._visibleColumns = next;
      localStorage.setItem(HISTORY_COLUMNS_KEY, JSON.stringify([...next]));
    }
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

  private _navigate(path: string) {
    this.dispatchEvent(new CustomEvent("navigate", { detail: path, bubbles: true, composed: true }));
  }

  private _openTask(taskId: string) {
    if (isDesktop()) {
      this.dispatchEvent(new CustomEvent("open-task-modal", { detail: taskId, bubbles: true, composed: true }));
    } else {
      this._navigate(`/edit/${taskId}`);
    }
  }

  private _formatDate(iso: string): string {
    return new Date(iso).toLocaleString();
  }

  private _getLinkedAreas(linkedEntityIds: string[]): string {
    return linkedEntityIds
      .filter((v) => v.startsWith("area:"))
      .map((v) => this._areas.find((a) => a.area_id === v.slice(5))?.name ?? v.slice(5))
      .join(", ") || "—";
  }

  private _getLinkedDevices(linkedEntityIds: string[]): string {
    return linkedEntityIds
      .filter((v) => v.startsWith("device:"))
      .map((v) => {
        const d = this._devices.find((device) => device.id === v.slice(7));
        return d ? (d.name_by_user || d.name) : v.slice(7);
      })
      .join(", ") || "—";
  }

  private _escapeHtml(text: string): string {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  private _flatExecutions(): FlatExecution[] {
    const flat: FlatExecution[] = [];
    for (const task of this.tasks) {
      if (!this._matchesLinkedFilters(task.linked_entity_ids ?? [])) continue;
      for (const ex of task.executions ?? []) {
        flat.push({ ...ex, _taskId: task.task_id, _taskNumber: task.task_number, _taskName: task.name, _linkedEntityIds: task.linked_entity_ids ?? [] });
      }
    }
    flat.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
    return flat;
  }

  private _exportCsv() {
    const tr = t(this.hass?.language);
    const cols = this._visibleColumns;
    const all = this._flatExecutions();
    const colLabel = this._colLabels();

    const colValue: Record<ColumnKey, (ex: FlatExecution) => string> = {
      task: (ex) => ex._taskName,
      area: (ex) => this._getLinkedAreas(ex._linkedEntityIds).replace("—", ""),
      device: (ex) => this._getLinkedDevices(ex._linkedEntityIds).replace("—", ""),
      by: (ex) => ex.completed_by || "",
      date: (ex) => new Date(ex.completed_at).toLocaleString(),
      late: (ex) => ex.was_late ? tr.lateLabel : "",
    };

    const visibleKeys = ALL_COLUMNS.filter((k) => cols.has(k));
    const headers = ["#", ...visibleKeys.map((k) => colLabel[k])];
    const rows = all.map((ex) => [
      `#${String(ex._taskNumber).padStart(3, "0")}`,
      ...visibleKeys.map((k) => colValue[k](ex)),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "intellikeep-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  private _printHistory() {
    const tr = t(this.hass?.language);
    const cols = this._visibleColumns;
    const all = this._flatExecutions();
    const e = (s: string) => this._escapeHtml(s);
    const colLabel = this._colLabels();
    const visibleKeys = ALL_COLUMNS.filter((k) => cols.has(k));

    const rows = all.map((ex) => {
      const cells = visibleKeys.map((k) => {
        if (k === "task") return `<td>${e(ex._taskName)}</td>`;
        if (k === "area") return `<td>${e(this._getLinkedAreas(ex._linkedEntityIds))}</td>`;
        if (k === "device") return `<td>${e(this._getLinkedDevices(ex._linkedEntityIds))}</td>`;
        if (k === "by") return `<td>${e(ex.completed_by || "—")}</td>`;
        if (k === "date") return `<td>${e(this._formatDate(ex.completed_at))}</td>`;
        if (k === "late") return `<td>${ex.was_late ? `<span style="background:#ff9800;color:#fff;font-size:10px;font-weight:600;padding:1px 6px;border-radius:4px;">${e(tr.lateLabel)}</span>` : "—"}</td>`;
        return "<td></td>";
      }).join("");
      return `<tr><td>#${e(String(ex._taskNumber).padStart(3, "0"))}</td>${cells}</tr>`;
    }).join("");

    const headerCells = visibleKeys.map((k) => `<th>${e(colLabel[k])}</th>`).join("");

    const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 336 416" height="40"><path fill="#000" d="M292.085,275.543C294.886,277,295.348,279.164,295.347,281.645C295.325,315.301,295.372,348.957,295.294,382.613C295.28,388.929,292.366,391.331,285.198,391.337C238.711,391.373,192.224,391.381,145.737,391.383C117.744,391.384,89.752,391.372,61.76,391.338C52.998,391.327,50.684,389.06,50.679,380.502C50.66,348.345,50.66,316.187,50.672,284.029C50.675,276.321,52.218,274.831,60.105,274.712C74.264,274.499,74.276,274.499,74.281,288.852C74.29,313.345,74.38,337.839,74.197,362.33C74.163,366.986,75.349,368.728,80.342,368.692C110.826,368.476,141.319,368.967,171.796,368.439C193.28,368.067,214.74,368.713,236.211,368.615C245.861,368.572,255.494,367.96,265.164,368.535C271.299,368.9,271.738,368.131,271.741,362.094C271.754,336.435,271.738,310.775,271.748,285.116C271.752,276.257,273.215,274.788,282.272,274.737C285.416,274.719,288.61,274.25,292.085,275.543z"/><path fill="#000" d="M320.53,252.723C324.286,259.571,323.451,265.254,318.429,268.988C313.15,272.914,307.521,272.273,301.916,266.689C278.307,243.165,254.779,219.561,231.214,195.992C213.423,178.198,195.629,160.407,177.823,142.628C173.271,138.083,172.813,138.093,168.221,142.681C128.256,182.607,88.297,222.539,48.336,262.468C46.921,263.881,45.523,265.313,44.07,266.686C38.204,272.228,31.425,272.392,26.385,267.138C21.725,262.279,22.113,256.061,27.791,250.309C38.21,239.756,48.781,229.354,59.281,218.879C93.962,184.281,128.635,149.675,163.32,115.08C170.895,107.526,175.581,107.627,183.172,115.229C228.863,160.979,274.576,206.706,320.53,252.723z"/><path fill="#000" d="M156.557,299.525C160.166,295.201,163.61,293.158,169.639,294.584C188.024,298.934,202.203,278.403,195.773,264.969C191.913,266.43,189.825,269.979,187.009,272.568C182.092,277.087,177.339,277.472,173.526,273.318C169.779,269.236,170.283,263.932,174.822,259.711C177.585,257.141,180.352,254.576,183.233,251.902C170.99,244.815,153.777,253.19,151.394,266.927C150.864,269.979,149.961,273.067,151.083,276.274C151.425,277.252,151.101,278.62,150.704,279.666C149.946,281.662,137.044,293.377,133.971,294.688C133.681,285.538,126.866,285.16,120.151,282.742C114.014,280.532,118.691,272.931,117.727,267.826C117.243,265.263,118.846,263.837,121.486,263.62C122.641,263.526,123.774,263.175,124.925,262.992C133.809,261.58,136.709,254.209,131.268,246.85C126.987,241.059,127.051,240.303,132.346,235.224C133.307,234.302,134.406,233.517,135.31,232.546C138.794,228.804,142.381,228.471,146.093,232.144C149.484,235.501,152.877,235.731,157.272,233.559C160.724,231.853,162.316,229.797,162.78,226.125C163.134,223.321,162.531,219.364,166.19,218.519C171.178,217.368,176.475,216.846,181.348,219.095C183.268,219.981,183.115,222.479,183.339,224.484C183.681,227.533,183.168,231.265,186.962,232.483C191.091,233.807,195.296,237.25,199.659,232.296C201.401,230.318,204.219,227.906,207.119,229.88C211.043,232.551,215.395,235.136,217.096,239.996C217.941,242.408,215.652,243.833,214.56,245.642C212.962,248.291,209.523,250.215,211.586,254.354C213.777,258.746,215.417,263.246,221.712,262.839C226.698,262.516,229.147,265.016,228.365,270.214C228.218,271.191,228.351,272.21,228.352,273.21C228.365,282.781,228.365,282.781,219.095,284.28C214.023,285.101,210.057,293.711,213.037,297.829C219.4,306.62,219.14,305.42,211.119,313.586C207.521,317.248,204.313,317.986,199.993,314.391C195.228,310.426,190.997,310.642,185.99,314.197C183.352,316.069,183.55,319.213,183.431,321.895C183.217,326.712,181.234,329.019,176.291,328.379C175.635,328.294,174.959,328.378,174.292,328.364C164.372,328.15,164,330.187,162.549,318.557C161.772,312.323,155.906,312.984,151.746,311.527C150.326,311.029,148.113,312.422,147.466,310.154C146.913,308.213,148.863,307.326,149.972,306.171C152.05,304.009,154.19,301.907,156.557,299.525z"/><path fill="#000" d="M187.924,40.781C205.599,43.236,221.527,49.142,236.326,58.295C239.911,60.513,241.081,62.498,238.145,66.093C235.942,68.791,233.966,71.722,232.238,74.748C230.315,78.116,228.374,78.323,225.038,76.4C214.334,70.231,203.171,65.211,190.839,62.966C167.933,58.798,146.534,63.005,126.185,73.783C124.42,74.718,122.629,75.632,120.973,76.739C118.387,78.469,116.544,78.228,114.861,75.388C112.828,71.955,110.482,68.702,108.193,65.427C106.166,62.526,106.48,60.446,109.688,58.503C132.412,44.741,156.758,37.761,183.492,40.471C184.816,40.605,186.149,40.647,187.924,40.781z"/><path fill="#000" d="M249.011,121.883C257.669,121.869,265.833,121.736,273.991,121.886C281.088,122.017,282.31,123.418,282.315,130.551C282.327,150.037,282.339,169.524,282.293,189.011C282.288,190.743,282.888,192.665,281.228,194.426C277.668,193.409,276.164,189.866,273.427,187.893C263.098,180.447,258.608,170.705,260.525,157.832C261.166,153.531,262.538,147.803,259.723,144.809C256.842,141.747,251.207,144.022,246.801,143.972C230.856,143.788,233.06,145.359,232.957,130.084C232.904,122.165,233.218,121.898,241.018,121.839C243.516,121.82,246.015,121.869,249.011,121.883z"/><path fill="#000" d="M82.143,171.044C84.154,175.714,83.172,178.934,79.275,181.722C74.754,184.956,71.094,189.342,66.515,192.12C64.384,191.171,64.222,189.57,63.768,188.198C55.428,162.95,55.684,137.621,62.993,112.198C63.977,108.774,65.532,107.412,69.078,108.985C72.873,110.668,76.729,112.241,80.644,113.619C84.002,114.8,84.733,116.54,83.668,120.052C78.615,136.733,77.489,153.612,82.143,171.044z"/><path fill="#000" d="M64.331,91.478C59.424,81.825,60.131,73.819,66.226,67.22C72.174,60.78,81.1,59.016,89.529,62.614C96.86,65.744,101.61,73.692,100.771,81.428C99.82,90.211,93.526,97.565,85.744,99.288C77.061,101.21,70.053,98.692,64.331,91.478z"/><path fill="#000" d="M278.435,66.513C285.689,74.329,286.806,82.963,281.826,90.845C277.285,98.032,267.981,101.683,260.2,99.33C251.19,96.606,245.216,88.625,245.767,79.543C246.201,72.378,249.594,66.785,256.202,63.726C263.926,60.15,271.373,60.818,278.435,66.513z"/><path fill="#000" d="M101.244,112.328C102.895,105.379,107.409,101.405,113.707,101.001C119.431,100.635,125.066,104.316,126.983,109.673C128.768,114.664,126.993,120.768,122.626,123.969C118.201,127.212,113.259,127.318,108.428,125.259C103.044,122.964,101.095,118.352,101.244,112.328z"/></svg>`;
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
    ${logoSvg}
    <span class="print-brand-name">IntelliKeep</span>
  </div>
  <div class="print-report-title">
    <div>${e(tr.globalHistoryTitle)}</div>
    <div class="print-date">${new Date().toLocaleDateString()}</div>
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

  static styles = css`
    :host { display: block; }

    .toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    h2 { margin: 0; font-size: 20px; font-weight: 500; flex: 1; min-width: 0; }

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
      --mdc-icon-size: 18px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .filter-toggle-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .filter-toggle-btn.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .filter-toggle-btn.has-filters:not(.active) { border-color: var(--primary-color); color: var(--primary-color); }
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

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      flex-shrink: 0;
      --mdc-icon-size: 15px;
    }
    .btn-secondary:hover { border-color: var(--primary-color); color: var(--primary-color); }
    .btn-secondary.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }

    /* Column picker panel */
    .column-picker {
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 12px;
    }
    .column-picker-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .column-picker-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .column-picker-limit {
      font-size: 11px;
      color: var(--primary-color);
      font-weight: 500;
    }
    .column-picker-options {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .col-option {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      cursor: pointer;
      font-size: 13px;
      user-select: none;
      background: transparent;
      color: var(--primary-text-color);
      transition: background 0.15s, border-color 0.15s;
    }
    .col-option:has(input:checked) {
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      border-color: color-mix(in srgb, var(--primary-color) 40%, var(--divider-color));
    }
    .col-option.at-limit {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .col-option input[type="checkbox"] {
      accent-color: var(--primary-color);
      width: 14px;
      height: 14px;
      cursor: inherit;
    }

    .empty {
      text-align: center;
      padding: 60px 20px;
      color: var(--secondary-text-color);
      font-size: 14px;
    }

    /* Table */
    ha-card { overflow: hidden; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th {
      text-align: left;
      padding: 8px 12px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-weight: 500;
      border-bottom: 1px solid var(--divider-color);
      white-space: nowrap;
    }
    td { padding: 10px 12px; border-bottom: 1px solid var(--divider-color); vertical-align: middle; }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr { cursor: pointer; }
    tbody tr:hover { background: var(--secondary-background-color); }
    .task-num { color: var(--secondary-text-color); font-size: 12px; white-space: nowrap; }
    .task-name { font-weight: 500; color: var(--primary-text-color); }
    .late-badge {
      display: inline-block;
      background: var(--warning-color, #ff9800);
      color: #fff;
      font-size: 10px;
      font-weight: 600;
      padding: 1px 6px;
      border-radius: 4px;
      vertical-align: middle;
    }
    .btn-view {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-color);
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      --mdc-icon-size: 14px;
    }
    .btn-view:hover { background: var(--secondary-background-color); }

    /* Pagination */
    .pagination {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      padding: 14px 0 0;
      flex-wrap: wrap;
    }
    .pagination span { font-size: 13px; color: var(--secondary-text-color); }
    .pagination select {
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
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
    .page-btn:disabled { opacity: 0.4; cursor: default; }

    /* Mobile */
    @media (hover: none) and (pointer: coarse) {
      .btn-export, .btn-print { display: none; }
    }
  `;

  render() {
    const tr = t(this.hass?.language);
    const hasFilters = this._selectedAreaIds.length > 0 || this._selectedDeviceIds.length > 0;
    const cols = this._isMobile ? this._visibleColumnsMobile : this._visibleColumns;

    const colDefs: { key: ColumnKey; label: string }[] = [
      { key: "task", label: tr.taskHeader },
      { key: "area", label: tr.filterAreasLabel },
      { key: "device", label: tr.filterDevicesLabel },
      { key: "by", label: tr.completedBy },
      { key: "date", label: tr.completedAt },
      { key: "late", label: tr.lateLabel },
    ];

    const all = this._flatExecutions();
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / this._pageSize));
    const page = Math.min(this._page, totalPages - 1);
    const start = page * this._pageSize;
    const pageItems = all.slice(start, start + this._pageSize);

    return html`
      <div class="toolbar">
        <h2>${tr.globalHistoryTitle}</h2>
        <button class="btn-secondary btn-export" @click=${() => this._exportCsv()}>
          <ha-icon icon="mdi:download"></ha-icon>${tr.exportCsv}
        </button>
        <button class="btn-secondary btn-print" @click=${() => this._printHistory()}>
          <ha-icon icon="mdi:printer"></ha-icon>${tr.printHistory}
        </button>
        <button
          class="btn-secondary ${this._showColumnPicker ? "active" : ""}"
          @click=${() => { this._showColumnPicker = !this._showColumnPicker; }}
        >
          <ha-icon icon="mdi:table-column"></ha-icon>${tr.columns}
        </button>
        <button
          class="filter-toggle-btn ${this._showLinkFilters ? "active" : ""} ${hasFilters ? "has-filters" : ""}"
          title=${tr.filterToggleTitle}
          @click=${() => { this._showLinkFilters = !this._showLinkFilters; }}
        >
          <ha-icon icon="mdi:filter"></ha-icon>
          ${hasFilters ? html`<span class="filter-toggle-badge">${this._selectedAreaIds.length + this._selectedDeviceIds.length}</span>` : nothing}
        </button>
      </div>

      ${this._showColumnPicker ? html`
        <div class="column-picker">
          <div class="column-picker-header">
            <span class="column-picker-title">${tr.columnPickerTitle}</span>
            ${this._isMobile ? html`<span class="column-picker-limit">${tr.columnPickerMobileLimit(MOBILE_MAX)}</span>` : nothing}
          </div>
          <div class="column-picker-options">
            ${colDefs.map(({ key, label }) => {
              const checked = cols.has(key);
              const atLimit = this._isMobile && cols.size >= MOBILE_MAX && !checked;
              const isLast = checked && cols.size === 1;
              const disabled = atLimit || isLast;
              return html`
                <label class="col-option ${disabled ? "at-limit" : ""}">
                  <input
                    type="checkbox"
                    .checked=${checked}
                    ?disabled=${disabled}
                    @change=${() => this._toggleColumn(key)}
                  >
                  ${label}
                </label>
              `;
            })}
          </div>
        </div>
      ` : nothing}

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

      <ha-card>
        ${total === 0
          ? html`<div class="empty">${tr.globalHistoryEmpty}</div>`
          : html`
            <table>
              <thead>
                <tr>
                  <th class="task-num">#</th>
                  ${cols.has("task") ? html`<th>${tr.taskHeader}</th>` : nothing}
                  ${cols.has("area") ? html`<th>${tr.filterAreasLabel}</th>` : nothing}
                  ${cols.has("device") ? html`<th>${tr.filterDevicesLabel}</th>` : nothing}
                  ${cols.has("by") ? html`<th>${tr.completedBy}</th>` : nothing}
                  ${cols.has("date") ? html`<th>${tr.completedAt}</th>` : nothing}
                  ${cols.has("late") ? html`<th>${tr.lateLabel}</th>` : nothing}
                  ${!this._isMobile ? html`<th></th>` : nothing}
                </tr>
              </thead>
              <tbody>
                ${pageItems.map((ex) => html`
                  <tr @click=${() => this._openTask(ex._taskId)}>
                    <td class="task-num">#${String(ex._taskNumber).padStart(3, "0")}</td>
                    ${cols.has("task") ? html`<td class="task-name">${ex._taskName}</td>` : nothing}
                    ${cols.has("area") ? html`<td>${this._getLinkedAreas(ex._linkedEntityIds)}</td>` : nothing}
                    ${cols.has("device") ? html`<td>${this._getLinkedDevices(ex._linkedEntityIds)}</td>` : nothing}
                    ${cols.has("by") ? html`<td>${ex.completed_by || "—"}</td>` : nothing}
                    ${cols.has("date") ? html`<td>${this._formatDate(ex.completed_at)}</td>` : nothing}
                    ${cols.has("late") ? html`<td>${ex.was_late ? html`<span class="late-badge">${tr.lateLabel}</span>` : "—"}</td>` : nothing}
                    ${!this._isMobile ? html`
                      <td>
                        <button class="btn-view" @click=${(e: Event) => { e.stopPropagation(); this._openTask(ex._taskId); }}>
                          <ha-icon icon="mdi:open-in-app"></ha-icon>
                          ${tr.viewTask}
                        </button>
                      </td>
                    ` : nothing}
                  </tr>
                `)}
              </tbody>
            </table>
            ${total > 10 ? html`
              <div class="pagination">
                <span>${tr.rowsPerPage}</span>
                <select .value=${String(this._pageSize)} @change=${(e: Event) => {
                  this._pageSize = Number((e.target as HTMLSelectElement).value) as 10 | 25 | 50;
                  this._page = 0;
                }}>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span>${start + 1}–${Math.min(start + this._pageSize, total)} ${tr.of} ${total}</span>
                <button class="page-btn" ?disabled=${page === 0} @click=${() => { this._page = page - 1; }}>&lt;</button>
                <button class="page-btn" ?disabled=${page >= totalPages - 1} @click=${() => { this._page = page + 1; }}>&gt;</button>
              </div>
            ` : nothing}
          `}
      </ha-card>
    `;
  }
}
