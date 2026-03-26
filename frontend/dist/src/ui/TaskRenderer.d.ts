import type { Task } from '../models/Task.js';
export declare class TaskRenderer {
    private taskService;
    constructor();
    private renderTags;
    private createActionButton;
    renderTaskRow(task: Task): HTMLTableRowElement;
    renderTasksList(container: HTMLElement): void;
}
//# sourceMappingURL=TaskRenderer.d.ts.map