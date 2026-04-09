import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant } from "../types";
import { t } from "../translations";
import "./searchable-select";

type AreaRegistryEntry = { area_id: string; name: string };
type DeviceRegistryEntry = { id: string; area_id: string | null; name_by_user: string | null; name: string };

export interface LinkFilterChangeDetail {
  selectedAreaIds: string[];
  selectedDeviceIds: string[];
  filterMode: "or" | "and";
}

@customElement("ik-link-filter")
export class IkLinkFilter extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) areas: AreaRegistryEntry[] = [];
  @property({ attribute: false }) devices: DeviceRegistryEntry[] = [];
  @property({ attribute: false }) selectedAreaIds: string[] = [];
  @property({ attribute: false }) selectedDeviceIds: string[] = [];
  @property() filterMode: "or" | "and" = "or";
  @property({ type: Boolean }) open = false;

  @state() private _areaPickerValue = "";
  @state() private _devicePickerValue = "";

  private _emit(selectedAreaIds: string[], selectedDeviceIds: string[], filterMode: "or" | "and") {
    this.dispatchEvent(new CustomEvent<LinkFilterChangeDetail>("filter-changed", {
      detail: { selectedAreaIds, selectedDeviceIds, filterMode },
      bubbles: true,
      composed: true,
    }));
  }

  private _applyPickerFilters() {
    let areas = [...this.selectedAreaIds];
    let devices = [...this.selectedDeviceIds];
    if (this._areaPickerValue && !areas.includes(this._areaPickerValue)) {
      areas = [...areas, this._areaPickerValue];
    }
    if (this._devicePickerValue && !devices.includes(this._devicePickerValue)) {
      devices = [...devices, this._devicePickerValue];
    }
    this._areaPickerValue = "";
    this._devicePickerValue = "";
    this._emit(areas, devices, this.filterMode);
  }

  private _removeAreaFilter(areaId: string) {
    this._emit(this.selectedAreaIds.filter((v) => v !== areaId), this.selectedDeviceIds, this.filterMode);
  }

  private _removeDeviceFilter(deviceId: string) {
    this._emit(this.selectedAreaIds, this.selectedDeviceIds.filter((v) => v !== deviceId), this.filterMode);
  }

  private _clearFilters() {
    this._areaPickerValue = "";
    this._devicePickerValue = "";
    this._emit([], [], this.filterMode);
  }

  private _setFilterMode(mode: "or" | "and") {
    this._emit(this.selectedAreaIds, this.selectedDeviceIds, mode);
  }

  private _getAreaName(areaId: string): string {
    return this.areas.find((a) => a.area_id === areaId)?.name ?? areaId;
  }

  private _getDeviceLabel(device: DeviceRegistryEntry): string {
    return device.name_by_user || device.name;
  }

  private _getDeviceName(deviceId: string): string {
    const device = this.devices.find((d) => d.id === deviceId);
    return device ? this._getDeviceLabel(device) : deviceId;
  }

  static styles = css`
    :host { display: block; }
    .filter-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 0 8px;
      flex-wrap: wrap;
    }
    .filter-group {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      width: 100%;
    }
    .picker-pair {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1 1 220px;
      min-width: 0;
    }
    .filter-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .filter-select {
      flex: 1;
      min-width: 0;
    }
    .add-filter-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 14px;
      border-radius: 6px;
      border: 1px solid var(--primary-color);
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      flex-shrink: 0;
      margin-left: auto;
      --mdc-icon-size: 16px;
    }
    .add-filter-btn:disabled { opacity: 0.4; cursor: default; }
    @media (hover: none) and (pointer: coarse) {
      .picker-pair { flex: 1 1 100%; }
    }
    .filter-mode-group {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .filter-mode-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 82px;
      padding: 5px 10px;
      border-radius: 999px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
    }
    .filter-mode-chip.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .filter-mode-chip:disabled { opacity: 0.45; cursor: default; }
    .active-filter-tags {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      padding-bottom: 8px;
    }
    .active-filter-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 10px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      color: var(--primary-text-color);
      font-size: 12px;
      border: 1px solid color-mix(in srgb, var(--primary-color) 30%, var(--divider-color));
    }
    .active-filter-tag button {
      border: none;
      background: transparent;
      color: inherit;
      cursor: pointer;
      padding: 0;
      display: inline-flex;
      align-items: center;
      --mdc-icon-size: 14px;
    }
    .clear-filters-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 10px;
      border-radius: 999px;
      border: 1px dashed var(--divider-color);
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      --mdc-icon-size: 14px;
    }
    .clear-filters-btn:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
  `;

  render() {
    const tr = t(this.hass?.language);
    const hasFilters = this.selectedAreaIds.length > 0 || this.selectedDeviceIds.length > 0;
    const canCombineFilters = this.selectedAreaIds.length > 0 && this.selectedDeviceIds.length > 0;
    const canAddFilter = Boolean(this._areaPickerValue || this._devicePickerValue);

    const areaItems = this.areas
      .filter((a) => !this.selectedAreaIds.includes(a.area_id))
      .map((a) => ({ value: a.area_id, label: a.name }));

    const deviceItems = this.devices
      .filter((d) => !this.selectedDeviceIds.includes(d.id))
      .filter((d) => !this._areaPickerValue || d.area_id === this._areaPickerValue)
      .map((d) => ({ value: d.id, label: this._getDeviceLabel(d) }));

    return html`
      ${this.open ? html`
        <div class="filter-bar">
          <div class="filter-group">
            <div class="picker-pair">
              <span class="filter-label">${tr.filterAreasLabel}</span>
              <ik-searchable-select
                class="filter-select"
                .items=${areaItems}
                .value=${this._areaPickerValue}
                .placeholder=${tr.filterAreasPlaceholder}
                .noResultsText=${tr.noResults}
                ?disabled=${areaItems.length === 0}
                @value-changed=${(e: CustomEvent) => { this._areaPickerValue = e.detail.value; this._devicePickerValue = ""; }}
              ></ik-searchable-select>
            </div>
            <div class="picker-pair">
              <span class="filter-label">${tr.filterDevicesLabel}</span>
              <ik-searchable-select
                class="filter-select"
                .items=${deviceItems}
                .value=${this._devicePickerValue}
                .placeholder=${tr.filterDevicesPlaceholder}
                .noResultsText=${tr.noResults}
                ?disabled=${deviceItems.length === 0}
                @value-changed=${(e: CustomEvent) => { this._devicePickerValue = e.detail.value; }}
              ></ik-searchable-select>
            </div>
            <button
              class="add-filter-btn"
              ?disabled=${!canAddFilter}
              @click=${() => this._applyPickerFilters()}
            ><ha-icon icon="mdi:plus"></ha-icon>${tr.addFilter}</button>
          </div>
        </div>
        <div class="filter-bar">
          <div class="filter-group">
            <span class="filter-label">${tr.filterModeLabel}</span>
            <div class="filter-mode-group">
              <button
                class="filter-mode-chip ${this.filterMode === "or" ? "active" : ""}"
                ?disabled=${!canCombineFilters}
                @click=${() => this._setFilterMode("or")}
              >${tr.filterModeAny}</button>
              <button
                class="filter-mode-chip ${this.filterMode === "and" ? "active" : ""}"
                ?disabled=${!canCombineFilters}
                @click=${() => this._setFilterMode("and")}
              >${tr.filterModeAll}</button>
            </div>
          </div>
        </div>
      ` : nothing}
      ${hasFilters ? html`
        <div class="active-filter-tags">
          ${this.selectedAreaIds.map((areaId) => html`
            <span class="active-filter-tag">
              ${tr.filterAreaTag(this._getAreaName(areaId))}
              <button @click=${() => this._removeAreaFilter(areaId)} aria-label=${tr.removeFilter}><ha-icon icon="mdi:close"></ha-icon></button>
            </span>
          `)}
          ${this.selectedDeviceIds.map((deviceId) => html`
            <span class="active-filter-tag">
              ${tr.filterDeviceTag(this._getDeviceName(deviceId))}
              <button @click=${() => this._removeDeviceFilter(deviceId)} aria-label=${tr.removeFilter}><ha-icon icon="mdi:close"></ha-icon></button>
            </span>
          `)}
          <button class="clear-filters-btn" @click=${() => this._clearFilters()}><ha-icon icon="mdi:filter-off"></ha-icon>${tr.clearFilters}</button>
        </div>
      ` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ik-link-filter": IkLinkFilter;
  }
}
