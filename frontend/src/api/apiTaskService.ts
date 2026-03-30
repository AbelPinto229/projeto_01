import type { Task } from '../models/Task.js';
import type { TaskStats } from '../models/Task.js';

const BASE_URL = 'http://localhost:3000';

// vai buscar todas as tarefas
export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/tasks`);
  if (!res.ok) throw new Error('Erro ao buscar tasks');

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

// atualiza uma tarefa pelo id
export async function updateTask(id: number, task: Task): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  if (!res.ok) throw new Error('Erro ao atualizar task');

  const data = (await res.json()) as Task;
  const newTask: Task = {
    id: data.id,
    titulo: data.titulo,
    categoria: data.categoria,
    estado: data.estado,
    concluida: data.concluida,
    responsavelNome: data.responsavelNome,
    dataConclusao: data.dataConclusao,
    created_at: data.created_at,
    tags: data.tags,
    tagIds: data.tagIds
  };

  return newTask;
}

// cria uma nova tarefa
export async function createTask(task: Task): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  if (!res.ok) throw new Error('Erro ao criar task');

  const data = (await res.json()) as Task;
  const newTask: Task = {
    id: data.id,
    titulo: data.titulo,
    categoria: data.categoria,
    estado: data.estado,
    concluida: data.concluida,
    responsavelNome: data.responsavelNome,
    dataConclusao: data.dataConclusao,
    created_at: data.created_at,
    tags: data.tags,
    tagIds: data.tagIds
  };

  return newTask;
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

  const data = (await res.json()) as TaskStats;
  const stats: TaskStats = {
    total: data.total,
    concluidas: data.concluidas,
    pendentes: data.pendentes,
    percentagem: data.percentagem
  };

  return stats;
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
