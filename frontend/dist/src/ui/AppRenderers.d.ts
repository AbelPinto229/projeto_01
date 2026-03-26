import type { Task, Tag, User } from './AppUiTypes.js';
type UserFilter = 'all' | 'active' | 'inactive';
type TaskFilter = 'all' | 'pending' | 'in-progress' | 'completed';
interface RenderUsersParams {
    users: User[];
    currentUserFilter: UserFilter;
    canEditData: boolean;
    onEditUser: (id: number) => void;
}
interface RenderTasksParams {
    tasks: Task[];
    currentTaskFilter: TaskFilter;
    taskSearchTerm: string;
    canEditData: boolean;
    onEditTask: (id: number) => void;
}
export declare function updateUserFilterButtonsUI(currentUserFilter: UserFilter): void;
export declare function updateTaskFilterButtonsUI(currentTaskFilter: TaskFilter): void;
export declare function renderUsers(params: RenderUsersParams): void;
export declare function renderTasks(params: RenderTasksParams): void;
export declare function populateTaskTagsDropdown(tags: Tag[]): void;
export declare function renderTags(tags: Tag[]): void;
export {};
//# sourceMappingURL=AppRenderers.d.ts.map