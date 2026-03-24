import * as tagService from "../services/tagService.js";

export const getTags = (req, res) => {
  try {
    const tags = tagService.getTags();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const createTag = (req, res) => {
  try {
    const tag = tagService.createTag(req.body);
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const deleteTag = (req, res) => {
  try {
    tagService.deleteTag(Number(req.params.id));
    res.json({ message: "Tag deletada com sucesso" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

export const getTasksForTag = (req, res) => {
  try {
    const tasks = tagService.getTasksForTag(Number(req.params.id));
    res.json(tasks);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}
