// Re-export types shared with the card
export type TaskFrequency =
  | "one_time"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export const WEEKDAYS: Weekday[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export type TaskPriority = "low" | "medium" | "high" | "critical";
export type TaskStatus = "pending" | "due" | "overdue" | "completed" | "snoozed";

export interface TaskNote {
  note_id: string;
  task_id: string;
  created_at: string;
  content: string;
  added_by: string;
}

export type TaskActivityType = "edited" | "completed" | "reopened" | "note_added" | "note_deleted";

export interface TaskActivity {
  activity_id: string;
  task_id: string;
  timestamp: string;
  action: TaskActivityType;
  performed_by: string;
  details: string;
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
  /** Repeats every N days, weeks, months or years, the unit given by frequency. */
  repeat_interval: number;
  /** What the next occurrence is counted from: the completion, or the task's own due date. */
  schedule_anchor: "completion" | "due_date";
  weekdays: Weekday[];
  /** MDI icon, e.g. "mdi:air-filter"; null shows the default wrench. */
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
  notes: TaskNote[];
  activities: TaskActivity[];
  enabled: boolean;
  status: TaskStatus;
  previous_task_id?: string | null;
}

/** A future due date of an open recurring task, projected by the backend (nothing stored). */
export interface TaskRepeat {
  task_id: string;
  due_date: string;
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
  /** Date and time settings from the user profile. */
  locale?: {
    language: string;
    time_format?: "language" | "system" | "12" | "24";
    time_zone?: "local" | "server";
    first_weekday?: "language" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  };
  config?: { time_zone: string };
}

export type Route = { prefix: string; path: string };

/** Asks the panel to open the task form: an existing task, or a new one (optionally copied from `template`). */
export interface OpenTaskRequest {
  taskId: string | null;
  tab?: "edit" | "notes" | "history";
  template?: Task;
  /** New tasks: due on this day (YYYY-MM-DD), with no time. */
  dueDate?: string;
}

export type PanelView =
  | { view: "tasks" }
  | { view: "new" }
  | { view: "edit"; taskId: string }
  | { view: "history"; taskId: string }
  | { view: "settings" };
