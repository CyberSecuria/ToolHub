// Import database query function
import { query } from '../Config/database.js';

// Add a new bookmark for a user
export async function addBookmark(req, res) {
  const { toolId, userId } = req.body || {};
  // Validate required fields
  if (!toolId || !userId) return res.status(400).json({ error: 'toolId and userId required' });
  try {
    // Insert bookmark into database
    const result = await query('INSERT INTO bookmarks (tool_id, user_id) VALUES (?, ?)', [toolId, userId]);
    const insertId = result && result.insertId ? result.insertId : null;
    if (insertId) {
      // Retrieve the newly created bookmark
      const rows = await query('SELECT id, tool_id AS toolId, user_id AS userId FROM bookmarks WHERE id = ?', [insertId]);
      return res.status(201).json(rows[0]);
    }
    res.status(201).json({ toolId, userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Retrieve all bookmarks from the database
export async function getAllBookmarks(req, res) {
  try {
    // Get all bookmarks (limited to 200)
    const rows = await query('SELECT id, tool_id AS toolId, user_id AS userId FROM bookmarks LIMIT 200');
    res.json({ bookmarks: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get bookmarks for a specific user by user ID
export async function getBookmarksById(req, res) {
  const { Id } = req.params; // Route parameter uses capital Id
  try {
    // Find bookmark by ID
    const rows = await query('SELECT id, tool_id AS toolId, user_id AS userId FROM bookmarks WHERE id = ?', [Id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Bookmark not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete a bookmark by ID
export async function deleteBookmark(req, res) {
  const { id } = req.params;
  try {
    // Remove bookmark from database
    await query('DELETE FROM bookmarks WHERE id = ?', [id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
