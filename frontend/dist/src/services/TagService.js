// FAKE DATA
const fakeTags = [
    { id: 1, nome: 'Urgente', created_at: '2024-01-10' },
    { id: 2, nome: 'Bug', created_at: '2024-01-15' },
    { id: 3, nome: 'Feature', created_at: '2024-01-20' },
    { id: 4, nome: 'Melhoria', created_at: '2024-02-01' },
    { id: 5, nome: 'Documentação', created_at: '2024-02-10' },
    { id: 6, nome: 'Em Revisão', created_at: '2024-02-15' },
    { id: 7, nome: 'Bloqueado', created_at: '2024-03-01' }
];
export class TagService {
    constructor() {
        this.tags = [...fakeTags];
        this.nextId = 8;
    }
    // Get all tags
    async getTags() {
        return Promise.resolve([...this.tags]);
    }
    // Create tag
    async createTag(nome) {
        const newTag = {
            id: this.nextId++,
            nome,
            created_at: new Date().toISOString().split('T')[0]
        };
        this.tags.push(newTag);
        return Promise.resolve(newTag);
    }
    // Get tag tasks (mock)
    async getTagTasks(id) {
        return Promise.resolve([]);
    }
    // Delete tag
    async deleteTag(id) {
        this.tags = this.tags.filter(t => t.id !== id);
        return Promise.resolve();
    }
}
//# sourceMappingURL=TagService.js.map