import type { User } from '../models/User.js';
import type { UserStats } from '../models/User.js';
import type { Task } from '../models/Task.js';

const BASE_URL = 'http://localhost:3000';

// GET /users
export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/users`);

  if (!res.ok) {
    throw new Error('Erro ao buscar users');
  }

  const users: User[] = [];
  let apiResponse: unknown[] = [];
  apiResponse = await res.json();

  apiResponse.forEach((item) => {
    users.push(item as User);
  });

  return users;
}

// POST /users
export async function createUser(user: User): Promise<User> {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

  if (!res.ok) {
    throw new Error('Erro ao criar user');
  }

  let createdUser: User = {} as User;
  let apiResponse: unknown = null;
  apiResponse = await res.json();

  createdUser = apiResponse as User;

  return createdUser;
}

// PUT /users/:id
export async function updateUser(id: number, user: User): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

  if (!res.ok) {
    throw new Error('Erro ao atualizar user');
  }

  let updatedUser: User = {} as User;
  let apiResponse: unknown = null;
  apiResponse = await res.json();

  updatedUser = apiResponse as User;

  return updatedUser;
}

// PATCH /users/:id
export async function toggleUserStatus(id: number): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PATCH'
  });

  if (!res.ok) {
    throw new Error('Erro ao alternar status do user');
  }

  let updatedUser: User = {} as User;
  let apiResponse: unknown = null;
  apiResponse = await res.json();

  updatedUser = apiResponse as User;

  return updatedUser;
}

// DELETE /users/:id
export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    throw new Error('Erro ao apagar user');
  }
}

// GET /users/stats
export async function getUserStats(): Promise<UserStats> {
  const res = await fetch(`${BASE_URL}/users/stats`);

  if (!res.ok) {
    throw new Error('Erro ao buscar estatisticas de users');
  }

  let stats: UserStats = {} as UserStats;
  let apiResponse: unknown = null;
  apiResponse = await res.json();

  stats = apiResponse as UserStats;

  return stats;
}

// GET /users/:id/tasks
export async function getUserTasks(id: number): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/users/${id}/tasks`);

  if (!res.ok) {
    throw new Error('Erro ao buscar tasks do user');
  }

  const tasks: Task[] = [];
  let apiResponse: unknown[] = [];
  apiResponse = await res.json();

  apiResponse.forEach((item) => {
    tasks.push(item as Task);
  });

  return tasks;
}
