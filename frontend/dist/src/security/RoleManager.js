// User Role Enum
export var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["MANAGER"] = "manager";
    UserRole["MEMBER"] = "member";
    UserRole["VIEWER"] = "viewer";
})(UserRole || (UserRole = {}));
// Permissions for each role
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
            // Update current role display
            const currentRoleEl = document.getElementById('currentRole');
            if (currentRoleEl) {
                currentRoleEl.textContent = this.currentRole.charAt(0).toUpperCase() + this.currentRole.slice(1);
            }
            // Apply role permissions
            this.applyRolePermissions();
            // Notify listeners
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
    // Subscribe to role changes
    subscribe(callback) {
        this.listeners.push(callback);
    }
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.currentRole));
    }
    applyRolePermissions() {
        // Wait for DOM to be ready, then update UI
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.updateUIElements());
        }
        else {
            this.updateUIElements();
        }
    }
    updateUIElements() {
        // Add role class to body for CSS-based visibility control
        document.body.className = document.body.className.replace(/role-\w+/g, '');
        document.body.classList.add(`role-${this.currentRole}`);
        // Update button visibility
        this.updateButtonVisibility();
    }
    updateButtonVisibility() {
        // Create User Button
        const createUserBtn = document.getElementById('createUserBtn');
        if (createUserBtn) {
            createUserBtn.style.display = this.hasPermission('create_user') ? 'inline-block' : 'none';
        }
        // Create Task Button
        const createTaskBtn = document.getElementById('createTaskBtn');
        if (createTaskBtn) {
            createTaskBtn.style.display = this.hasPermission('create_task') ? 'inline-block' : 'none';
        }
        // Create Tag Button
        const createTagBtn = document.getElementById('createTagBtn');
        if (createTagBtn) {
            createTagBtn.style.display = this.hasPermission('create_tag') ? 'inline-block' : 'none';
        }
        // Delete buttons in tables
        const deleteButtons = document.querySelectorAll('[data-action="delete"], [data-action="delete-tag"]');
        deleteButtons.forEach(btn => {
            const htmlBtn = btn;
            htmlBtn.style.display = this.hasPermission('delete_task') || this.hasPermission('delete_user') || this.hasPermission('delete_tag') ? 'inline-block' : 'none';
        });
        // Edit buttons in tables
        const editButtons = document.querySelectorAll('[data-action="edit"]');
        editButtons.forEach(btn => {
            const htmlBtn = btn;
            htmlBtn.style.display = this.hasPermission('edit_task') || this.hasPermission('edit_user') ? 'inline-block' : 'none';
        });
        // Toggle status buttons
        const toggleButtons = document.querySelectorAll('[data-action="toggle-status"]');
        toggleButtons.forEach(btn => {
            const htmlBtn = btn;
            htmlBtn.style.display = this.hasPermission('edit_user') || this.hasPermission('edit_task') ? 'inline-block' : 'none';
        });
    }
    // Force re-render UI (useful after adding new elements dynamically)
    forceUIUpdate() {
        this.updateUIElements();
    }
}
export const roleManager = new RoleManager();
//# sourceMappingURL=RoleManager.js.map