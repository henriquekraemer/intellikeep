import { TaskPriority, TaskStatus, Weekday } from "./types";
export declare function relativeDueDate(isoDate: string | null, language: string | undefined): string;
export declare function priorityColor(priority: TaskPriority): string;
export declare function statusColor(status: TaskStatus): string;
export declare function statusIcon(status: TaskStatus): string;
export declare function frequencyLabel(freq: string, customDays: number | null | undefined, weekdays: Weekday[] | null | undefined, language: string | undefined): string;
