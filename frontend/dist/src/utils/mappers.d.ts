import type { Task as ApiTask } from '../models/Task.js';
import type { User as ApiUser } from '../models/User.js';
import type { Tag as ApiTag } from '../models/Tag.js';
import type { Task, User, Tag } from '../ui/AppUiTypes.js';
export declare function getTagColor(name: string): string;
export declare function toUiTask(task: ApiTask): Task;
export declare function toApiTask(task: Task): ApiTask;
export declare function toUiUser(user: ApiUser): User;
export declare function toApiUser(user: User): ApiUser;
export declare function toUiTag(tag: ApiTag): Tag;
export declare function toApiTag(tag: Tag): ApiTag;
//# sourceMappingURL=mappers.d.ts.map