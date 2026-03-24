import db from '../db.js';

// GET /tags
export const getTags = async () => {
  const [rows] = await db.query('SELECT * FROM tags');
  return rows;
};

// POST /tags
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

// DELETE /tags/:id
export const deleteTag = async (id) => {
  await db.query('DELETE FROM task_tags WHERE tag_id = ?', [id]);
  const [result] = await db.query('DELETE FROM tags WHERE id = ?', [id]);
  
  if (result.affectedRows === 0) {
    throw new Error("Tag não encontrada");
  }
  
  return { message: "Tag deletada com sucesso" };
};

// GET /tags/:id/tasks
export const getTasksByTagId = async (tagId) => {
  const [rows] = await db.query(`
    SELECT tasks.* 
    FROM tasks
    INNER JOIN task_tags ON tasks.id = task_tags.task_id
    WHERE task_tags.tag_id = ?
  `, [tagId]);
  
  return rows;
};
