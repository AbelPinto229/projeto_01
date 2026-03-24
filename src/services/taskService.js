// db é um objeto pool de conexões configurado em db.js e permite executar queries SQL através do db.query()

import { db } from "../db.js";

/*
 * rcupera tarefas do banco de dados com opções de filtragem e ordenação
 * 1. constrói uma query SQL dinâmica baseada nos parâmetros recebidos
 * 2. se houver busca, adiciona cláusula WHERE com LIKE (ex:%ao) para busca parcial no título
 * 3. se houver ordenação, adiciona ORDER BY na direção especificada (asc/desc)
 * 4. executa a query com os parâmetros preparados e retorna o resultado no array de saida rows.
 */
export const getTasks = async (query = {}) => {
  let sql = 'SELECT * FROM tasks';
  const params = [];

  if (query.search) {
    sql += ' WHERE titulo LIKE ?';
    params.push(`%${query.search}%`);
  }

  if (query.sort === 'asc') {
    sql += ' ORDER BY titulo ASC';
  } else if (query.sort === 'desc') {
    sql += ' ORDER BY titulo DESC';
  }

  // executa a query SQL com os parametros no banco e retorna array de tarefas encontradas
  // sql tem haver com a instrucao do SQL e o params tem os valores que substituem os ? na ordem
  // array de saida, ou seja onde é guardado o resultado da query.
  const [rows] = await db.query(sql, params);
  return rows;
};

/**
 * insere uma nova tarefa no banco de dados
 * 1. executa INSERT na tabela tasks com os dados fornecidos pelo req.body(data) do controller(json enviado no POST)
 * 2. usa valores padrão atraves do nullish coalescing ?? (false para concluida, null para dataConclusao) se não fornecidos
 * 3. retorna o objeto da tarefa criada com o ID gerado pelo banco
*/
export const createTask = async (data) => {

  const [result] = await db.query(
    'INSERT INTO tasks (titulo, categoria, concluida, responsavelNome, dataConclusao) VALUES (?, ?, ?, ?, ?)',
    [data.titulo, data.categoria, data.concluida ?? false, data.responsavelNome, data.dataConclusao ?? null]
  );

  // retorna a tarefa criada com o ID gerado pelo banco e os dados fornecidos (com valores padrão aplicados)
  return {
    id: result.insertId,
    ...data,
    concluida: data.concluida ?? false,
    dataConclusao: data.dataConclusao ?? null
  };
};

/**
 * atualiza parcial ou totalmente uma tarefa pelo ID
 * 1. verifica se a tarefa existe no banco
 * 2. se não existir, lança erro
 * 3. para cada campo, usa o valor fornecido ou mantém o valor atual através do nullish coalescing (??)
 * 4. executa UPDATE e busca a tarefa atualizada para retornar
 */

export const updateTask = async (id, data) => {
  const [existing] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
  
  if (existing.length === 0) {
    throw new Error("Tarefa não encontrada");
  }

  const task = existing[0];
  await db.query(
    'UPDATE tasks SET titulo = ?, categoria = ?, concluida = ?, responsavelNome = ?, dataConclusao = ? WHERE id = ?',
    [
      data.titulo ?? task.titulo,
      data.categoria ?? task.categoria,
      data.concluida ?? task.concluida,
      data.responsavelNome ?? task.responsavelNome,
      data.dataConclusao ?? task.dataConclusao,
      id
    ]
  );


  const [updated] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
  return updated[0];
};

/**
 * deleta uma tarefa do banco de dados pelo ID
 * 1. executa DELETE na tabela tasks para o ID fornecido
 * 2. verifica se alguma linha foi afetada (affectedRows)
 * 3. se nenhuma linha foi afetada, significa que a tarefa não existe e lança erro
 * 4. se deletado com sucesso, retorna mensagem de confirmação
 */
export const deleteTask = async (id) => {

  const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [id]);
  
  if (result.affectedRows === 0) {
    throw new Error("Tarefa não encontrada");
  }
  return { message: "Tarefa deletada com sucesso" };
};

/**
 * calcula estatísticas agregadas de todas as tarefas
 * 1. usa COUNT(*) para contar total de tarefas
 * 2. usa SUM com CASE para contar tarefas concluídas (concluida = 1)
 * 3. usa SUM com CASE para contar tarefas pendentes (concluida = 0)
 * 4. retorna objeto com os três valores (total, concluidas, pendentes) 
 */
export const getTaskStats = async () => {
  const [rows] = await db.query(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN concluida = 1 THEN 1 ELSE 0 END) AS concluidas,
      SUM(CASE WHEN concluida = 0 THEN 1 ELSE 0 END) AS pendentes
    FROM tasks
  `);

  return rows[0];
};

/**
 * retorna todas as tarefas atribuídas a um usuário
 * 1. usa subquery para buscar o nome do usuário pelo ID na tabela users
 * 2. compara o responsavelNome da tarefa com o nome do usuário encontrado
 * 3. retorna todas as tarefas onde o nome coincide
 */
export const getTasksByUserId = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM tasks WHERE responsavelNome = (SELECT name FROM users WHERE id = ?)',
    [userId]
  );
  return rows;
};

/**
 * cria relacionamento muitos-para-muitos entre tarefa e tag
 * Receb o ID da tarefa e o ID da tag a ser associada
 * 1. verifica se a associação já existe na tabela task_tags
 * 2. se já existir, lança erro para evitar duplicação
 * 3. se não existir, insere novo registro na tabela de relacionamento
 * 4. retorna mensagem de sucesso
 */
export const addTagToTask = async (taskId, tagData) => {

  const [alreadyExists] = await db.query(
    'SELECT * FROM task_tags WHERE task_id = ? AND tag_id = ?',
    [taskId, tagData.tag_id]
  );
  
  
  if (alreadyExists.length > 0) {
    throw new Error("Tag já associada a esta task");
  }

  await db.query(
    'INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)',
    [taskId, tagData.tag_id]
  );
  
  return { message: "Tag adicionada à task com sucesso" };
};
