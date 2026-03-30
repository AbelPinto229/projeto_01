import { getCommentsByTask as apiGetCommentsByTask, createComment as apiCreateComment, updateComment as apiUpdateComment, deleteComment as apiDeleteComment } from '../api/apiCommentService.js';
export class CommentService {
    constructor() {
        this.commentsByTask = {};
    }
    // devolve os comentários de uma tarefa
    async getCommentsByTask(taskId) {
        this.commentsByTask[taskId] = await apiGetCommentsByTask(taskId);
        return [...this.commentsByTask[taskId]];
    }
    // cria um comentário e atualiza a lista em memória
    async createComment(taskId, userId, conteudo) {
        await apiCreateComment(taskId, userId, conteudo);
        await this.getCommentsByTask(taskId);
    }
    // atualiza um comentário e volta a carregar a lista
    async updateComment(taskId, commentId, conteudo) {
        await apiUpdateComment(taskId, commentId, conteudo);
        await this.getCommentsByTask(taskId);
    }
    // apaga um comentário e volta a carregar a lista
    async deleteComment(taskId, commentId) {
        await apiDeleteComment(taskId, commentId);
        await this.getCommentsByTask(taskId);
    }
}
//# sourceMappingURL=CommentService.js.map