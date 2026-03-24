import db from '../db.js';

// GET /users
// GET /users?sort=asc|desc
// GET /users?search=nome
export const getUsers = async (query = {}) => {
  let sql = 'SELECT * FROM users';
  const params = [];
  
  if (query.search) {
    sql += ' WHERE name LIKE ?';
    params.push(`%${query.search}%`);
  }
  
  if (query.sort === 'asc') {
    sql += ' ORDER BY name ASC';
  } else if (query.sort === 'desc') {
    sql += ' ORDER BY name DESC';
  }
  
  const [rows] = await db.query(sql, params);
  return rows;
};

// POST /users
export const createUser = async (data) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, active) VALUES (?, ?, ?)',
    [data.name, data.email, data.active ?? true]
  );
  
  return {
    id: result.insertId,
    ...data,
    active: data.active ?? true
  };
};

// PUT /users/:id
export const updateUser = async (id, data) => {
  const [existing] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  
  if (existing.length === 0) {
    throw new Error("Usuário não encontrado");
  }

  const user = existing[0];

  await db.query(
    'UPDATE users SET name = ?, email = ?, active = ? WHERE id = ?',
    [
      data.name ?? user.name,
      data.email ?? user.email,
      data.active ?? user.active,
      id
    ]
  );

  const [updated] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return updated[0];
};

// PATCH /users/:id
export const toggleUserStatus = async (id) => {
  const [existing] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  
  if (existing.length === 0) {
    throw new Error("Usuário não encontrado");
  }

  const newStatus = !existing[0].active;
  
  await db.query('UPDATE users SET active = ? WHERE id = ?', [newStatus, id]);
  
  const [updated] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return updated[0];
};

// DELETE /users/:id
export const deleteUser = async (id) => {
  const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
  
  if (result.affectedRows === 0) {
    throw new Error("Usuário não encontrado");
  }
  
  return { message: "Usuário deletado com sucesso" };
};

// GET /users/stats
export const getUserStats = async () => {
  const [rows] = await db.query(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) as ativos
    FROM users
  `);
  
  const { total, ativos } = rows[0];
  const percentagemAtivos = total > 0 ? ((ativos / total) * 100).toFixed(2) : 0;
  
  return {
    total,
    ativos,
    percentagemAtivos: `${percentagemAtivos}%`
  };
};
