import * as userService from "../services/userService.js";

export const getUsers = (req, res) => {
  try {
    const users = userService.getUsers(req.query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const createUser = (req, res) => {
  try {
    const user = userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const updateUser = (req, res) => {
  try {
    const user = userService.updateUser(req.user.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

export const toggleUserStatus = (req, res) => {
  try {
    const user = userService.toggleUserStatus(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

export const deleteUser = (req, res) => {
  try {
    userService.deleteUser(req.user.id);
    res.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

export const getUserStats = (req, res) => {
  try {
    const stats = userService.getUserStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
