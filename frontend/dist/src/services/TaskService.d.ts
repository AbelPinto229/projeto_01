import type { Task, TaskStats } from '../models/Task.js';
declare class TaskService {
    private tasks;
    getTasks(search?: string, sort?: 'asc' | 'desc'): Promise<Task[]>;
    getTaskStats(): TaskStats;
    createTask(task: Task): Promise<void>;
    getTask(id: number): Task;
    updateTask(task: Task): Promise<void>;
    deleteTask(id: number): Promise<void>;
    addTagToTask(taskId: number, tagId: number): Promise<void>;
    removeTagFromTask(taskId: number, tagId: number): Promise<void>;
}
export { TaskService };
//# sourceMappingURL=TaskService.d.ts.map