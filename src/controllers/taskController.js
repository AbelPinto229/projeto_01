import * as taskService from "../services/taskService.js";

// GET /tasks, GET /tasks?sort=asc|desc, GET /tasks?search=titulo
export const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.query);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// POST /tasks
export const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// PUT /tasks/:id
export const updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(Number(req.params.id), req.body);
    res.json(task);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

// DELETE /tasks/:id
export const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(Number(req.params.id));
    res.json({ message: "Tarefa deletada com sucesso" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

// GET /tasks/stats
export const getTaskStats = async (req, res) => {
  try {
    const stats = await taskService.getTaskStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// GET /users/:id/tasks
export const getTasksByUserId = async (req, res) => {
  try {
    const tasks = await taskService.getTasksByUserId(Number(req.params.id));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// POST /tasks/:id/tags
export const addTagToTask = async (req, res) => {
  try {
    const result = await taskService.addTagToTask(Number(req.params.id), req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
