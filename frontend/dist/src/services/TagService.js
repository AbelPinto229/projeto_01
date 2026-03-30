import { getTags as apiGetTags, createTag as apiCreateTag, deleteTag as apiDeleteTag } from '../api/apiTagService.js';
export class TagService {
    constructor() {
        this.tags = [];
    }
    // devolve todas as tags
    async getTags() {
        this.tags = await apiGetTags();
        return [...this.tags];
    }
    // cria uma nova tag
    async createTag(tag) {
        await apiCreateTag(tag);
        await this.getTags();
    }
    // apaga uma tag
    async deleteTag(id) {
        await apiDeleteTag(id);
        await this.getTags();
    }
}
//# sourceMappingURL=TagService.js.map