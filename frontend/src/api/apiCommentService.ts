import type { Comment } from '../models/Comment.js';

const BASE_URL = 'http://localhost:3000';

// vai buscar os comentários de uma tarefa
export async function getCommentsByTask(taskId: number): Promise<Comment[]> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/comments`);
  if (!res.ok) throw new Error('Erro ao buscar comentarios da task');
  return res.json() as Promise<Comment[]>;
}

// cria um comentário numa tarefa
export async function createComment(taskId: number, userId: number, conteudo: string): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, conteudo })
  });
  if (!res.ok) throw new Error('Erro ao criar comentario');
  return res.json() as Promise<Comment>;
}

// atualiza um comentário de uma tarefa
export async function updateComment(taskId: number, commentId: number, conteudo: string): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/comments/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conteudo })
  });
  if (!res.ok) throw new Error('Erro ao atualizar comentario');
  return res.json() as Promise<Comment>;
}

// apaga um comentário de uma tarefa
export async function deleteComment(taskId: number, commentId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/comments/${commentId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Erro ao apagar comentario');
}