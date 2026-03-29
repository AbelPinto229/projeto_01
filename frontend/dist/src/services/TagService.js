import { getTags as apiGetTags, createTag as apiCreateTag, deleteTag as apiDeleteTag } from '../api/apiTagService.js';
export class TagService {
    constructor() {
        this.tags = [];
    }
    // carrega as tags da api
    async loadTags() {
        return this.getTags();
    }
    // devolve todas as tags
    async getTags() {
        this.tags = await apiGetTags();
        return [...this.tags];
    }
    // cria uma nova tag
    async createTag(tag) {
        await apiCreateTag(tag);
        await this.loadTags();
    }
    // apaga uma tag
    async deleteTag(id) {
        await apiDeleteTag(id);
        await this.loadTags();
    }
}
//# sourceMappingURL=TagService.js.map