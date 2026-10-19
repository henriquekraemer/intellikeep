import { css } from "lit";

// Colors follow the panel's tokens (panel/src/styles.ts): red and amber mean overdue and due today only
export const cardStyles = css`
  :host {
    display: block;
    --ik-error-text: color-mix(in srgb, var(--error-color) 70%, var(--primary-text-color));
    --ik-error-fill: color-mix(in srgb, var(--error-color) 20%, transparent);
    --ik-warning-text: color-mix(in srgb, var(--warning-color) 55%, var(--primary-text-color));
    --ik-warning-fill: color-mix(in srgb, var(--warning-color) 16%, transparent);
    --ik-primary-fill: color-mix(in srgb, var(--primary-color) 16%, transparent);
    --ik-focus-ring: var(--ha-color-focus, var(--primary-color));
  }

  ha-card {
    overflow: hidden;
  }

  button {
    font: inherit;
  }

  button:focus-visible,
  a:focus-visible {
    outline: 2px solid var(--ik-focus-ring);
    outline-offset: 2px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
  }

  .header-icon {
    width: 40px;
    height: 40px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--ik-primary-fill);
    color: var(--primary-color);
    --mdc-icon-size: 20px;
  }

  .header-text {
    flex: 1 1 auto;
    min-width: 0;
  }

  .title {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.4;
    color: var(--primary-text-color);
  }

  .summary {
    margin-top: 2px;
    font-size: 13px;
    color: var(--secondary-text-color);
  }

  .summary .overdue {
    color: var(--ik-error-text);
  }

  .summary .today {
    color: var(--ik-warning-text);
  }

  .row {
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 56px;
    padding-inline-end: 12px;
    border-top: 1px solid var(--divider-color);
  }

  .check {
    width: 44px;
    height: 44px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-inline-start: 4px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: none;
    cursor: pointer;
  }

  .check:hover:not(:disabled) {
    background: var(--secondary-background-color);
  }

  .check:disabled {
    cursor: default;
  }

  .box {
    width: 20px;
    height: 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--secondary-text-color);
    border-radius: 6px;
    color: var(--text-primary-color);
    --mdc-icon-size: 16px;
  }

  .check:hover:not(:disabled) .box {
    border-color: var(--primary-color);
  }

  .check[aria-checked="true"] .box {
    background: var(--primary-color);
    border-color: var(--primary-color);
  }

  .text {
    flex: 1 1 auto;
    min-width: 0;
    padding: 8px 0;
  }

  .name,
  .secondary {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .name {
    font-size: 14px;
    font-weight: 500;
    color: var(--primary-text-color);
  }

  .secondary {
    margin-top: 2px;
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .chip {
    flex: none;
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 0 10px;
    border-radius: 12px;
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }

  .chip.overdue {
    background: var(--ik-error-fill);
    color: var(--ik-error-text);
  }

  .chip.today {
    background: var(--ik-warning-fill);
    color: var(--ik-warning-text);
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    padding: 4px 8px;
    border-top: 1px solid var(--divider-color);
  }

  .footer a {
    display: inline-flex;
    align-items: center;
    height: 44px;
    padding: 0 12px;
    border-radius: 22px;
    font-size: 14px;
    font-weight: 500;
    color: var(--primary-color);
    text-decoration: none;
  }

  .footer a:hover {
    background: var(--ik-primary-fill);
  }
`;
