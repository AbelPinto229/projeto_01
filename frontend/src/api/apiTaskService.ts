import type { Task } from '../models/Task.js';
import type { TaskStats } from '../models/Task.js';

const BASE_URL = 'http://localhost:3000';

// GET /tasks
export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/tasks`);

  if (!res.ok) {
    throw new Error('Erro ao buscar tasks');
  }

  const tasks: Task[] = [];
  let apiResponse: unknown[] = [];
  apiResponse = await res.json();

  apiResponse.forEach((item) => {
    tasks.push(item as Task);
  });

  return tasks;
}

// PUT /tasks/:id
export async function updateTask(id: number, task: Task): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });

  if (!res.ok) {
    throw new Error('Erro ao atualizar task');
  }

  let updatedTask: Task = {} as Task;
  let apiResponse: unknown = null;
  apiResponse = await res.json();

  updatedTask = apiResponse as Task;

  return updatedTask;
}

// POST /tasks
export async function createTask(task: Task): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });

  if (!res.ok) {
    throw new Error('Erro ao criar task');
  }

  let createdTask: Task = {} as Task;
  let apiResponse: unknown = null;
  apiResponse = await res.json();

  createdTask = apiResponse as Task;

  return createdTask;
}

// DELETE /tasks/:id
export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    throw new Error('Erro ao apagar task');
  }
}

// GET /tasks/stats
export async function getTaskStats(): Promise<TaskStats> {
  const res = await fetch(`${BASE_URL}/tasks/stats`);

  if (!res.ok) {
    throw new Error('Erro ao buscar estatisticas de tasks');
  }

  let stats: TaskStats = {} as TaskStats;
  let apiResponse: unknown = null;
  apiResponse = await res.json();

  stats = apiResponse as TaskStats;

  return stats;
}

// POST /tasks/:id/tags
export async function addTagToTask(taskId: number, tagId: number): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tagId })
  });

  if (!res.ok) {
    throw new Error('Erro ao adicionar tag na task');
  }

  let apiResponse: unknown = null;
  apiResponse = await res.json();

  return apiResponse;
}
