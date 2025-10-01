import { query } from '../Config/database.js';

export async function getAllTools(req, res) {
  try {
    // Read from view to include Name_Category, Name_OS, Platform_Name, Stars
    const rows = await query('SELECT * FROM `v_tools_summary` ORDER BY ID_Tools ASC');
    res.json({ tools: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getToolById(req, res) {
  const { id } = req.params;
  try {
    const rows = await query('SELECT * FROM v_tools_summary WHERE ID_Tools = ?', [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Tool not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



export const createTool = async (req, res) => {
  const {
    Name_Tools,
    Description_Tools,
    Link_Tools,
    ImageTools,
    Image_Alt,
    ID_Statut = 1,   // par défaut Active
    ID_Category,
    Name_OS,           // Nouveau champ pour les OS
    Platform_Name      // Nouveau champ pour les plateformes (peut être ignoré, on déduira depuis OS)
  } = req.body;

  // Validation obligatoire
  if (!Name_Tools || !Description_Tools || !ID_Category || !Link_Tools || !ImageTools || !Image_Alt) {
    return res.status(400).json({
      message: 'Please include Name_Tools, Description_Tools, Link_Tools, ImageTools, Image_Alt, and ID_Category.'
    });
  }

  try {
    // Vérifier que la catégorie existe
    const categoryRows = await query(
      'SELECT * FROM category WHERE ID_Category = ?', 
      [ID_Category]
    );
    if (!categoryRows || categoryRows.length === 0) {
      return res.status(400).json({ message: 'Invalid ID_Category' });
    }

    // Préparer les champs et valeurs pour l'insertion (uniquement colonnes existantes de tools)
    let fields = ['Name_Tools', 'Description_Tools', 'Link_Tools', 'ImageTools', 'Image_Alt', 'ID_Statut', 'ID_Category', 'Add_Date'];
    let placeholders = ['?', '?', '?', '?', '?', '?', '?', 'NOW()'];
    let values = [Name_Tools, Description_Tools, Link_Tools, ImageTools, Image_Alt, ID_Statut, ID_Category];

    // Insérer le nouvel outil
    const result = await query(
      `INSERT INTO tools (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`,
      values
    );

    const insertedToolId = result.insertId;

    // Link tool to OS via run_on (tool ↔ os)
    try {
      if (Name_OS && typeof Name_OS === 'string') {
        const osList = Name_OS.split(',')
          .map(o => String(o || '').trim())
          .filter(o => o.length > 0);
        for (const osNameRaw of osList) {
          const found = await query('SELECT ID_OS FROM os WHERE LOWER(Name_OS) = LOWER(?) LIMIT 1', [osNameRaw]);
          if (found && found.length > 0) {
            const idOs = found[0].ID_OS;
            await query(
              'INSERT IGNORE INTO run_on (ID_Tools, ID_OS) VALUES (?, ?)',
              [insertedToolId, idOs]
            );
          }
        }
      }
    } catch (e) {
      // ignore OS link errors
    }

    // Upsert Platform record if Platform_Name provided
    // Link tool to Platform via need_platform (tool ↔ platforms)
    // Déduire la/les plateformes à partir des OS sélectionnés
    try {
      const inferredPlatforms = new Set();
      if (Name_OS && typeof Name_OS === 'string') {
        const osTokens = Name_OS.split(',').map(o => String(o || '').trim().toLowerCase());
        if (osTokens.some(x => x.includes('android') || x.includes('ios'))) {
          inferredPlatforms.add('Mobile');
        }
        if (osTokens.some(x => x.includes('windows') || x.includes('mac') || x.includes('macos') || x.includes('linux'))) {
          inferredPlatforms.add('Desktop');
        }
      }
      // Si une plateforme est fournie explicitement, on l'ajoute aussi
      if (Platform_Name && typeof Platform_Name === 'string' && Platform_Name.trim().length > 0) {
        inferredPlatforms.add(Platform_Name.trim());
      }

      for (const platformLabel of inferredPlatforms) {
        const found = await query('SELECT ID_Platform FROM platforms WHERE LOWER(Platform_Name) = LOWER(?) LIMIT 1', [platformLabel]);
        if (found && found.length > 0) {
          const idPlatform = found[0].ID_Platform;
          await query(
            'INSERT IGNORE INTO need_platform (ID_Tools, ID_Platform) VALUES (?, ?)',
            [insertedToolId, idPlatform]
          );
        }
      }
    } catch (e) {
      // ignore platform link errors
    }

    // Insert default rating = 1 without user id
    try {
      await query(
        'INSERT INTO rating (ID_User, ID_Tools, Add_Date, Description, Stars) VALUES (NULL, ?, NOW(), ?, ?)',
        [insertedToolId, '', 1]
      );
    } catch (e) {
      // Ne pas bloquer la création d'outil si l'insert rating échoue
      // Optionnel: log
      // console.warn('rating insert failed:', e?.message);
    }

    const newTool = {
      ID_Tools: insertedToolId,
      Name_Tools,
      Description_Tools,
      Link_Tools,
      ImageTools,
      Image_Alt,
      ID_Statut,
      ID_Category,
      Name_OS: Name_OS || null,
      Platform_Name: Platform_Name || null
    };

    res.status(201).json(newTool);

  } catch (error) {
    console.error('Error creating tool:', error);
    res.status(500).json({ message: error.message, details: error.toString() });
  }
};


  export const updateTool = async (req, res) => {
  const { id } = req.params;
  const {
    Name_Tools,
    Description_Tools,
    Link_Tools,
    ImageTools,
    Image_Alt,
    ID_Statut,
    ID_Category
  } = req.body || {};

  try {
    const fields = [];
    const values = [];

    if (Name_Tools) { fields.push('Name_Tools = ?'); values.push(Name_Tools); }
    if (Description_Tools) { fields.push('Description_Tools = ?'); values.push(Description_Tools); }
    if (Link_Tools) { fields.push('Link_Tools = ?'); values.push(Link_Tools); }
    if (ImageTools) { fields.push('ImageTools = ?'); values.push(ImageTools); }
    if (Image_Alt) { fields.push('Image_Alt = ?'); values.push(Image_Alt); }
    if (ID_Statut) { fields.push('ID_Statut = ?'); values.push(ID_Statut); }

    // Vérifier que la catégorie existe si ID_Category fourni
    if (ID_Category) {
      const categoryRows = await query('SELECT * FROM category WHERE ID_Category = ?', [ID_Category]);
      if (!categoryRows || categoryRows.length === 0) {
        return res.status(400).json({ message: 'Invalid ID_Category' });
      }
      fields.push('ID_Category = ?');
      values.push(ID_Category);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields provided to update' });
    }

    values.push(id);

    // Update dynamique
    await query(`UPDATE tools SET ${fields.join(', ')} WHERE ID_Tools = ?`, values);

    const rows = await query('SELECT * FROM tools WHERE ID_Tools = ?', [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ message: 'Tool not found' });

    res.json(rows[0]);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export async function deleteTool(req, res) {
  const { id } = req.params;
  try {
  await query('DELETE FROM tools WHERE ID_Tools = ?', [id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
