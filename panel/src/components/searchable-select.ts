import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

export interface SelectItem {
  value: string;
  label: string;
}

@customElement("ik-searchable-select")
export class IkSearchableSelect extends LitElement {
  @property({ type: Array }) items: SelectItem[] = [];
  @property() value = "";
  @property() placeholder = "";
  @property({ type: Boolean }) disabled = false;

  @state() private _search = "";
  @state() private _open = false;

  static styles = css`
    :host { display: block; position: relative; }
    .input-wrap {
      display: flex;
      align-items: center;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color);
      overflow: hidden;
    }
    input {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--primary-text-color);
      font-size: 14px;
      font-family: inherit;
      padding: 8px 10px;
      outline: none;
      min-width: 0;
    }
    input:disabled { opacity: 0.6; cursor: not-allowed; }
    .clear-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 0 8px;
      font-size: 16px;
      line-height: 1;
      flex-shrink: 0;
    }
    .clear-btn:hover { color: var(--primary-text-color); }
    .dropdown {
      position: absolute;
      top: calc(100% + 2px);
      left: 0;
      right: 0;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.18);
      z-index: 100;
      max-height: 220px;
      overflow-y: auto;
    }
    .option {
      padding: 8px 12px;
      font-size: 14px;
      cursor: pointer;
      color: var(--primary-text-color);
    }
    .option:hover, .option.focused { background: var(--secondary-background-color); }
    .option.selected { color: var(--primary-color); font-weight: 500; }
    .option.empty { color: var(--secondary-text-color); font-style: italic; cursor: default; }
  `;

  private get _selectedLabel(): string {
    return this.items.find(i => i.value === this.value)?.label ?? "";
  }

  private get _filtered(): SelectItem[] {
    const q = this._search.toLowerCase();
    return q ? this.items.filter(i => i.label.toLowerCase().includes(q)) : this.items;
  }

  private _onFocus() {
    if (this.disabled) return;
    this._search = "";
    this._open = true;
  }

  private _onInput(e: Event) {
    this._search = (e.target as HTMLInputElement).value;
    this._open = true;
  }

  private _select(item: SelectItem) {
    this._open = false;
    this._search = "";
    if (item.value === this.value) return;
    this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: item.value }, bubbles: true, composed: true }));
  }

  private _clear(e: Event) {
    e.stopPropagation();
    this._open = false;
    this._search = "";
    if (this.value === "") return;
    this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: "" }, bubbles: true, composed: true }));
  }

  private _onBlur() {
    // Delay to allow click on option
    setTimeout(() => { this._open = false; this._search = ""; }, 150);
  }

  render() {
    const displayValue = this._open ? this._search : this._selectedLabel;
    const filtered = this._filtered;
    return html`
      <div class="input-wrap">
        <input
          .value=${displayValue}
          placeholder=${this._open ? (this._selectedLabel || this.placeholder) : this.placeholder}
          ?disabled=${this.disabled}
          @focus=${this._onFocus}
          @input=${this._onInput}
          @blur=${this._onBlur}
        />
        ${this.value ? html`<button class="clear-btn" @mousedown=${this._clear}>✕</button>` : nothing}
      </div>
      ${this._open ? html`
        <div class="dropdown">
          ${filtered.length === 0
            ? html`<div class="option empty">No results</div>`
            : filtered.map(item => html`
                <div
                  class="option ${item.value === this.value ? "selected" : ""}"
                  @mousedown=${() => this._select(item)}
                >${item.label}</div>
              `)}
        </div>
      ` : nothing}
    `;
  }
}
