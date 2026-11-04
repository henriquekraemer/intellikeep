import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant } from "../types";
import { t } from "../translations";
import { deleteAllData } from "../api";
import "../components/confirm-dialog";

const ACTIONS = [
  "create_task",
  "update_task",
  "complete_task",
  "reopen_task",
  "delete_task",
  "add_task_note",
  "delete_task_note",
  "load_sample_data",
  "delete_all_data",
].map((action) => `intellikeep.${action}`);

const EVENTS = ["intellikeep_task_notification", "intellikeep_task_updated"];

/** Entity IDs with the default instance name, for when the entity registry isn't available. */
const DEFAULT_ENTITY_IDS = [
  "calendar.intellikeep_tasks",
  "sensor.intellikeep_next_due_task",
  "sensor.intellikeep_tasks_due_today",
  "sensor.intellikeep_tasks_overdue",
  "todo.intellikeep_tasks",
];

/** HA's Store API saves under .storage/<key>, without an extension. */
const STORAGE_FILE = ".storage/intellikeep";

@customElement("ik-settings-view")
export class IkSettingsView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) enableAnimations = true;
  @state() private _showDeleteAllConfirm = false;
  @state() private _deletingAll = false;

  static styles = css`
    :host { display: block; }
    ha-card {
      padding: 20px;
      box-shadow: none;
      border: none;
      background: transparent;
    }
    h3 { margin: 0 0 8px; font-size: 16px; }
    p { color: var(--secondary-text-color); font-size: 14px; line-height: 1.5; }
    .info-row {
      display: flex;
      align-items: baseline;
      gap: 10px;
      padding: 10px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .info-row:last-child,
    .info-row:has(+ .danger-zone) { border-bottom: none; }
    .info-label { font-size: 13px; color: var(--secondary-text-color); min-width: 160px; flex-shrink: 0; }
    .info-value {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 12px;
      min-width: 0;
      font-size: 13px;
      color: var(--primary-text-color);
    }
    .info-value code {
      font-family: var(--ha-font-family-code, var(--code-font-family, monospace));
      overflow-wrap: anywhere;
    }
    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .toggle-label {
      font-size: 14px;
      color: var(--primary-text-color);
    }
    .toggle-desc {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }
    /* Simple toggle switch */
    .switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 22px;
      flex-shrink: 0;
    }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider {
      position: absolute;
      inset: 0;
      background: var(--disabled-color, #ccc);
      border-radius: 22px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .slider::before {
      content: "";
      position: absolute;
      width: 16px;
      height: 16px;
      left: 3px;
      top: 3px;
      background: var(--text-primary-color);
      border-radius: 50%;
      transition: transform 0.2s;
    }
    input:checked + .slider { background: var(--primary-color); }
    input:checked + .slider::before { transform: translateX(18px); }
    .danger-zone {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--divider-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .danger-zone h4 {
      margin: 0 0 8px;
      font-size: 13px;
      font-weight: 600;
      color: var(--error-color, #f44336);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .btn-danger {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 18px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      background: var(--error-color, #f44336);
      color: var(--text-primary-color);
      --mdc-icon-size: 18px;
    }
    .btn-danger:disabled { opacity: 0.6; cursor: default; }
  `;

  /** IntelliKeep's entity IDs as registered, so a renamed instance or entity shows its real ID. */
  private get _entityIds(): string[] {
    const ids = Object.values(this.hass?.entities ?? {})
      .filter((entity) => entity.platform === "intellikeep")
      .map((entity) => entity.entity_id)
      .sort();
    return ids.length ? ids : DEFAULT_ENTITY_IDS;
  }

  private _renderInfoRow(label: string, values: string[]) {
    return html`
      <div class="info-row">
        <span class="info-label">${label}</span>
        <span class="info-value">${values.map((value) => html`<code>${value}</code>`)}</span>
      </div>
    `;
  }

  render() {
    const tr = t(this.hass?.language);
    return html`
      <ha-card>
        <div>
          <div class="toggle-row">
            <div>
              <div class="toggle-label">${tr.animationsLabel}</div>
              <div class="toggle-desc">${tr.animationsDesc}</div>
            </div>
            <label class="switch">
              <input type="checkbox"
                .checked=${this.enableAnimations}
                @change=${(e: Event) => this.dispatchEvent(new CustomEvent("animations-changed", {
                  detail: (e.target as HTMLInputElement).checked,
                  bubbles: true, composed: true
                }))}
              />
              <span class="slider"></span>
            </label>
          </div>
          ${this._renderInfoRow(tr.infoActions, ACTIONS)}
          ${this._renderInfoRow(tr.infoEvents, EVENTS)}
          ${this._renderInfoRow(tr.infoEntities, this._entityIds)}
          ${this._renderInfoRow(tr.infoStorage, [STORAGE_FILE])}
          ${this.hass?.user?.is_admin ? html`
            <div class="danger-zone">
              <h4>${tr.dangerZone}</h4>
              <button class="btn-danger" ?disabled=${this._deletingAll} @click=${() => { this._showDeleteAllConfirm = true; }}>
                <ha-icon icon="mdi:delete-sweep"></ha-icon>
                ${tr.deleteAllBtn}
              </button>
            </div>
          ` : ""}
        </div>
        <ik-confirm-dialog
          .heading=${tr.deleteAllHeading}
          .open=${this._showDeleteAllConfirm}
          @dialog-closed=${async (e: CustomEvent) => {
            this._showDeleteAllConfirm = false;
            if (!e.detail.confirmed) return;
            this._deletingAll = true;
            try {
              await deleteAllData(this.hass);
            } finally {
              this._deletingAll = false;
            }
          }}
        >${tr.deleteAllBody}</ik-confirm-dialog>
      </ha-card>
    `;
  }
}
