import { query } from '../Config/database.js';

// Récupérer toutes les plateformes uniques depuis la base (dérivées des outils saisis)
export async function getAllPlatforms(req, res) {
  try {
    // Votre schéma: table `platforms` avec colonnes (ID_Platform, Platform_Name)
    const rows = await query(
      `SELECT DISTINCT Platform_Name AS name 
       FROM platforms 
       WHERE Platform_Name IS NOT NULL AND Platform_Name <> '' 
       ORDER BY Platform_Name`
    );
    const platforms = (rows || [])
      .map(r => ({ Platform_Name: String(r.name || '').trim() }))
      .filter(p => p.Platform_Name.length > 0);

    res.json({ platforms });
  } catch (err) {
    console.error('[platforms] error:', err);
    res.status(500).json({ error: err.message });
  }
}