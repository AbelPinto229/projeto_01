import type { Task, TaskStats } from '../models/Task.js';
import { getTasks as apiGetTasks, createTask as apiCreateTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask, addTagToTask as apiAddTagToTask, removeTagFromTask as apiRemoveTagFromTask } from '../api/apiTaskService.js';

class TaskService {
  private tasks: Task[] = [];

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
  async createTask(task: Task) {
    await apiCreateTask(task);

    await this.getTasks();
  }

  // devolve uma tarefa específica
  getTask(id: number): Task {
    const task = this.tasks.find(t => t.id === id);
    if (!task) throw new Error('Tarefa não encontrada');
    return task;
  }

  // atualiza uma tarefa
  async updateTask(task: Task) {
    await apiUpdateTask(task.id, task);

    await this.getTasks();
  }

  // apaga uma tarefa
  async deleteTask(id: number) {
    await apiDeleteTask(id);

    await this.getTasks();
  }

  async addTagToTask(taskId: number, tagId: number) {
    await apiAddTagToTask(taskId, tagId);

    await this.getTasks();
  }

  async removeTagFromTask(taskId: number, tagId: number) {
    await apiRemoveTagFromTask(taskId, tagId);

    await this.getTasks();
  }
}

export { TaskService };
