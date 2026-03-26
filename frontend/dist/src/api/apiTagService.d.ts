import type { Tag } from '../models/Tag.js';
import type { Task } from '../models/Task.js';
export declare function getTags(): Promise<Tag[]>;
export declare function createTag(tag: Tag): Promise<Tag>;
export declare function deleteTag(id: number): Promise<void>;
export declare function getTasksForTag(id: number): Promise<Task[]>;
//# sourceMappingURL=apiTagService.d.ts.map