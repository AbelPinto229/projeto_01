const BASE_URL = 'http://localhost:3000';
// vai buscar todas as tags
export async function getTags() {
    const res = await fetch(`${BASE_URL}/tags`);
    if (!res.ok)
        throw new Error('Erro ao buscar tags');
    return res.json();
}
// cria uma nova tag
export async function createTag(tag) {
    const res = await fetch(`${BASE_URL}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tag)
    });
    if (!res.ok)
        throw new Error('Erro ao criar tag');
    return res.json();
}
// apaga uma tag pelo id
export async function deleteTag(id) {
    const res = await fetch(`${BASE_URL}/tags/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        throw new Error('Erro ao apagar tag');
    }
}
// vai buscar as tarefas associadas a uma tag
export async function getTasksForTag(id) {
    const res = await fetch(`${BASE_URL}/tags/${id}/tasks`);
    if (!res.ok)
        throw new Error('Erro ao buscar tasks da tag');
    return res.json();
}
//# sourceMappingURL=apiTagService.js.map