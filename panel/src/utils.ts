import { HomeAssistant, Task, WEEKDAYS, Weekday } from "./types";
import { t } from "./translations";

/** Returns true when the device has a precise pointer and hover support (desktop/laptop). */
export const isDesktop = (): boolean =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const pad2 = (n: number): string => String(n).padStart(2, "0");

/** Local calendar date of `d` as YYYY-MM-DD, the format of `<input type="date">`. */
export const localDate = (d: Date): string =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/** Local time of day of `d` as HH:MM, the format of `<input type="time">`. */
export const localTime = (d: Date): string => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

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
  if (Number.isNaN(d.getTime())) return NaN;
  if (!timeZone) return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  const parts = formatter("en-US", { timeZone, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(d);
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find(p => p.type === type)?.value);
  return Date.UTC(part("year"), part("month") - 1, part("day"));
};

/** Calendar day of `date` in the Home Assistant time zone, as a UTC midnight: a date with no zone, so adding days ignores DST. */
export const calendarDay = (date: Date | string, hass: HomeAssistant | undefined): Date =>
  new Date(dayStamp(new Date(date), hassTimeZone(hass)));

/** Whether `date` is midnight in the Home Assistant time zone, which is how a due date without a time is saved. */
export const isMidnight = (date: Date | string, hass: HomeAssistant | undefined): boolean => {
  const parts = formatter("en-US", { timeZone: hassTimeZone(hass), hour: "numeric", minute: "numeric", hourCycle: "h23" })
    .formatToParts(new Date(date));
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find(p => p.type === type)?.value);
  return part("hour") === 0 && part("minute") === 0;
};

/** A span like "Oct 19 – 25, 2026", with the parts both ends share written once; `options` override the default fields. */
export const formatDateRange = (
  start: Date,
  end: Date,
  hass: HomeAssistant | undefined,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const f = formatter(hassLanguage(hass), { timeZone: hassTimeZone(hass), ...DATE, ...options }) as Intl.DateTimeFormat & {
    formatRange?: (from: Date, to: Date) => string;
  };
  return f.formatRange ? f.formatRange(start, end) : `${f.format(start)} – ${f.format(end)}`;
};

/** Calendar days from `from` to `to` in the Home Assistant time zone. */
export const daysBetween = (from: Date | string, to: Date | string, hass: HomeAssistant | undefined): number => {
  const timeZone = hassTimeZone(hass);
  return Math.round((dayStamp(new Date(to), timeZone) - dayStamp(new Date(from), timeZone)) / 86400000);
};

/** Calendar days from today to `d` in the Home Assistant time zone; negative once `d` is a past day. */
export const daysUntil = (d: Date, hass: HomeAssistant | undefined): number => {
  const timeZone = hassTimeZone(hass);
  return Math.round((dayStamp(d, timeZone) - dayStamp(new Date(), timeZone)) / 86400000);
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

/** A due date like formatRelative, but just "Today" for a task due all day (saved at midnight), as the calendar shows it. */
export const formatRelativeDue = (date: Date | string, hass: HomeAssistant | undefined): string =>
  isMidnight(date, hass) ? relativeDay(date, hass) ?? formatDate(date, hass) : formatRelative(date, hass);

/** Short day like "Tue, Oct 20"; the year is added only when it isn't the current one. */
export const formatShortDate = (date: Date | string, hass: HomeAssistant | undefined): string => {
  const d = new Date(date);
  const timeZone = hassTimeZone(hass);
  const year = (stamp: number) => new Date(stamp).getUTCFullYear();
  const sameYear = year(dayStamp(d, timeZone)) === year(dayStamp(new Date(), timeZone));
  return formatDate(d, hass, { weekday: "short", year: sameYear ? undefined : "numeric" });
};

const WEEKDAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

// CLDR regions whose week starts on Sunday or Saturday, for browsers without Intl.Locale week info
const SUNDAY_FIRST = new Set(
  "AG AS BD BR BS BT BW BZ CA CN CO DM DO ET GT GU HK HN ID IL IN JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM US VE VI WS YE ZA ZW".split(" ")
);
const SATURDAY_FIRST = new Set("AE AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY".split(" "));

/** First day of the week (0 = Sunday): the profile setting, or the convention of the language's region. */
export const firstWeekday = (hass: HomeAssistant | undefined): number => {
  const named = WEEKDAY_NAMES.indexOf(hass?.locale?.first_weekday ?? "language");
  if (named >= 0) return named;
  try {
    const locale = new Intl.Locale(hassLanguage(hass)) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const info = locale.getWeekInfo?.() ?? locale.weekInfo;
    if (info) return info.firstDay % 7;
    const region = locale.maximize().region ?? "";
    return SUNDAY_FIRST.has(region) ? 0 : SATURDAY_FIRST.has(region) ? 6 : 1;
  } catch {
    return 1;
  }
};

/** Days from today to the first day of next week (1 to 7), in the Home Assistant time zone. */
export const daysUntilNextWeek = (hass: HomeAssistant | undefined): number => {
  const today = new Date(dayStamp(new Date(), hassTimeZone(hass))).getUTCDay();
  return (firstWeekday(hass) - today + 7) % 7 || 7;
};

/** Shows a Home Assistant toast, optionally with an action button such as Undo. */
export const showToast = (
  el: HTMLElement,
  message: string,
  action?: { text: string; action: () => void },
  duration = 4000
): void => {
  el.dispatchEvent(new CustomEvent("hass-notification", {
    detail: { message, action, duration },
    bubbles: true,
    composed: true,
  }));
};

/** Short weekday name in the profile language, capitalized ("Mon", "Seg"); 2024-01-01 is a Monday. */
export const weekdayName = (code: Weekday, hass: HomeAssistant | undefined): string => {
  const raw = new Date(2024, 0, 1 + WEEKDAYS.indexOf(code))
    .toLocaleDateString(hassLanguage(hass), { weekday: "short" })
    .replace(/\.$/, "");
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

/** "Repeats monthly", "Repeats every 2 weeks (Mon, Thu)" (short: "Monthly", "Every 2 weeks (Mon, Thu)"); null for one-time tasks. */
export const repeatLabel = (
  task: Pick<Task, "frequency" | "repeat_interval" | "weekdays">,
  hass: HomeAssistant | undefined,
  short = false
): string | null => {
  if (task.frequency === "one_time") return null;
  const tr = t(hass?.language ?? "en");
  const label = (short ? tr.repeatsShort : tr.repeats)(task.frequency, Math.max(1, task.repeat_interval || 1));
  const days = task.frequency === "weekly" ? (task.weekdays ?? []).map((code) => weekdayName(code, hass)) : [];
  return days.length ? `${label} (${days.join(", ")})` : label;
};

/** Readable text of an error from a service call or anything thrown. */
export const errorText = (err: unknown): string =>
  err instanceof Error ? err.message : (err as { message?: string } | null)?.message ?? String(err);
