import type { Task } from '../models/Task.js';
import type { TaskStats } from '../models/Task.js';
export declare function getTasks(): Promise<Task[]>;
export declare function updateTask(id: number, task: Task): Promise<Task>;
export declare function createTask(task: Task): Promise<Task>;
export declare function deleteTask(id: number): Promise<void>;
export declare function getTaskStats(): Promise<TaskStats>;
export declare function addTagToTask(taskId: number, tagId: number): Promise<void>;
export declare function removeTagFromTask(taskId: number, tagId: number): Promise<void>;
//# sourceMappingURL=apiTaskService.d.ts.map