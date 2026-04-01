import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ik-confirm-dialog")
export class IkConfirmDialog extends LitElement {
  @property() heading = "Are you sure?";
  @property() confirmText = "Confirm";
  @property() cancelText = "Cancel";
  @property({ type: Boolean }) open = false;

  static styles = css`
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dialog {
      background: var(--card-background-color, #fff);
      border-radius: 12px;
      padding: 24px;
      min-width: 280px;
      max-width: 400px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,.2));
    }
    h3 {
      margin: 0 0 8px;
      font-size: 16px;
      color: var(--primary-text-color);
    }
    .content {
      color: var(--secondary-text-color);
      font-size: 14px;
      margin-bottom: 20px;
    }
    .buttons {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    button {
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }
    .cancel {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }
    .confirm {
      background: var(--error-color, #f44336);
      color: #fff;
    }
  `;

  private _fire(confirmed: boolean) {
    this.dispatchEvent(new CustomEvent("dialog-closed", { detail: { confirmed } }));
    this.open = false;
  }

  render() {
    if (!this.open) return html``;
    return html`
      <div class="backdrop" @click=${() => this._fire(false)}>
        <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
          <h3>${this.heading}</h3>
          <div class="content"><slot></slot></div>
          <div class="buttons">
            <button class="cancel" @click=${() => this._fire(false)}>${this.cancelText}</button>
            <button class="confirm" @click=${() => this._fire(true)}>${this.confirmText}</button>
          </div>
        </div>
      </div>
    `;
  }
}
