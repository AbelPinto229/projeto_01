import * as userService from "../services/userService.js";

/**
 * busca todos os usuários com opções de pesquisa e ordenação
 */
export const getUsers = async (req, res) => {
  try {
    
    const users = await userService.getUsers(req.query);
    
    res.json(users);
  } catch (error) {
   
    res.status(500).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}

/**
 * cria um novo usuário
 */
export const createUser = async (req, res) => {
  try {
  
    const user = await userService.createUser(req.body);
    
    res.status(201).json(user);
  } catch (error) {
   
    res.status(400).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}

/**
 * atualiza os dados de um usuário existente
 */
export const updateUser = async (req, res) => {
  try {
    
    const user = await userService.updateUser(req.user, req.body);
    
    res.json(user);
  } catch (error) {
    
    res.status(404).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}

/**
 * alterna o status ativo/inativo de um usuário (toggle)
 */
export const toggleUserStatus = async (req, res) => {
  try {
    
    const user = await userService.toggleUserStatus(req.user.id);
    
    res.json(user);
  } catch (error) {
   
    res.status(404).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}

/**
 * deleta um usuário do sistema
 */
export const deleteUser = async (req, res) => {
  try {

    await userService.deleteUser(req.user.id);
    
    res.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
   
    res.status(404).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}

/**
 * calcula estatísticas sobre os usuários no sistema
 * retorna: total de usuários, ativos e percentagem de ativos
 */
export const getUserStats = async (req, res) => {
  try {
    
    const stats = await userService.getUserStats();
    
    res.json(stats);
  } catch (error) {

    res.status(500).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}
