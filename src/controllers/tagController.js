import * as tagService from "../services/tagService.js";

/**
 * busca todas as tags disponíveis no sistema
 */
export const getTags = async (req, res) => {
  try {
    
    const tags = await tagService.getTags();
    
    res.json(tags);
  } catch (error) {
  
    res.status(500).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}

/**
 * cria uma nova tag

 */
export const createTag = async (req, res) => {
  try {
    // req.body contém os dados da tag: { nome: "urgente" }
    const tag = await tagService.createTag(req.body);
    
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}

/**
 * deleta uma tag e todas as suas associações com tarefas
 */
export const deleteTag = async (req, res) => {
  try {
    
    await tagService.deleteTag(Number(req.params.id));
    
   
    res.json({ message: "Tag deletada com sucesso" });
  } catch (error) {
  
    res.status(404).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}

/**
 * busca todas as tarefas que possuem uma tag específica
 */
export const getTasksForTag = async (req, res) => {
  try {

    const tasks = await tagService.getTasksByTagId(Number(req.params.id));
  
    res.json(tasks);
  } catch (error) {
    
    res.status(404).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}
