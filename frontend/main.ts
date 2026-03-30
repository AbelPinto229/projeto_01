import { UserService } from './src/services/UserService.js';
import { TaskService } from './src/services/TaskService.js';
import { CommentService } from './src/services/CommentService.js';
import { TagService } from './src/services/TagService.js';
import { openUserModal as openUserModalUI, closeUserModal as closeUserModalUI, openTaskModal as openTaskModalUI, closeTaskModal as closeTaskModalUI, setupModalBackdropHandlers } from './src/ui/ModalManager.js';
import { roleManager } from './src/security/RoleManager.js';
import { systemLogger } from './src/logs/SystemLogger.js';
import type { Comment } from './src/models/Comment.js';
import type { Task } from './src/models/Task.js';
import type { User } from './src/models/User.js';
import type { Tag } from './src/models/Tag.js';
import { canEditData as checkCanEditData, canCreateTag as checkCanCreateTag } from './src/security/permissions.js';

// tipa extensões do objeto global para facilitar debug manual no browser
declare global {
  interface Window {
    roleManager: any;
    userService: UserService;
    taskService: TaskService;
    tagService: TagService;
    systemLogger: any;
    setRole: (role: string) => void;
    openUserModal: (userId?: number) => void;
    closeUserModal: () => void;
    openTaskModal: (taskId?: number) => void;
    closeTaskModal: () => void;
  }
}

let currentRole: string = 'admin';
let currentUserFilter: 'all' | 'active' | 'inactive' = 'all';
let currentTaskFilter: 'all' | 'pending' | 'in-progress' | 'completed' = 'all';
let taskSearchTerm = '';

// estado local usado para renderizar a interface
let tasks: Task[] = [];
let users: User[] = [];
let tags: Tag[] = [];
let currentTaskComments: Comment[] = [];

// recarrega utilizadores e atualiza a tabela
async function loadUsers() {
  users = await userService.getUsers();
  renderUsers();
}

// recarrega tags e atualiza lista e seletor
async function loadTags() {
  tags = await tagService.getTags();
  renderTags();
}

// recarrega tarefas e atualiza tabela
async function loadTasks() {
  tasks = await taskService.getTasks();
  renderTasks();
}

const userService = new UserService();
const taskService = new TaskService();
const commentService = new CommentService();
const tagService = new TagService();

// expõe serviços para inspeção no devtools
window.roleManager = roleManager;
window.userService = userService;
window.taskService = taskService;
window.tagService = tagService;
window.systemLogger = systemLogger;

// abre modal de utilizador (novo ou edição)
function openUserModal(userId?: number): void {
  openUserModalUI({ userId, users, canEditData: checkCanEditData(currentRole) });
}

// fecha modal de utilizador
function closeUserModal(): void {
  closeUserModalUI();
}

function openTaskModal(taskId?: number): void {
  // abre modal com dados atuais da tarefa selecionada
  openTaskModalUI({ taskId, tasks, canEditData: checkCanEditData(currentRole) });
  // ao abrir modal, sincroniza comentários da tarefa selecionada
  void syncTaskComments(taskId);
}

function closeTaskModal(): void {
  // limpa comentários em memória para evitar fuga de contexto entre tarefas
  currentTaskComments = [];
  renderTaskComments();
  closeTaskModalUI();
}

function getTagColor(name: string): string {
  // garante sempre a mesma cor para o mesmo nome de tag
  const palette = ['#ff6b6b', '#ff8787', '#4c6ef5', '#15aabf', '#ffd43b', '#a78bfa', '#ff922b', '#63e6be', '#ffb3ba', '#ff8fab'];
  let hash = 0;

  for (let i = 0; i < name.length; i += 1) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }

  return palette[Math.abs(hash) % palette.length];
}

// formata datas iso para formato local com horas e minutos
function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('pt-PT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function updateUserFilterButtonsUI(filter: 'all' | 'active' | 'inactive'): void {
  // ativa visualmente apenas o filtro atual
  document.querySelectorAll('.user-filter-btn').forEach(button => {
    const element = button as HTMLButtonElement;
    const status = element.getAttribute('data-status');
    element.classList.toggle('active', status === filter);
  });
}

