// enum dos papéis de utilizador
export var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["MANAGER"] = "manager";
    UserRole["MEMBER"] = "member";
    UserRole["VIEWER"] = "viewer";
})(UserRole || (UserRole = {}));
// permissões de cada papel
export const rolePermissions = {
    [UserRole.ADMIN]: ['create_user', 'edit_user', 'delete_user', 'create_task', 'edit_task', 'delete_task', 'create_tag', 'delete_tag', 'manage_all'],
    [UserRole.MANAGER]: ['create_task', 'edit_task', 'delete_task', 'create_tag', 'delete_tag', 'assign_task'],
    [UserRole.MEMBER]: ['create_task', 'edit_task', 'add_comment'],
    [UserRole.VIEWER]: ['view_all', 'add_comment']
};
export class RoleManager {
    constructor() {
        this.currentRole = UserRole.ADMIN;
        this.listeners = [];
    }
    setRole(role) {
        const roleStr = role.toLowerCase();
        if (Object.values(UserRole).includes(roleStr)) {
            this.currentRole = roleStr;
            // atualiza a indicação do papel atual
            const currentRoleEl = document.getElementById('currentRole');
            if (currentRoleEl) {
                currentRoleEl.textContent = this.currentRole.charAt(0).toUpperCase() + this.currentRole.slice(1);
            }
            // aplica as permissões do papel
            this.applyRolePermissions();
            // notifica os listeners
            this.notifyListeners();
        }
    }
    getCurrentRole() {
        return this.currentRole;
    }
    getRoleName() {
        return this.currentRole.charAt(0).toUpperCase() + this.currentRole.slice(1);
    }
    hasPermission(permission) {
        return rolePermissions[this.currentRole].includes(permission);
    }
    // subscreve alterações de papel
    subscribe(callback) {
        this.listeners.push(callback);
    }
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.currentRole));
    }
    applyRolePermissions() {
        // espera que o dom esteja pronto e depois atualiza a ui
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.updateUIElements());
        }
        else {
            this.updateUIElements();
        }
    }
    updateUIElements() {
        // adiciona a classe do papel ao body para controlar visibilidade por css
        document.body.className = document.body.className.replace(/role-\w+/g, '');
        document.body.classList.add(`role-${this.currentRole}`);
        // atualiza a visibilidade dos botões
        this.updateButtonVisibility();
    }
    updateButtonVisibility() {
        // botão criar utilizador
        const createUserBtn = document.getElementById('createUserBtn');
        if (createUserBtn) {
            createUserBtn.style.display = this.hasPermission('create_user') ? 'inline-block' : 'none';
        }
        // botão criar tarefa
        const createTaskBtn = document.getElementById('createTaskBtn');
        if (createTaskBtn) {
            createTaskBtn.style.display = this.hasPermission('create_task') ? 'inline-block' : 'none';
        }
        // botão criar tag
        const createTagBtn = document.getElementById('createTagBtn');
        if (createTagBtn) {
            createTagBtn.style.display = this.hasPermission('create_tag') ? 'inline-block' : 'none';
        }
        // botões de apagar nas tabelas
        const deleteButtons = document.querySelectorAll('[data-action="delete"], [data-action="delete-tag"]');
        deleteButtons.forEach(btn => {
            const htmlBtn = btn;
            htmlBtn.style.display = this.hasPermission('delete_task') || this.hasPermission('delete_user') || this.hasPermission('delete_tag') ? 'inline-block' : 'none';
        });
        // botões de editar nas tabelas
        const editButtons = document.querySelectorAll('[data-action="edit"]');
        editButtons.forEach(btn => {
            const htmlBtn = btn;
            htmlBtn.style.display = this.hasPermission('edit_task') || this.hasPermission('edit_user') ? 'inline-block' : 'none';
        });
        // botões de alternar estado
        const toggleButtons = document.querySelectorAll('[data-action="toggle-status"]');
        toggleButtons.forEach(btn => {
            const htmlBtn = btn;
            htmlBtn.style.display = this.hasPermission('edit_user') || this.hasPermission('edit_task') ? 'inline-block' : 'none';
        });
    }
    // força re-render da ui após adicionar novos elementos dinamicamente
    forceUIUpdate() {
        this.updateUIElements();
    }
}
export const roleManager = new RoleManager();
//# sourceMappingURL=RoleManager.js.map