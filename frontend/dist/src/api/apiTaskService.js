const BASE_URL = 'http://localhost:3000';
// GET /tasks
export async function getTasks() {
    const res = await fetch(`${BASE_URL}/tasks`);
    if (!res.ok) {
        throw new Error('Erro ao buscar tasks');
    }
    const tasks = [];
    let apiResponse = [];
    apiResponse = await res.json();
    apiResponse.forEach((item) => {
        tasks.push(item);
    });
    return tasks;
}
// PUT /tasks/:id
export async function updateTask(id, task) {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });
    if (!res.ok) {
        throw new Error('Erro ao atualizar task');
    }
    let updatedTask = {};
    let apiResponse = null;
    apiResponse = await res.json();
    updatedTask = apiResponse;
    return updatedTask;
}
// POST /tasks
export async function createTask(task) {
    const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });
    if (!res.ok) {
        throw new Error('Erro ao criar task');
    }
    let createdTask = {};
    let apiResponse = null;
    apiResponse = await res.json();
    createdTask = apiResponse;
    return createdTask;
}
// DELETE /tasks/:id
export async function deleteTask(id) {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        throw new Error('Erro ao apagar task');
    }
}
// GET /tasks/stats
export async function getTaskStats() {
    const res = await fetch(`${BASE_URL}/tasks/stats`);
    if (!res.ok) {
        throw new Error('Erro ao buscar estatisticas de tasks');
    }
    let stats = {};
    let apiResponse = null;
    apiResponse = await res.json();
    stats = apiResponse;
    return stats;
}
// POST /tasks/:id/tags
export async function addTagToTask(taskId, tagId) {
    const res = await fetch(`${BASE_URL}/tasks/${taskId}/tags`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tagId })
    });
    if (!res.ok) {
        throw new Error('Erro ao adicionar tag na task');
    }
    let apiResponse = null;
    apiResponse = await res.json();
    return apiResponse;
}
//# sourceMappingURL=apiTaskService.js.map