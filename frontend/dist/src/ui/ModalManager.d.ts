import type { Task } from '../models/Task.js';
import type { User } from '../models/User.js';
interface OpenUserModalOptions {
    userId?: number;
    users: User[];
    canEditData: boolean;
}
interface OpenTaskModalOptions {
    taskId?: number;
    tasks: Task[];
    canEditData: boolean;
}
export declare function openUserModal(options: OpenUserModalOptions): void;
export declare function closeUserModal(): void;
export declare function openTaskModal(options: OpenTaskModalOptions): void;
export declare function closeTaskModal(): void;
export declare function setupModalBackdropHandlers(): void;
export {};
//# sourceMappingURL=ModalManager.d.ts.map