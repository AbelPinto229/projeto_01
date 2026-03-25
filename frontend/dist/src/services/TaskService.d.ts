import type { Task, TaskStats } from '../models/Task.js';
export declare class TaskService {
    private tasks;
    private nextId;
    getTasks(search?: string, sort?: 'asc' | 'desc'): Promise<Task[]>;
    getTaskStats(): Promise<TaskStats>;
    createTask(titulo: string, categoria: string, responsavelNome: string): Promise<Task>;
    getTask(id: number): Promise<Task>;
    updateTask(id: number, titulo: string, categoria: string, responsavelNome: string): Promise<Task>;
    toggleTaskStatus(id: number): Promise<Task>;
    deleteTask(id: number): Promise<void>;
    addTagToTask(taskId: number, tagId: number): Promise<void>;
    getTaskComments(id: number): Promise<any[]>;
}
//# sourceMappingURL=TaskService.d.ts.map