import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

export type MenuItem =
  | { action: string; label: string; icon?: string; danger?: boolean; selected?: boolean }
  | { divider: true };

/**
 * Button that opens a list of actions. HA's own menu elements are lazy-loaded
 * and not guaranteed in a custom panel, so this one is self-contained. The list
 * is position: fixed, so scrolling containers and card borders don't clip it.
 * Fires `menu-select` with the chosen item's `action`.
 */
@customElement("ik-menu")
export class IkMenu extends LitElement {
  @property({ attribute: false }) items: MenuItem[] = [];
  /** Accessible name of the icon button, or the visible text of the pill button. */
  @property() label = "";
  @property() icon = "mdi:dots-vertical";
  /** Text button with a chevron instead of an icon-only button. */
  @property({ type: Boolean }) pill = false;
  /** Pill only: an icon before the text. */
  @property() pillIcon = "";

  @state() private _open = false;
  @state() private _position = "";

  static styles = css`
    :host { display: inline-flex; }
    .trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      font: inherit;
    }
    .trigger.icon {
      width: var(--ik-hit-target, 44px);
      height: var(--ik-hit-target, 44px);
      border-radius: 50%;
      --mdc-icon-size: 20px;
    }
    .trigger.pill {
      gap: 8px;
      height: 40px;
      padding: 0 12px 0 16px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-pill, 20px);
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      --mdc-icon-size: 18px;
    }
    .trigger:hover { background: var(--ik-subtle-fill, var(--secondary-background-color)); color: var(--primary-text-color); }
    .trigger:focus-visible, .item:focus-visible {
      outline: 2px solid var(--ik-focus-ring, var(--primary-color));
      outline-offset: -2px;
    }
    .scrim { position: fixed; inset: 0; z-index: 10; }
    .menu {
      position: fixed;
      z-index: 11;
      min-width: 180px;
      max-height: 70vh;
      overflow-y: auto;
      padding: 6px 0;
      border-radius: 12px;
      background: var(--ik-surface, var(--card-background-color));
      border: 1px solid var(--divider-color);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.24);
    }
    .item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      min-height: var(--ik-hit-target, 44px);
      padding: 0 16px;
      border: none;
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 14px;
      text-align: start;
      cursor: pointer;
      --mdc-icon-size: 20px;
    }
    .item ha-icon { color: var(--secondary-text-color); }
    .item:hover { background: var(--ik-subtle-fill, var(--secondary-background-color)); }
    .item.danger, .item.danger ha-icon { color: var(--error-color); }
    .item .check { margin-inline-start: auto; color: var(--primary-color); }
    .divider { height: 1px; margin: 6px 0; background: var(--divider-color); }
  `;

  disconnectedCallback() {
    super.disconnectedCallback();
    this._close(false);
  }

  protected updated(changed: PropertyValues) {
    if (changed.has("_open") && this._open) {
      const items = this._items();
      (items.find((i) => i.getAttribute("aria-checked") === "true") ?? items[0])?.focus();
    }
  }

  private _items(): HTMLButtonElement[] {
    return Array.from(this.renderRoot.querySelectorAll<HTMLButtonElement>(".item"));
  }

  private _toggle(e: Event) {
    e.stopPropagation();
    if (this._open) {
      this._close();
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const estimatedHeight = this.items.length * 44 + 16;
    const vertical = rect.bottom + estimatedHeight > window.innerHeight && rect.top > estimatedHeight
      ? `bottom: ${window.innerHeight - rect.top + 4}px`
      : `top: ${rect.bottom + 4}px`;
    this._position = `${vertical}; right: ${Math.max(8, window.innerWidth - rect.right)}px`;
    this._open = true;
    window.addEventListener("scroll", this._onViewportChange, true);
    window.addEventListener("resize", this._onViewportChange);
  }

  private _onViewportChange = (e: Event) => {
    // Scrolling inside the menu itself must not close it
    if (e.type === "scroll" && e.composedPath().includes(this.renderRoot.querySelector(".menu") as EventTarget)) return;
    this._close(false);
  };

  private _close(refocus = true) {
    if (!this._open) return;
    this._open = false;
    window.removeEventListener("scroll", this._onViewportChange, true);
    window.removeEventListener("resize", this._onViewportChange);
    if (refocus) this.renderRoot.querySelector<HTMLElement>(".trigger")?.focus();
  }

  private _select(action: string) {
    this._close();
    this.dispatchEvent(new CustomEvent("menu-select", { detail: action, bubbles: true, composed: true }));
  }

  private _onKeydown(e: KeyboardEvent) {
    const items = this._items();
    const index = items.indexOf(this.shadowRoot?.activeElement as HTMLButtonElement);
    const focus = (i: number) => items[(i + items.length) % items.length]?.focus();
    switch (e.key) {
      case "ArrowDown": focus(index + 1); break;
      case "ArrowUp": focus(index - 1); break;
      case "Home": focus(0); break;
      case "End": focus(items.length - 1); break;
      case "Escape": this._close(); break;
      case "Tab": this._close(false); return;
      default: return;
    }
    e.preventDefault();
  }

  render() {
    return html`
      <button
        class="trigger ${this.pill ? "pill" : "icon"}"
        aria-haspopup="menu"
        aria-expanded=${this._open ? "true" : "false"}
        aria-label=${this.pill ? nothing : this.label}
        title=${this.pill ? nothing : this.label}
        @click=${this._toggle}
      >
        ${this.pill
          ? html`${this.pillIcon ? html`<ha-icon icon=${this.pillIcon}></ha-icon>` : nothing}${this.label}<ha-icon icon="mdi:chevron-down"></ha-icon>`
          : html`<ha-icon icon=${this.icon}></ha-icon>`}
      </button>
      ${this._open ? html`
        <div class="scrim" @click=${(e: Event) => { e.stopPropagation(); this._close(false); }}></div>
        <div class="menu" role="menu" style=${this._position} @keydown=${this._onKeydown}>
          ${this.items.map((item) => "divider" in item
            ? html`<div class="divider" role="separator"></div>`
            : html`
              <button
                class="item ${item.danger ? "danger" : ""}"
                role=${item.selected === undefined ? "menuitem" : "menuitemradio"}
                aria-checked=${item.selected === undefined ? nothing : String(item.selected)}
                @click=${(e: Event) => { e.stopPropagation(); this._select(item.action); }}
              >
                ${item.icon ? html`<ha-icon icon=${item.icon}></ha-icon>` : nothing}
                ${item.label}
                ${item.selected ? html`<ha-icon class="check" icon="mdi:check"></ha-icon>` : nothing}
              </button>
            `)}
        </div>
      ` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ik-menu": IkMenu;
  }
}
