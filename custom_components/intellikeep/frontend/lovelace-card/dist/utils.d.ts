import { TaskPriority, TaskStatus } from "./types";
export declare function relativeDueDate(isoDate: string | null): string;
export declare function priorityColor(priority: TaskPriority): string;
export declare function statusColor(status: TaskStatus): string;
export declare function statusIcon(status: TaskStatus): string;
export declare function frequencyLabel(freq: string, customDays?: number | null): string;
