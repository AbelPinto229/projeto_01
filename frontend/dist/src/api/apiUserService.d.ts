import type { User } from '../models/User.js';
import type { UserStats } from '../models/User.js';
import type { Task } from '../models/Task.js';
export declare function getUsers(): Promise<User[]>;
export declare function createUser(user: User): Promise<User>;
export declare function updateUser(id: number, user: User): Promise<User>;
export declare function toggleUserStatus(id: number): Promise<User>;
export declare function deleteUser(id: number): Promise<void>;
export declare function getUserStats(): Promise<UserStats>;
export declare function getUserTasks(id: number): Promise<Task[]>;
//# sourceMappingURL=apiUserService.d.ts.map