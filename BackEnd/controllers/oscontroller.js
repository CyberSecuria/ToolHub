import { query } from '../Config/database.js';

// Récupérer tous les OS uniques
export async function getAllOS(req, res) {
  try {
    const rows = await query('SELECT ID_OS, Name_OS FROM os ORDER BY Name_OS');
    res.json({ os: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}