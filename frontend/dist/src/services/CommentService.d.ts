import type { Comment } from '../models/Comment.js';
export declare class CommentService {
    private commentsByTask;
    getCommentsByTask(taskId: number): Promise<Comment[]>;
    createComment(taskId: number, userId: number, conteudo: string): Promise<void>;
    updateComment(taskId: number, commentId: number, conteudo: string): Promise<void>;
    deleteComment(taskId: number, commentId: number): Promise<void>;
}
//# sourceMappingURL=CommentService.d.ts.map