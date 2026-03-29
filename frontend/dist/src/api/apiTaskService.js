const BASE_URL = 'http://localhost:3000';
// vai buscar todas as tarefas
export async function getTasks() {
    const res = await fetch(`${BASE_URL}/tasks`);
    if (!res.ok)
        throw new Error('Erro ao buscar tasks');
    return res.json();
}
// atualiza uma tarefa pelo id
export async function updateTask(id, task) {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });
    if (!res.ok)
        throw new Error('Erro ao atualizar task');
    return res.json();
}
// cria uma nova tarefa
export async function createTask(task) {
    const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });
    if (!res.ok)
        throw new Error('Erro ao criar task');
    return res.json();
}
// apaga uma tarefa pelo id
export async function deleteTask(id) {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        throw new Error('Erro ao apagar task');
    }
}
// vai buscar estatísticas das tarefas
export async function getTaskStats() {
    const res = await fetch(`${BASE_URL}/tasks/stats`);
    if (!res.ok)
        throw new Error('Erro ao buscar estatisticas de tasks');
    return res.json();
}
// adiciona uma tag a uma tarefa
export async function addTagToTask(taskId, tagId) {
    const res = await fetch(`${BASE_URL}/tasks/${taskId}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagId })
    });
    if (!res.ok)
        throw new Error('Erro ao adicionar tag na task');
}
// remove uma tag de uma tarefa
export async function removeTagFromTask(taskId, tagId) {
    const res = await fetch(`${BASE_URL}/tasks/${taskId}/tags/${tagId}`, {
        method: 'DELETE'
    });
    if (!res.ok)
        throw new Error('Erro ao remover tag da task');
}
//# sourceMappingURL=apiTaskService.js.map