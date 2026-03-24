import db from "../db.js";

export const checkUserExists = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }
    
    req.user = rows[0];
    next();
  } catch (error) {
    res.status(404).json({ error: "Utilizador não encontrado" });
  }
};
