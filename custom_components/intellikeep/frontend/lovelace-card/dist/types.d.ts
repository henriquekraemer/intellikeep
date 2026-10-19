export type TaskFrequency = "one_time" | "daily" | "weekly" | "monthly" | "yearly";
export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type TaskStatus = "pending" | "due" | "overdue" | "completed" | "snoozed";
export interface TaskExecution {
    execution_id: string;
    task_id: string;
    completed_at: string;
    completed_by: string;
    notes: string;
}
export interface Task {
    task_id: string;
    name: string;
    description: string;
    priority: TaskPriority;
    frequency: TaskFrequency;
    repeat_interval: number;
    schedule_anchor: "completion" | "due_date";
    weekdays: Weekday[];
    icon: string | null;
    due_date: string | null;
    linked_entity_ids: string[];
    notify_days_before: number;
    notify_on_overdue: boolean;
    created_at: string;
    updated_at: string;
    last_completed_at: string | null;
    executions: TaskExecution[];
    executions_count: number;
    enabled: boolean;
    status: TaskStatus;
    task_number: number;
}
export interface IntelliKeepCardConfig {
    type: string;
    title?: string;
    max_tasks?: number;
    filter_priority?: TaskPriority[];
    filter_status?: TaskStatus[];
    show_linked_entities?: boolean;
    show_description?: boolean;
}
export interface HassEntityState {
    entity_id: string;
    state: string;
    attributes: Record<string, unknown>;
    last_changed: string;
    last_updated: string;
}
export interface HassDeviceRegistryEntry {
    id: string;
    area_id: string | null;
    name: string;
    name_by_user: string | null;
}
export interface HassAreaRegistryEntry {
    area_id: string;
    name: string;
}
export interface HomeAssistant {
    language: string;
    /** Date and time settings from the user profile. */
    locale?: {
        language: string;
        time_format?: "language" | "system" | "12" | "24";
        time_zone?: "local" | "server";
    };
    config?: {
        time_zone: string;
    };
    user?: {
        name: string;
    };
    states: Record<string, HassEntityState>;
    devices: Record<string, HassDeviceRegistryEntry>;
    areas: Record<string, HassAreaRegistryEntry>;
    callService(domain: string, service: string, serviceData?: Record<string, unknown>): Promise<void>;
    callWS<T>(msg: Record<string, unknown>): Promise<T>;
    formatEntityState(stateObj: HassEntityState): string;
}
