export function openUserModal(options) {
    const { userId, users, canEditData } = options;
    if (!canEditData)
        return;
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');
    const titleEl = document.getElementById('userModalTitle');
    if (userId) {
        const user = users.find(item => item.id === userId);
        if (user) {
            titleEl.textContent = 'Editar Utilizador';
            document.getElementById('userId').value = String(user.id);
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userStatus').value = user.status;
        }
    }
    else {
        titleEl.textContent = 'Novo Utilizador';
        form.reset();
        document.getElementById('userId').value = '';
    }
    modal.classList.remove('modal-hidden');
    modal.classList.add('modal-visible');
}
export function closeUserModal() {
    const modal = document.getElementById('userModal');
    modal.classList.remove('modal-visible');
    modal.classList.add('modal-hidden');
}
export function openTaskModal(options) {
    const { taskId, tasks, canEditData } = options;
    if (!canEditData)
        return;
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('taskForm');
    const titleEl = document.getElementById('taskModalTitle');
    const select = document.getElementById('taskTagsSelect');
    if (taskId) {
        const task = tasks.find(item => item.id === taskId);
        if (task) {
            titleEl.textContent = 'Editar Tarefa';
            document.getElementById('taskId').value = String(task.id);
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskCategory').value = task.category;
            document.getElementById('taskResponsible').value = task.responsible;
            document.getElementById('taskStatus').value = task.status;
            Array.from(select.options).forEach(option => {
                option.selected = task.tags.includes(option.value);
            });
        }
    }
    else {
        titleEl.textContent = 'Nova Tarefa';
        form.reset();
        document.getElementById('taskId').value = '';
        Array.from(select.options).forEach(option => {
            option.selected = false;
        });
    }
    modal.classList.remove('modal-hidden');
    modal.classList.add('modal-visible');
}
export function closeTaskModal() {
    const modal = document.getElementById('taskModal');
    modal.classList.remove('modal-visible');
    modal.classList.add('modal-hidden');
}
export function setupModalBackdropHandlers() {
    const userModal = document.getElementById('userModal');
    userModal.addEventListener('click', event => {
        if (event.target.id === 'userModal')
            closeUserModal();
    });
    const taskModal = document.getElementById('taskModal');
    taskModal.addEventListener('click', event => {
        if (event.target.id === 'taskModal')
            closeTaskModal();
    });
}
//# sourceMappingURL=ModalManager.js.map