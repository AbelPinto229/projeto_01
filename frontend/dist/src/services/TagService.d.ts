import type { Tag } from '../models/Tag.js';
export declare class TagService {
    private tags;
    private nextId;
    getTags(): Promise<Tag[]>;
    createTag(nome: string): Promise<Tag>;
    getTagTasks(id: number): Promise<any[]>;
    deleteTag(id: number): Promise<void>;
}
//# sourceMappingURL=TagService.d.ts.map