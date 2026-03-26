import type { Tag } from '../models/Tag.js';
import type { Task } from '../models/Task.js';

const BASE_URL = 'http://localhost:3000';

// GET /tags
export async function getTags(): Promise<Tag[]> {
  const res = await fetch(`${BASE_URL}/tags`);

  if (!res.ok) {
    throw new Error('Erro ao buscar tags');
  }

  const tags: Tag[] = [];
  let apiResponse: unknown[] = [];
  apiResponse = await res.json();

  apiResponse.forEach((item) => {
    tags.push(item as Tag);
  });

  return tags;
}

// POST /tags
export async function createTag(tag: Tag): Promise<Tag> {
  const res = await fetch(`${BASE_URL}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tag)
  });

  if (!res.ok) {
    throw new Error('Erro ao criar tag');
  }

  let createdTag: Tag = {} as Tag;
  let apiResponse: unknown = null;
  apiResponse = await res.json();

  createdTag = apiResponse as Tag;

  return createdTag;
}

// DELETE /tags/:id
export async function deleteTag(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/tags/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    throw new Error('Erro ao apagar tag');
  }
}

// GET /tags/:id/tasks
export async function getTasksForTag(id: number): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/tags/${id}/tasks`);

  if (!res.ok) {
    throw new Error('Erro ao buscar tasks da tag');
  }

  const tasks: Task[] = [];
  let apiResponse: unknown[] = [];
  apiResponse = await res.json();

  apiResponse.forEach((item) => {
    tasks.push(item as Task);
  });

  return tasks;
}
