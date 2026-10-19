import { LitElement, PropertyValues } from "lit";
import { HomeAssistant, IntelliKeepCardConfig } from "./types";
/**
 * Dashboard card: a header with how many tasks are overdue and due today,
 * the next open tasks with a checkbox that completes them (with Undo), and
 * a link to the panel.
 */
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
        max_tasks: number;
        show_linked_entities: boolean;
        show_description: boolean;
    };
    /** Height in 50px units, for masonry dashboards: header, one per row, footer. */
    getCardSize(): number;
    protected firstUpdated(_changedProperties: PropertyValues): void;
    disconnectedCallback(): void;
    private _subscribe;
    private _fetchTasks;
    /** Open tasks (or the configured statuses and priorities), most urgent first. */
    private get _openTasks();
    private _toast;
    private _setCompleting;
    private _completeTask;
    private _reopenTask;
    /** Same-tab navigation inside Home Assistant; modified clicks keep the browser's handling. */
    private _openPanel;
    private _linkedLabel;
    private _renderSummary;
    private _renderChip;
    private _renderTask;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "intellikeep-card": IntelliKeepCard;
    }
    interface Window {
        customCards?: object[];
    }
}
