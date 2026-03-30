import type { User, UserStats } from '../models/User.js';
export declare class UserService {
    private users;
    getUsers(search?: string, sort?: 'asc' | 'desc'): Promise<User[]>;
    getUserStats(): UserStats;
    createUser(user: User): Promise<void>;
    getUser(id: number): User;
    updateUser(user: User): Promise<void>;
    toggleUserStatus(id: number): Promise<void>;
    deleteUser(id: number): Promise<void>;
}
//# sourceMappingURL=UserService.d.ts.map