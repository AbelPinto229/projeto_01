const BASE_URL = 'http://localhost:3000';
// GET /tags
export async function getTags() {
    const res = await fetch(`${BASE_URL}/tags`);
    if (!res.ok) {
        throw new Error('Erro ao buscar tags');
    }
    const tags = [];
    let apiResponse = [];
    apiResponse = await res.json();
    apiResponse.forEach((item) => {
        tags.push(item);
    });
    return tags;
}
// POST /tags
export async function createTag(tag) {
    const res = await fetch(`${BASE_URL}/tags`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tag)
    });
    if (!res.ok) {
        throw new Error('Erro ao criar tag');
    }
    let createdTag = {};
    let apiResponse = null;
    apiResponse = await res.json();
    createdTag = apiResponse;
    return createdTag;
}
// DELETE /tags/:id
export async function deleteTag(id) {
    const res = await fetch(`${BASE_URL}/tags/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        throw new Error('Erro ao apagar tag');
    }
}
// GET /tags/:id/tasks
export async function getTasksForTag(id) {
    const res = await fetch(`${BASE_URL}/tags/${id}/tasks`);
    if (!res.ok) {
        throw new Error('Erro ao buscar tasks da tag');
    }
    const tasks = [];
    let apiResponse = [];
    apiResponse = await res.json();
    apiResponse.forEach((item) => {
        tasks.push(item);
    });
    return tasks;
}
//# sourceMappingURL=apiTagService.js.map