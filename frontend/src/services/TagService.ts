import type { Tag } from '../models/Tag.js';

// FAKE DATA
const fakeTags: Tag[] = [
  { id: 1, nome: 'Urgente', created_at: '2024-01-10' },
  { id: 2, nome: 'Bug', created_at: '2024-01-15' },
  { id: 3, nome: 'Feature', created_at: '2024-01-20' },
  { id: 4, nome: 'Melhoria', created_at: '2024-02-01' },
  { id: 5, nome: 'Documentação', created_at: '2024-02-10' },
  { id: 6, nome: 'Em Revisão', created_at: '2024-02-15' },
  { id: 7, nome: 'Bloqueado', created_at: '2024-03-01' }
];

export class TagService {
  private tags: Tag[] = [...fakeTags];
  private nextId: number = 8;

  // Get all tags
  getTags(): Tag[] {
    return [...this.tags];
  }

  // Create tag
  createTag(nome: string): Tag {
    const newTag: Tag = {
      id: this.nextId++,
      nome,
      created_at: new Date().toISOString().split('T')[0]
    };

    this.tags.push(newTag);
    return newTag;
  }

  // Get tag tasks (mock)
  getTagTasks(id: number): any[] {
    return [];
  }

  // Delete tag
  deleteTag(id: number): void {
    this.tags = this.tags.filter(t => t.id !== id);
  }
}
