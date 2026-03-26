export function updateUserFilterButtonsUI(currentUserFilter) {
    document.querySelectorAll('.user-filter-btn').forEach(button => {
        const element = button;
        const status = element.getAttribute('data-status');
        const isActive = status === currentUserFilter;
        element.classList.toggle('active', isActive);
    });
}
export function updateTaskFilterButtonsUI(currentTaskFilter) {
    document.querySelectorAll('.task-filter-btn').forEach(button => {
        const element = button;
        const status = element.getAttribute('data-status');
        const isActive = status === currentTaskFilter;
        element.classList.toggle('active', isActive);
    });
}
export function renderUsers(params) {
    const { users, currentUserFilter, canEditData, onEditUser } = params;
    const tbody = document.querySelector('#userTable tbody');
    const filteredUsers = users.filter(user => currentUserFilter === 'all' || user.status === currentUserFilter);
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
        statusBadge.className = `status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}`;
        statusBadge.textContent = user.status === 'active' ? 'Ativo' : 'Inativo';
        statusCell.appendChild(statusBadge);
        const createdAtCell = document.createElement('td');
        createdAtCell.textContent = user.createdAt;
        const actionCell = document.createElement('td');
        if (canEditData) {
            const button = document.createElement('button');
            button.className = 'action-btn';
            button.textContent = 'Editar';
            button.setAttribute('data-user-id', String(user.id));
            button.addEventListener('click', () => {
                onEditUser(user.id);
            });
            actionCell.appendChild(button);
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
}
export function renderTasks(params) {
    const { tasks, currentTaskFilter, taskSearchTerm, canEditData, onEditTask } = params;
    const term = taskSearchTerm.trim().toLowerCase();
    const filteredTasks = tasks.filter(task => {
        const matchesStatus = currentTaskFilter === 'all' || task.status === currentTaskFilter;
        if (!matchesStatus)
            return false;
        if (!term)
            return true;
        const searchable = `${task.title} ${task.category} ${task.responsible} ${task.tags.join(' ')}`.toLowerCase();
        return searchable.includes(term);
    });
    const tbody = document.querySelector('#taskTable tbody');
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
        titleCell.textContent = task.title;
        const categoryCell = document.createElement('td');
        categoryCell.textContent = task.category;
        const responsibleCell = document.createElement('td');
        responsibleCell.textContent = task.responsible;
        const tagsCell = document.createElement('td');
        task.tags.forEach(tag => {
            const tagBadge = document.createElement('span');
            tagBadge.className = 'tag-pill';
            tagBadge.textContent = tag;
            tagsCell.appendChild(tagBadge);
        });
        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = `status-badge ${task.status === 'completed' ? 'status-completed' : task.status === 'in-progress' ? 'status-progress' : 'status-pending'}`;
        statusBadge.textContent = task.status === 'completed' ? 'Concluido' : task.status === 'in-progress' ? 'Em Progresso' : 'Pendente';
        statusCell.appendChild(statusBadge);
        const createdAtCell = document.createElement('td');
        createdAtCell.textContent = task.createdAt;
        const actionCell = document.createElement('td');
        if (canEditData) {
            const button = document.createElement('button');
            button.className = 'action-btn';
            button.textContent = 'Editar';
            button.setAttribute('data-task-id', String(task.id));
            button.addEventListener('click', () => {
                onEditTask(task.id);
            });
            actionCell.appendChild(button);
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
}
export function populateTaskTagsDropdown(tags) {
    const select = document.getElementById('taskTagsSelect');
    if (!select)
        return;
    while (select.options.length > 1) {
        select.remove(1);
    }
    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag.name;
        option.textContent = tag.name;
        select.appendChild(option);
    });
}
export function renderTags(tags) {
    const tagsList = document.getElementById('tagsList');
    tagsList.textContent = '';
    tags.forEach(tag => {
        const badge = document.createElement('span');
        badge.className = 'status-badge';
        badge.style.backgroundColor = tag.color;
        badge.style.color = '#ffffff';
        badge.textContent = tag.name;
        tagsList.appendChild(badge);
    });
    populateTaskTagsDropdown(tags);
}
//# sourceMappingURL=AppRenderers.js.map