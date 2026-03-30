import { UserService } from './src/services/UserService.js';
import { TaskService } from './src/services/TaskService.js';
import { TagService } from './src/services/TagService.js';
declare global {
    interface Window {
        roleManager: any;
        userService: UserService;
        taskService: TaskService;
        tagService: TagService;
        systemLogger: any;
        setRole: (role: string) => void;
        openUserModal: (userId?: number) => void;
        closeUserModal: () => void;
        openTaskModal: (taskId?: number) => void;
        closeTaskModal: () => void;
    }
}
//# sourceMappingURL=main.d.ts.map