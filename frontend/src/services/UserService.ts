import type { User, UserStats } from '../models/User.js';
import { getUsers as apiGetUsers, createUser as apiCreateUser, updateUser as apiUpdateUser, toggleUserStatus as apiToggleUserStatus, deleteUser as apiDeleteUser } from '../api/apiUserService.js';

export class UserService {
  private users: User[] = [];

  // carrega os utilizadores da api
  async loadUsers(search?: string, sort?: 'asc' | 'desc'): Promise<User[]> {
    return this.getUsers(search, sort);
  }

  // devolve todos os utilizadores com filtros opcionais
  async getUsers(search?: string, sort?: 'asc' | 'desc'): Promise<User[]> {
    this.users = await apiGetUsers();
    let filtered = [...this.users];

    if (search) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === 'asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filtered;
  }

  // devolve estatísticas dos utilizadores
  getUserStats(): UserStats {
    const total = this.users.length;
    const active = this.users.filter(u => u.active).length;
    const inactive = total - active;
    const percentage = total === 0 ? 0 : Math.round((active / total) * 100);

    return {
      total,
      active,
      inactive,
      percentage
    };
  }

  // cria um novo utilizador
  async createUser(user: User): Promise<void> {
    await apiCreateUser(user);
    await this.loadUsers();
  }

  // devolve um utilizador específico
  getUser(id: number): User {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new Error('Utilizador não encontrado');
    return user;
  }

  // atualiza um utilizador
  async updateUser(user: User): Promise<void> {
    await apiUpdateUser(user.id, user);
    await this.loadUsers();
  }

  // alterna o estado ativo do utilizador
  async toggleUserStatus(id: number): Promise<void> {
    await apiToggleUserStatus(id);
    await this.loadUsers();
  }

  // apaga um utilizador
  async deleteUser(id: number): Promise<void> {
    await apiDeleteUser(id);
    await this.loadUsers();
  }

}
