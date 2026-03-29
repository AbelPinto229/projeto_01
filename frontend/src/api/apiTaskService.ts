import type { Task } from '../models/Task.js';
import type { TaskStats } from '../models/Task.js';

const BASE_URL = 'http://localhost:3000';

// vai buscar todas as tarefas
export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/tasks`);
  if (!res.ok) throw new Error('Erro ao buscar tasks');
  return res.json() as Promise<Task[]>;
}

// atualiza uma tarefa pelo id
export async function updateTask(id: number, task: Task): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  if (!res.ok) throw new Error('Erro ao atualizar task');
  return res.json() as Promise<Task>;
}

// cria uma nova tarefa
export async function createTask(task: Task): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  if (!res.ok) throw new Error('Erro ao criar task');
  return res.json() as Promise<Task>;
}

// apaga uma tarefa pelo id
export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    throw new Error('Erro ao apagar task');
  }
}

// vai buscar estatísticas das tarefas
export async function getTaskStats(): Promise<TaskStats> {
  const res = await fetch(`${BASE_URL}/tasks/stats`);
  if (!res.ok) throw new Error('Erro ao buscar estatisticas de tasks');
  return res.json() as Promise<TaskStats>;
}

// adiciona uma tag a uma tarefa
export async function addTagToTask(taskId: number, tagId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tagId })
  });
  if (!res.ok) throw new Error('Erro ao adicionar tag na task');
}

// remove uma tag de uma tarefa
export async function removeTagFromTask(taskId: number, tagId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}/tags/${tagId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Erro ao remover tag da task');
}
