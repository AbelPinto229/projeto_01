// define se o papel pode editar dados no sistema
export function canEditData(role: string): boolean {
  return role !== 'viewer';
}

// define se o papel pode criar novas tags
export function canCreateTag(role: string): boolean {
  return role === 'admin' || role === 'manager';
}
