import { LitElement } from "lit";
import { IntelliKeepCardConfig } from "./types";
export declare class IntelliKeepCardEditor extends LitElement {
    config: IntelliKeepCardConfig;
    static get styles(): import("lit").CSSResult;
    setConfig(config: IntelliKeepCardConfig): void;
    private _valueChanged;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "intellikeep-card-editor": IntelliKeepCardEditor;
    }
}
