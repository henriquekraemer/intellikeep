// Wording follows panel/src/translations.ts wherever the two share a phrase
const messages = {
  en: {
    loading: "Loading tasks…",
    allClear: "All caught up!",
    defaultTitle: "Home maintenance",
    overdueCount: (n: number) => `${n} overdue`,
    dueTodayCount: (n: number) => `${n} due today`,
    openCount: (n: number) => `${n} open task${n !== 1 ? "s" : ""}`,
    viewAll: (n: number) => (n === 1 ? "View 1 task" : `View all ${n} tasks`),
    markComplete: (name: string) => `Mark ${name} as complete`,
    taskCompleted: "Task completed",
    undoAction: "Undo",
    actionFailed: (error: string) => `Something went wrong: ${error}`,
    overdue: "Overdue",
    daysOverdue: (n: number) => `${n} day${n !== 1 ? "s" : ""} overdue`,
    editorMaxTasks: "Max tasks to show",
    editorShowLinkedEntities: "Show linked areas and devices",
    editorShowDescription: "Show task description",
  },
  pt: {
    loading: "Carregando tarefas…",
    allClear: "Está tudo em dia!",
    defaultTitle: "Manutenção da casa",
    overdueCount: (n: number) => `${n} atrasada${n !== 1 ? "s" : ""}`,
    dueTodayCount: (n: number) => `${n} vence${n !== 1 ? "m" : ""} hoje`,
    openCount: (n: number) => `${n} tarefa${n !== 1 ? "s" : ""} aberta${n !== 1 ? "s" : ""}`,
    viewAll: (n: number) => (n === 1 ? "Ver 1 tarefa" : `Ver todas as ${n} tarefas`),
    markComplete: (name: string) => `Marcar ${name} como concluída`,
    taskCompleted: "Tarefa concluída",
    undoAction: "Desfazer",
    actionFailed: (error: string) => `Algo deu errado: ${error}`,
    overdue: "Atrasada",
    daysOverdue: (n: number) => `${n} dia${n !== 1 ? "s" : ""} de atraso`,
    editorMaxTasks: "Máximo de tarefas a exibir",
    editorShowLinkedEntities: "Mostrar áreas e dispositivos vinculados",
    editorShowDescription: "Mostrar descrição da tarefa",
  },
  es: {
    loading: "Cargando tareas…",
    allClear: "¡Todo al día!",
    defaultTitle: "Mantenimiento del hogar",
    overdueCount: (n: number) => `${n} vencida${n !== 1 ? "s" : ""}`,
    dueTodayCount: (n: number) => `${n} vence${n !== 1 ? "n" : ""} hoy`,
    openCount: (n: number) => `${n} tarea${n !== 1 ? "s" : ""} abierta${n !== 1 ? "s" : ""}`,
    viewAll: (n: number) => (n === 1 ? "Ver 1 tarea" : `Ver las ${n} tareas`),
    markComplete: (name: string) => `Marcar ${name} como completada`,
    taskCompleted: "Tarea completada",
    undoAction: "Deshacer",
    actionFailed: (error: string) => `Algo salió mal: ${error}`,
    overdue: "Vencida",
    daysOverdue: (n: number) => `${n} día${n !== 1 ? "s" : ""} de retraso`,
    editorMaxTasks: "Máximo de tareas a mostrar",
    editorShowLinkedEntities: "Mostrar áreas y dispositivos vinculados",
    editorShowDescription: "Mostrar descripción de la tarea",
  },
};

export type Translations = typeof messages.en;

export function t(language: string | undefined): Translations {
  const lang = language?.split("-")[0]?.toLowerCase() ?? "en";
  return (messages as Record<string, Translations>)[lang] ?? messages.en;
}
