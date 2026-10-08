import { LitElement, PropertyValues } from "lit";
import { HomeAssistant, IntelliKeepCardConfig } from "./types";
export declare class IntelliKeepCard extends LitElement {
    hass: HomeAssistant;
    config: IntelliKeepCardConfig;
    private _tasks;
    private _loading;
    private _completing;
    private _unsubscribe?;
    static get styles(): import("lit").CSSResult;
    setConfig(config: IntelliKeepCardConfig): void;
    static getConfigForm(): {
        schema: ({
            name: string;
            selector: {
                text: {};
                number?: undefined;
                boolean?: undefined;
            };
        } | {
            name: string;
            selector: {
                number: {
                    min: number;
                    max: number;
                    mode: string;
                };
                text?: undefined;
                boolean?: undefined;
            };
        } | {
            name: string;
            selector: {
                boolean: {};
                text?: undefined;
                number?: undefined;
            };
        })[];
        computeLabel: (field: {
            name: string;
        }) => string | undefined;
    };
    static getStubConfig(): {
        title: string;
        max_tasks: number;
        show_linked_entities: boolean;
        show_description: boolean;
    };
    protected firstUpdated(_changedProperties: PropertyValues): void;
    disconnectedCallback(): void;
    private _subscribe;
    private _fetchTasks;
    private get _filteredTasks();
    private _completeTask;
    private _resolveLinkedLabel;
    private _renderEntityChips;
    protected render(): import("lit-html").TemplateResult<1>;
    private _renderTask;
}
declare global {
    interface HTMLElementTagNameMap {
        "intellikeep-card": IntelliKeepCard;
    }
    interface Window {
        customCards?: object[];
    }
}
