// ============================================
// MAIN APPLICATION ENTRY POINT
// ============================================
import { UserService } from './src/services/UserService.js';
import { TaskService } from './src/services/TaskService.js';
import { CommentService } from './src/services/CommentService.js';
import { TagService } from './src/services/TagService.js';
import { UserRenderer } from './src/ui/UserRenderer.js';
import { TaskRenderer } from './src/ui/TaskRenderer.js';
import { openUserModal as openUserModalUI, closeUserModal as closeUserModalUI, openTaskModal as openTaskModalUI, closeTaskModal as closeTaskModalUI, setupModalBackdropHandlers } from './src/ui/ModalManager.js';
import { roleManager } from './src/security/RoleManager.js';
import { systemLogger } from './src/logs/SystemLogger.js';
import { canEditData as checkCanEditData, canCreateTag as checkCanCreateTag } from './src/security/permissions.js';
// ============================================
// STATE VARIABLES
// ============================================
let currentRole = 'admin';
let currentUserFilter = 'all';
let currentTaskFilter = 'all';
let taskSearchTerm = '';
// ============================================
// API
// ============================================
// array local para manter o estado das tasks no frontend
let tasks = [];
// array local para manter o estado dos users no frontend
let users = [];
// array local para manter o estado das tags no frontend
let tags = [];
// users
// vai buscar users da api e atualiza o array local
async function loadUsers() {
    users = await userService.getUsers();
    renderUsers();
}
// cria user na api e depois sincroniza o array local
async function createUser(user) {
    await userService.createUser(user);
    await loadUsers();
}
// edita user na api e depois sincroniza o array local
async function editUser(user) {
    await userService.updateUser(user);
    await loadUsers();
}
// apaga user na api e depois sincroniza o array local
async function deleteUser(id) {
    await userService.deleteUser(id);
    await loadUsers();
}
//tags
// vai buscar tags da api e atualiza o array local
async function loadTags() {
    tags = await tagService.getTags();
    renderTags();
}
// apaga tag na api e depois sincroniza o array local
async function deleteTag(id) {
    await tagService.deleteTag(id);
    await loadTags();
}
//tasks
// vai buscar da api e atualiza e renderiza o array local 
async function loadTasks() {
    tasks = await taskService.loadTasks();
    renderTasks();
}
// cria task na api e depois sincroniza o array local
async function createTask(task) {
    await taskService.createTask(task);
    await loadTasks();
}
// edita task na api e depois sincroniza o array local
async function editTask(task) {
    await taskService.updateTask(task);
    await loadTasks();
}
// apaga task na api e depois sincroniza o array local
async function deleteTask(id) {
    await taskService.deleteTask(id);
    await loadTasks();
}
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
    openUserModalUI({ userId, users, canEditData: checkCanEditData(currentRole) });
}
function closeUserModal() {
    closeUserModalUI();
}
function openTaskModal(taskId) {
    openTaskModalUI({ taskId, tasks, canEditData: checkCanEditData(currentRole) });
}
function closeTaskModal() {
    closeTaskModalUI();
}
// ============================================
// RENDER FUNCTIONS
// ============================================
function getTagColor(name) {
    const palette = ['#ff6b6b', '#ff8787', '#4c6ef5', '#15aabf', '#ffd43b', '#a78bfa', '#ff922b', '#63e6be', '#ffb3ba', '#ff8fab'];
    let hash = 0;
    for (let i = 0; i < name.length; i += 1) {
        hash = (hash << 5) - hash + name.charCodeAt(i);
        hash |= 0;
    }
    return palette[Math.abs(hash) % palette.length];
}
function updateUserFilterButtonsUI(filter) {
    document.querySelectorAll('.user-filter-btn').forEach(button => {
        const element = button;
        const status = element.getAttribute('data-status');
        element.classList.toggle('active', status === filter);
    });
}
function updateTaskFilterButtonsUI(filter) {
    document.querySelectorAll('.task-filter-btn').forEach(button => {
        const element = button;
        const status = element.getAttribute('data-status');
        element.classList.toggle('active', status === filter);
    });
}
function populateTaskTagsDropdown() {
    const select = document.getElementById('taskTagsSelect');
    if (!select)
        return;
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
function renderUsers() {
    const tbody = document.querySelector('#userTable tbody');
    if (!tbody)
        return;
    const filteredUsers = users.filter(user => {
        if (currentUserFilter === 'active')
            return user.active;
        if (currentUserFilter === 'inactive')
            return !user.active;
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
        createdAtCell.textContent = user.created_at;
        const actionCell = document.createElement('td');
        if (checkCanEditData(currentRole)) {
            const editButton = document.createElement('button');
            editButton.className = 'action-btn';
            editButton.textContent = 'Editar';
            editButton.addEventListener('click', () => openUserModal(user.id));
            const deleteButton = document.createElement('button');
            deleteButton.className = 'action-btn';
            deleteButton.textContent = 'Apagar';
            deleteButton.addEventListener('click', async () => {
                await deleteUser(user.id);
            });
            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);
        }
        else {
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
function setupUserControls() {
    document.querySelectorAll('.user-filter-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const target = event.currentTarget;
            const status = target.getAttribute('data-status');
            if (!status)
                return;
            currentUserFilter = status;
            updateUserFilterButtonsUI(currentUserFilter);
            renderUsers();
        });
    });
    updateUserFilterButtonsUI(currentUserFilter);
}
function renderTasks() {
    const tbody = document.querySelector('#taskTable tbody');
    if (!tbody)
        return;
    const term = taskSearchTerm.trim().toLowerCase();
    const filteredTasks = tasks.filter(task => {
        if (currentTaskFilter === 'completed' && !task.concluida)
            return false;
        if (currentTaskFilter === 'pending' && task.concluida)
            return false;
        if (!term)
            return true;
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
        const row = document.createElement('tr');
        row.className = 'table-row';
        const titleCell = document.createElement('td');
        titleCell.textContent = task.titulo;
        const categoryCell = document.createElement('td');
        categoryCell.textContent = task.categoria;
        const responsibleCell = document.createElement('td');
        responsibleCell.textContent = task.responsavelNome;
        const tagsCell = document.createElement('td');
        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = `status-badge ${task.concluida ? 'status-completed' : 'status-pending'}`;
        statusBadge.textContent = task.concluida ? 'Concluido' : 'Pendente';
        statusCell.appendChild(statusBadge);
        const createdAtCell = document.createElement('td');
        createdAtCell.textContent = task.created_at;
        const actionCell = document.createElement('td');
        if (checkCanEditData(currentRole)) {
            const editButton = document.createElement('button');
            editButton.className = 'action-btn';
            editButton.textContent = 'Editar';
            editButton.addEventListener('click', () => openTaskModal(task.id));
            const deleteButton = document.createElement('button');
            deleteButton.className = 'action-btn';
            deleteButton.textContent = 'Apagar';
            deleteButton.addEventListener('click', async () => {
                await deleteTask(task.id);
            });
            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);
        }
        else {
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
            updateTaskFilterButtonsUI(currentTaskFilter);
            renderTasks();
        });
    });
    updateTaskFilterButtonsUI(currentTaskFilter);
}
function renderTags() {
    const tagsList = document.getElementById('tagsList');
    if (!tagsList)
        return;
    const canManageTags = checkCanCreateTag(currentRole);
    tagsList.textContent = '';
    tags.forEach(tag => {
        const badge = document.createElement('span');
        badge.className = 'status-badge';
        badge.style.backgroundColor = getTagColor(tag.nome);
        badge.style.color = '#ffffff';
        badge.textContent = tag.nome;
        if (canManageTags) {
            badge.style.cursor = 'pointer';
            badge.title = 'Clique para apagar esta tag';
            badge.addEventListener('click', async () => {
                await deleteTag(tag.id);
            });
        }
        tagsList.appendChild(badge);
    });
    populateTaskTagsDropdown();
}
async function createTagFromInput() {
    if (!checkCanCreateTag(currentRole)) {
        return;
    }
    const input = document.getElementById('newTagName');
    if (!input)
        return;
    const tagName = input.value.trim();
    if (!tagName) {
        alert('Por favor, digite um nome para a tag');
        return;
    }
    if (tags.some(t => t.nome.toLowerCase() === tagName.toLowerCase())) {
        alert('Esta tag ja existe');
        return;
    }
    const newId = Math.max(...tags.map(t => t.id), 0) + 1;
    try {
        await tagService.createTag({ id: newId, nome: tagName, created_at: new Date().toISOString().split('T')[0] });
        await loadTags();
    }
    catch (error) {
        console.error('erro ao criar tag na api:', error);
        return;
    }
    input.value = '';
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
    totalUsersEl.textContent = users.length.toString();
    const activeUsers = users.filter(u => u.active).length;
    activeUsersEl.textContent = activeUsers.toString();
    percentageEl.textContent = users.length === 0 ? '0%' : Math.round((activeUsers / users.length) * 100) + '%';
    totalTasksEl.textContent = tasks.length.toString();
    const completedTasks = tasks.filter(t => t.concluida).length;
    completedTasksEl.textContent = completedTasks.toString();
    pendingTasksEl.textContent = tasks.filter(t => !t.concluida).length.toString();
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
    const tagInput = document.getElementById('newTagName');
    if (tagInput) {
        const canCreate = checkCanCreateTag(currentRole);
        tagInput.disabled = !canCreate;
        tagInput.placeholder = canCreate ? 'Nova tag' : 'Sem permissao para criar tag';
        tagInput.classList.toggle('opacity-60', !canCreate);
        tagInput.classList.toggle('cursor-not-allowed', !canCreate);
    }
}
window.setRole = function (role) {
    currentRole = role;
    updateRoleUI();
    renderUsers();
    renderTasks();
};
// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    setupUserControls();
    setupTaskControls();
    updateRoleUI();
    // Create User Button
    const createUserBtn = document.getElementById('createUserBtn');
    if (createUserBtn) {
        createUserBtn.addEventListener('click', () => {
            openUserModal();
        });
    }
    // Create Task Button
    const createTaskBtn = document.getElementById('createTaskBtn');
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', () => {
            openTaskModal();
        });
    }
    // Create Tag Button
    const createTagBtn = document.getElementById('createTagBtn');
    if (createTagBtn) {
        createTagBtn.addEventListener('click', async () => {
            await createTagFromInput();
        });
    }
    const newTagInput = document.getElementById('newTagName');
    if (newTagInput) {
        newTagInput.addEventListener('keydown', async (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                await createTagFromInput();
            }
        });
    }
    try {
        await Promise.all([loadUsers(), loadTasks(), loadTags()]);
        updateStats();
    }
    catch (error) {
        console.error('erro ao carregar dados iniciais da api:', error);
    }
    // User Form Submit
    const userForm = document.getElementById('userForm');
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!checkCanEditData(currentRole)) {
            closeUserModal();
            return;
        }
        const id = document.getElementById('userId').value;
        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const status = document.getElementById('userStatus').value;
        const createdAt = new Date().toISOString().split('T')[0];
        try {
            if (id) {
                await editUser({ id: parseInt(id, 10), name, email, active: status === 'active', created_at: createdAt });
            }
            else {
                const newId = Math.max(...users.map(u => u.id), 0) + 1;
                await createUser({ id: newId, name, email, active: status === 'active', created_at: createdAt });
            }
        }
        catch (error) {
            console.error('erro ao sincronizar user com a api:', error);
            return;
        }
        closeUserModal();
    });
    // Task Form Submit
    const taskForm = document.getElementById('taskForm');
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!checkCanEditData(currentRole)) {
            closeTaskModal();
            return;
        }
        const id = document.getElementById('taskId').value;
        const title = document.getElementById('taskTitle').value;
        const category = document.getElementById('taskCategory').value;
        const responsible = document.getElementById('taskResponsible').value;
        const status = document.getElementById('taskStatus').value;
        const createdAt = new Date().toISOString().split('T')[0];
        try {
            if (id) {
                await editTask({ id: parseInt(id), titulo: title, categoria: category, responsavelNome: responsible, concluida: status === 'completed', dataConclusao: status === 'completed' ? createdAt : null, created_at: createdAt });
            }
            else {
                const nextId = Math.max(...tasks.map(t => t.id), 0) + 1;
                await createTask({ id: nextId, titulo: title, categoria: category, responsavelNome: responsible, concluida: status === 'completed', dataConclusao: status === 'completed' ? createdAt : null, created_at: createdAt });
            }
        }
        catch (error) {
            console.error('erro ao sincronizar task com a api:', error);
            return;
        }
        closeTaskModal();
    });
    setupModalBackdropHandlers();
    window.openUserModal = openUserModal;
    window.closeUserModal = closeUserModal;
    window.openTaskModal = openTaskModal;
    window.closeTaskModal = closeTaskModal;
});
//# sourceMappingURL=main.js.map