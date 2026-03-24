import { db } from '../db.js';

/**
 * busca todas as tags disponíveis no sistema
 * 1. executa SELECT * na tabela tags sem filtros
 * 2. retorna array com todas as tags cadastradas
 */
export const getTags = async () => {
  
  const [rows] = await db.query('SELECT * FROM tags');
  return rows;
};

/**
 * cria uma nova tag no sistema
 * 1. executa INSERT na tabela tags com o nome fornecido (req.body do controller)
 * 2. usa prepared statement com ? para prevenir SQL injection
 * 3. retorna o objeto da tag criada com o ID gerado pelo banco
 */
export const createTag = async (data) => {
  
  const [result] = await db.query(
    'INSERT INTO tags (name) VALUES (?)',
    [data.name]
  );
  
  return {
    id: result.insertId, 
    name: data.name
  };
};

/**
 * deleta uma tag e todas as suas associações com tarefas
 * 1. primeiro remove todas as associações na tabela task_tags para evitar violação de foreign key
 * 2. depois deleta a própria tag da tabela tags
 * 3. verifica affectedRows para confirmar que a tag existia
 * 4. se nenhuma linha foi afetada, lança erro
 * 5. retorna mensagem de sucesso
 */
export const deleteTag = async (id) => {

  await db.query('DELETE FROM task_tags WHERE tag_id = ?', [id]);
  
  const [result] = await db.query('DELETE FROM tags WHERE id = ?', [id]);
  
  if (result.affectedRows === 0) {
    throw new Error("Tag não encontrada");
  }
  
  return { message: "Tag deletada com sucesso" };
};

/**
 * busca todas as tarefas que possuem uma tag específica
 * 1. usa INNER JOIN entre tabelas tasks e task_tags para relacionar tarefas com suas tags
 * 2. filtra pelo tag_id na tabela de relacionamento (padrão many-to-many)
 * 3. retorna array com todas as tarefas que possuem essa tag
 */
export const getTasksByTagId = async (tagId) => {
  const [rows] = await db.query(`
    SELECT tasks.* 
    FROM tasks
    INNER JOIN task_tags ON tasks.id = task_tags.task_id
    WHERE task_tags.tag_id = ?
  `, [tagId]);
  
  // rows é o array de saída com todas as tarefas encontradas
  return rows;
};
