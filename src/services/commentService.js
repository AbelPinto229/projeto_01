import { db } from "../db.js";

// POST /tasks/:id/comments
export const createComment = async (taskId, data) => {
  const [result] = await db.query(
    'INSERT INTO comments (task_id, user_id, conteudo) VALUES (?, ?, ?)',
    [taskId, data.user_id, data.conteudo]
  );
  
  return {
    id: result.insertId,
    task_id: taskId,
    user_id: data.user_id,
    conteudo: data.conteudo
  };
};

// GET /tasks/:id/comments
export const getCommentsByTaskId = async (taskId) => {
  const [rows] = await db.query(
    'SELECT * FROM comments WHERE task_id = ? ORDER BY dataCriacao ASC',
    [taskId]
  );
  
  return rows;
};

// PUT /tasks/:id/comments/:commentId
export const updateComment = async (taskId, commentId, data) => {
  const [result] = await db.query(
    'UPDATE comments SET conteudo = ? WHERE id = ? AND task_id = ?',
    [data.conteudo, commentId, taskId]
  );

  if (result.affectedRows === 0) {
    throw new Error("Comentário não encontrado");
  }

  const [updated] = await db.query('SELECT * FROM comments WHERE id = ?', [commentId]);
  return updated[0];
};

// DELETE /tasks/:id/comments/:commentId
export const deleteComment = async (taskId, commentId) => {
  const [result] = await db.query(
    'DELETE FROM comments WHERE id = ? AND task_id = ?',
    [commentId, taskId]
  );
  
  if (result.affectedRows === 0) {
    throw new Error("Comentário não encontrado");
  }
  
  return { message: "Comentário deletado com sucesso" };
};
