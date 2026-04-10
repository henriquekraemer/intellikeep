/** Returns true when the device has a precise pointer and hover support (desktop/laptop). */
export const isDesktop = (): boolean =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;
