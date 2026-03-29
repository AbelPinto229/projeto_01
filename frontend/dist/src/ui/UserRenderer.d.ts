import type { User } from '../models/User.js';
export declare class UserRenderer {
    private userService;
    constructor();
    private createActionButton;
    renderUserRow(user: User): HTMLTableRowElement;
    renderUsersList(container: HTMLElement): Promise<void>;
}
//# sourceMappingURL=UserRenderer.d.ts.map