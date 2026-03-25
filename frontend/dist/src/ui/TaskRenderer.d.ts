import type { Task } from '../models/Task.js';
export declare class TaskRenderer {
    private taskService;
    constructor();
    private renderTags;
    renderTaskRow(task: Task): string;
    renderTasksList(container: HTMLElement): Promise<void>;
}
//# sourceMappingURL=TaskRenderer.d.ts.map