function updateTaskFilterButtonsUI(filter: 'all' | 'pending' | 'in-progress' | 'completed'): void {
  // ativa visualmente apenas o filtro atual
  document.querySelectorAll('.task-filter-btn').forEach(button => {
    const element = button as HTMLButtonElement;
    const status = element.getAttribute('data-status');
    element.classList.toggle('active', status === filter);
  });
}

function populateTaskTagsDropdown(): void {
  // repovoa o seletor múltiplo de tags mantendo a primeira opção fixa
  const select = document.getElementById('taskTagsSelect') as HTMLSelectElement | null;
  if (!select) return;

  while (select.options.length > 1) {
    select.remove(1);
  }

  tags.forEach(tag => {
    const option = document.createElement('option');
    option.value = tag.nome;
    option.textContent = tag.nome;
    select.appendChild(option);
  });
}

function renderUsers(): void {
  // desenha a tabela de utilizadores com base no filtro selecionado
  const tbody = document.querySelector('#userTable tbody') as HTMLTableSectionElement | null;
  if (!tbody) return;

  const filteredUsers = users.filter(user => {
    // aplica filtro de estado ativo/inativo sem pedir dados novamente
    if (currentUserFilter === 'active') return user.active;
    if (currentUserFilter === 'inactive') return !user.active;
    return true;
  });

  tbody.textContent = '';

  if (filteredUsers.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 5;
    cell.className = 'empty-row';
    cell.textContent = 'Nenhum utilizador encontrado para o filtro atual.';
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  filteredUsers.forEach(user => {
    // cria uma linha completa para cada utilizador
    const row = document.createElement('tr');
    row.className = 'table-row';

    const nameCell = document.createElement('td');
    nameCell.textContent = user.name;

    const emailCell = document.createElement('td');
    emailCell.textContent = user.email;

    const statusCell = document.createElement('td');
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge ${user.active ? 'status-active' : 'status-inactive'}`;
    statusBadge.textContent = user.active ? 'Ativo' : 'Inativo';
    statusCell.appendChild(statusBadge);

    const createdAtCell = document.createElement('td');
    createdAtCell.textContent = formatDateTime(user.created_at);

    const actionCell = document.createElement('td');
    if (checkCanEditData(currentRole)) {
      // só perfis com permissão podem editar/apagar
      const editButton = document.createElement('button');
      editButton.className = 'action-btn';
      editButton.textContent = 'Editar';
      editButton.addEventListener('click', () => openUserModal(user.id));

      const deleteButton = document.createElement('button');
      deleteButton.className = 'action-btn';
      deleteButton.textContent = 'Apagar';
      deleteButton.addEventListener('click', async () => {
        await userService.deleteUser(user.id);
        await loadUsers();
      });

      actionCell.appendChild(editButton);
      actionCell.appendChild(deleteButton);
    } else {
      const noPermission = document.createElement('span');
      noPermission.className = 'no-permission';
      noPermission.textContent = 'Sem permissao';
      actionCell.appendChild(noPermission);
    }

    row.appendChild(nameCell);
    row.appendChild(emailCell);
    row.appendChild(statusCell);
    row.appendChild(createdAtCell);
    row.appendChild(actionCell);
    tbody.appendChild(row);
  });

  updateStats();
}

function setupUserControls(): void {
  // liga os botões de filtro de utilizadores
  document.querySelectorAll('.user-filter-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const target = event.currentTarget as HTMLButtonElement;
      const status = target.getAttribute('data-status') as 'all' | 'active' | 'inactive' | null;
      if (!status) return;

      currentUserFilter = status;
      // atualiza interface imediatamente sem roundtrip à api
      updateUserFilterButtonsUI(currentUserFilter);
      renderUsers();
    });
  });

  updateUserFilterButtonsUI(currentUserFilter);
}

function renderTasks(): void {
  // desenha a tabela de tarefas com pesquisa e filtro por estado
  const tbody = document.querySelector('#taskTable tbody') as HTMLTableSectionElement | null;
  if (!tbody) return;

  const term = taskSearchTerm.trim().toLowerCase();
  const filteredTasks = tasks.filter(task => {
    // primeiro filtro por estado
    if (currentTaskFilter !== 'all' && task.estado !== currentTaskFilter) return false;
    if (!term) return true;

    // depois filtro por texto em campos relevantes
    const searchable = `${task.titulo} ${task.categoria} ${task.responsavelNome}`.toLowerCase();
    return searchable.includes(term);
  });

  tbody.textContent = '';

  if (filteredTasks.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 7;
    cell.className = 'empty-row';
    cell.textContent = 'Nenhuma tarefa encontrada para o filtro atual.';
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  filteredTasks.forEach(task => {
    // cria linha da tarefa com colunas e ações
    const row = document.createElement('tr');
    row.className = 'table-row';

    const titleCell = document.createElement('td');
    titleCell.textContent = task.titulo;

    const categoryCell = document.createElement('td');
    categoryCell.textContent = task.categoria;

    const responsibleCell = document.createElement('td');
    responsibleCell.textContent = task.responsavelNome;

    const tagsCell = document.createElement('td');
    const taskTagNames = task.tags || [];
    if (taskTagNames.length === 0) {
      tagsCell.textContent = '-';
    } else {
      // mostra cada tag como badge colorido
      taskTagNames.forEach(tagName => {
        const badge = document.createElement('span');
        badge.className = 'status-badge';
        badge.style.backgroundColor = getTagColor(tagName);
        badge.style.color = '#ffffff';
        badge.style.marginRight = '6px';
        badge.textContent = tagName;
        tagsCell.appendChild(badge);
      });
    }

    const statusCell = document.createElement('td');
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge ${task.estado === 'completed' ? 'status-completed' : 'status-pending'}`;
    statusBadge.textContent = task.estado === 'completed' ? 'Concluido' : task.estado === 'in-progress' ? 'Em Progresso' : 'Pendente';
    statusCell.appendChild(statusBadge);

    const createdAtCell = document.createElement('td');
    createdAtCell.textContent = formatDateTime(task.created_at);

    const actionCell = document.createElement('td');
    if (checkCanEditData(currentRole)) {
      // ações só disponíveis para quem pode editar dados
      const editButton = document.createElement('button');
      editButton.className = 'action-btn';
      editButton.textContent = 'Editar';
      editButton.addEventListener('click', () => openTaskModal(task.id));

      const deleteButton = document.createElement('button');
      deleteButton.className = 'action-btn';
      deleteButton.textContent = 'Apagar';
      deleteButton.addEventListener('click', async () => {
        await taskService.deleteTask(task.id);
        await loadTasks();
      });

      actionCell.appendChild(editButton);
      actionCell.appendChild(deleteButton);
    } else {
      const noPermission = document.createElement('span');
      noPermission.className = 'no-permission';
      noPermission.textContent = 'Sem permissao';
      actionCell.appendChild(noPermission);
    }

    row.appendChild(titleCell);
    row.appendChild(categoryCell);
    row.appendChild(responsibleCell);
    row.appendChild(tagsCell);
    row.appendChild(statusCell);
    row.appendChild(createdAtCell);
    row.appendChild(actionCell);
    tbody.appendChild(row);
  });

  updateStats();
}

function setupTaskControls(): void {
  // liga caixa de pesquisa para filtrar em tempo real
  const searchInput = document.getElementById('taskSearchInput') as HTMLInputElement | null;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      taskSearchTerm = searchInput.value;
      renderTasks();
    });
  }

  document.querySelectorAll('.task-filter-btn').forEach(button => {
    // liga botões de filtro por estado
    button.addEventListener('click', (event) => {
      const target = event.currentTarget as HTMLButtonElement;
      const status = target.getAttribute('data-status') as 'all' | 'pending' | 'in-progress' | 'completed' | null;
      if (!status) return;

      currentTaskFilter = status;
      updateTaskFilterButtonsUI(currentTaskFilter);
      renderTasks();
    });
  });

  updateTaskFilterButtonsUI(currentTaskFilter);
}

