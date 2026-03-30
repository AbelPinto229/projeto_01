import * as taskService from "../services/taskService.js";

// rotas suportadas: get /tasks, get /tasks?sort=asc|desc, get /tasks?search=titulo
export const getTasks = async (req, res) => {
  try {
    
    const tasks = await taskService.getTasks(req.query);
   
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}


// cria uma nova tarefa com os dados do req.body (json enviado no post)
export const createTask = async (req, res) => {
  try {
  
    const task = await taskService.createTask(req.body);
    
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}

// atualiza uma tarefa existente (parcial ou totalmente)
export const updateTask = async (req, res) => {
  try {
    
    const task = await taskService.updateTask(Number(req.params.id), req.body);
    
    res.json(task);

  } catch (error) {

    res.status(404).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}

/**
 * deleta uma tarefa específica
 * delete /tasks/:id
 */
export const deleteTask = async (req, res) => {
  try {
   
    await taskService.deleteTask(Number(req.params.id));
    
    res.json({ message: "Tarefa deletada com sucesso" });
  } catch (error) {
   
    res.status(404).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}

/**
 * busca estatísticas agregadas das tarefas
 * retorna: total de tarefas, concluídas, não concluídas e percentagem
 */
export const getTaskStats = async (req, res) => {
  try {
   
    const stats = await taskService.getTaskStats();
    
    res.json(stats);
  } catch (error) {
    
    res.status(500).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}

/**
 * busca todas as tarefas de um usuário específico
 */
export const getTasksByUserId = async (req, res) => {
  try {
    
    const tasks = await taskService.getTasksByUserId(Number(req.params.id));
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}

/**
 * adiciona uma tag a uma tarefa (relacionamento many-to-many)
 */
export const addTagToTask = async (req, res) => {
  try {
   
    const result = await taskService.addTagToTask(Number(req.params.id), req.body);
    
    res.status(201).json(result);
  } catch (error) {
    
    res.status(400).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}

/**
 * remove a associação de uma tag com uma tarefa
 */
export const removeTagFromTask = async (req, res) => {
  try {
    const result = await taskService.removeTagFromTask(
      Number(req.params.id),
      Number(req.params.tagId)
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}
