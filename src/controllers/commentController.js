import * as commentService from "../services/commentService.js";

/**
 * busca todos os comentários de uma tarefa específica
 */
export const getCommentsByTask = async (req, res) => {
  try {
    
    const comments = await commentService.getCommentsByTaskId(Number(req.params.id));
    
    res.json(comments);
  } catch (error) {
    res.status(404).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}

/**
 * cria um novo comentário para uma tarefa
 */
export const createComment = async (req, res) => {
  try {
    
    const comment = await commentService.createComment(Number(req.params.id), req.body);
    
    // Retorna o comentário criado com status 201 (Created)
    res.status(201).json(comment);
  } catch (error) {
    // Erro 400 (Bad Request) se os dados forem inválidos
    res.status(400).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}

/**
 * atualiza o conteúdo de um comentário existente
 */
export const updateComment = async (req, res) => {
  try {
    const comment = await commentService.updateComment(
      Number(req.params.id),
      Number(req.params.commentId),
      req.body
    );
    
    res.json(comment);
  } catch (error) {

    res.status(404).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}

/**
 * deleta um comentário específico
 */
export const deleteComment = async (req, res) => {
  try {
    
    const result = await commentService.deleteComment(
      Number(req.params.id),
      Number(req.params.commentId)
    );
    
    
    res.json(result);
  } catch (error) {
   
    res.status(404).json({ error: "DEU ERRO CHAVALO, NA DEU, TENTA DEPOIS" });
  }
}
