import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, Task, TaskExecution } from "../types";
import { getTask } from "../api";

@customElement("ik-task-history-view")
export class IkTaskHistoryView extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property() taskId = "";

  @state() private _task: Task | null = null;
  @state() private _loading = true;
  @state() private _error = "";

  async connectedCallback() {
    super.connectedCallback();
    await this._load();
  }

  private async _load() {
    try {
      this._task = await getTask(this.hass, this.taskId);
    } catch (err) {
      this._error = String(err);
    } finally {
      this._loading = false;
    }
  }

  static styles = css`
    :host { display: block; }
    h2 { margin: 0 0 4px; font-size: 18px; }
    .subtitle { color: var(--secondary-text-color); font-size: 13px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th {
      text-align: left;
      padding: 8px 12px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-weight: 500;
      border-bottom: 1px solid var(--divider-color);
    }
    td { padding: 10px 12px; border-bottom: 1px solid var(--divider-color); }
    tr:last-child td { border-bottom: none; }
    .empty { text-align: center; padding: 32px; color: var(--secondary-text-color); }
    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 16px;
      padding: 6px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 13px;
    }
  `;

  private _navigate(path: string) {
    this.dispatchEvent(new CustomEvent("navigate", { detail: path, bubbles: true, composed: true }));
  }

  private _formatDate(iso: string): string {
    return new Date(iso).toLocaleString();
  }

  render() {
    if (this._loading) return html`<p>Loading…</p>`;
    if (this._error) return html`<p style="color:var(--error-color)">${this._error}</p>`;
    if (!this._task) return html`<p>Task not found.</p>`;

    const executions = [...(this._task.executions || [])].reverse();

    return html`
      <button class="back-btn" @click=${() => this._navigate("/tasks")}>← Back</button>
      <h2>${this._task.name}</h2>
      <div class="subtitle">Execution history — ${executions.length} record${executions.length !== 1 ? "s" : ""}</div>

      <ha-card>
        ${executions.length === 0
          ? html`<div class="empty">No executions recorded yet.</div>`
          : html`
              <table>
                <thead>
                  <tr>
                    <th>Completed at</th>
                    <th>Completed by</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  ${executions.map(
                    (ex: TaskExecution) => html`
                      <tr>
                        <td>${this._formatDate(ex.completed_at)}</td>
                        <td>${ex.completed_by || "—"}</td>
                        <td>${ex.notes || "—"}</td>
                      </tr>
                    `
                  )}
                </tbody>
              </table>
            `}
      </ha-card>
    `;
  }
}
