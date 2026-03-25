import { UserService } from './src/services/UserService.js';
import { TaskService } from './src/services/TaskService.js';
import { CommentService } from './src/services/CommentService.js';
import { TagService } from './src/services/TagService.js';
import { UserRenderer } from './src/ui/UserRenderer.js';
import { TaskRenderer } from './src/ui/TaskRenderer.js';
interface AppState {
    userService: UserService;
    taskService: TaskService;
    commentService: CommentService;
    tagService: TagService;
    userRenderer: UserRenderer;
    taskRenderer: TaskRenderer;
}
declare global {
    interface Window {
        app: AppState;
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
export {};
//# sourceMappingURL=main.d.ts.map