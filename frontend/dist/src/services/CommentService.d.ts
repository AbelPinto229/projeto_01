import type { Comment } from '../models/Comment.js';
export declare class CommentService {
    private comments;
    private nextId;
    createComment(taskId: number, userId: number, conteudo: string): Comment;
    updateComment(taskId: number, commentId: number, conteudo: string): Comment;
    deleteComment(taskId: number, commentId: number): void;
}
//# sourceMappingURL=CommentService.d.ts.map