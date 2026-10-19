import { HomeAssistant, Task } from "./types";

// Date helpers, kept in sync with panel/src/utils.ts (the card is a separate bundle)

/** Language of the user's Home Assistant profile, used for every date and time. */
export const hassLanguage = (hass: HomeAssistant | undefined): string =>
  hass?.locale?.language ?? hass?.language ?? "en";

/**
 * Time zone Home Assistant shows times in: the server's when the user profile
 * asks for it, otherwise undefined, which Intl reads as the browser's own zone.
 */
export const hassTimeZone = (hass: HomeAssistant | undefined): string | undefined =>
  hass?.locale?.time_zone === "server" ? hass.config?.time_zone : undefined;

/** 12- or 24-hour clock from the profile's time format; undefined follows the language. */
const hourCycle = (hass: HomeAssistant | undefined): "h12" | "h23" | undefined => {
  switch (hass?.locale?.time_format) {
    case "12":
      return "h12";
    case "24":
      return "h23";
    case "system":
      return formatter(undefined, { hour: "numeric" }).resolvedOptions().hour12 ? "h12" : "h23";
    default:
      return undefined;
  }
};

// Building an Intl.DateTimeFormat is slow, and lists format the same pattern for every row
const formatters = new Map<string, Intl.DateTimeFormat>();

const formatter = (language: string | undefined, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat => {
  const key = JSON.stringify([language, options]);
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(language, options);
    formatters.set(key, f);
  }
  return f;
};

const format = (
  date: Date | string,
  hass: HomeAssistant | undefined,
  options: Intl.DateTimeFormatOptions
): string => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  const opts: Intl.DateTimeFormatOptions = { timeZone: hassTimeZone(hass), ...options };
  if (opts.hour !== undefined) opts.hourCycle ??= hourCycle(hass);
  return formatter(hassLanguage(hass), opts).format(d);
};

const DATE: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
const TIME: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };

/** Date like "Oct 18, 2026" / "18 de out. de 2026"; `options` override the default fields. */
export const formatDate = (
  date: Date | string,
  hass: HomeAssistant | undefined,
  options: Intl.DateTimeFormatOptions = {}
): string => format(date, hass, { ...DATE, ...options });

/** Time of day like "19:14" or "7:14 PM", following the profile's 12/24-hour setting. */
export const formatTime = (
  date: Date | string,
  hass: HomeAssistant | undefined,
  options: Intl.DateTimeFormatOptions = {}
): string => format(date, hass, { ...TIME, ...options });

/** Date and time like "Oct 18, 2026, 7:14 PM"; `options` override the default fields. */
export const formatDateTime = (
  date: Date | string,
  hass: HomeAssistant | undefined,
  options: Intl.DateTimeFormatOptions = {}
): string => format(date, hass, { ...DATE, ...TIME, ...options });

/** Calendar date of `d` in `timeZone` as a UTC timestamp, so day differences ignore DST. */
const dayStamp = (d: Date, timeZone: string | undefined): number => {
  if (!timeZone) return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  const parts = formatter("en-US", { timeZone, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(d);
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find(p => p.type === type)?.value);
  return Date.UTC(part("year"), part("month") - 1, part("day"));
};

/** Calendar days from today to `d` in the Home Assistant time zone; negative once `d` is a past day. */
export const daysUntil = (d: Date, hass: HomeAssistant | undefined): number => {
  if (Number.isNaN(d.getTime())) return NaN;
  const timeZone = hassTimeZone(hass);
  return Math.round((dayStamp(d, timeZone) - dayStamp(new Date(), timeZone)) / 86400000);
};

/** Whether `date` is midnight in the Home Assistant time zone, which is how a due date without a time is saved. */
export const isMidnight = (date: Date | string, hass: HomeAssistant | undefined): boolean => {
  const parts = formatter("en-US", { timeZone: hassTimeZone(hass), hour: "numeric", minute: "numeric", hourCycle: "h23" })
    .formatToParts(new Date(date));
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find(p => p.type === type)?.value);
  return part("hour") === 0 && part("minute") === 0;
};

/** "Today", "Yesterday" or "Tomorrow" in the profile language; null for any other day. */
export const relativeDay = (date: Date | string, hass: HomeAssistant | undefined): string | null => {
  const days = daysUntil(new Date(date), hass);
  if (Number.isNaN(days) || Math.abs(days) > 1) return null;
  const raw = new Intl.RelativeTimeFormat(hassLanguage(hass), { numeric: "auto" }).format(days, "day");
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

/**
 * "Today, 19:14", "Yesterday, 08:02" or "Tomorrow, 09:00" for the days next
 * to today; any other day falls back to formatDateTime.
 */
export const formatRelative = (date: Date | string, hass: HomeAssistant | undefined): string => {
  const day = relativeDay(date, hass);
  return day ? `${day}, ${formatTime(date, hass)}` : formatDateTime(date, hass);
};

/** A due date like formatRelative, but just "Today" for a task due all day (saved at midnight), as the panel calendar shows it. */
export const formatRelativeDue = (date: Date | string, hass: HomeAssistant | undefined): string =>
  isMidnight(date, hass) ? relativeDay(date, hass) ?? formatDate(date, hass) : formatRelative(date, hass);

/** "Tue, Oct 20"; the year shows only when it isn't the current one. */
export const formatShortDate = (date: Date | string, hass: HomeAssistant | undefined): string => {
  const d = new Date(date);
  const timeZone = hassTimeZone(hass);
  const year = (stamp: number) => new Date(stamp).getUTCFullYear();
  const sameYear = year(dayStamp(d, timeZone)) === year(dayStamp(new Date(), timeZone));
  return formatDate(d, hass, { weekday: "short", year: sameYear ? undefined : "numeric" });
};

/** Overdue and due-today tasks are tinted; nothing else is (same rule as the panel). */
export const urgencyOf = (task: Task, hass: HomeAssistant | undefined): "overdue" | "today" | null => {
  if (task.status === "overdue") return "overdue";
  if (task.status !== "completed" && task.due_date && daysUntil(new Date(task.due_date), hass) <= 0) return "today";
  return null;
};

/** Readable text of an error from a service call or anything thrown. */
export const errorText = (err: unknown): string =>
  err instanceof Error ? err.message : (err as { message?: string } | null)?.message ?? String(err);
