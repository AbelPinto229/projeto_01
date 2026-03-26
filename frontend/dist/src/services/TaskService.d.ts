import type { Task, TaskStats } from '../models/Task.js';
export declare class TaskService {
    private tasks;
    private nextId;
    getTasks(search?: string, sort?: 'asc' | 'desc'): Task[];
    getTaskStats(): TaskStats;
    createTask(titulo: string, categoria: string, responsavelNome: string): Task;
    getTask(id: number): Task;
    updateTask(id: number, titulo: string, categoria: string, responsavelNome: string): Task;
    toggleTaskStatus(id: number): Task;
    deleteTask(id: number): void;
    addTagToTask(taskId: number, tagId: number): void;
    getTaskComments(id: number): any[];
}
//# sourceMappingURL=TaskService.d.ts.map