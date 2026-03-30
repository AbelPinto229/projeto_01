import type { Task, TaskStats } from '../models/Task.js';
export declare class TaskService {
    private tasks;
    getTasks(search?: string, sort?: 'asc' | 'desc'): Promise<Task[]>;
    getTaskStats(): TaskStats;
    createTask(task: Task): Promise<Task>;
    getTask(id: number): Task;
    updateTask(task: Task): Promise<Task>;
    deleteTask(id: number): Promise<void>;
    addTagToTask(taskId: number, tagId: number): Promise<void>;
    removeTagFromTask(taskId: number, tagId: number): Promise<void>;
}
//# sourceMappingURL=TaskService.d.ts.map