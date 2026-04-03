import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, Task, TaskExecution } from "../types";
import { t } from "../translations";

interface FlatExecution extends TaskExecution {
  _taskId: string;
  _taskName: string;
}

@customElement("ik-task-history-view")
export class IkTaskHistoryView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) tasks: Task[] = [];

  @state() private _page = 0;
  @state() private _pageSize: 10 | 25 | 50 = 25;

  private _navigate(path: string) {
    this.dispatchEvent(new CustomEvent("navigate", { detail: path, bubbles: true, composed: true }));
  }

  private _formatDate(iso: string): string {
    return new Date(iso).toLocaleString();
  }

  private _flatExecutions(): FlatExecution[] {
    const flat: FlatExecution[] = [];
    for (const task of this.tasks) {
      for (const ex of task.executions ?? []) {
        flat.push({ ...ex, _taskId: task.task_id, _taskName: task.name });
      }
    }
    flat.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
    return flat;
  }

  static styles = css`
    :host { display: block; }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 8px;
    }
    h2 { margin: 0; font-size: 20px; font-weight: 500; }
    .empty {
      text-align: center;
      padding: 60px 20px;
      color: var(--secondary-text-color);
      font-size: 14px;
    }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th {
      text-align: left;
      padding: 8px 12px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-weight: 500;
      border-bottom: 1px solid var(--divider-color);
      white-space: nowrap;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--divider-color);
      vertical-align: middle;
    }
    tbody tr:last-child td { border-bottom: none; }
    .task-name { font-weight: 500; color: var(--primary-text-color); }
    .late-badge {
      display: inline-block;
      background: var(--warning-color, #ff9800);
      color: #fff;
      font-size: 10px;
      font-weight: 600;
      padding: 1px 6px;
      border-radius: 4px;
      margin-left: 6px;
      vertical-align: middle;
    }
    .btn-view {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-color);
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      --mdc-icon-size: 14px;
    }
    .btn-view:hover { background: var(--secondary-background-color); }
    .pagination {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      padding: 14px 0 0;
      flex-wrap: wrap;
    }
    .pagination span { font-size: 13px; color: var(--secondary-text-color); }
    .pagination select {
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .page-btn {
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 13px;
    }
    .page-btn:disabled { opacity: 0.4; cursor: default; }
    ha-card { overflow: hidden; }
  `;

  render() {
    const tr = t(this.hass?.language);
    const all = this._flatExecutions();
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / this._pageSize));
    const page = Math.min(this._page, totalPages - 1);
    const start = page * this._pageSize;
    const pageItems = all.slice(start, start + this._pageSize);

    return html`
      <div class="header">
        <h2>${tr.globalHistoryTitle}</h2>
      </div>

      <ha-card>
        ${total === 0
          ? html`<div class="empty">${tr.globalHistoryEmpty}</div>`
          : html`
            <table>
              <thead>
                <tr>
                  <th>${tr.completedAt}</th>
                  <th>${tr.taskHeader}</th>
                  <th>${tr.completedBy}</th>
                  <th>${tr.notes}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${pageItems.map((ex) => html`
                  <tr>
                    <td>
                      ${this._formatDate(ex.completed_at)}
                      ${ex.was_late ? html`<span class="late-badge">${tr.lateLabel}</span>` : nothing}
                    </td>
                    <td class="task-name">${ex._taskName}</td>
                    <td>${ex.completed_by || "—"}</td>
                    <td>${ex.notes || "—"}</td>
                    <td>
                      <button class="btn-view" @click=${() => this._navigate(`/edit/${ex._taskId}`)}>
                        <ha-icon icon="mdi:open-in-app"></ha-icon>
                        ${tr.viewTask}
                      </button>
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
            ${total > 10 ? html`
              <div class="pagination">
                <span>${tr.rowsPerPage}</span>
                <select .value=${String(this._pageSize)} @change=${(e: Event) => {
                  this._pageSize = Number((e.target as HTMLSelectElement).value) as 10 | 25 | 50;
                  this._page = 0;
                }}>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span>${start + 1}–${Math.min(start + this._pageSize, total)} ${tr.of} ${total}</span>
                <button class="page-btn" ?disabled=${page === 0} @click=${() => { this._page = page - 1; }}>&lt;</button>
                <button class="page-btn" ?disabled=${page >= totalPages - 1} @click=${() => { this._page = page + 1; }}>&gt;</button>
              </div>
            ` : nothing}
          `}
      </ha-card>
    `;
  }
}
