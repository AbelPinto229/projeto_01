import type { User, UserStats } from '../models/User.js';
export declare class UserService {
    private users;
    private nextId;
    getUsers(search?: string, sort?: 'asc' | 'desc'): Promise<User[]>;
    getUserStats(): Promise<UserStats>;
    createUser(name: string, email: string): Promise<User>;
    getUser(id: number): Promise<User>;
    updateUser(id: number, name: string, email: string): Promise<User>;
    toggleUserStatus(id: number): Promise<User>;
    deleteUser(id: number): Promise<void>;
    getUserTasks(id: number): Promise<any[]>;
}
//# sourceMappingURL=UserService.d.ts.map