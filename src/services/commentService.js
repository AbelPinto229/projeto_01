import { db } from "../db.js";

/**
 * cria um novo comentário para uma tarefa
 * 1. executa INSERT na tabela comments com os dados fornecidos (taskId e req.body do controller)
 * 2. usa prepared statement com ? para prevenir SQL injection
 * 3. retorna o objeto do comentário criado com o ID gerado pelo banco
 */
export const createComment = async (taskId, data) => {
  const [result] = await db.query(
    'INSERT INTO comments (task_id, user_id, conteudo) VALUES (?, ?, ?)',
    [taskId, data.user_id, data.conteudo]
  );
  
  // Retorna o comentário recém-criado com o ID gerado automaticamente pelo MySQL
  return {
    id: result.insertId,         
    task_id: taskId,
    user_id: data.user_id,
    conteudo: data.conteudo
  };
};

/**
 * busca todos os comentários de uma tarefa específica
 * 1. executa SELECT com WHERE para filtrar comentários pela task_id
 * 2. ordena os resultados por dataCriação (do mais antigo para o mais recente)
 * 3. retorna array com todos os comentários encontrados
 */
export const getCommentsByTaskId = async (taskId) => {
  // SELECT * busca todos os comentários onde task_id = ? (taskId)
  // ORDER BY dataCriacao ASC ordena do mais antigo para o mais recente
  // Destructuring: const [rows] extrai o primeiro elemento do array retornado por db.query()
  const [rows] = await db.query(
    'SELECT * FROM comments WHERE task_id = ? ORDER BY dataCriacao ASC',
    [taskId]  // array de entrada (params) para o prepared statement
  );
  
  // rows é o array de saída com todos os comentários encontrados
  return rows;
};

/**
 * atualiza o conteúdo de um comentário existente
 * 1. executa UPDATE na tabela comments com validação de task_id e comment_id
 * 2. verifica affectedRows para confirmar que o comentário existe e pertence à tarefa
 * 3. busca e retorna o comentário atualizado com todos os campos
 */
export const updateComment = async (taskId, commentId, data) => {
  // UPDATE modifica o conteúdo do comentário
  // WHERE id = ? AND task_id = ? garante que o comentário pertence à tarefa correta
  const [result] = await db.query(
    'UPDATE comments SET conteudo = ? WHERE id = ? AND task_id = ?',
    [data.conteudo, commentId, taskId]  // array de entrada (params)
  );

  // affectedRows indica quantas linhas foram modificadas
  // Se for 0, significa que o comentário não existe ou não pertence a essa tarefa
  if (result.affectedRows === 0) {
    throw new Error("Comentário não encontrado");
  }

  // Busca o comentário atualizado para retornar com todos os campos
  const [updated] = await db.query('SELECT * FROM comments WHERE id = ?', [commentId]);
  // updated[0] pega o primeiro elemento do array de saída (o comentário)
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
  // DELETE remove o comentário do banco de dados
  // WHERE id = ? AND task_id = ? garante que estamos deletando o comentário correto da tarefa correta
  const [result] = await db.query(
    'DELETE FROM comments WHERE id = ? AND task_id = ?',
    [commentId, taskId]  // array de entrada (params) para o prepared statement
  );
  
  // affectedRows indica quantas linhas foram deletadas
  // Se for 0, o comentário não existe ou não pertence a essa tarefa
  if (result.affectedRows === 0) {
    throw new Error("Comentário não encontrado");
  }
  
  return { message: "Comentário deletado com sucesso" };
};
