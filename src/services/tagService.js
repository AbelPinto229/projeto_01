import { db } from '../db.js';

// executa uma função assíncrona que busca todas as tags cadastradas no sistema
// não recebe parâmetros, apenas executa um SELECT * na tabela tags
// o resultado da query é desestruturado para pegar o array de tags (rows)
// retorna esse array contendo todas as tags existentes
export const getTags = async () => {
  const [rows] = await db.query('SELECT id, nome, created_at FROM tags');
  return rows;
};

// executa uma função assíncrona que cria uma nova tag no sistema
// recebe os dados da tag (normalmente só o nome) vindos do controller (req.body)
// executa um INSERT na tabela tags usando prepared statement para evitar SQL injection
// o resultado da query retorna o insertId, que é o id gerado automaticamente pelo banco
// retorna um objeto com o id e o nome da tag criada
export const createTag = async (data) => {
  const nome = data.nome ?? data.name;
  const [result] = await db.query(
    'INSERT INTO tags (nome) VALUES (?)',
    [nome]
  );

  const [created] = await db.query(
    'SELECT id, nome, created_at FROM tags WHERE id = ?',
    [result.insertId]
  );

  return created[0];
};

// executa uma função assíncrona que deleta uma tag do sistema e todas as suas associações com tarefas
// recebe o id da tag a ser deletada
// deleta a tag da tabela tags — o ON DELETE CASCADE trata automaticamente de apagar as associações em task_tags
// verifica se alguma linha foi afetada (affectedRows) para saber se a tag existia
// se não existia, lança erro; se deletou, retorna mensagem de sucesso
export const deleteTag = async (id) => {
  const [result] = await db.query('DELETE FROM tags WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new Error("Tag não encontrada");
  }
  return { message: "Tag deletada com sucesso" };
};

// executa uma função assíncrona que busca todas as tarefas associadas a uma tag específica
// recebe o id da tag como parâmetro
// faz um INNER JOIN entre as tabelas tasks e task_tags para encontrar as tarefas relacionadas à tag
// filtra pelo tag_id na tabela de relacionamento 
// retorna um array com todas as tarefas que possuem essa tag
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
