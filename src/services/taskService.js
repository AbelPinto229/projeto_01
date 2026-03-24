import { db } from "../db.js";

// GET /tasks
// GET /tasks?sort=asc|desc
// GET /tasks?search=titulo
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

  const [rows] = await db.query(sql, params);
  return rows;
};

// POST /tasks
export const createTask = async (data) => {
  const [result] = await db.query(
    'INSERT INTO tasks (titulo, categoria, concluida, responsavelNome, dataConclusao) VALUES (?, ?, ?, ?, ?)',
    [data.titulo, data.categoria, data.concluida ?? false, data.responsavelNome, data.dataConclusao ?? null]
  );

  return {
    id: result.insertId,
    ...data,
    concluida: data.concluida ?? false,
    dataConclusao: data.dataConclusao ?? null
  };
};

// PUT /tasks/:id
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

// DELETE /tasks/:id
export const deleteTask = async (id) => {
  const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [id]);
  
  if (result.affectedRows === 0) {
    throw new Error("Tarefa não encontrada");
  }

  return { message: "Tarefa deletada com sucesso" };
};

// GET /tasks/stats
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

// GET /users/:id/tasks
export const getTasksByUserId = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM tasks WHERE responsavelNome = (SELECT name FROM users WHERE id = ?)',
    [userId]
  );
  
  return rows;
};

// POST /tasks/:id/tags
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
