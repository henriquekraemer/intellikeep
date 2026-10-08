import { t } from "./translations";
import { TaskPriority, TaskStatus, Weekday } from "./types";

const WEEKDAYS: Weekday[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

/** Short localized weekday name (2024-01-01 is a Monday). */
function weekdayName(day: Weekday, language: string | undefined): string {
  const raw = new Date(2024, 0, 1 + WEEKDAYS.indexOf(day))
    .toLocaleDateString(language || "en", { weekday: "short" })
    .replace(/\.$/, "");
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function relativeDueDate(isoDate: string | null, language: string | undefined): string {
  const tr = t(language);
  if (!isoDate) return tr.noDueDate;
  const due = new Date(isoDate);
  const now = new Date();
  // Count calendar days in local time (Date.UTC keeps DST shifts out of it)
  const diffDays = Math.round(
    (Date.UTC(due.getFullYear(), due.getMonth(), due.getDate()) -
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) /
      (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return tr.dueToday;
  if (diffDays === 1) return tr.dueTomorrow;
  if (diffDays > 0) return tr.dueInDays(diffDays);
  return tr.daysOverdue(Math.abs(diffDays));
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

export function frequencyLabel(
  freq: string,
  customDays: number | null | undefined,
  weekdays: Weekday[] | null | undefined,
  language: string | undefined
): string {
  const tr = t(language);
  const days = (weekdays ?? []).filter(d => WEEKDAYS.includes(d)).map(d => weekdayName(d, language));
  const map: Record<string, string> = {
    one_time: tr.freqOneTime,
    daily: tr.freqDaily,
    weekly: days.length ? `${tr.freqWeekly} (${days.join(", ")})` : tr.freqWeekly,
    monthly: tr.freqMonthly,
    yearly: tr.freqYearly,
    custom: customDays ? tr.freqEveryDays(customDays) : tr.freqCustom,
  };
  return map[freq] ?? freq;
}
