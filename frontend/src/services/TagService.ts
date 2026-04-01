import type { Tag } from '../models/Tag.js';
import { getTags as apiGetTags, createTag as apiCreateTag, deleteTag as apiDeleteTag } from '../api/apiTagService.js';

export class TagService {
  private tags: Tag[] = [];

  // devolve todas as tags
  async getTags(): Promise<Tag[]> {
    this.tags = await apiGetTags();
    return [...this.tags];
  }

  // cria uma nova tag
  async createTag(tag: Tag) {
    await apiCreateTag(tag);

    await this.getTags();
  }

  // apaga uma tag
  async deleteTag(id: number) {
    await apiDeleteTag(id);

    await this.getTags();
  }
}
