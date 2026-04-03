// Re-export types shared with the card
export type TaskFrequency =
  | "one_time"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";

export type TaskPriority = "low" | "medium" | "high" | "critical";
export type TaskStatus = "pending" | "due" | "overdue" | "completed" | "snoozed";

export interface TaskNote {
  note_id: string;
  task_id: string;
  created_at: string;
  content: string;
  added_by: string;
}

export interface TaskExecution {
  execution_id: string;
  task_id: string;
  completed_at: string;
  completed_by: string;
  notes: string;
  was_late: boolean;
}

export interface Task {
  task_id: string;
  task_number: number;
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
  notes: TaskNote[];
  enabled: boolean;
  status: TaskStatus;
  previous_task_id?: string | null;
}

export interface HomeAssistant {
  auth: { data: { access_token: string } };
  connection: {
    sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T>;
    subscribeMessage<T>(
      callback: (msg: T) => void,
      msg: Record<string, unknown>
    ): Promise<() => void>;
  };
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<void>;
  states: Record<string, { state: string; attributes: Record<string, unknown> }>;
  themes: unknown;
  user: { id: string; name: string; is_admin: boolean };
  language: string;
}

export type Route = { prefix: string; path: string };

export type PanelView =
  | { view: "tasks" }
  | { view: "new" }
  | { view: "edit"; taskId: string }
  | { view: "history"; taskId: string }
  | { view: "settings" };
