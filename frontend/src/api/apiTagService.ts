import type { Tag } from '../models/Tag.js';
import type { Task } from '../models/Task.js';

const BASE_URL = 'http://localhost:3000';

// vai buscar todas as tags
export async function getTags(): Promise<Tag[]> {
  const res = await fetch(`${BASE_URL}/tags`);
  if (!res.ok) throw new Error('Erro ao buscar tags');
  return res.json() as Promise<Tag[]>;
}

// cria uma nova tag
export async function createTag(tag: Tag): Promise<Tag> {
  const res = await fetch(`${BASE_URL}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tag)
  });
  if (!res.ok) throw new Error('Erro ao criar tag');
  return res.json() as Promise<Tag>;
}

// apaga uma tag pelo id
export async function deleteTag(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/tags/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    throw new Error('Erro ao apagar tag');
  }
}

// vai buscar as tarefas associadas a uma tag
export async function getTasksForTag(id: number): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/tags/${id}/tasks`);
  if (!res.ok) throw new Error('Erro ao buscar tasks da tag');
  return res.json() as Promise<Task[]>;
}
