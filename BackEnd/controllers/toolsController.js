import { query } from '../Config/database.js';

export async function getAllTools(req, res) {
  try {
    // Requête complète avec jointures pour inclure ID_User
    const rows = await query(`
      SELECT 
        t.ID_Tools,
        t.Name_Tools,
        t.Description_Tools,
        t.Link_Tools,
        t.ImageTools,
        t.Image_Alt,
        t.Add_Date,
        t.ID_Statut,
        t.ID_Category,
        t.ID_User,
        c.Name_Category,
        GROUP_CONCAT(DISTINCT o.Name_OS SEPARATOR ', ') as Name_OS,
        GROUP_CONCAT(DISTINCT p.Platform_Name SEPARATOR ', ') as Platform_Name,
        COALESCE(AVG(r.Stars), 0) as Stars
      FROM tools t
      LEFT JOIN category c ON t.ID_Category = c.ID_Category
      LEFT JOIN run_on ro ON t.ID_Tools = ro.ID_Tools
      LEFT JOIN os o ON ro.ID_OS = o.ID_OS
      LEFT JOIN need_platform np ON t.ID_Tools = np.ID_Tools
      LEFT JOIN platforms p ON np.ID_Platform = p.ID_Platform
      LEFT JOIN rating r ON t.ID_Tools = r.ID_Tools
      GROUP BY t.ID_Tools
      ORDER BY t.ID_Tools ASC
    `);
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
    Platform_Name,     // Nouveau champ pour les plateformes (peut être ignoré, on déduira depuis OS)
    ID_User            // ID de l'utilisateur qui crée l'outil
  } = req.body;

  // Validation obligatoire
  if (!Name_Tools || !Description_Tools || !ID_Category || !Link_Tools || !ImageTools || !Image_Alt) {
    return res.status(400).json({
      message: 'Please include Name_Tools, Description_Tools, Link_Tools, ImageTools, Image_Alt, and ID_Category.'
    });
  }

  // Validation de l'utilisateur
  if (!ID_User) {
    return res.status(400).json({
      message: 'ID_User is required. User must be authenticated to create tools.'
    });
  }

  try {
    // Vérifier que l'utilisateur existe
    const userRows = await query(
      'SELECT * FROM users WHERE ID_User = ?', 
      [ID_User]
    );
    if (!userRows || userRows.length === 0) {
      return res.status(400).json({ message: 'Invalid ID_User. User does not exist.' });
    }

    // Vérifier que la catégorie existe
    const categoryRows = await query(
      'SELECT * FROM category WHERE ID_Category = ?', 
      [ID_Category]
    );
    if (!categoryRows || categoryRows.length === 0) {
      return res.status(400).json({ message: 'Invalid ID_Category' });
    }

    // Préparer les champs et valeurs pour l'insertion (incluant ID_User)
    let fields = ['Name_Tools', 'Description_Tools', 'Link_Tools', 'ImageTools', 'Image_Alt', 'ID_Statut', 'ID_Category', 'ID_User', 'Add_Date'];
    let placeholders = ['?', '?', '?', '?', '?', '?', '?', '?', 'NOW()'];
    let values = [Name_Tools, Description_Tools, Link_Tools, ImageTools, Image_Alt, ID_Statut, ID_Category, ID_User];

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
    ID_Category,
    ID_User  // ID de l'utilisateur qui tente la modification
  } = req.body || {};

  // Vérification de l'utilisateur
  if (!ID_User) {
    return res.status(400).json({ message: 'ID_User is required for tool modification.' });
  }

  try {
    // Vérifier que l'outil existe et appartient à l'utilisateur
    const toolRows = await query('SELECT ID_User FROM tools WHERE ID_Tools = ?', [id]);
    if (!toolRows || toolRows.length === 0) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    const toolOwner = toolRows[0].ID_User;
    if (toolOwner !== ID_User) {
      return res.status(403).json({ message: 'You can only modify tools that you created.' });
    }
    const fields = [];
    const values = [];

    if (Name_Tools) { fields.push('Name_Tools = ?'); values.push(Name_Tools); }
    if (Description_Tools) { fields.push('Description_Tools = ?'); values.push(Description_Tools); }
    if (Link_Tools) { fields.push('Link_Tools = ?'); values.push(Link_Tools); }
    if (ImageTools) { 
      fields.push('ImageTools = ?'); 
      values.push(ImageTools);
      // Mettre à jour aussi Image_Alt si ImageTools est fourni
      if (Name_Tools) {
        fields.push('Image_Alt = ?'); 
        values.push(`${Name_Tools} icon`);
      }
    }
    if (Image_Alt && !ImageTools) { fields.push('Image_Alt = ?'); values.push(Image_Alt); }
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
  const { ID_User } = req.body || {};
  
  // Vérification de l'utilisateur
  if (!ID_User) {
    return res.status(400).json({ message: 'ID_User is required for tool deletion.' });
  }
  
  try {
    // Vérifier que l'outil existe et appartient à l'utilisateur
    const toolRows = await query('SELECT ID_User FROM tools WHERE ID_Tools = ?', [id]);
    if (!toolRows || toolRows.length === 0) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    const toolOwner = toolRows[0].ID_User;
    if (toolOwner !== ID_User) {
      return res.status(403).json({ message: 'You can only delete tools that you created.' });
    }
    
    // Utiliser une transaction avec désactivation temporaire des contraintes
    await query('START TRANSACTION');
    
    try {
      console.log(`Attempting to delete tool ${id} for user ${ID_User}`);
      
      // Désactiver temporairement les vérifications de clés étrangères
      await query('SET FOREIGN_KEY_CHECKS = 0');
      console.log('Foreign key checks disabled');
      
      // Vérifier d'abord ce qui existe
      const ratingCount = await query('SELECT COUNT(*) as count FROM rating WHERE ID_Tools = ?', [id]);
      const runOnCount = await query('SELECT COUNT(*) as count FROM run_on WHERE ID_Tools = ?', [id]);
      const needPlatformCount = await query('SELECT COUNT(*) as count FROM need_platform WHERE ID_Tools = ?', [id]);
      
      console.log(`Found ${ratingCount[0].count} ratings, ${runOnCount[0].count} run_on, ${needPlatformCount[0].count} need_platform`);
      
      // Supprimer tous les enregistrements liés
      if (ratingCount[0].count > 0) {
        await query('DELETE FROM rating WHERE ID_Tools = ?', [id]);
        console.log('Deleted ratings');
      }
      
      if (runOnCount[0].count > 0) {
        await query('DELETE FROM run_on WHERE ID_Tools = ?', [id]);
        console.log('Deleted run_on');
      }
      
      if (needPlatformCount[0].count > 0) {
        await query('DELETE FROM need_platform WHERE ID_Tools = ?', [id]);
        console.log('Deleted need_platform');
      }
      
      // Supprimer l'outil principal
      await query('DELETE FROM tools WHERE ID_Tools = ?', [id]);
      console.log('Deleted main tool');
      
      // Réactiver les vérifications de clés étrangères
      await query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('Foreign key checks re-enabled');
      
      // Valider la transaction
      await query('COMMIT');
      console.log('Transaction committed successfully');
      res.status(204).end();
      
    } catch (deleteError) {
      // Réactiver les contraintes et annuler la transaction en cas d'erreur
      try {
        await query('SET FOREIGN_KEY_CHECKS = 1');
        await query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError);
      }
      console.error('Delete error:', deleteError);
      
      // Essayer une méthode alternative sans transaction
      try {
        console.log('Trying alternative deletion method...');
        await query('SET FOREIGN_KEY_CHECKS = 0');
        
        // Supprimer directement sans transaction
        await query('DELETE FROM rating WHERE ID_Tools = ?', [id]);
        await query('DELETE FROM run_on WHERE ID_Tools = ?', [id]);
        await query('DELETE FROM need_platform WHERE ID_Tools = ?', [id]);
        await query('DELETE FROM tools WHERE ID_Tools = ?', [id]);
        
        await query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Alternative deletion successful');
        res.status(204).end();
        return;
      } catch (altError) {
        await query('SET FOREIGN_KEY_CHECKS = 1');
        console.error('Alternative deletion failed:', altError);
        throw deleteError;
      }
    }
  } catch (err) {
    console.error('Final error:', err);
    res.status(500).json({ error: err.message });
  }
}
