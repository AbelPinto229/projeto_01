import type { Comment } from '../models/Comment.js';
export declare class CommentService {
    private comments;
    private nextId;
    createComment(taskId: number, userId: number, conteudo: string): Promise<Comment>;
    updateComment(taskId: number, commentId: number, conteudo: string): Promise<Comment>;
    deleteComment(taskId: number, commentId: number): Promise<void>;
}
//# sourceMappingURL=CommentService.d.ts.map