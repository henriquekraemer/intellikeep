export type TaskFrequency = "one_time" | "daily" | "weekly" | "monthly" | "yearly" | "custom";
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
    custom_days_interval: number | null;
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
export interface HomeAssistant {
    states: Record<string, HassEntityState>;
    callService(domain: string, service: string, serviceData?: Record<string, unknown>): Promise<void>;
    callWS<T>(msg: Record<string, unknown>): Promise<T>;
    formatEntityState(stateObj: HassEntityState): string;
}
