import { getTasks as apiGetTasks, createTask as apiCreateTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask, addTagToTask as apiAddTagToTask, removeTagFromTask as apiRemoveTagFromTask } from '../api/apiTaskService.js';
export class TaskService {
    constructor() {
        this.tasks = [];
    }
    // carrega as tarefas da api
    async loadTasks(search, sort) {
        return this.getTasks(search, sort);
    }
    // devolve todas as tarefas com filtros opcionais
    async getTasks(search, sort) {
        this.tasks = await apiGetTasks();
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
        return filtered;
    }
    // devolve estatísticas das tarefas
    getTaskStats() {
        const total = this.tasks.length;
        const concluidas = this.tasks.filter(t => t.concluida).length;
        const pendentes = total - concluidas;
        const percentagem = total === 0 ? 0 : Math.round((concluidas / total) * 100);
        return {
            total,
            concluidas,
            pendentes,
            percentagem
        };
    }
    // cria uma nova tarefa
    async createTask(task) {
        await apiCreateTask(task);
        await this.loadTasks();
    }
    // devolve uma tarefa específica
    getTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task)
            throw new Error('Tarefa não encontrada');
        return task;
    }
    // atualiza uma tarefa
    async updateTask(task) {
        await apiUpdateTask(task.id, task);
        await this.loadTasks();
    }
    // apaga uma tarefa
    async deleteTask(id) {
        await apiDeleteTask(id);
        await this.loadTasks();
    }
    async addTagToTask(taskId, tagId) {
        await apiAddTagToTask(taskId, tagId);
        await this.loadTasks();
    }
    async removeTagFromTask(taskId, tagId) {
        await apiRemoveTagFromTask(taskId, tagId);
        await this.loadTasks();
    }
}
//# sourceMappingURL=TaskService.js.map