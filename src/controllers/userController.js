import * as userService from "../services/userService.js";

// GET /users, GET /users?sort=asc|desc, GET /users?search=nome
export const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers(req.query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// POST /users
export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// PUT /users/:id
export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.user.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

// PATCH /users/:id
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await userService.toggleUserStatus(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

// DELETE /users/:id
export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.user.id);
    res.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

// GET /users/stats
export const getUserStats = async (req, res) => {
  try {
    const stats = await userService.getUserStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
