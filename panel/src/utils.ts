/** Returns true when the device has a precise pointer and hover support (desktop/laptop). */
export const isDesktop = (): boolean =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const pad2 = (n: number): string => String(n).padStart(2, "0");

/** Local calendar date of `d` as YYYY-MM-DD, the format of `<input type="date">`. */
export const localDate = (d: Date): string =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/** Local time of day of `d` as HH:MM, the format of `<input type="time">`. */
export const localTime = (d: Date): string => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

/** Calendar days from today to `d` in local time; negative once `d` is a past day. */
export const daysUntil = (d: Date): number => {
  const today = new Date();
  // Date.UTC on the local year/month/day keeps DST shifts out of the difference
  const from = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const to = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((to - from) / 86400000);
};
