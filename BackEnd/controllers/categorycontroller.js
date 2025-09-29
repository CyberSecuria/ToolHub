import { query } from '../Config/database.js';

// Récupérer toutes les catégories
export async function getAllCategories(req, res) {
  try {
    const rows = await query('SELECT ID_Category, Name_Category FROM category ORDER BY Name_Category');
    res.json({ categories: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}