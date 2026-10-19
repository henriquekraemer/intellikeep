import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

/** The focused element, looking inside open shadow roots. */
const deepActiveElement = (): HTMLElement | null => {
  let el = document.activeElement;
  while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
  return el as HTMLElement | null;
};

/**
 * Asks to confirm a destructive action. While open it holds the keyboard
 * focus (Cancel first), Escape cancels, and closing gives the focus back to
 * where it was.
 */
@customElement("ik-confirm-dialog")
export class IkConfirmDialog extends LitElement {
  @property() heading = "Are you sure?";
  @property() confirmText = "Confirm";
  @property() cancelText = "Cancel";
  @property({ type: Boolean }) open = false;

  private _returnFocus: HTMLElement | null = null;

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
    button:focus-visible {
      outline: 2px solid var(--ik-focus-ring, var(--primary-color));
      outline-offset: 2px;
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
      color: var(--text-primary-color);
    }
  `;

  protected willUpdate(changed: PropertyValues) {
    if (changed.has("open") && this.open) this._returnFocus = deepActiveElement();
  }

  protected updated(changed: PropertyValues) {
    if (!changed.has("open")) return;
    if (this.open) {
      // Cancel first, so Enter right after opening doesn't confirm
      this.renderRoot.querySelector<HTMLButtonElement>(".cancel")?.focus();
    } else if (changed.get("open")) {
      if (this._returnFocus?.isConnected) this._returnFocus.focus();
      this._returnFocus = null;
    }
  }

  private _fire(confirmed: boolean) {
    this.dispatchEvent(new CustomEvent("dialog-closed", { detail: { confirmed } }));
    this.open = false;
  }

  private _onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      // Only this dialog closes, not a task dialog under it
      e.stopPropagation();
      this._fire(false);
    } else if (e.key === "Tab") {
      // Tab and Shift+Tab move between the two buttons instead of the page behind
      e.preventDefault();
      const cancel = this.renderRoot.querySelector<HTMLButtonElement>(".cancel");
      const confirm = this.renderRoot.querySelector<HTMLButtonElement>(".confirm");
      ((this.renderRoot as ShadowRoot).activeElement === cancel ? confirm : cancel)?.focus();
    }
  }

  render() {
    if (!this.open) return html``;
    return html`
      <div class="backdrop" @click=${() => this._fire(false)} @keydown=${this._onKeydown}>
        <div
          class="dialog"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="heading"
          aria-describedby="content"
          @click=${(e: Event) => e.stopPropagation()}
        >
          <h3 id="heading">${this.heading}</h3>
          <div class="content" id="content"><slot></slot></div>
          <div class="buttons">
            <button class="cancel" @click=${() => this._fire(false)}>${this.cancelText}</button>
            <button class="confirm" @click=${() => this._fire(true)}>${this.confirmText}</button>
          </div>
        </div>
      </div>
    `;
  }
}
