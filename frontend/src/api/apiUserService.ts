import type { User } from '../models/User.js';
import type { UserStats } from '../models/User.js';
import type { Task } from '../models/Task.js';

const BASE_URL = 'http://localhost:3000';

// vai buscar todos os utilizadores
export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error('Erro ao buscar users');
  return res.json() as Promise<User[]>;
}

// cria um novo utilizador
export async function createUser(user: User): Promise<User> {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  if (!res.ok) throw new Error('Erro ao criar user');
  return res.json() as Promise<User>;
}

// atualiza um utilizador pelo id
export async function updateUser(id: number, user: User): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  if (!res.ok) throw new Error('Erro ao atualizar user');
  return res.json() as Promise<User>;
}

// alterna o estado do utilizador
export async function toggleUserStatus(id: number): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${id}`, { method: 'PATCH' });
  if (!res.ok) throw new Error('Erro ao alternar status do user');
  return res.json() as Promise<User>;
}

// apaga um utilizador pelo id
export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    throw new Error('Erro ao apagar user');
  }
}

// vai buscar estatísticas dos utilizadores
export async function getUserStats(): Promise<UserStats> {
  const res = await fetch(`${BASE_URL}/users/stats`);
  if (!res.ok) throw new Error('Erro ao buscar estatisticas de users');
  return res.json() as Promise<UserStats>;
}

// vai buscar as tarefas de um utilizador
export async function getUserTasks(id: number): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/users/${id}/tasks`);
  if (!res.ok) throw new Error('Erro ao buscar tasks do user');
  return res.json() as Promise<Task[]>;
}
