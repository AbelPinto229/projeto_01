import { UserService } from '../services/UserService.js';
export class UserRenderer {
    constructor() {
        this.userService = new UserService();
    }
    renderUserRow(user) {
        const statusClass = user.active ? 'bg-green-50' : 'bg-red-50';
        const statusBadge = user.active
            ? '<span class="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">Online</span>'
            : '<span class="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded">Offline</span>';
        return `
      <tr class="${statusClass} hover:bg-slate-100 transition-colors">
        <td class="px-4 py-3 text-sm font-medium text-slate-900">${user.name}</td>
        <td class="px-4 py-3 text-sm text-slate-600">${user.email}</td>
        <td class="px-4 py-3">${statusBadge}</td>
        <td class="px-4 py-3 text-sm text-slate-500">${new Date(user.created_at).toLocaleDateString('pt-PT')}</td>
        <td class="px-4 py-3 flex gap-2">
          <button data-action="edit" data-user-id="${user.id}" class="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded">Editar</button>
          <button data-action="toggle-status" data-user-id="${user.id}" class="px-2 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded">Alternar</button>
          <button data-action="delete" data-user-id="${user.id}" class="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded">Deletar</button>
        </td>
      </tr>
    `;
    }
    async renderUsersList(container) {
        try {
            const users = await this.userService.getUsers();
            const html = users.map(user => this.renderUserRow(user)).join('');
            const tbody = container.querySelector('tbody');
            if (tbody) {
                tbody.innerHTML = html;
            }
        }
        catch (error) {
            console.error('Erro ao renderizar utilizadores:', error);
        }
    }
}
//# sourceMappingURL=UserRenderer.js.map