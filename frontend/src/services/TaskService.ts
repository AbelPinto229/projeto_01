import type { Task, TaskStats } from '../models/Task.js';
import { getTasks as apiGetTasks, createTask as apiCreateTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask, addTagToTask as apiAddTagToTask } from '../api/apiTaskService.js';

export class TaskService {
  private tasks: Task[] = [];

  // carrega as tarefas da api
  async loadTasks(search?: string, sort?: 'asc' | 'desc'): Promise<Task[]> {
    return this.getTasks(search, sort);
  }

  // devolve todas as tarefas com filtros opcionais
  async getTasks(search?: string, sort?: 'asc' | 'desc'): Promise<Task[]> {
    this.tasks = await apiGetTasks();
    let filtered = [...this.tasks];

    if (search) {
      filtered = filtered.filter(t =>
        t.titulo.toLowerCase().includes(search.toLowerCase()) ||
        t.categoria.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === 'asc') {
      filtered.sort((a, b) => a.titulo.localeCompare(b.titulo));
    } else if (sort === 'desc') {
      filtered.sort((a, b) => b.titulo.localeCompare(a.titulo));
    }

    return filtered;
  }

  // devolve estatísticas das tarefas
  getTaskStats(): TaskStats {
    const total = this.tasks.length;
    const concluidas = this.tasks.filter(t => t.concluida).length;
    const pendentes = total - concluidas;
    const percentagem = total === 0 ? 0 : Math.round((concluidas / total) * 100);

    return {
      total,
      concluidas,
      pendentes,
      percentagem
    };
  }

  // cria uma nova tarefa
  async createTask(task: Task): Promise<void> {
    await apiCreateTask(task);
    await this.loadTasks();
  }

  // devolve uma tarefa específica
  getTask(id: number): Task {
    const task = this.tasks.find(t => t.id === id);
    if (!task) throw new Error('Tarefa não encontrada');
    return task;
  }

  // atualiza uma tarefa
  async updateTask(task: Task): Promise<void> {
    await apiUpdateTask(task.id, task);
    await this.loadTasks();
  }

  // apaga uma tarefa
  async deleteTask(id: number): Promise<void> {
    await apiDeleteTask(id);
    await this.loadTasks();
  }

  async addTagToTask(taskId: number, tagId: number): Promise<void> {
    await apiAddTagToTask(taskId, tagId);
    await this.loadTasks();
  }
}
