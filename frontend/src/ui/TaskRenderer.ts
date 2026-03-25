import type { Task } from '../models/Task.js';
import { TaskService } from '../services/TaskService.js';
import { TaskUtils } from '../utils/index.js';

// FAKE TAGS FOR DISPLAY
const taskTags = new Map<number, string[]>([
  [1, ['Feature', 'Backend']],
  [2, ['Frontend', 'Design']],
  [3, ['QA', 'Teste']],
  [4, ['Documentação']],
  [5, ['DevOps', 'Urgente']],
  [6, ['Backend', 'Notificação']],
  [7, ['Database', 'Otimização']],
  [8, ['QA', 'Teste', 'Urgente']],
  [9, ['DevOps', 'Bloqueado']]
]);

export class TaskRenderer {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  private renderTags(taskId: number): string {
    const tags = taskTags.get(taskId) || [];
    return tags
      .map(tag => `<span class="inline-block px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded mr-1">${tag}</span>`)
      .join('');
  }

  renderTaskRow(task: Task): string {
    const statusClass = TaskUtils.getStatusBadgeColor(task.concluida);
    const statusText = TaskUtils.getStatusText(task.concluida);
    const tags = this.renderTags(task.id);

    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="px-4 py-3 text-sm font-medium text-slate-900">${task.titulo}</td>
        <td class="px-4 py-3 text-sm text-slate-600">${task.categoria}</td>
        <td class="px-4 py-3 text-sm text-slate-600">${task.responsavelNome}</td>
        <td class="px-4 py-3 text-sm">${tags}</td>
        <td class="px-4 py-3">
          <span class="px-2 py-1 text-xs font-semibold ${statusClass} rounded">${statusText}</span>
        </td>
        <td class="px-4 py-3 text-sm text-slate-500">${new Date(task.created_at).toLocaleDateString('pt-PT')}</td>
        <td class="px-4 py-3 flex gap-2">
          <button data-action="view-details" data-task-id="${task.id}" class="px-2 py-1 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded">Ver</button>
          <button data-action="edit" data-task-id="${task.id}" class="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded">Editar</button>
          <button data-action="toggle-status" data-task-id="${task.id}" class="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded">Alternar</button>
          <button data-action="delete" data-task-id="${task.id}" class="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded">Deletar</button>
        </td>
      </tr>
    `;
  }

  async renderTasksList(container: HTMLElement): Promise<void> {
    try {
      const tasks = await this.taskService.getTasks();
      const html = tasks.map(task => this.renderTaskRow(task)).join('');
      const tbody = container.querySelector('tbody');
      if (tbody) {
        tbody.innerHTML = html;
      }
    } catch (error) {
      console.error('Erro ao renderizar tarefas:', error);
    }
  }
}
