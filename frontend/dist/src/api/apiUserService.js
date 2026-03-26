const BASE_URL = 'http://localhost:3000';
// GET /users
export async function getUsers() {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok) {
        throw new Error('Erro ao buscar users');
    }
    const users = [];
    let apiResponse = [];
    apiResponse = await res.json();
    apiResponse.forEach((item) => {
        users.push(item);
    });
    return users;
}
// POST /users
export async function createUser(user) {
    const res = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    if (!res.ok) {
        throw new Error('Erro ao criar user');
    }
    let createdUser = {};
    let apiResponse = null;
    apiResponse = await res.json();
    createdUser = apiResponse;
    return createdUser;
}
// PUT /users/:id
export async function updateUser(id, user) {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    if (!res.ok) {
        throw new Error('Erro ao atualizar user');
    }
    let updatedUser = {};
    let apiResponse = null;
    apiResponse = await res.json();
    updatedUser = apiResponse;
    return updatedUser;
}
// PATCH /users/:id
export async function toggleUserStatus(id) {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PATCH'
    });
    if (!res.ok) {
        throw new Error('Erro ao alternar status do user');
    }
    let updatedUser = {};
    let apiResponse = null;
    apiResponse = await res.json();
    updatedUser = apiResponse;
    return updatedUser;
}
// DELETE /users/:id
export async function deleteUser(id) {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        throw new Error('Erro ao apagar user');
    }
}
// GET /users/stats
export async function getUserStats() {
    const res = await fetch(`${BASE_URL}/users/stats`);
    if (!res.ok) {
        throw new Error('Erro ao buscar estatisticas de users');
    }
    let stats = {};
    let apiResponse = null;
    apiResponse = await res.json();
    stats = apiResponse;
    return stats;
}
// GET /users/:id/tasks
export async function getUserTasks(id) {
    const res = await fetch(`${BASE_URL}/users/${id}/tasks`);
    if (!res.ok) {
        throw new Error('Erro ao buscar tasks do user');
    }
    const tasks = [];
    let apiResponse = [];
    apiResponse = await res.json();
    apiResponse.forEach((item) => {
        tasks.push(item);
    });
    return tasks;
}
//# sourceMappingURL=apiUserService.js.map