function renderTags(): void {
  // renderiza lista de tags e permite apagar por clique quando permitido
  const tagsList = document.getElementById('tagsList') as HTMLDivElement | null;
  if (!tagsList) return;

  const canManageTags = checkCanCreateTag(currentRole);
  tagsList.textContent = '';

  tags.forEach(tag => {
    // cada tag é mostrada como badge com cor determinística
    const badge = document.createElement('span');
    badge.className = 'status-badge';
    badge.style.backgroundColor = getTagColor(tag.nome);
    badge.style.color = '#ffffff';
    badge.textContent = tag.nome;

    if (canManageTags) {
      // clique na badge remove a tag
      badge.style.cursor = 'pointer';
      badge.title = 'Clique para apagar esta tag';
      badge.addEventListener('click', async () => {
        await tagService.deleteTag(tag.id);
        await loadTags();
      });
    }

    tagsList.appendChild(badge);
  });

  populateTaskTagsDropdown();
}

function renderTaskComments(): void {
  // mostra/oculta a secção e renderiza comentários da tarefa ativa
  const section = document.getElementById('taskCommentsSection') as HTMLDivElement | null;
  const list = document.getElementById('taskCommentsList') as HTMLDivElement | null;
  const input = document.getElementById('taskCommentInput') as HTMLTextAreaElement | null;
  const addButton = document.getElementById('addTaskCommentBtn') as HTMLButtonElement | null;
  const taskId = (document.getElementById('taskId') as HTMLInputElement | null)?.value;
  const canEdit = checkCanEditData(currentRole);

  if (!section || !list || !input || !addButton) return;

  if (!taskId) {
    // no modo criar tarefa, secção de comentários fica escondida
    section.classList.add('comments-hidden');
    list.textContent = '';
    input.value = '';
    input.disabled = true;
    addButton.disabled = true;
    return;
  }

  section.classList.remove('comments-hidden');
  input.disabled = !canEdit;
  addButton.disabled = !canEdit;
  list.textContent = '';

  if (currentTaskComments.length === 0) {
    // estado vazio quando não existem comentários
    const empty = document.createElement('div');
    empty.className = 'comment-card';
    empty.textContent = 'Sem comentários nesta tarefa.';
    list.appendChild(empty);
    return;
  }

  currentTaskComments.forEach(comment => {
    // renderiza cartão do comentário com metadados e ações
    const item = document.createElement('div');
    item.className = 'comment-card';

    const header = document.createElement('div');
    header.className = 'comment-header';

    const meta = document.createElement('div');
    meta.className = 'comment-meta';
    const author = users.find(user => user.id === comment.user_id)?.name || `User ${comment.user_id}`;
    meta.textContent = `${author} · ${formatDateTime(comment.dataCriacao)}`;

    header.appendChild(meta);

    if (canEdit) {
      // editar/apagar comentário só para perfis com permissão
      const actions = document.createElement('div');
      actions.className = 'comment-actions-inline';

      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'comment-action-btn';
      editButton.textContent = 'Editar';
      editButton.addEventListener('click', async () => {
        await editCommentFromTask(comment.id, comment.conteudo);
      });

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'comment-action-btn comment-delete-btn';
      deleteButton.textContent = 'Apagar';
      deleteButton.addEventListener('click', async () => {
        await deleteCommentFromTask(comment.id);
      });

      actions.appendChild(editButton);
      actions.appendChild(deleteButton);
      header.appendChild(actions);
    }

    const text = document.createElement('p');
    text.className = 'comment-text';
    text.textContent = comment.conteudo;

    item.appendChild(header);
    item.appendChild(text);
    list.appendChild(item);
  });
}

