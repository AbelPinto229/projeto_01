import * as commentService from "../services/commentService.js";

export const getCommentsByTask = (req, res) => {
  try {
    const comments = commentService.getCommentsByTask(Number(req.params.id));
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const createComment = (req, res) => {
  try {
    const commentData = {
      taskId: Number(req.params.id),
      userId: req.body.userId,
      conteudo: req.body.conteudo
    };
    const comment = commentService.createComment(commentData);
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
