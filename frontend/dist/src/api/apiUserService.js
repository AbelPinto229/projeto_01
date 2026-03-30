const BASE_URL = 'http://localhost:3000';
// vai buscar todos os utilizadores
export async function getUsers() {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok)
        throw new Error('Erro ao buscar users');
    const data = (await res.json());
    return data.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        active: item.active,
        created_at: item.created_at
    }));
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
    const data = (await res.json());
    const newUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        active: data.active,
        created_at: data.created_at
    };
    return newUser;
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
    const data = (await res.json());
    const newUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        active: data.active,
        created_at: data.created_at
    };
    return newUser;
}
// alterna o estado do utilizador
export async function toggleUserStatus(id) {
    const res = await fetch(`${BASE_URL}/users/${id}`, { method: 'PATCH' });
    if (!res.ok)
        throw new Error('Erro ao alternar status do user');
    const data = (await res.json());
    const updatedUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        active: data.active,
        created_at: data.created_at
    };
    return updatedUser;
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
    const data = (await res.json());
    const stats = {
        total: data.total,
        active: data.active,
        inactive: data.inactive,
        percentage: data.percentage
    };
    return stats;
}
// vai buscar as tarefas de um utilizador
export async function getUserTasks(id) {
    const res = await fetch(`${BASE_URL}/users/${id}/tasks`);
    if (!res.ok)
        throw new Error('Erro ao buscar tasks do user');
    const data = (await res.json());
    return data.map((item) => ({
        id: item.id,
        titulo: item.titulo,
        categoria: item.categoria,
        estado: item.estado,
        concluida: item.concluida,
        responsavelNome: item.responsavelNome,
        dataConclusao: item.dataConclusao,
        created_at: item.created_at,
        tags: item.tags,
        tagIds: item.tagIds
    }));
}
//# sourceMappingURL=apiUserService.js.map