async function syncTaskComments(taskId?: number): Promise<void> {
  // sincroniza lista local de comentários para a tarefa ativa
  const input = document.getElementById('taskCommentInput') as HTMLTextAreaElement | null;

  if (!taskId) {
    currentTaskComments = [];
    if (input) input.value = '';
    renderTaskComments();
    return;
  }

  try {
    // lê comentários mais recentes da api
    currentTaskComments = await commentService.getCommentsByTask(taskId);
  } catch (error) {
    console.error('erro ao carregar comentarios da task:', error);
    currentTaskComments = [];
  }

  if (input) input.value = '';
  renderTaskComments();
}

async function addCommentToCurrentTask(): Promise<void> {
  // cria comentário e recarrega lista para refletir estado real
  const taskId = Number((document.getElementById('taskId') as HTMLInputElement).value);
  const commentInput = document.getElementById('taskCommentInput') as HTMLTextAreaElement | null;
  const responsibleName = (document.getElementById('taskResponsible') as HTMLInputElement | null)?.value;

  if (!taskId || !commentInput) return;

  const conteudo = commentInput.value.trim();
  if (!conteudo) return;

  const userId = users.find(user => user.name === responsibleName)?.id ?? users.find(user => user.active)?.id ?? users[0]?.id;
  // tenta resolver autor pelo responsável da tarefa; fallback para utilizador ativo
  if (!userId) {
    alert('Nao foi possivel determinar o utilizador do comentario');
    return;
  }

  try {
    await commentService.createComment(taskId, userId, conteudo);
    currentTaskComments = await commentService.getCommentsByTask(taskId);
    commentInput.value = '';
    renderTaskComments();
  } catch (error) {
    console.error('erro ao criar comentario na task:', error);
  }
}

