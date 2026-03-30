import type { Comment } from '../models/Comment.js';
import {
  getCommentsByTask as apiGetCommentsByTask,
  createComment as apiCreateComment,
  updateComment as apiUpdateComment,
  deleteComment as apiDeleteComment
} from '../api/apiCommentService.js';

export class CommentService {
  private commentsByTask: Record<number, Comment[]> = {};

  // devolve os comentários de uma tarefa
  async getCommentsByTask(taskId: number): Promise<Comment[]> {
    this.commentsByTask[taskId] = await apiGetCommentsByTask(taskId);
    return [...this.commentsByTask[taskId]];
  }

  // cria um comentário e atualiza a lista em memória
  async createComment(taskId: number, userId: number, conteudo: string): Promise<void> {
    await apiCreateComment(taskId, userId, conteudo);
    await this.getCommentsByTask(taskId);
  }

  // atualiza um comentário e volta a carregar a lista
  async updateComment(taskId: number, commentId: number, conteudo: string): Promise<void> {
    await apiUpdateComment(taskId, commentId, conteudo);
    await this.getCommentsByTask(taskId);
  }

  // apaga um comentário e volta a carregar a lista
  async deleteComment(taskId: number, commentId: number): Promise<void> {
    await apiDeleteComment(taskId, commentId);
    await this.getCommentsByTask(taskId);
  }
}
