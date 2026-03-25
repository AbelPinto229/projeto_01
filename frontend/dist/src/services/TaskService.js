// FAKE DATA
const fakeTasks = [
    { id: 1, titulo: 'Implementar autenticação', categoria: 'Backend', concluida: true, responsavelNome: 'João Silva', dataConclusao: '2024-02-15', created_at: '2024-01-15' },
    { id: 2, titulo: 'Desenhar UI do dashboard', categoria: 'Frontend', concluida: true, responsavelNome: 'Maria Santos', dataConclusao: '2024-02-20', created_at: '2024-01-20' },
    { id: 3, titulo: 'Testar API de utilizadores', categoria: 'QA', concluida: false, responsavelNome: 'Pedro Oliveira', dataConclusao: null, created_at: '2024-02-01' },
    { id: 4, titulo: 'Documentar endpoints', categoria: 'Documentação', concluida: false, responsavelNome: 'Ana Costa', dataConclusao: null, created_at: '2024-02-10' },
    { id: 5, titulo: 'Backup de base de dados', categoria: 'DevOps', concluida: true, responsavelNome: 'Carlos Mendes', dataConclusao: '2024-03-01', created_at: '2024-02-15' },
    { id: 6, titulo: 'Implementar sistema de notificações', categoria: 'Backend', concluida: false, responsavelNome: 'Sofia Pereira', dataConclusao: null, created_at: '2024-03-01' },
    { id: 7, titulo: 'Otimizar queries SQL', categoria: 'Database', concluida: true, responsavelNome: 'Miguel Ferreira', dataConclusao: '2024-03-05', created_at: '2024-02-20' },
    { id: 8, titulo: 'Criar testes unitários', categoria: 'QA', concluida: false, responsavelNome: 'Beatriz Gomes', dataConclusao: null, created_at: '2024-03-10' },
    { id: 9, titulo: 'Deploy em produção', categoria: 'DevOps', concluida: false, responsavelNome: 'João Silva', dataConclusao: null, created_at: '2024-03-12' }
];
export class TaskService {
    constructor() {
        this.tasks = [...fakeTasks];
        this.nextId = 10;
    }
    // Get all tasks with optional filters
    async getTasks(search, sort) {
        let filtered = [...this.tasks];
        if (search) {
            filtered = filtered.filter(t => t.titulo.toLowerCase().includes(search.toLowerCase()) ||
                t.categoria.toLowerCase().includes(search.toLowerCase()));
        }
        if (sort === 'asc') {
            filtered.sort((a, b) => a.titulo.localeCompare(b.titulo));
        }
        else if (sort === 'desc') {
            filtered.sort((a, b) => b.titulo.localeCompare(a.titulo));
        }
        return Promise.resolve(filtered);
    }
    // Get task statistics
    async getTaskStats() {
        const total = this.tasks.length;
        const concluidas = this.tasks.filter(t => t.concluida).length;
        const pendentes = total - concluidas;
        const percentagem = Math.round((concluidas / total) * 100);
        return Promise.resolve({
            total,
            concluidas,
            pendentes,
            percentagem
        });
    }
    // Create new task
    async createTask(titulo, categoria, responsavelNome) {
        const newTask = {
            id: this.nextId++,
            titulo,
            categoria,
            responsavelNome,
            concluida: false,
            dataConclusao: null,
            created_at: new Date().toISOString().split('T')[0]
        };
        this.tasks.push(newTask);
        return Promise.resolve(newTask);
    }
    // Get specific task
    async getTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task)
            throw new Error('Tarefa não encontrada');
        return Promise.resolve(task);
    }
    // Update task
    async updateTask(id, titulo, categoria, responsavelNome) {
        const task = this.tasks.find(t => t.id === id);
        if (!task)
            throw new Error('Tarefa não encontrada');
        task.titulo = titulo;
        task.categoria = categoria;
        task.responsavelNome = responsavelNome;
        return Promise.resolve(task);
    }
    // Toggle task completion status
    async toggleTaskStatus(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task)
            throw new Error('Tarefa não encontrada');
        task.concluida = !task.concluida;
        task.dataConclusao = task.concluida ? new Date().toISOString().split('T')[0] : null;
        return Promise.resolve(task);
    }
    // Delete task
    async deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        return Promise.resolve();
    }
    // Add tag to task (mock)
    async addTagToTask(taskId, tagId) {
        return Promise.resolve();
    }
    // Get task comments (mock)
    async getTaskComments(id) {
        return Promise.resolve([]);
    }
}
//# sourceMappingURL=TaskService.js.map