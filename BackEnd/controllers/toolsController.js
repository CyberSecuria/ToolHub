import { query } from '../Config/database.js';

export async function getAllTools(req, res) {
  try {
    const rows = await query('SELECT ID_Tools, Name_Tools, Description_Tools FROM tools LIMIT 100');
    res.json({ tools: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getToolById(req, res) {
  const { id } = req.params;
  try {
    const rows = await query('SELECT id, name, description FROM tools WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Tool not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createTool(req, res) {
  const { name, description } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name required' });
  try {
    const result = await query('INSERT INTO tools (name, description) VALUES (?, ?)', [name, description || null]);
    const insertId = result && result.insertId ? result.insertId : null;
    if (insertId) {
      const rows = await query('SELECT id, name, description FROM tools WHERE id = ?', [insertId]);
      return res.status(201).json(rows[0]);
    }
    // fallback: return submitted data
    res.status(201).json({ name, description });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateTool(req, res) {
  const { id } = req.params;
  const { name, description } = req.body || {};
  try {
    await query('UPDATE tools SET name = ?, description = ? WHERE id = ?', [name, description, id]);
    const rows = await query('SELECT id, name, description FROM tools WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Tool not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteTool(req, res) {
  const { id } = req.params;
  try {
    await query('DELETE FROM tools WHERE id = ?', [id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
