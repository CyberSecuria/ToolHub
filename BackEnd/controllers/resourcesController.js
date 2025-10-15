// Import database query function
import { query } from '../Config/database.js';

// Retrieve all educational resources from the database
export async function getAllResources(req, res) {
  try {
    // Get all resources ordered by ID
    const rows = await query(
      'SELECT ID_Ressource, Title, Path FROM ressources ORDER BY ID_Ressource ASC'
    );
    res.json({ resources: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get a specific resource by ID
export async function getResourceById(req, res) {
  const { id } = req.params;
  try {
    // Find resource by ID
    const rows = await query(
      'SELECT ID_Ressource, Title, Path FROM ressources WHERE ID_Ressource = ?',
      [id]
    );
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Resource not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Create a new resource
export async function createResource(req, res) {
  const { Title, Path } = req.body || {};
  // Validate required fields
  if (!Title || !Path) {
    return res.status(400).json({ message: 'Please include Title and Path.' });
  }
  try {
    // Insert new resource into database
    const result = await query(
      'INSERT INTO ressources (Title, Path) VALUES (?, ?)',
      [Title, Path]
    );
    res.status(201).json({ ID_Ressource: result.insertId, Title, Path });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update an existing resource
export async function updateResource(req, res) {
  const { id } = req.params;
  const { Title, Path } = req.body || {};
  try {
    // Build dynamic update query based on provided fields
    const fields = [];
    const values = [];
    if (Title) { fields.push('Title = ?'); values.push(Title); }
    if (Path) { fields.push('Path = ?'); values.push(Path); }
    if (fields.length === 0) return res.status(400).json({ message: 'No fields provided to update' });
    values.push(id);
    // Update resource in database
    await query(`UPDATE ressources SET ${fields.join(', ')} WHERE ID_Ressource = ?`, values);
    // Retrieve updated resource
    const rows = await query('SELECT ID_Ressource, Title, Path FROM ressources WHERE ID_Ressource = ?', [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Resource not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete a resource by ID
export async function deleteResource(req, res) {
  const { id } = req.params;
  try {
    // Remove resource from database
    await query('DELETE FROM ressources WHERE ID_Ressource = ?', [id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



