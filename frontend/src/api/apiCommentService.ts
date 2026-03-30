import type { Comment } from '../models/Comment.js';

const BASE_URL = 'http://localhost:3000';

// vai buscar os comentários de uma tarefa
export async function getCommentsByTask(taskId: number): Promise<Comment[]> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/comments`);
  if (!res.ok) throw new Error('Erro ao buscar comentarios da task');

  const data = (await res.json()) as Comment[];
  return data.map((item) => {
    const comment: Comment = {
      id: item.id,
      task_id: item.task_id,
      user_id: item.user_id,
      conteudo: item.conteudo,
      dataCriacao: item.dataCriacao
    };

    return comment;
  });
}

// cria um comentário numa tarefa
export async function createComment(taskId: number, userId: number, conteudo: string): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, conteudo })
  });
  if (!res.ok) throw new Error('Erro ao criar comentario');

  const data = (await res.json()) as Comment;
  const newComment: Comment = {
    id: data.id,
    task_id: data.task_id,
    user_id: data.user_id,
    conteudo: data.conteudo,
    dataCriacao: data.dataCriacao
  };

  return newComment;
}

// atualiza um comentário de uma tarefa
export async function updateComment(taskId: number, commentId: number, conteudo: string): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/comments/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conteudo })
  });
  if (!res.ok) throw new Error('Erro ao atualizar comentario');

  const data = (await res.json()) as Comment;
  const newComment: Comment = {
    id: data.id,
    task_id: data.task_id,
    user_id: data.user_id,
    conteudo: data.conteudo,
    dataCriacao: data.dataCriacao
  };

  return newComment;

}

// apaga um comentário de uma tarefa
export async function deleteComment(taskId: number, commentId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/comments/${commentId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Erro ao apagar comentario');
}