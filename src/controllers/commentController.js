import * as commentService from "../services/commentService.js";

/**
 * busca todos os comentários de uma tarefa específica
 * GET /tasks/:id/comments
 */
export const getCommentsByTask = async (req, res) => {
  try {
    // req.params.id contém o ID da tarefa na URL (/tasks/5/comments → id = "5")
    // Number() converte de string para número
    const comments = await commentService.getCommentsByTaskId(Number(req.params.id));
    
    // Retorna array de comentários da tarefa, ordenados por data de criação
    res.json(comments);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

/**
 * cria um novo comentário para uma tarefa
 * POST /tasks/:id/comments
 */
export const createComment = async (req, res) => {
  try {
    // req.params.id contém o ID da tarefa (/tasks/5/comments → id = "5")
    // req.body contém os dados do comentário: { user_id: 2, conteudo: "Texto..." }
    const comment = await commentService.createComment(Number(req.params.id), req.body);
    
    // Retorna o comentário criado com status 201 (Created)
    res.status(201).json(comment);
  } catch (error) {
    // Erro 400 (Bad Request) se os dados forem inválidos
    res.status(400).json({ error: error.message });
  }
}

/**
 * atualiza o conteúdo de um comentário existente
 * PUT /tasks/:id/comments/:commentId
 */
export const updateComment = async (req, res) => {
  try {
    // req.params.id = ID da tarefa (/tasks/5/comments/10 → id = "5")
    // req.params.commentId = ID do comentário (→ commentId = "10")
    // req.body contém o novo conteúdo: { conteudo: "Texto atualizado..." }
    const comment = await commentService.updateComment(
      Number(req.params.id),
      Number(req.params.commentId),
      req.body
    );
    
    // Retorna o comentário atualizado
    res.json(comment);
  } catch (error) {
    // Erro 404 (Not Found) se o comentário não existir
    res.status(404).json({ error: error.message });
  }
}

/**
 * deleta um comentário específico
 * DELETE /tasks/:id/comments/:commentId
 */
export const deleteComment = async (req, res) => {
  try {
    // req.params.id = ID da tarefa (/tasks/5/comments/10 → id = "5")
    // req.params.commentId = ID do comentário (→ commentId = "10")
    // Valida que o comentário pertence à tarefa correta
    const result = await commentService.deleteComment(
      Number(req.params.id),
      Number(req.params.commentId)
    );
    
    // Retorna mensagem de sucesso
    res.json(result);
  } catch (error) {
    // Erro 404 (Not Found) se o comentário não existir
    res.status(404).json({ error: error.message });
  }
}
