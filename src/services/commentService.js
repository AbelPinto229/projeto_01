import { db } from "../db.js";

// executa uma função assíncrona que cria um novo comentário para uma tarefa
// recebe o id da tarefa (taskId) e os dados do comentário (normalmente user_id e conteudo) vindos do controller
// executa um INSERT na tabela comments usando prepared statement para evitar SQL injection
// o resultado da query retorna o insertId, que é o id gerado automaticamente pelo banco
// retorna um objeto com o id do comentário, o id da tarefa, o id do usuário e o conteúdo
export const createComment = async (taskId, data) => {
  const [result] = await db.query(
    'INSERT INTO comments (task_id, user_id, conteudo) VALUES (?, ?, ?)',
    [taskId, data.user_id, data.conteudo]
  );

  const [created] = await db.query('SELECT * FROM comments WHERE id = ?', [result.insertId]);
  return created[0];
};

// executa uma função assíncrona que busca todos os comentários de uma tarefa específica
// recebe o id da tarefa (taskId) como parâmetro
// executa um SELECT na tabela comments filtrando pelo task_id e ordenando por data de criação (do mais antigo para o mais recente)
// desestrutura o resultado para pegar o array de comentários (rows)
// retorna esse array contendo todos os comentários encontrados para a tarefa
export const getCommentsByTaskId = async (taskId) => {
  const [rows] = await db.query(
    'SELECT * FROM comments WHERE task_id = ? ORDER BY dataCriacao ASC',
    [taskId]
  );
  return rows;
};

// executa uma função assíncrona que atualiza o conteúdo de um comentário existente
// recebe o id da tarefa (taskId), o id do comentário (commentId) e os novos dados (normalmente conteudo)
// executa um UPDATE na tabela comments, garantindo que o comentário pertence à tarefa correta (WHERE id = ? AND task_id = ?)
// verifica se alguma linha foi afetada (affectedRows) para saber se o comentário existia e pertencia à tarefa
// se não existia, lança erro; se atualizou, busca o comentário atualizado e retorna o objeto completo
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

/**
 * deleta um comentário específico
 * 1. executa DELETE na tabela comments com validação de task_id e comment_id
 * 2. verifica affectedRows para confirmar que o comentário foi deletado
 * 3. se nenhuma linha foi afetada, lança erro indicando que o comentário não existe
 * 4. retorna mensagem de sucesso
 */
export const deleteComment = async (taskId, commentId) => {
  const [result] = await db.query(
    'DELETE FROM comments WHERE id = ? AND task_id = ?',
    [commentId, taskId] )

  if (result.affectedRows === 0) {
    throw new Error("Comentário não encontrado");
  }
  
  return { message: "Comentário deletado com sucesso" };
};
