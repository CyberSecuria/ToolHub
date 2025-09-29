import { query } from '../Config/database.js';

// Récupérer toutes les plateformes uniques
export async function getAllPlatforms(req, res) {
  try {
    const platforms = [
      { Platform_Name: 'Desktop' },
      { Platform_Name: 'Mobile' },
      { Platform_Name: 'Web' }
    ];
    res.json({ platforms });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}