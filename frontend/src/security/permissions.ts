export function canEditData(role: string): boolean {
  return role !== 'viewer';
}

export function canCreateTag(role: string): boolean {
  return role === 'admin' || role === 'manager';
}
