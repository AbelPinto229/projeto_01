// ============================================
// MAIN APPLICATION ENTRY POINT
// ============================================
import { UserService } from './src/services/UserService.js';
import { TaskService } from './src/services/TaskService.js';
import { CommentService } from './src/services/CommentService.js';
import { TagService } from './src/services/TagService.js';
import { UserRenderer } from './src/ui/UserRenderer.js';
import { TaskRenderer } from './src/ui/TaskRenderer.js';
import { roleManager } from './src/security/RoleManager.js';
import { systemLogger } from './src/logs/SystemLogger.js';
// ============================================
// FAKE DATA
// ============================================
const fakeUsers = [
    { id: 1, name: 'João Silva', email: 'joao@example.com', status: 'active', createdAt: '2024-01-15' },
    { id: 2, name: 'Maria Santos', email: 'maria@example.com', status: 'active', createdAt: '2024-01-16' },
    { id: 3, name: 'Pedro Oliveira', email: 'pedro@example.com', status: 'inactive', createdAt: '2024-01-17' },
    { id: 4, name: 'Ana Costa', email: 'ana@example.com', status: 'active', createdAt: '2024-01-18' },
    { id: 5, name: 'Carlos Mendes', email: 'carlos@example.com', status: 'active', createdAt: '2024-01-19' },
    { id: 6, name: 'Sofia Pereira', email: 'sofia@example.com', status: 'active', createdAt: '2024-01-20' },
    { id: 7, name: 'Miguel Ferreira', email: 'miguel@example.com', status: 'inactive', createdAt: '2024-01-21' },
    { id: 8, name: 'Beatriz Gomes', email: 'beatriz@example.com', status: 'active', createdAt: '2024-01-22' }
];
const fakeTasks = [
    { id: 1, title: 'Implementar autenticação', category: 'Backend', responsible: 'João Silva', tags: ['Urgente', 'Feature'], status: 'completed', createdAt: '2024-01-10' },
    { id: 2, title: 'Criar dashboard', category: 'Frontend', responsible: 'Maria Santos', tags: ['Feature', 'UI'], status: 'in-progress', createdAt: '2024-01-11' },
    { id: 3, title: 'Corrigir bug login', category: 'Backend', responsible: 'Pedro Oliveira', tags: ['Bug', 'Urgente'], status: 'in-progress', createdAt: '2024-01-12' },
    { id: 4, title: 'Design do logo', category: 'Design', responsible: 'Ana Costa', tags: ['Design'], status: 'completed', createdAt: '2024-01-13' },
    { id: 5, title: 'Documentação API', category: 'Documentation', responsible: 'Carlos Mendes', tags: ['Documentação'], status: 'pending', createdAt: '2024-01-14' },
    { id: 6, title: 'Testes unitários', category: 'QA', responsible: 'Sofia Pereira', tags: ['Testing', 'Bug'], status: 'in-progress', createdAt: '2024-01-15' },
    { id: 7, title: 'Deploy em produção', category: 'DevOps', responsible: 'Miguel Ferreira', tags: ['Urgente', 'Bloqueado'], status: 'pending', createdAt: '2024-01-16' },
    { id: 8, title: 'Revisar código', category: 'Backend', responsible: 'Beatriz Gomes', tags: ['Em Revisão'], status: 'pending', createdAt: '2024-01-17' },
    { id: 9, title: 'Otimizar performance', category: 'Frontend', responsible: 'João Silva', tags: ['Melhoria'], status: 'pending', createdAt: '2024-01-18' }
];
const fakeTags = [
    { id: 1, name: 'Urgente', color: '#ff6b6b' },
    { id: 2, name: 'Bug', color: '#ff8787' },
    { id: 3, name: 'Feature', color: '#4c6ef5' },
    { id: 4, name: 'Melhoria', color: '#15aabf' },
    { id: 5, name: 'Documentação', color: '#ffd43b' },
    { id: 6, name: 'Em Revisão', color: '#a78bfa' },
    { id: 7, name: 'Bloqueado', color: '#ff922b' }
];
// ============================================
// STATE VARIABLES
// ============================================
let currentRole = 'admin';
let editingUserId = null;
let editingTaskId = null;
let currentUserFilter = 'all';
let currentTaskFilter = 'all';
let taskSearchTerm = '';
// ============================================
// INITIALIZE SERVICES
// ============================================
const userService = new UserService();
const taskService = new TaskService();
const commentService = new CommentService();
const tagService = new TagService();
const userRenderer = new UserRenderer();
const taskRenderer = new TaskRenderer();
const appState = {
    userService,
    taskService,
    commentService,
    tagService,
    userRenderer,
    taskRenderer
};
// ============================================
// EXPOSE TO GLOBAL WINDOW
// ============================================
window.app = appState;
window.roleManager = roleManager;
window.userService = userService;
window.taskService = taskService;
window.tagService = tagService;
window.systemLogger = systemLogger;
// ============================================
// MODAL FUNCTIONS
// ============================================
function openUserModal(userId) {
    editingUserId = userId || null;
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');
    const titleEl = document.getElementById('userModalTitle');
    if (userId) {
        // Editing mode
        const user = fakeUsers.find(u => u.id === userId);
        if (user) {
            titleEl.textContent = 'Editar Utilizador';
            document.getElementById('userId').value = user.id.toString();
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userStatus').value = user.status;
        }
    }
    else {
        // Creating mode
        titleEl.textContent = 'Novo Utilizador';
        form.reset();
        document.getElementById('userId').value = '';
    }
    modal.classList.remove('modal-hidden');
    modal.classList.add('modal-visible');
}
function closeUserModal() {
    const modal = document.getElementById('userModal');
    modal.classList.remove('modal-visible');
    modal.classList.add('modal-hidden');
    editingUserId = null;
}
function openTaskModal(taskId) {
    editingTaskId = taskId || null;
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('taskForm');
    const titleEl = document.getElementById('taskModalTitle');
    const select = document.getElementById('taskTagsSelect');
    if (taskId) {
        // Editing mode
        const task = fakeTasks.find(t => t.id === taskId);
        if (task) {
            titleEl.textContent = 'Editar Tarefa';
            document.getElementById('taskId').value = task.id.toString();
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskCategory').value = task.category;
            document.getElementById('taskResponsible').value = task.responsible;
            document.getElementById('taskStatus').value = task.status;
            // Select the tags for this task
            Array.from(select.options).forEach(option => {
                option.selected = task.tags.includes(option.value);
            });
        }
    }
    else {
        // Creating mode
        titleEl.textContent = 'Nova Tarefa';
        form.reset();
        document.getElementById('taskId').value = '';
        // Deselect all tags
        Array.from(select.options).forEach(option => {
            option.selected = false;
        });
    }
    modal.classList.remove('modal-hidden');
    modal.classList.add('modal-visible');
}
function closeTaskModal() {
    const modal = document.getElementById('taskModal');
    modal.classList.remove('modal-visible');
    modal.classList.add('modal-hidden');
    editingTaskId = null;
}
// ============================================
// RENDER FUNCTIONS
// ============================================
function renderUsers() {
    const tbody = document.querySelector('#userTable tbody');
    const filteredUsers = getFilteredUsers();
    if (filteredUsers.length === 0) {
        tbody.innerHTML = `
      <tr>
        <td colspan="5" class="px-4 py-10 text-center text-slate-500">Nenhum utilizador encontrado para o filtro atual.</td>
      </tr>
    `;
        return;
    }
    tbody.innerHTML = filteredUsers.map(user => `
    <tr class="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
      <td class="px-4 py-3 text-sm font-medium text-slate-800">${user.name}</td>
      <td class="px-4 py-3 text-sm text-slate-700">${user.email}</td>
      <td class="px-4 py-3">
        <span class="px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">
          ${user.status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td class="px-4 py-3 text-sm text-slate-500">${user.createdAt}</td>
      <td class="px-4 py-3">
        <button class="edit-user-btn inline-flex items-center rounded-md bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600" data-user-id="${user.id}">Editar</button>
      </td>
    </tr>
  `).join('');
    // Add edit listeners
    document.querySelectorAll('.edit-user-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = parseInt(e.target.getAttribute('data-user-id') || '0');
            openUserModal(userId);
        });
    });
}
function getFilteredUsers() {
    return fakeUsers.filter(user => currentUserFilter === 'all' || user.status === currentUserFilter);
}
function updateUserFilterButtonsUI() {
    document.querySelectorAll('.user-filter-btn').forEach(button => {
        const element = button;
        const status = element.getAttribute('data-status');
        const isActive = status === currentUserFilter;
        if (isActive) {
            element.classList.remove('bg-emerald-50', 'text-emerald-700', 'bg-rose-50', 'text-rose-700', 'bg-blue-50', 'text-blue-700');
            element.classList.add('bg-blue-700', 'text-white');
        }
        else {
            element.classList.remove('bg-blue-700', 'text-white');
            if (status === 'active') {
                element.classList.add('bg-emerald-50', 'text-emerald-700');
            }
            else if (status === 'inactive') {
                element.classList.add('bg-rose-50', 'text-rose-700');
            }
            else {
                element.classList.add('bg-blue-50', 'text-blue-700');
            }
        }
    });
}
function setupUserControls() {
    document.querySelectorAll('.user-filter-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const target = event.currentTarget;
            const status = target.getAttribute('data-status');
            if (!status)
                return;
            currentUserFilter = status;
            updateUserFilterButtonsUI();
            renderUsers();
        });
    });
    updateUserFilterButtonsUI();
}
function renderTasks() {
    const tbody = document.querySelector('#taskTable tbody');
    const filteredTasks = getFilteredTasks();
    if (filteredTasks.length === 0) {
        tbody.innerHTML = `
      <tr>
        <td colspan="7" class="px-4 py-10 text-center text-slate-500">Nenhuma tarefa encontrada para o filtro atual.</td>
      </tr>
    `;
        return;
    }
    tbody.innerHTML = filteredTasks.map(task => `
    <tr class="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
      <td class="px-4 py-3 text-sm font-medium text-slate-800">${task.title}</td>
      <td class="px-4 py-3 text-sm text-slate-700">${task.category}</td>
      <td class="px-4 py-3 text-sm text-slate-700">${task.responsible}</td>
      <td class="px-4 py-3">
        <div class="flex gap-2">
          ${task.tags.map(tag => `<span class="px-2.5 py-1 text-xs rounded-full bg-brand-100 text-brand-700 font-medium">${tag}</span>`).join('')}
        </div>
      </td>
      <td class="px-4 py-3">
        <span class="px-2.5 py-1 text-xs rounded-full font-semibold ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : task.status === 'in-progress' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'}">
          ${task.status === 'completed' ? 'Concluido' : task.status === 'in-progress' ? 'Em Progresso' : 'Pendente'}
        </span>
      </td>
      <td class="px-4 py-3 text-sm text-slate-500">${task.createdAt}</td>
      <td class="px-4 py-3">
        <button class="edit-task-btn inline-flex items-center rounded-md bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600" data-task-id="${task.id}">Editar</button>
      </td>
    </tr>
  `).join('');
    // Add edit listeners
    document.querySelectorAll('.edit-task-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const taskId = parseInt(e.target.getAttribute('data-task-id') || '0');
            openTaskModal(taskId);
        });
    });
}
function getFilteredTasks() {
    const term = taskSearchTerm.trim().toLowerCase();
    return fakeTasks.filter(task => {
        const matchesStatus = currentTaskFilter === 'all' || task.status === currentTaskFilter;
        if (!matchesStatus)
            return false;
        if (!term)
            return true;
        const searchable = `${task.title} ${task.category} ${task.responsible} ${task.tags.join(' ')}`.toLowerCase();
        return searchable.includes(term);
    });
}
function updateTaskFilterButtonsUI() {
    document.querySelectorAll('.task-filter-btn').forEach(button => {
        const element = button;
        const status = element.getAttribute('data-status');
        const isActive = status === currentTaskFilter;
        if (isActive) {
            element.classList.remove('bg-amber-50', 'text-amber-700', 'bg-emerald-50', 'text-emerald-700', 'bg-cyan-50', 'text-cyan-700', 'bg-blue-50', 'text-blue-700');
            element.classList.add('bg-blue-700', 'text-white');
        }
        else {
            element.classList.remove('bg-blue-700', 'text-white');
            if (status === 'pending') {
                element.classList.add('bg-amber-50', 'text-amber-700');
            }
            else if (status === 'completed') {
                element.classList.add('bg-emerald-50', 'text-emerald-700');
            }
            else if (status === 'in-progress') {
                element.classList.add('bg-cyan-50', 'text-cyan-700');
            }
            else {
                element.classList.add('bg-blue-50', 'text-blue-700');
            }
        }
    });
}
function setupTaskControls() {
    const searchInput = document.getElementById('taskSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            taskSearchTerm = searchInput.value;
            renderTasks();
        });
    }
    document.querySelectorAll('.task-filter-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const target = event.currentTarget;
            const status = target.getAttribute('data-status');
            if (!status)
                return;
            currentTaskFilter = status;
            updateTaskFilterButtonsUI();
            renderTasks();
        });
    });
    updateTaskFilterButtonsUI();
}
function renderTags() {
    const tagsList = document.getElementById('tagsList');
    tagsList.innerHTML = fakeTags.map(tag => `
    <span class="px-4 py-2 rounded-full text-sm font-medium text-white" style="background-color: ${tag.color}">
      ${tag.name}
    </span>
  `).join('');
    // Also populate task modal dropdown
    populateTaskTagsDropdown();
}
function populateTaskTagsDropdown() {
    const select = document.getElementById('taskTagsSelect');
    if (!select)
        return;
    // Remove all options except the first one
    while (select.options.length > 1) {
        select.remove(1);
    }
    // Add all available tags
    fakeTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag.name;
        option.textContent = tag.name;
        select.appendChild(option);
    });
}
function createTagFromInput() {
    const input = document.getElementById('newTagName');
    if (!input)
        return;
    const tagName = input.value.trim();
    if (!tagName) {
        alert('Por favor, digite um nome para a tag');
        return;
    }
    if (fakeTags.some(t => t.name.toLowerCase() === tagName.toLowerCase())) {
        alert('Esta tag ja existe');
        return;
    }
    const colors = ['#ff6b6b', '#ff8787', '#4c6ef5', '#15aabf', '#ffd43b', '#a78bfa', '#ff922b', '#63e6be', '#ffb3ba', '#ff8fab'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const newId = Math.max(...fakeTags.map(t => t.id), 0) + 1;
    fakeTags.push({ id: newId, name: tagName, color });
    input.value = '';
    renderTags();
}
// ============================================
// STATISTICS
// ============================================
function updateStats() {
    const totalUsersEl = document.getElementById('totalUsers');
    const activeUsersEl = document.getElementById('activeUsers');
    const percentageEl = document.getElementById('activePercentage');
    const totalTasksEl = document.getElementById('totalTasks');
    const completedTasksEl = document.getElementById('completedTasks');
    const pendingTasksEl = document.getElementById('pendingTasks');
    totalUsersEl.textContent = fakeUsers.length.toString();
    const activeUsers = fakeUsers.filter(u => u.status === 'active').length;
    activeUsersEl.textContent = activeUsers.toString();
    percentageEl.textContent = Math.round((activeUsers / fakeUsers.length) * 100) + '%';
    totalTasksEl.textContent = fakeTasks.length.toString();
    const completedTasks = fakeTasks.filter(t => t.status === 'completed').length;
    completedTasksEl.textContent = completedTasks.toString();
    pendingTasksEl.textContent = fakeTasks.filter(t => t.status === 'pending').length.toString();
}
// ============================================
// ROLE MANAGEMENT
// ============================================
function updateRoleUI() {
    const currentRoleEl = document.getElementById('currentRole');
    currentRoleEl.textContent = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);
    const permissions = {
        admin: ['createUserBtn', 'createTaskBtn', 'createTagBtn'],
        manager: ['createTaskBtn', 'createTagBtn'],
        member: [],
        viewer: []
    };
    const allowedButtons = permissions[currentRole] || [];
    ['createUserBtn', 'createTaskBtn', 'createTagBtn'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.style.display = allowedButtons.includes(id) ? 'block' : 'none';
        }
    });
}
window.setRole = function (role) {
    currentRole = role;
    updateRoleUI();
};
// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    setupUserControls();
    setupTaskControls();
    renderUsers();
    renderTasks();
    renderTags();
    updateStats();
    updateRoleUI();
    // Create User Button
    const createUserBtn = document.getElementById('createUserBtn');
    createUserBtn.addEventListener('click', () => {
        openUserModal();
    });
    // Create Task Button
    const createTaskBtn = document.getElementById('createTaskBtn');
    createTaskBtn.addEventListener('click', () => {
        openTaskModal();
    });
    // Create Tag Button
    const createTagBtn = document.getElementById('createTagBtn');
    if (createTagBtn) {
        createTagBtn.addEventListener('click', () => {
            createTagFromInput();
        });
    }
    const newTagInput = document.getElementById('newTagName');
    if (newTagInput) {
        newTagInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                createTagFromInput();
            }
        });
    }
    // User Form Submit
    const userForm = document.getElementById('userForm');
    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('userId').value;
        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const status = document.getElementById('userStatus').value;
        const createdAt = new Date().toISOString().split('T')[0];
        if (id) {
            // Edit existing user
            const userIndex = fakeUsers.findIndex(u => u.id === parseInt(id));
            if (userIndex !== -1) {
                fakeUsers[userIndex] = { ...fakeUsers[userIndex], name, email, status };
            }
        }
        else {
            // Create new user
            const newId = Math.max(...fakeUsers.map(u => u.id)) + 1;
            fakeUsers.push({ id: newId, name, email, status, createdAt });
        }
        renderUsers();
        updateStats();
        closeUserModal();
    });
    // Task Form Submit
    const taskForm = document.getElementById('taskForm');
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('taskId').value;
        const title = document.getElementById('taskTitle').value;
        const category = document.getElementById('taskCategory').value;
        const responsible = document.getElementById('taskResponsible').value;
        const status = document.getElementById('taskStatus').value;
        const createdAt = new Date().toISOString().split('T')[0];
        // Get selected tags from dropdown
        const select = document.getElementById('taskTagsSelect');
        const tags = Array.from(select.selectedOptions).map(option => option.value);
        if (id) {
            // Edit existing task
            const taskIndex = fakeTasks.findIndex(t => t.id === parseInt(id));
            if (taskIndex !== -1) {
                fakeTasks[taskIndex] = { ...fakeTasks[taskIndex], title, category, responsible, status, tags };
            }
        }
        else {
            // Create new task
            const newId = Math.max(...fakeTasks.map(t => t.id)) + 1;
            fakeTasks.push({ id: newId, title, category, responsible, tags, status, createdAt });
        }
        renderTasks();
        updateStats();
        closeTaskModal();
    });
    // Close modals when clicking outside
    const userModal = document.getElementById('userModal');
    userModal.addEventListener('click', (e) => {
        if (e.target.id === 'userModal')
            closeUserModal();
    });
    const taskModal = document.getElementById('taskModal');
    taskModal.addEventListener('click', (e) => {
        if (e.target.id === 'taskModal')
            closeTaskModal();
    });
    window.openUserModal = openUserModal;
    window.closeUserModal = closeUserModal;
    window.openTaskModal = openTaskModal;
    window.closeTaskModal = closeTaskModal;
});
//# sourceMappingURL=main.js.map