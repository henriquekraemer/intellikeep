import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant } from "../types";
import { t } from "../translations";
import { deleteAllData } from "../api";
import "../components/confirm-dialog";

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
      align-items: center;
      gap: 10px;
      padding: 10px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-size: 13px; color: var(--secondary-text-color); min-width: 160px; }
    .info-value { font-size: 14px; color: var(--primary-text-color); font-weight: 500; }
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
      background: #fff;
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
      color: #fff;
      --mdc-icon-size: 18px;
    }
    .btn-danger:disabled { opacity: 0.6; cursor: default; }
  `;

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
          <div class="info-row">
            <span class="info-label">Available services</span>
            <span class="info-value">intellikeep.create_task, intellikeep.complete_task, intellikeep.delete_task, intellikeep.update_task</span>
          </div>
          <div class="info-row">
            <span class="info-label">HA Event</span>
            <span class="info-value">intellikeep_task_notification</span>
          </div>
          <div class="info-row">
            <span class="info-label">Storage location</span>
            <span class="info-value">.storage/intellikeep.json</span>
          </div>
          <div class="info-row">
            <span class="info-label">Sensors</span>
            <span class="info-value">sensor.tasks_due_today · sensor.tasks_overdue · sensor.next_due_task</span>
          </div>
          <div class="danger-zone">
            <h4>Danger zone</h4>
            <button class="btn-danger" ?disabled=${this._deletingAll} @click=${() => { this._showDeleteAllConfirm = true; }}>
              <ha-icon icon="mdi:delete-sweep"></ha-icon>
              ${tr.deleteAllBtn}
            </button>
          </div>
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
