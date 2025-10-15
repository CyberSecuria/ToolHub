// Import database query function
import { query } from '../Config/database.js';

// Retrieve all unique operating systems from the database
export async function getAllOS(req, res) {
  try {
    // Get all OS ordered by name
    const rows = await query('SELECT ID_OS, Name_OS FROM os ORDER BY Name_OS');
    res.json({ os: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}