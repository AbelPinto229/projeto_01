
import { db } from '../db.js';

// executa uma função assíncrona que busca todos os usuários do sistema
// recebe um objeto query com possíveis filtros de pesquisa e ordenação (ex: ?search=nome&sort=asc)
// monta uma query SQL dinâmica: se houver search, adiciona WHERE com LIKE para busca parcial no nome
// se houver sort, adiciona ORDER BY na direção especificada (asc/desc)
// executa a query no banco e desestrutura o resultado para pegar o array de usuários (rows)
// retorna esse array contendo todos os usuários encontrados
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

// executa uma função assíncrona que cria um novo usuário no sistema
// recebe os dados do usuário (nome, email, active) vindos do controller (req.body)
// executa um INSERT na tabela users usando prepared statement para evitar SQL injection
// usa nullish coalescing (??) para definir active = true se não for fornecido
// retorna um objeto com o id gerado pelo banco e os dados do usuário criado
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

// executa uma função assíncrona que atualiza parcial ou totalmente um usuário pelo ID
// recebe o id do usuário e os dados a serem atualizados (vindos do controller)
// primeiro busca o usuário pelo id para verificar se existe
// se não existir, lança erro
// para cada campo, usa o valor fornecido ou mantém o valor atual usando nullish coalescing (??)
// executa o UPDATE no banco e depois busca o usuário atualizado para retornar
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


/**
 * alterna o status ativo/inativo de um usuário (toggle)
 * 1. busca o usuário para obter o status atual
 * 2. inverte o valor booleano do campo active usando operador ! (true ↔ false)
 * 3. executa UPDATE apenas no campo active
 * 4. busca e retorna o usuário atualizado
 */
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


/**
 * deleta um usuário do sistema
 * 1. executa DELETE na tabela users para o ID fornecido
 * 2. verifica affectedRows para confirmar que o usuário existia
 * 3. se nenhuma linha foi afetada, lança erro
 * 4. retorna mensagem de sucesso
 */
export const deleteUser = async (id) => {
  const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new Error("Usuário não encontrado");
  }
  return { message: "Usuário deletado com sucesso" };
};


/**
 * calcula estatísticas agregadas sobre os usuários no sistema
 * 1. usa COUNT(*) para contar total de usuários
 * 2. usa SUM com CASE para contar usuários ativos
 * 3. calcula percentagem de usuários ativos 
 * 4. retorna objeto com total, ativos e percentagem formatada
 */
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
