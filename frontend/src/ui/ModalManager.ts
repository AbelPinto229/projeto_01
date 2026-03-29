import type { Task } from '../models/Task.js';
import type { User } from '../models/User.js';

interface OpenUserModalOptions {
  userId?: number;
  users: User[];
  canEditData: boolean;
}

interface OpenTaskModalOptions {
  taskId?: number;
  tasks: Task[];
  canEditData: boolean;
}

export function openUserModal(options: OpenUserModalOptions): void {
  const { userId, users, canEditData } = options;
  if (!canEditData) return;

  const modal = document.getElementById('userModal') as HTMLDivElement;
  const form = document.getElementById('userForm') as HTMLFormElement;
  const titleEl = document.getElementById('userModalTitle') as HTMLHeadingElement;

  if (userId) {
    const user = users.find(item => item.id === userId);
    if (user) {
      titleEl.textContent = 'Editar Utilizador';
      (document.getElementById('userId') as HTMLInputElement).value = String(user.id);
      (document.getElementById('userName') as HTMLInputElement).value = user.name;
      (document.getElementById('userEmail') as HTMLInputElement).value = user.email;
      (document.getElementById('userStatus') as HTMLSelectElement).value = user.active ? 'active' : 'inactive';
    }
  } else {
    titleEl.textContent = 'Novo Utilizador';
    form.reset();
    (document.getElementById('userId') as HTMLInputElement).value = '';
  }

  modal.classList.remove('modal-hidden');
  modal.classList.add('modal-visible');
}

export function closeUserModal(): void {
  const modal = document.getElementById('userModal') as HTMLDivElement;
  modal.classList.remove('modal-visible');
  modal.classList.add('modal-hidden');
}

export function openTaskModal(options: OpenTaskModalOptions): void {
  const { taskId, tasks, canEditData } = options;
  if (!canEditData) return;

  const modal = document.getElementById('taskModal') as HTMLDivElement;
  const form = document.getElementById('taskForm') as HTMLFormElement;
  const titleEl = document.getElementById('taskModalTitle') as HTMLHeadingElement;
  const select = document.getElementById('taskTagsSelect') as HTMLSelectElement;

  if (taskId) {
    const task = tasks.find(item => item.id === taskId);
    if (task) {
      titleEl.textContent = 'Editar Tarefa';
      (document.getElementById('taskId') as HTMLInputElement).value = String(task.id);
      (document.getElementById('taskTitle') as HTMLInputElement).value = task.titulo;
      (document.getElementById('taskCategory') as HTMLInputElement).value = task.categoria;
      (document.getElementById('taskResponsible') as HTMLInputElement).value = task.responsavelNome;
      (document.getElementById('taskStatus') as HTMLSelectElement).value = task.concluida ? 'completed' : 'pending';

      Array.from(select.options).forEach(option => {
        option.selected = false;
      });

      const selectedTagNames = task.tags ?? [];
      Array.from(select.options).forEach(option => {
        if (selectedTagNames.includes(option.value)) {
          option.selected = true;
        }
      });
    }
  } else {
    titleEl.textContent = 'Nova Tarefa';
    form.reset();
    (document.getElementById('taskId') as HTMLInputElement).value = '';

    Array.from(select.options).forEach(option => {
      option.selected = false;
    });
  }

  modal.classList.remove('modal-hidden');
  modal.classList.add('modal-visible');
}

export function closeTaskModal(): void {
  const modal = document.getElementById('taskModal') as HTMLDivElement;
  modal.classList.remove('modal-visible');
  modal.classList.add('modal-hidden');
}

export function setupModalBackdropHandlers(): void {
  const userModal = document.getElementById('userModal') as HTMLDivElement;
  userModal.addEventListener('click', event => {
    if ((event.target as HTMLElement).id === 'userModal') closeUserModal();
  });

  const taskModal = document.getElementById('taskModal') as HTMLDivElement;
  taskModal.addEventListener('click', event => {
    if ((event.target as HTMLElement).id === 'taskModal') closeTaskModal();
  });
}