async function editCommentFromTask(commentId: number, currentContent: string): Promise<void> {
  // pede novo texto e atualiza comentário na api
  const taskId = Number((document.getElementById('taskId') as HTMLInputElement).value);
  if (!taskId) return;

  const nextContent = prompt('Editar comentário', currentContent)?.trim();
  if (!nextContent || nextContent === currentContent) return;

  try {
    await commentService.updateComment(taskId, commentId, nextContent);
    currentTaskComments = await commentService.getCommentsByTask(taskId);
    renderTaskComments();
  } catch (error) {
    console.error('erro ao editar comentario da task:', error);
  }
}

async function deleteCommentFromTask(commentId: number): Promise<void> {
  // confirma com o utilizador e remove comentário
  const taskId = Number((document.getElementById('taskId') as HTMLInputElement).value);
  if (!taskId) return;

  if (!confirm('Queres apagar este comentário?')) return;

  try {
    await commentService.deleteComment(taskId, commentId);
    currentTaskComments = await commentService.getCommentsByTask(taskId);
    renderTaskComments();
  } catch (error) {
    console.error('erro ao apagar comentario da task:', error);
  }
}

async function createTagFromInput(): Promise<void> {
  // valida permissões e evita duplicados antes de criar
  if (!checkCanCreateTag(currentRole)) {
    return;
  }

  const input = document.getElementById('newTagName') as HTMLInputElement | null;
  if (!input) return;

  const tagName = input.value.trim();

  if (!tagName) {
    alert('Por favor, digite um nome para a tag');
    return;
  }

  if (tags.some(t => t.nome.toLowerCase() === tagName.toLowerCase())) {
    alert('Esta tag ja existe');
    return;
  }

  try {
    await tagService.createTag({ id: 0, nome: tagName, created_at: new Date().toISOString().split('T')[0] });
    await loadTags();
  } catch (error) {
    console.error('erro ao criar tag na api:', error);
    return;
  }

  input.value = '';
}

