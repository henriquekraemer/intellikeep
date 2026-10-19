import { css } from "lit";

/**
 * Design tokens (docs/design/DESIGN.md, section 2), mapped onto Home Assistant
 * theme variables so the light theme and user themes keep working. They are set
 * once on the panel host and inherit into every view and dialog rendered inside it.
 */
export const tokens = css`
  :host {
    /* Surfaces */
    --ik-surface: var(--ha-card-background, var(--card-background-color));
    --ik-dialog-surface: var(--ha-dialog-surface-background, var(--mdc-theme-surface, var(--card-background-color)));
    --ik-subtle-fill: var(--secondary-background-color);
    --ik-field-fill: var(--ha-color-form-background, var(--secondary-background-color));
    --ik-focus-ring: var(--ha-color-focus, var(--primary-color));

    /*
     * Red and amber mean urgency only: overdue, due today, and Critical priority.
     * Text mixes the theme color with the text color so it keeps 4.5:1 contrast:
     * lighter on dark themes, darker on light ones (raw amber on white is about 2:1).
     */
    --ik-error-text: color-mix(in srgb, var(--error-color) 70%, var(--primary-text-color));
    --ik-error-fill: color-mix(in srgb, var(--error-color) 20%, transparent);
    --ik-warning-text: color-mix(in srgb, var(--warning-color) 55%, var(--primary-text-color));
    --ik-warning-fill: color-mix(in srgb, var(--warning-color) 16%, transparent);
    --ik-success-text: color-mix(in srgb, var(--success-color) 60%, var(--primary-text-color));
    --ik-success-fill: color-mix(in srgb, var(--success-color) 16%, transparent);
    --ik-primary-fill: color-mix(in srgb, var(--primary-color) 16%, transparent);

    /* Shape */
    --ik-radius-card: var(--ha-card-border-radius, 12px);
    --ik-radius-dialog: 24px;
    --ik-radius-pill: 20px;
    --ik-radius-field: 10px;
    --ik-radius-chip: 14px;
    --ik-chip-height: 28px;
    --ik-hit-target: 44px;

    /* Type scale; the font family always comes from Home Assistant */
    --ik-row-title-size: 15px;
    --ik-row-title-weight: 500;
    --ik-row-secondary-size: 13px;
    --ik-group-header-size: 13px;
    --ik-group-header-weight: 500;
    --ik-group-header-spacing: 0.03em;
  }
`;
