import type { User } from '../models/User.js';
export declare class UserRenderer {
    private userService;
    constructor();
    renderUserRow(user: User): string;
    renderUsersList(container: HTMLElement): Promise<void>;
}
//# sourceMappingURL=UserRenderer.d.ts.map