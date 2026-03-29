const BASE_URL = 'http://localhost:3000';
// vai buscar todos os utilizadores
export async function getUsers() {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok)
        throw new Error('Erro ao buscar users');
    return res.json();
}
// cria um novo utilizador
export async function createUser(user) {
    const res = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    if (!res.ok)
        throw new Error('Erro ao criar user');
    return res.json();
}
// atualiza um utilizador pelo id
export async function updateUser(id, user) {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    if (!res.ok)
        throw new Error('Erro ao atualizar user');
    return res.json();
}
// alterna o estado do utilizador
export async function toggleUserStatus(id) {
    const res = await fetch(`${BASE_URL}/users/${id}`, { method: 'PATCH' });
    if (!res.ok)
        throw new Error('Erro ao alternar status do user');
    return res.json();
}
// apaga um utilizador pelo id
export async function deleteUser(id) {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        throw new Error('Erro ao apagar user');
    }
}
// vai buscar estatísticas dos utilizadores
export async function getUserStats() {
    const res = await fetch(`${BASE_URL}/users/stats`);
    if (!res.ok)
        throw new Error('Erro ao buscar estatisticas de users');
    return res.json();
}
// vai buscar as tarefas de um utilizador
export async function getUserTasks(id) {
    const res = await fetch(`${BASE_URL}/users/${id}/tasks`);
    if (!res.ok)
        throw new Error('Erro ao buscar tasks do user');
    return res.json();
}
//# sourceMappingURL=apiUserService.js.map