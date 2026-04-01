import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { IntelliKeepCardConfig } from "./types";

@customElement("intellikeep-card-editor")
export class IntelliKeepCardEditor extends LitElement {
  @property({ attribute: false }) config!: IntelliKeepCardConfig;

  static get styles() {
    return css`
      .form-row {
        margin-bottom: 12px;
      }
      ha-textfield,
      ha-select {
        width: 100%;
      }
    `;
  }

  setConfig(config: IntelliKeepCardConfig) {
    this.config = config;
  }

  private _valueChanged(field: keyof IntelliKeepCardConfig, value: unknown) {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: { ...this.config, [field]: value } },
        bubbles: true,
        composed: true,
      })
    );
  }

  protected render() {
    if (!this.config) return html``;

    return html`
      <div class="form-row">
        <ha-textfield
          label="Title"
          .value=${this.config.title ?? "Home Maintenance"}
          @change=${(e: Event) =>
            this._valueChanged("title", (e.target as HTMLInputElement).value)}
        ></ha-textfield>
      </div>

      <div class="form-row">
        <ha-textfield
          label="Max tasks to show"
          type="number"
          min="1"
          max="50"
          .value=${String(this.config.max_tasks ?? 5)}
          @change=${(e: Event) =>
            this._valueChanged(
              "max_tasks",
              parseInt((e.target as HTMLInputElement).value, 10)
            )}
        ></ha-textfield>
      </div>

      <div class="form-row">
        <ha-formfield label="Show linked entity states">
          <ha-checkbox
            .checked=${this.config.show_linked_entities ?? true}
            @change=${(e: Event) =>
              this._valueChanged(
                "show_linked_entities",
                (e.target as HTMLInputElement).checked
              )}
          ></ha-checkbox>
        </ha-formfield>
      </div>

      <div class="form-row">
        <ha-formfield label="Show task description">
          <ha-checkbox
            .checked=${this.config.show_description ?? false}
            @change=${(e: Event) =>
              this._valueChanged(
                "show_description",
                (e.target as HTMLInputElement).checked
              )}
          ></ha-checkbox>
        </ha-formfield>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "intellikeep-card-editor": IntelliKeepCardEditor;
  }
}
