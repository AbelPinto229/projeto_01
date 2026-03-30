import type { Comment } from '../models/Comment.js';
export declare function getCommentsByTask(taskId: number): Promise<Comment[]>;
export declare function createComment(taskId: number, userId: number, conteudo: string): Promise<Comment>;
export declare function updateComment(taskId: number, commentId: number, conteudo: string): Promise<Comment>;
export declare function deleteComment(taskId: number, commentId: number): Promise<void>;
//# sourceMappingURL=apiCommentService.d.ts.map