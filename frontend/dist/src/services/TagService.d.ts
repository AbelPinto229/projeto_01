import type { Tag } from '../models/Tag.js';
export declare class TagService {
    private tags;
    loadTags(): Promise<Tag[]>;
    getTags(): Promise<Tag[]>;
    createTag(tag: Tag): Promise<void>;
    deleteTag(id: number): Promise<void>;
}
//# sourceMappingURL=TagService.d.ts.map