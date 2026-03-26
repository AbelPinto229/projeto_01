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

  private renderTags(taskId: number): HTMLSpanElement[] {
    const tags = taskTags.get(taskId) || [];
    return tags.map(tag => {
      const element = document.createElement('span');
      element.className = 'tag-pill';
      element.textContent = tag;
      return element;
    });
  }

  private createActionButton(action: string, taskId: number, label: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'action-btn';
    button.setAttribute('data-action', action);
    button.setAttribute('data-task-id', String(taskId));
    button.textContent = label;
    return button;
  }

  renderTaskRow(task: Task): HTMLTableRowElement {
    const statusClass = TaskUtils.getStatusBadgeColor(task.concluida);
    const statusText = TaskUtils.getStatusText(task.concluida);
    const row = document.createElement('tr');
    row.className = 'table-row';

    const titleCell = document.createElement('td');
    titleCell.textContent = task.titulo;

    const categoryCell = document.createElement('td');
    categoryCell.textContent = task.categoria;

    const ownerCell = document.createElement('td');
    ownerCell.textContent = task.responsavelNome;

    const tagsCell = document.createElement('td');
    this.renderTags(task.id).forEach(tagElement => tagsCell.appendChild(tagElement));

    const statusCell = document.createElement('td');
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge ${statusClass}`;
    statusBadge.textContent = statusText;
    statusCell.appendChild(statusBadge);

    const createdAtCell = document.createElement('td');
    createdAtCell.textContent = new Date(task.created_at).toLocaleDateString('pt-PT');

    const actionsCell = document.createElement('td');
    actionsCell.appendChild(this.createActionButton('view-details', task.id, 'Ver'));
    actionsCell.appendChild(this.createActionButton('edit', task.id, 'Editar'));
    actionsCell.appendChild(this.createActionButton('toggle-status', task.id, 'Alternar'));
    actionsCell.appendChild(this.createActionButton('delete', task.id, 'Deletar'));

    row.appendChild(titleCell);
    row.appendChild(categoryCell);
    row.appendChild(ownerCell);
    row.appendChild(tagsCell);
    row.appendChild(statusCell);
    row.appendChild(createdAtCell);
    row.appendChild(actionsCell);

    return row;
  }

  renderTasksList(container: HTMLElement): void {
    try {
      const tasks = this.taskService.getTasks();
      const tbody = container.querySelector('tbody');
      if (tbody) {
        tbody.textContent = '';
        tasks.forEach(task => {
          tbody.appendChild(this.renderTaskRow(task));
        });
      }
    } catch (error) {
      console.error('Erro ao renderizar tarefas:', error);
    }
  }
}
