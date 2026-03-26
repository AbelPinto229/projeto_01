// ============================================
// MAIN APPLICATION ENTRY POINT
// ============================================
import { UserService } from './src/services/UserService.js';
import { TaskService } from './src/services/TaskService.js';
import { CommentService } from './src/services/CommentService.js';
import { TagService } from './src/services/TagService.js';
import { getTasks as apiGetTasks, createTask as apiCreateTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from './src/api/apiTaskService.js';
import { getUsers as apiGetUsers, createUser as apiCreateUser, updateUser as apiUpdateUser, deleteUser as apiDeleteUser } from './src/api/apiUserService.js';
import { getTags as apiGetTags, createTag as apiCreateTag, deleteTag as apiDeleteTag } from './src/api/apiTagService.js';
import { UserRenderer } from './src/ui/UserRenderer.js';
import { TaskRenderer } from './src/ui/TaskRenderer.js';
import { renderUsers as renderUsersUI, renderTasks as renderTasksUI, renderTags as renderTagsUI, updateUserFilterButtonsUI, updateTaskFilterButtonsUI } from './src/ui/AppRenderers.js';
import { openUserModal as openUserModalUI, closeUserModal as closeUserModalUI, openTaskModal as openTaskModalUI, closeTaskModal as closeTaskModalUI, setupModalBackdropHandlers } from './src/ui/ModalManager.js';
import { roleManager } from './src/security/RoleManager.js';
import { systemLogger } from './src/logs/SystemLogger.js';
import { toUiTask, toApiTask, toUiUser, toApiUser, toUiTag, toApiTag, getTagColor } from './src/utils/mappers.js';
import { canEditData as checkCanEditData, canCreateTag as checkCanCreateTag } from './src/security/permissions.js';
// ============================================
// STATE VARIABLES
// ============================================
let currentRole = 'admin';
let currentUserFilter = 'all';
let currentTaskFilter = 'all';
let taskSearchTerm = '';
// array local para manter o estado das tasks no frontend
let tasks = [];
// array local para manter o estado dos users no frontend
let users = [];
// array local para manter o estado das tags no frontend
let tags = [];
// vai buscar users da api e atualiza o array local
async function loadUsers() {
    try {
        const apiUsers = await apiGetUsers();
        users = apiUsers.map(toUiUser);
    }
    catch (error) {
        console.error('erro ao carregar users:', error);
        users = [];
    }
    renderUsers();
    updateStats();
}
// cria user na api e depois sincroniza o array local
async function createUserRecord(user) {
    await apiCreateUser(toApiUser(user));
    await loadUsers();
}
// edita user na api e depois sincroniza o array local
async function editUserRecord(user) {
    await apiUpdateUser(user.id, toApiUser(user));
    await loadUsers();
}
// apaga user na api e depois sincroniza o array local
async function deleteUserRecord(id) {
    await apiDeleteUser(id);
    await loadUsers();
}
// vai buscar tags da api e atualiza o array local
async function loadTags() {
    try {
        const apiTags = await apiGetTags();
        tags = apiTags.map(toUiTag);
    }
    catch (error) {
        console.error('erro ao carregar tags:', error);
        tags = [];
    }
    renderTags();
}
// cria tag na api e depois sincroniza o array local
async function createTagRecord(tag) {
    await apiCreateTag(toApiTag(tag));
    await loadTags();
}
// apaga tag na api e depois sincroniza o array local
async function deleteTagRecord(id) {
    await apiDeleteTag(id);
    await loadTags();
}
// vai buscar da api e atualiza o array local
async function loadTasks() {
    try {
        const apiTasks = await apiGetTasks();
        tasks = apiTasks.map(toUiTask);
    }
    catch (error) {
        console.error('erro ao carregar tasks:', error);
        tasks = [];
    }
    renderTasks();
    updateStats();
}
// cria task na api e depois sincroniza o array local
async function createTask(task) {
    await apiCreateTask(toApiTask(task));
    await loadTasks();
}
// edita task na api e depois sincroniza o array local
async function editTask(task) {
    await apiUpdateTask(task.id, toApiTask(task));
    await loadTasks();
}
// apaga task na api e depois sincroniza o array local
async function deleteTask(id) {
    await apiDeleteTask(id);
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
function renderUsers() {
    renderUsersUI({
        users,
        currentUserFilter,
        canEditData: checkCanEditData(currentRole),
        onEditUser: openUserModal
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
            updateUserFilterButtonsUI(currentUserFilter);
            renderUsers();
        });
    });
    updateUserFilterButtonsUI(currentUserFilter);
}
function renderTasks() {
    renderTasksUI({
        tasks,
        currentTaskFilter,
        taskSearchTerm,
        canEditData: checkCanEditData(currentRole),
        onEditTask: openTaskModal
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
            updateTaskFilterButtonsUI(currentTaskFilter);
            renderTasks();
        });
    });
    updateTaskFilterButtonsUI(currentTaskFilter);
}
function renderTags() {
    renderTagsUI(tags);
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
    if (tags.some(t => t.name.toLowerCase() === tagName.toLowerCase())) {
        alert('Esta tag ja existe');
        return;
    }
    const newId = Math.max(...tags.map(t => t.id), 0) + 1;
    const color = getTagColor(tagName);
    try {
        await createTagRecord({ id: newId, name: tagName, color });
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
    const activeUsers = users.filter(u => u.status === 'active').length;
    activeUsersEl.textContent = activeUsers.toString();
    percentageEl.textContent = users.length === 0 ? '0%' : Math.round((activeUsers / users.length) * 100) + '%';
    totalTasksEl.textContent = tasks.length.toString();
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    completedTasksEl.textContent = completedTasks.toString();
    pendingTasksEl.textContent = tasks.filter(t => t.status === 'pending').length.toString();
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
    await Promise.all([loadUsers(), loadTasks(), loadTags()]);
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
                await editUserRecord({ id: parseInt(id, 10), name, email, status, createdAt });
            }
            else {
                const newId = Math.max(...users.map(u => u.id), 0) + 1;
                await createUserRecord({ id: newId, name, email, status, createdAt });
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
        // Get selected tags from dropdown
        const select = document.getElementById('taskTagsSelect');
        const tags = Array.from(select.selectedOptions).map(option => option.value);
        try {
            if (id) {
                await editTask({ id: parseInt(id), title, category, responsible, tags, status, createdAt });
            }
            else {
                const nextId = Math.max(...tasks.map(t => t.id), 0) + 1;
                await createTask({ id: nextId, title, category, responsible, tags, status, createdAt });
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