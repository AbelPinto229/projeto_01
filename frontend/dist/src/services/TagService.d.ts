import type { Tag } from '../models/Tag.js';
export declare class TagService {
    private tags;
    private nextId;
    getTags(): Tag[];
    createTag(nome: string): Tag;
    getTagTasks(id: number): any[];
    deleteTag(id: number): void;
}
//# sourceMappingURL=TagService.d.ts.map