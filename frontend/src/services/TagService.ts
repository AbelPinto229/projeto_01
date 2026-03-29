import type { Tag } from '../models/Tag.js';
import { getTags as apiGetTags, createTag as apiCreateTag, deleteTag as apiDeleteTag } from '../api/apiTagService.js';

export class TagService {
  private tags: Tag[] = [];

  // carrega as tags da api
  async loadTags(): Promise<Tag[]> {
    return this.getTags();
  }

  // devolve todas as tags
  async getTags(): Promise<Tag[]> {
    this.tags = await apiGetTags();
    return [...this.tags];
  }

  // cria uma nova tag
  async createTag(tag: Tag): Promise<void> {
    await apiCreateTag(tag);
    await this.loadTags();
  }

  // apaga uma tag
  async deleteTag(id: number): Promise<void> {
    await apiDeleteTag(id);
    await this.loadTags();
  }
}
