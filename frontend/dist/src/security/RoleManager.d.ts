export declare enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    MEMBER = "member",
    VIEWER = "viewer"
}
export declare const rolePermissions: Record<UserRole, string[]>;
export declare class RoleManager {
    private currentRole;
    private listeners;
    setRole(role: UserRole | string): void;
    getCurrentRole(): UserRole;
    getRoleName(): string;
    hasPermission(permission: string): boolean;
    subscribe(callback: (role: UserRole) => void): void;
    private notifyListeners;
    private applyRolePermissions;
    private updateUIElements;
    private updateButtonVisibility;
    forceUIUpdate(): void;
}
export declare const roleManager: RoleManager;
//# sourceMappingURL=RoleManager.d.ts.map