function updateStats(): void {
  // recalcula estatísticas visíveis no dashboard
  // bloco de elementos dos cartões de utilizadores
  const totalUsersEl = document.getElementById('totalUsers') as HTMLElement;
  const activeUsersEl = document.getElementById('activeUsers') as HTMLElement;
  const percentageEl = document.getElementById('activePercentage') as HTMLElement;
  // bloco de elementos dos cartões de tarefas
  const totalTasksEl = document.getElementById('totalTasks') as HTMLElement;
  const completedTasksEl = document.getElementById('completedTasks') as HTMLElement;
  const pendingTasksEl = document.getElementById('pendingTasks') as HTMLElement;

  totalUsersEl.textContent = users.length.toString();
  const activeUsers = users.filter(u => u.active).length;
  activeUsersEl.textContent = activeUsers.toString();
  percentageEl.textContent = users.length === 0 ? '0%' : Math.round((activeUsers / users.length) * 100) + '%';
  
  totalTasksEl.textContent = tasks.length.toString();
  const completedTasks = tasks.filter(t => t.concluida).length;
  completedTasksEl.textContent = completedTasks.toString();
  pendingTasksEl.textContent = tasks.filter(t => !t.concluida).length.toString();
}

function updateRoleUI(): void {
  // aplica visibilidade de ações com base no papel atual
  const currentRoleEl = document.getElementById('currentRole') as HTMLElement;
  currentRoleEl.textContent = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);
  
  const permissions: { [key: string]: string[] } = {
    admin: ['createUserBtn', 'createTaskBtn', 'createTagBtn'],
    manager: ['createTaskBtn', 'createTagBtn'],
    member: [],
    viewer: []
  };

  const allowedButtons = permissions[currentRole] || [];
  
  // aplica visibilidade dos botões principais conforme permissões
  ['createUserBtn', 'createTaskBtn', 'createTagBtn'].forEach(id => {
    const btn = document.getElementById(id) as HTMLButtonElement;
    if (btn) {
      btn.style.display = allowedButtons.includes(id) ? 'block' : 'none';
    }
  });

  const tagInput = document.getElementById('newTagName') as HTMLInputElement | null;
  if (tagInput) {
    // configura estado visual e interação do input de tags
    const canCreate = checkCanCreateTag(currentRole);
    tagInput.disabled = !canCreate;
    tagInput.placeholder = canCreate ? 'Nova tag' : 'Sem permissao para criar tag';
    tagInput.classList.toggle('opacity-60', !canCreate);
    tagInput.classList.toggle('cursor-not-allowed', !canCreate);
  }
}

window.setRole = function(role: string): void {
  // ponto de entrada global para trocar papel em runtime
  currentRole = role;
  updateRoleUI();
  renderUsers();
  renderTasks();
};

