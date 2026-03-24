import * as commentService from "../services/commentService.js";

// GET /tasks/:id/comments
export const getCommentsByTask = async (req, res) => {
  try {
    const comments = await commentService.getCommentsByTaskId(Number(req.params.id));
    res.json(comments);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

// POST /tasks/:id/comments
export const createComment = async (req, res) => {
  try {
    const comment = await commentService.createComment(Number(req.params.id), req.body);
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// PUT /tasks/:id/comments/:commentId
export const updateComment = async (req, res) => {
  try {
    const comment = await commentService.updateComment(
      Number(req.params.id),
      Number(req.params.commentId),
      req.body
    );
    res.json(comment);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

// DELETE /tasks/:id/comments/:commentId
export const deleteComment = async (req, res) => {
  try {
    const result = await commentService.deleteComment(
      Number(req.params.id),
      Number(req.params.commentId)
    );
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}
