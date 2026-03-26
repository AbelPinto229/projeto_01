import type { User, UserStats } from '../models/User.js';

// FAKE DATA
const fakeUsers: User[] = [
  { id: 1, name: 'João Silva', email: 'joao@example.com', active: true, created_at: '2024-01-15' },
  { id: 2, name: 'Maria Santos', email: 'maria@example.com', active: true, created_at: '2024-01-20' },
  { id: 3, name: 'Pedro Oliveira', email: 'pedro@example.com', active: false, created_at: '2024-02-01' },
  { id: 4, name: 'Ana Costa', email: 'ana@example.com', active: true, created_at: '2024-02-10' },
  { id: 5, name: 'Carlos Mendes', email: 'carlos@example.com', active: true, created_at: '2024-02-15' },
  { id: 6, name: 'Sofia Pereira', email: 'sofia@example.com', active: false, created_at: '2024-03-01' },
  { id: 7, name: 'Miguel Ferreira', email: 'miguel@example.com', active: true, created_at: '2024-03-05' },
  { id: 8, name: 'Beatriz Gomes', email: 'beatriz@example.com', active: true, created_at: '2024-03-10' }
];

export class UserService {
  private users: User[] = [...fakeUsers];
  private nextId: number = 9;

  // Get all users with optional filters
  getUsers(search?: string, sort?: 'asc' | 'desc'): User[] {
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

  // Get user statistics
  getUserStats(): UserStats {
    const total = this.users.length;
    const active = this.users.filter(u => u.active).length;
    const inactive = total - active;
    const percentage = Math.round((active / total) * 100);

    return {
      total,
      active,
      inactive,
      percentage
    };
  }

  // Create new user
  createUser(name: string, email: string): User {
    const newUser: User = {
      id: this.nextId++,
      name,
      email,
      active: true,
      created_at: new Date().toISOString().split('T')[0]
    };

    this.users.push(newUser);
    return newUser;
  }

  // Get specific user
  getUser(id: number): User {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new Error('Utilizador não encontrado');
    return user;
  }

  // Update user
  updateUser(id: number, name: string, email: string): User {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new Error('Utilizador não encontrado');

    user.name = name;
    user.email = email;
    return user;
  }

  // Toggle user active status
  toggleUserStatus(id: number): User {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new Error('Utilizador não encontrado');

    user.active = !user.active;
    return user;
  }

  // Delete user
  deleteUser(id: number): void {
    this.users = this.users.filter(u => u.id !== id);
  }

  // Get user tasks
  getUserTasks(id: number): any[] {
    // Mock: return tasks assigned to this user
    return [];
  }
}
