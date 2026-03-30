// define se o papel pode editar dados no sistema
export function canEditData(role) {
    return role !== 'viewer';
}
// define se o papel pode criar novas tags
export function canCreateTag(role) {
    return role === 'admin' || role === 'manager';
}
//# sourceMappingURL=permissions.js.map