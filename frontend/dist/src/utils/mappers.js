export function getTagColor(name) {
    const palette = ['#ff6b6b', '#ff8787', '#4c6ef5', '#15aabf', '#ffd43b', '#a78bfa', '#ff922b', '#63e6be', '#ffb3ba', '#ff8fab'];
    let hash = 0;
    for (let i = 0; i < name.length; i += 1) {
        hash = (hash << 5) - hash + name.charCodeAt(i);
        hash |= 0;
    }
    return palette[Math.abs(hash) % palette.length];
}
export function toUiTask(task) {
    return {
        id: task.id,
        title: task.titulo,
        category: task.categoria,
        responsible: task.responsavelNome,
        tags: [],
        status: task.concluida ? 'completed' : 'pending',
        createdAt: task.created_at
    };
}
export function toApiTask(task) {
    return {
        id: task.id,
        titulo: task.title,
        categoria: task.category,
        concluida: task.status === 'completed',
        responsavelNome: task.responsible,
        dataConclusao: task.status === 'completed' ? new Date().toISOString().split('T')[0] : null,
        created_at: task.createdAt
    };
}
export function toUiUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.active ? 'active' : 'inactive',
        createdAt: user.created_at
    };
}
export function toApiUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        active: user.status === 'active',
        created_at: user.createdAt
    };
}
export function toUiTag(tag) {
    const apiTag = tag;
    const tagName = apiTag.name ?? apiTag.nome ?? '';
    return {
        id: tag.id,
        name: tagName,
        color: getTagColor(tagName)
    };
}
export function toApiTag(tag) {
    const payload = {
        id: tag.id,
        nome: tag.name,
        name: tag.name,
        created_at: new Date().toISOString().split('T')[0]
    };
    return payload;
}
//# sourceMappingURL=mappers.js.map