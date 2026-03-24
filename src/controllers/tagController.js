import * as tagService from "../services/tagService.js";

/**
 * busca todas as tags disponíveis no sistema
 * GET /tags
 */
export const getTags = async (req, res) => {
  try {
    // Não precisa de parâmetros - retorna todas as tags
    const tags = await tagService.getTags();
    
    // Retorna array com todas as tags
    res.json(tags);
  } catch (error) {
    // Erro interno do servidor (500)
    res.status(500).json({ error: error.message });
  }
}

/**
 * cria uma nova tag
 * POST /tags
 */
export const createTag = async (req, res) => {
  try {
    // req.body contém os dados da tag: { name: "urgente" }
    const tag = await tagService.createTag(req.body);
    
    // Retorna a tag criada com status 201 (Created)
    res.status(201).json(tag);
  } catch (error) {
    // Erro 400 (Bad Request) se os dados forem inválidos
    res.status(400).json({ error: error.message });
  }
}

/**
 * deleta uma tag e todas as suas associações com tarefas
 * DELETE /tags/:id
 */
export const deleteTag = async (req, res) => {
  try {
    // req.params.id contém o ID da tag na URL (/tags/3 → id = "3")
    // Number() converte de string para número
    await tagService.deleteTag(Number(req.params.id));
    
    // Retorna mensagem de sucesso
    res.json({ message: "Tag deletada com sucesso" });
  } catch (error) {
    // Erro 404 (Not Found) se a tag não existir
    res.status(404).json({ error: error.message });
  }
}

/**
 * busca todas as tarefas que possuem uma tag específica
 * GET /tags/:id/tasks
 */
export const getTasksForTag = async (req, res) => {
  try {
    // req.params.id contém o ID da tag na URL (/tags/2/tasks → id = "2")
    // Number() converte para número antes de passar ao service
    const tasks = await tagService.getTasksByTagId(Number(req.params.id));
    
    // Retorna array de tarefas que possuem essa tag
    res.json(tasks);
  } catch (error) {
    // Erro 404 se a tag não existir
    res.status(404).json({ error: error.message });
  }
}
