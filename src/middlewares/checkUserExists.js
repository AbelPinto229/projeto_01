import { db } from "../db.js";

// Middleware que verifica se existe um usuário com o id fornecido na URL.
// Se existir, adiciona o objeto do usuário em req.user; senão, retorna erro 404.
export const checkUserExists = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "DEU ERRO CHAVALO; NA DEU; TENTA DEPOIS" });
    }
    req.user = rows[0];
    next();
  } catch (error) {
    res.status(404).json({ error: "DEU ERRO CHAVALO; NA DEU; TENTA DEPOIS" });
  }
};
