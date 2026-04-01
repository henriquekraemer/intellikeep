import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
    font-family: var(--paper-font-body1_-_font-family);
  }

  ha-card {
    padding: 0;
    overflow: hidden;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 16px 8px;
    font-size: 18px;
    font-weight: 500;
    color: var(--primary-text-color);
  }

  .card-header ha-icon {
    color: var(--primary-color);
    margin-right: 8px;
  }

  .task-list {
    padding: 0 8px 8px;
  }

  .task-item {
    display: flex;
    align-items: flex-start;
    padding: 10px 8px;
    border-radius: 8px;
    margin-bottom: 4px;
    cursor: default;
    transition: background-color 0.15s;
  }

  .task-item:hover {
    background-color: var(--secondary-background-color);
  }

  .task-status-icon {
    margin-right: 10px;
    margin-top: 2px;
    flex-shrink: 0;
  }

  .task-body {
    flex: 1;
    min-width: 0;
  }

  .task-name {
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .task-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 2px;
    font-size: 12px;
    color: var(--secondary-text-color);
    flex-wrap: wrap;
  }

  .task-description {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .priority-badge {
    display: inline-flex;
    align-items: center;
    padding: 1px 6px;
    border-radius: 10px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    color: white;
  }

  .entity-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 4px;
  }

  .entity-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    background: var(--secondary-background-color);
    border-radius: 12px;
    font-size: 11px;
    color: var(--secondary-text-color);
  }

  .complete-btn {
    flex-shrink: 0;
    margin-left: 8px;
    --mdc-icon-button-size: 36px;
  }

  .empty-state {
    text-align: center;
    padding: 24px;
    color: var(--secondary-text-color);
    font-size: 14px;
  }

  .empty-state ha-icon {
    display: block;
    --mdc-icon-size: 40px;
    margin-bottom: 8px;
    color: var(--primary-color);
    opacity: 0.5;
  }

  .divider {
    height: 1px;
    background: var(--divider-color);
    margin: 0 8px;
  }
`;
