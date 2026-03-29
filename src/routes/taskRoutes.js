import express from "express";
import * as taskController from "../controllers/taskController.js";
import * as commentController from "../controllers/commentController.js";

const router = express.Router();

router.get("/", taskController.getTasks);
router.get("/stats", taskController.getTaskStats);
router.post("/", taskController.createTask);
router.post("/:id/tags", taskController.addTagToTask);
router.delete("/:id/tags/:tagId", taskController.removeTagFromTask);
router.get("/:id/comments", commentController.getCommentsByTask);
router.post("/:id/comments", commentController.createComment);
router.put("/:id/comments/:commentId", commentController.updateComment);
router.delete("/:id/comments/:commentId", commentController.deleteComment);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
