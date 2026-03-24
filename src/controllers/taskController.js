import * as taskService from "../services/taskService.js";

// GET /tasks, GET /tasks?sort=asc|desc, GET /tasks?search=titulo
export const getTasks = async (req, res) => {
  try {
    // req.query contém os parâmetros da URL (?search=cafe&sort=asc)
    // Passa para o service que retorna array de tarefas
    const tasks = await taskService.getTasks(req.query);
    
    // Retorna as tarefas como JSON para o cliente
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// POST /tasks
export const createTask = async (req, res) => {
  try {
    // req.body contém o JSON enviado pelo cliente no corpo da requisição
    // Ex: { titulo: "Comprar café", categoria: "pessoal", responsavelNome: "João" }
    // Passa para o service como parâmetro "data"
    const task = await taskService.createTask(req.body);
    
    // Retorna a tarefa criada (com ID gerado) com status 201 (Created)
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// PUT /tasks/:id
export const updateTask = async (req, res) => {
  try {
    // req.params.id contém o ID da URL (/tasks/5 → id = 5)
    // req.body contém os campos a atualizar (podem ser parciais)
    // Number() converte string para número
    const task = await taskService.updateTask(Number(req.params.id), req.body);
    
    // Retorna a tarefa atualizada
    res.json(task);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

/**
 * deleta uma tarefa específica
 * DELETE /tasks/:id
 */
export const deleteTask = async (req, res) => {
  try {
    // req.params.id contém o ID da tarefa na URL (/tasks/5 → id = "5")
    // Number() converte de string para número antes de passar ao service
    await taskService.deleteTask(Number(req.params.id));
    
    // Retorna mensagem de sucesso com status 200
    res.json({ message: "Tarefa deletada com sucesso" });
  } catch (error) {
    // Se a tarefa não existir, service lança erro e retorna 404 (Not Found)
    res.status(404).json({ error: error.message });
  }
}

/**
 * busca estatísticas agregadas das tarefas
 * GET /tasks/stats
 * Retorna: total de tarefas, concluídas, não concluídas e percentagem
 */
export const getTaskStats = async (req, res) => {
  try {
    // Não precisa de parâmetros - calcula stats de todas as tarefas
    const stats = await taskService.getTaskStats();
    
    // Retorna objeto com { total, concluidas, naoConcluidas, percentagemConcluidas }
    res.json(stats);
  } catch (error) {
    // Erro interno do servidor (500)
    res.status(500).json({ error: error.message });
  }
}

/**
 * busca todas as tarefas de um usuário específico
 * GET /users/:id/tasks
 */
export const getTasksByUserId = async (req, res) => {
  try {
    // req.params.id contém o ID do usuário na URL (/users/3/tasks → id = "3")
    // Number() converte para número antes de passar ao service
    const tasks = await taskService.getTasksByUserId(Number(req.params.id));
    
    // Retorna array de tarefas do usuário
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * adiciona uma tag a uma tarefa (relacionamento many-to-many)
 * POST /tasks/:id/tags
 */
export const addTagToTask = async (req, res) => {
  try {
    // req.params.id contém o ID da tarefa na URL (/tasks/5/tags → id = "5")
    // req.body contém os dados da tag: { tag_id: 2 }
    // Number() converte taskId de string para número
    const result = await taskService.addTagToTask(Number(req.params.id), req.body);
    
    // Retorna status 201 (Created) com a associação criada
    res.status(201).json(result);
  } catch (error) {
    // Erro 400 (Bad Request) se a tag ou tarefa não existir, ou se já estiver associada
    res.status(400).json({ error: error.message });
  }
}
