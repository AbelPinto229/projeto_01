import type { User, UserStats } from '../models/User.js';
export declare class UserService {
    private users;
    private nextId;
    getUsers(search?: string, sort?: 'asc' | 'desc'): User[];
    getUserStats(): UserStats;
    createUser(name: string, email: string): User;
    getUser(id: number): User;
    updateUser(id: number, name: string, email: string): User;
    toggleUserStatus(id: number): User;
    deleteUser(id: number): void;
    getUserTasks(id: number): any[];
}
//# sourceMappingURL=UserService.d.ts.map