import { TaskPriority, TaskStatus } from "./types";

export function relativeDueDate(isoDate: string | null): string {
  if (!isoDate) return "No due date";
  const due = new Date(isoDate);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays === -1) return "1 day overdue";
  if (diffDays > 0) return `Due in ${diffDays} days`;
  return `${Math.abs(diffDays)} days overdue`;
}

export function priorityColor(priority: TaskPriority): string {
  const map: Record<TaskPriority, string> = {
    low: "var(--success-color, #4caf50)",
    medium: "var(--warning-color, #ff9800)",
    high: "var(--error-color, #f44336)",
    critical: "#9c27b0",
  };
  return map[priority] ?? "var(--secondary-text-color)";
}

export function statusColor(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    pending: "var(--secondary-text-color)",
    due: "var(--warning-color, #ff9800)",
    overdue: "var(--error-color, #f44336)",
    completed: "var(--success-color, #4caf50)",
    snoozed: "var(--disabled-color)",
  };
  return map[status] ?? "var(--secondary-text-color)";
}

export function statusIcon(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    pending: "mdi:clock-outline",
    due: "mdi:alert-circle-outline",
    overdue: "mdi:alert-outline",
    completed: "mdi:check-circle-outline",
    snoozed: "mdi:sleep",
  };
  return map[status] ?? "mdi:help";
}

export function frequencyLabel(freq: string, customDays?: number | null): string {
  const map: Record<string, string> = {
    one_time: "One-time",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
    custom: customDays ? `Every ${customDays} days` : "Custom",
  };
  return map[freq] ?? freq;
}
