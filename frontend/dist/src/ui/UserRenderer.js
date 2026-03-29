import { UserService } from '../services/UserService.js';
export class UserRenderer {
    constructor() {
        this.userService = new UserService();
    }
    createActionButton(action, userId, label) {
        const button = document.createElement('button');
        button.className = 'action-btn';
        button.setAttribute('data-action', action);
        button.setAttribute('data-user-id', String(userId));
        button.textContent = label;
        return button;
    }
    renderUserRow(user) {
        const row = document.createElement('tr');
        row.className = 'table-row';
        const nameCell = document.createElement('td');
        nameCell.textContent = user.name;
        const emailCell = document.createElement('td');
        emailCell.textContent = user.email;
        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = `status-badge ${user.active ? 'status-active' : 'status-inactive'}`;
        statusBadge.textContent = user.active ? 'Online' : 'Offline';
        statusCell.appendChild(statusBadge);
        const createdAtCell = document.createElement('td');
        createdAtCell.textContent = new Date(user.created_at).toLocaleDateString('pt-PT');
        const actionsCell = document.createElement('td');
        actionsCell.appendChild(this.createActionButton('edit', user.id, 'Editar'));
        actionsCell.appendChild(this.createActionButton('toggle-status', user.id, 'Alternar'));
        actionsCell.appendChild(this.createActionButton('delete', user.id, 'Deletar'));
        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(statusCell);
        row.appendChild(createdAtCell);
        row.appendChild(actionsCell);
        return row;
    }
    async renderUsersList(container) {
        try {
            const users = await this.userService.getUsers();
            const tbody = container.querySelector('tbody');
            if (tbody) {
                tbody.textContent = '';
                users.forEach(user => {
                    tbody.appendChild(this.renderUserRow(user));
                });
            }
        }
        catch (error) {
            console.error('Erro ao renderizar utilizadores:', error);
        }
    }
}
//# sourceMappingURL=UserRenderer.js.map