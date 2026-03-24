import * as userService from "../services/userService.js";

/**
 * busca todos os usuários com opções de pesquisa e ordenação
 * GET /users, GET /users?sort=asc|desc, GET /users?search=nome
 */
export const getUsers = async (req, res) => {
  try {
    // req.query contém os parâmetros da URL (?search=João&sort=asc)
    // Parâmetros opcionais: search (filtro por nome) e sort (ordenação)
    const users = await userService.getUsers(req.query);
    
    // Retorna array de usuários
    res.json(users);
  } catch (error) {
    // Erro interno do servidor (500)
    res.status(500).json({ error: error.message });
  }
}

/**
 * cria um novo usuário
 * POST /users
 */
export const createUser = async (req, res) => {
  try {
    // req.body contém os dados do usuário: { name: "João", email: "joao@email.com", active: true }
    // Campo active é opcional (padrão: true)
    const user = await userService.createUser(req.body);
    
    // Retorna o usuário criado com status 201 (Created)
    res.status(201).json(user);
  } catch (error) {
    // Erro 400 (Bad Request) se os dados forem inválidos
    res.status(400).json({ error: error.message });
  }
}

/**
 * atualiza os dados de um usuário existente
 * PUT /users/:id
 */
export const updateUser = async (req, res) => {
  try {
    // req.user.id contém o ID do usuário (vem do middleware checkUserExists)
    // req.body contém os campos a atualizar: { name, email, active } (todos opcionais)
    const user = await userService.updateUser(req.user.id, req.body);
    
    // Retorna o usuário atualizado
    res.json(user);
  } catch (error) {
    // Erro 404 (Not Found) se o usuário não existir
    res.status(404).json({ error: error.message });
  }
}

/**
 * alterna o status ativo/inativo de um usuário (toggle)
 * PATCH /users/:id
 */
export const toggleUserStatus = async (req, res) => {
  try {
    // req.user.id contém o ID do usuário (vem do middleware checkUserExists)
    // Não precisa de req.body - apenas inverte o status atual (true ↔ false)
    const user = await userService.toggleUserStatus(req.user.id);
    
    // Retorna o usuário com o status atualizado
    res.json(user);
  } catch (error) {
    // Erro 404 (Not Found) se o usuário não existir
    res.status(404).json({ error: error.message });
  }
}

/**
 * deleta um usuário do sistema
 * DELETE /users/:id
 */
export const deleteUser = async (req, res) => {
  try {
    // req.user.id contém o ID do usuário (vem do middleware checkUserExists)
    await userService.deleteUser(req.user.id);
    
    // Retorna mensagem de sucesso
    res.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    // Erro 404 (Not Found) se o usuário não existir
    res.status(404).json({ error: error.message });
  }
}

/**
 * calcula estatísticas sobre os usuários no sistema
 * GET /users/stats
 * Retorna: total de usuários, ativos e percentagem de ativos
 */
export const getUserStats = async (req, res) => {
  try {
    // Não precisa de parâmetros - calcula stats de todos os usuários
    const stats = await userService.getUserStats();
    
    // Retorna objeto com { total, ativos, percentagemAtivos }
    res.json(stats);
  } catch (error) {
    // Erro interno do servidor (500)
    res.status(500).json({ error: error.message });
  }
}
