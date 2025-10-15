// Import database query function
import { query } from '../Config/database.js';

// Retrieve all unique platforms from the database (derived from entered tools)
export async function getAllPlatforms(req, res) {
  try {
    // Database schema: table `platforms` with columns (ID_Platform, Platform_Name)
    const rows = await query(
      `SELECT DISTINCT Platform_Name AS name 
       FROM platforms 
       WHERE Platform_Name IS NOT NULL AND Platform_Name <> '' 
       ORDER BY Platform_Name`
    );
    // Map and filter platform names
    const platforms = (rows || [])
      .map(r => ({ Platform_Name: String(r.name || '').trim() }))
      .filter(p => p.Platform_Name.length > 0);

    res.json({ platforms });
  } catch (err) {
    console.error('[platforms] error:', err);
    res.status(500).json({ error: err.message });
  }
}