import { HomeAssistant, Task } from "./types";

const DOMAIN = "intellikeep";

export async function getTasks(hass: HomeAssistant): Promise<Task[]> {
  const result = await hass.connection.sendMessagePromise<{ tasks: Task[] }>({
    type: `${DOMAIN}/get_tasks`,
  });
  return result.tasks;
}

export async function getTask(hass: HomeAssistant, taskId: string): Promise<Task> {
  const result = await hass.connection.sendMessagePromise<{ task: Task }>({
    type: `${DOMAIN}/get_task`,
    task_id: taskId,
  });
  return result.task;
}

export async function subscribeTasks(
  hass: HomeAssistant,
  callback: (tasks: Task[]) => void
): Promise<() => void> {
  return hass.connection.subscribeMessage<{ tasks: Task[] }>(
    (msg) => callback(msg.tasks),
    { type: `${DOMAIN}/subscribe` }
  );
}

export async function createTask(
  hass: HomeAssistant,
  data: Partial<Task>
): Promise<void> {
  await hass.callService(DOMAIN, "create_task", data as Record<string, unknown>);
}

export async function updateTask(
  hass: HomeAssistant,
  taskId: string,
  data: Partial<Task>
): Promise<void> {
  await hass.callService(DOMAIN, "update_task", {
    task_id: taskId,
    ...(data as Record<string, unknown>),
  });
}

export async function completeTask(
  hass: HomeAssistant,
  taskId: string,
  completedBy = "",
  notes = ""
): Promise<void> {
  await hass.callService(DOMAIN, "complete_task", {
    task_id: taskId,
    completed_by: completedBy,
    notes,
  });
}

export async function deleteTask(
  hass: HomeAssistant,
  taskId: string
): Promise<void> {
  await hass.callService(DOMAIN, "delete_task", { task_id: taskId });
}
