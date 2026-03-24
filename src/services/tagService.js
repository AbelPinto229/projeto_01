import { db } from '../db.js';

/**
 * busca todas as tags disponíveis no sistema
 * 1. executa SELECT * na tabela tags sem filtros
 * 2. retorna array com todas as tags cadastradas
 */
export const getTags = async () => {
  // SELECT * busca todas as tags da tabela tags
  // descontroi e extrai o primeiro elemento (array de resultados)
  const [rows] = await db.query('SELECT * FROM tags');
  // rows é o array de saída contendo todas as tags
  return rows;
};

/**
 * cria uma nova tag no sistema
 * 1. executa INSERT na tabela tags com o nome fornecido (req.body do controller)
 * 2. usa prepared statement com ? para prevenir SQL injection
 * 3. retorna o objeto da tag criada com o ID gerado pelo banco
 */
export const createTag = async (data) => {
  // INSERT INTO adiciona uma nova tag no banco de dados
  // ? é o placeholder que previne SQL injection 
  const [result] = await db.query(
    'INSERT INTO tags (name) VALUES (?)',
    [data.name]  // array de entrada (params)
  );
  
  // Retorna a tag criada com o ID auto-incrementado do MySQL
  return {
    id: result.insertId,  // ID gerado automaticamente pelo MySQL
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
  // Primeiro remove todas as associações da tag com tarefas na tabela task_tags (relação many-to-many)
  // Isso é necessário para evitar violar constraints de foreign key
  await db.query('DELETE FROM task_tags WHERE tag_id = ?', [id]);
  
  // Depois deleta a própria tag
  const [result] = await db.query('DELETE FROM tags WHERE id = ?', [id]);
  
  // affectedRows indica quantas linhas foram deletadas
  // Se for 0, a tag não existe
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
  // SELECT com INNER JOIN une as tabelas tasks e task_tags
  // tasks.* seleciona todas as colunas da tabela tasks
  // INNER JOIN task_tags ON tasks.id = task_tags.task_id conecta tarefas com suas tags
  // WHERE task_tags.tag_id = ? filtra apenas as tarefas com a tag especificada
  // Este é um padrão comum para trabalhar com relações many-to-many
  const [rows] = await db.query(`
    SELECT tasks.* 
    FROM tasks
    INNER JOIN task_tags ON tasks.id = task_tags.task_id
    WHERE task_tags.tag_id = ?
  `, [tagId]);  // array de entrada (params)
  
  // rows é o array de saída com todas as tarefas encontradas
  return rows;
};
