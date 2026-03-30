import type { Tag } from '../models/Tag.js';
import type { Task } from '../models/Task.js';

const BASE_URL = 'http://localhost:3000';

// vai buscar todas as tags
export async function getTags(): Promise<Tag[]> {
  const res = await fetch(`${BASE_URL}/tags`);
  if (!res.ok) throw new Error('Erro ao buscar tags');

  const data = (await res.json()) as Tag[];
  return data.map((item) => ({
    id: item.id,
    nome: item.nome,
    created_at: item.created_at
  }));
}

// cria uma nova tag
export async function createTag(tag: Tag): Promise<Tag> {
  const res = await fetch(`${BASE_URL}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tag)
  });
  if (!res.ok) throw new Error('Erro ao criar tag');

  const data = (await res.json()) as Tag;
  const newTag: Tag = {
    id: data.id,
    nome: data.nome,
    created_at: data.created_at
  };

  return newTag;
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

  const data = (await res.json()) as Task[];
  return data.map((item) => ({
    id: item.id,
    titulo: item.titulo,
    categoria: item.categoria,
    estado: item.estado,
    concluida: item.concluida,
    responsavelNome: item.responsavelNome,
    dataConclusao: item.dataConclusao,
    created_at: item.created_at,
    tags: item.tags,
    tagIds: item.tagIds
  }));
}
