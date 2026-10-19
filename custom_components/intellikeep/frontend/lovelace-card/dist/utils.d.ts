import { HomeAssistant, Task } from "./types";
/** Language of the user's Home Assistant profile, used for every date and time. */
export declare const hassLanguage: (hass: HomeAssistant | undefined) => string;
/**
 * Time zone Home Assistant shows times in: the server's when the user profile
 * asks for it, otherwise undefined, which Intl reads as the browser's own zone.
 */
export declare const hassTimeZone: (hass: HomeAssistant | undefined) => string | undefined;
/** Date like "Oct 18, 2026" / "18 de out. de 2026"; `options` override the default fields. */
export declare const formatDate: (date: Date | string, hass: HomeAssistant | undefined, options?: Intl.DateTimeFormatOptions) => string;
/** Time of day like "19:14" or "7:14 PM", following the profile's 12/24-hour setting. */
export declare const formatTime: (date: Date | string, hass: HomeAssistant | undefined, options?: Intl.DateTimeFormatOptions) => string;
/** Date and time like "Oct 18, 2026, 7:14 PM"; `options` override the default fields. */
export declare const formatDateTime: (date: Date | string, hass: HomeAssistant | undefined, options?: Intl.DateTimeFormatOptions) => string;
/** Calendar days from today to `d` in the Home Assistant time zone; negative once `d` is a past day. */
export declare const daysUntil: (d: Date, hass: HomeAssistant | undefined) => number;
/** Whether `date` is midnight in the Home Assistant time zone, which is how a due date without a time is saved. */
export declare const isMidnight: (date: Date | string, hass: HomeAssistant | undefined) => boolean;
/** "Today", "Yesterday" or "Tomorrow" in the profile language; null for any other day. */
export declare const relativeDay: (date: Date | string, hass: HomeAssistant | undefined) => string | null;
/**
 * "Today, 19:14", "Yesterday, 08:02" or "Tomorrow, 09:00" for the days next
 * to today; any other day falls back to formatDateTime.
 */
export declare const formatRelative: (date: Date | string, hass: HomeAssistant | undefined) => string;
/** A due date like formatRelative, but just "Today" for a task due all day (saved at midnight), as the panel calendar shows it. */
export declare const formatRelativeDue: (date: Date | string, hass: HomeAssistant | undefined) => string;
/** "Tue, Oct 20"; the year shows only when it isn't the current one. */
export declare const formatShortDate: (date: Date | string, hass: HomeAssistant | undefined) => string;
/** Overdue and due-today tasks are tinted; nothing else is (same rule as the panel). */
export declare const urgencyOf: (task: Task, hass: HomeAssistant | undefined) => "overdue" | "today" | null;
/** Readable text of an error from a service call or anything thrown. */
export declare const errorText: (err: unknown) => string;