document.addEventListener('DOMContentLoaded', async () => {
  // liga eventos base da interface
  setupUserControls();
  setupTaskControls();
  updateRoleUI();

  // bloco de ações de criação no topo
  const createUserBtn = document.getElementById('createUserBtn') as HTMLButtonElement | null;
  createUserBtn?.addEventListener('click', () => { openUserModal(); });

  const createTaskBtn = document.getElementById('createTaskBtn') as HTMLButtonElement | null;
  createTaskBtn?.addEventListener('click', () => { openTaskModal(); });

  const createTagBtn = document.getElementById('createTagBtn') as HTMLButtonElement | null;
  createTagBtn?.addEventListener('click', async () => { await createTagFromInput(); });

  const newTagInput = document.getElementById('newTagName') as HTMLInputElement | null;
  if (newTagInput) {
    // permite criar tag com enter
    newTagInput.addEventListener('keydown', async (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        await createTagFromInput();
      }
    });
  }

  // botão de adicionar comentário no modal de tarefa
  const addTaskCommentBtn = document.getElementById('addTaskCommentBtn') as HTMLButtonElement | null;
  addTaskCommentBtn?.addEventListener('click', async () => { await addCommentToCurrentTask(); });

  try {
    // carrega dados essenciais em paralelo no arranque
    await Promise.all([loadUsers(), loadTasks(), loadTags()]);
    updateStats();
  } catch (error) {
    console.error('erro ao carregar dados iniciais da api:', error);
  }

  // formulário de utilizador (novo/editar)
  const userForm = document.getElementById('userForm') as HTMLFormElement;
  userForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!checkCanEditData(currentRole)) {
      closeUserModal();
      return;
    }
    
    const id = (document.getElementById('userId') as HTMLInputElement).value;
    const name = (document.getElementById('userName') as HTMLInputElement).value;
    const email = (document.getElementById('userEmail') as HTMLInputElement).value;
    const status = (document.getElementById('userStatus') as HTMLSelectElement).value as 'active' | 'inactive';
    const createdAt = new Date().toISOString().split('T')[0];
    
    // cria ou atualiza utilizador e recarrega a lista
    try {
      if (id) {
        await userService.updateUser({ id: parseInt(id, 10), name, email, active: status === 'active', created_at: createdAt });
      } else {
        await userService.createUser({ id: 0, name, email, active: status === 'active', created_at: createdAt });
      }

      await loadUsers();
    } catch (error) {
      console.error('erro ao sincronizar user com a api:', error);
      return;
    }

    closeUserModal();
  });

  // formulário de tarefa (novo/editar)
  const taskForm = document.getElementById('taskForm') as HTMLFormElement;
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!checkCanEditData(currentRole)) {
      closeTaskModal();
      return;
    }
    
    const id = (document.getElementById('taskId') as HTMLInputElement).value;
    const title = (document.getElementById('taskTitle') as HTMLInputElement).value;
    const category = (document.getElementById('taskCategory') as HTMLInputElement).value;
    const responsible = (document.getElementById('taskResponsible') as HTMLInputElement).value;
    const status = (document.getElementById('taskStatus') as HTMLSelectElement).value as 'pending' | 'in-progress' | 'completed';
    const selectedTags = Array.from((document.getElementById('taskTagsSelect') as HTMLSelectElement).selectedOptions)
      .map(option => option.value)
      .filter(value => value && value !== 'Selecionar tags');
    const createdAt = new Date().toISOString().split('T')[0];
    let taskIdForTags: number;
    
    // cria ou atualiza tarefa, depois sincroniza associação de tags
    try {
      if (id) {
        taskIdForTags = parseInt(id, 10);
        await taskService.updateTask({ id: taskIdForTags, titulo: title, categoria: category, estado: status, responsavelNome: responsible, concluida: status === 'completed', dataConclusao: status === 'completed' ? createdAt : null, created_at: createdAt });
      } else {
        await taskService.createTask({ id: 0, titulo: title, categoria: category, estado: status, responsavelNome: responsible, concluida: status === 'completed', dataConclusao: status === 'completed' ? createdAt : null, created_at: createdAt });
        await loadTasks();
        taskIdForTags = Math.max(...tasks.map(t => t.id), 0);
      }

      const selectedTagIds = tags
        .filter(tag => selectedTags.includes(tag.nome))
        .map(tag => tag.id);

      // calcula diferenças para adicionar/remover apenas o necessário
      const existingTagIds = tasks.find(task => task.id === taskIdForTags)?.tagIds || [];

      const tagIdsToAdd = selectedTagIds.filter(tagId => !existingTagIds.includes(tagId));
      const tagIdsToRemove = existingTagIds.filter(tagId => !selectedTagIds.includes(tagId));

      for (const tagId of tagIdsToAdd) {
        try {
          await taskService.addTagToTask(taskIdForTags, tagId);
        } catch (tagError) {
          console.warn('aviso ao associar tag na task:', tagError);
        }
      }

      for (const tagId of tagIdsToRemove) {
        try {
          await taskService.removeTagFromTask(taskIdForTags, tagId);
        } catch (tagError) {
          console.warn('aviso ao remover tag da task:', tagError);
        }
      }

      await loadTasks();
    } catch (error) {
      console.error('erro ao sincronizar task com a api:', error);
      return;
    }

    closeTaskModal();
  });
  
  setupModalBackdropHandlers();

  // expõe ações de modal para uso em html inline e debug
  window.openUserModal = openUserModal;
  window.closeUserModal = closeUserModal;
  window.openTaskModal = openTaskModal;
  window.closeTaskModal = closeTaskModal;
});