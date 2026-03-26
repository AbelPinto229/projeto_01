export function canEditData(role) {
    return role !== 'viewer';
}
export function canCreateTag(role) {
    return role === 'admin' || role === 'manager';
}
//# sourceMappingURL=permissions.js.map