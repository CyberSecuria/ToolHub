// Import database query function
import { query } from '../Config/database.js';

// Retrieve all tools from the database with related data
export async function getAllTools(req, res) {
  try {
    // Complete query with joins to include ID_User, category, OS, platforms, and ratings
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

// Get a specific tool by ID with all related data
export async function getToolById(req, res) {
  const { id } = req.params;
  try {
    // Use the same query as getAllTools but for a single tool
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
      WHERE t.ID_Tools = ?
      GROUP BY t.ID_Tools
    `, [id]);
    
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Tool not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



// Create a new tool in the database
export const createTool = async (req, res) => {
  const {
    Name_Tools,
    Description_Tools,
    Link_Tools,
    ImageTools,
    Image_Alt,
    ID_Statut = 1,   // Default status: Active
    ID_Category,
    Name_OS,           // Operating systems for the tool
    Platform_Name,     // Platforms for the tool (can be inferred from OS)
    ID_User            // ID of the user creating the tool
  } = req.body;

  // Validate required fields
  if (!Name_Tools || !Description_Tools || !ID_Category || !Link_Tools || !ImageTools || !Image_Alt) {
    return res.status(400).json({
      message: 'Please include Name_Tools, Description_Tools, Link_Tools, ImageTools, Image_Alt, and ID_Category.'
    });
  }

  // Validate user authentication
  if (!ID_User) {
    return res.status(400).json({
      message: 'ID_User is required. User must be authenticated to create tools.'
    });
  }

  try {
    // Verify that the user exists in database
    const userRows = await query(
      'SELECT * FROM users WHERE ID_User = ?', 
      [ID_User]
    );
    if (!userRows || userRows.length === 0) {
      return res.status(400).json({ message: 'Invalid ID_User. User does not exist.' });
    }

    // Verify that the category exists in database
    const categoryRows = await query(
      'SELECT * FROM category WHERE ID_Category = ?', 
      [ID_Category]
    );
    if (!categoryRows || categoryRows.length === 0) {
      return res.status(400).json({ message: 'Invalid ID_Category' });
    }

    // Prepare fields and values for insertion (including ID_User)
    let fields = ['Name_Tools', 'Description_Tools', 'Link_Tools', 'ImageTools', 'Image_Alt', 'ID_Statut', 'ID_Category', 'ID_User', 'Add_Date'];
    let placeholders = ['?', '?', '?', '?', '?', '?', '?', '?', 'NOW()'];
    let values = [Name_Tools, Description_Tools, Link_Tools, ImageTools, Image_Alt, ID_Statut, ID_Category, ID_User];

    // Insert the new tool into database
    const result = await query(
      `INSERT INTO tools (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`,
      values
    );

    const insertedToolId = result.insertId;

    // Link tool to operating systems via run_on table (many-to-many relationship)
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

    // Deduce the platform(s) from the selected operating systems
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
      // If a platform is explicitly provided, it is also added.
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
      // Do not block tool creation if the rating insertion fails
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

// Update an existing tool in the database
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
    ID_User,  // ID of the user attempting the modification
    Name_OS,  // New field for operating systems
    Platform_Name,  // New field for platforms
    New_ID_User  // New tool owner (for admins)
  } = req.body || {};

  // User verification
  if (!ID_User) {
    return res.status(400).json({ message: 'ID_User is required for tool modification.' });
  }

  try {
    // Verify that the tool exists
    const toolRows = await query('SELECT ID_User FROM tools WHERE ID_Tools = ?', [id]);
    if (!toolRows || toolRows.length === 0) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    // Check if the user is an admin
    const userRows = await query('SELECT ID_Role FROM users WHERE ID_User = ?', [ID_User]);
    if (!userRows || userRows.length === 0) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const userRole = userRows[0].ID_Role;
    const toolOwner = toolRows[0].ID_User;
    
    // Allow modification if the user is the owner OR an admin (ID_Role = 3)
    if (toolOwner !== ID_User && userRole !== 3) {
      return res.status(403).json({ message: 'You can only modify tools that you created, unless you are an admin.' });
    }
    const fields = [];
    const values = [];

    // Process all possible fields
    if (Name_Tools !== undefined && Name_Tools !== null && Name_Tools !== '') { 
      fields.push('Name_Tools = ?'); 
      values.push(Name_Tools); 
    }
    
    if (Description_Tools !== undefined && Description_Tools !== null && Description_Tools !== '') { 
      fields.push('Description_Tools = ?'); 
      values.push(Description_Tools); 
    }
    
    if (Link_Tools !== undefined && Link_Tools !== null && Link_Tools !== '') { 
      fields.push('Link_Tools = ?'); 
      values.push(Link_Tools); 
    }
    
    if (ImageTools !== undefined && ImageTools !== null && ImageTools !== '') { 
      fields.push('ImageTools = ?'); 
      values.push(ImageTools);
    }
    
    // Handle Image_Alt – either provided explicitly or generated from Name_Tools
    if (Image_Alt !== undefined && Image_Alt !== null && Image_Alt !== '') {
      fields.push('Image_Alt = ?'); 
      values.push(Image_Alt);
    } else if (Name_Tools) {
      fields.push('Image_Alt = ?'); 
      values.push(`${Name_Tools} icon`);
    }
    
    if (ID_Statut !== undefined && ID_Statut !== null) { 
      fields.push('ID_Statut = ?'); 
      values.push(ID_Statut); 
    }

    // Verify that the category exists if ID_Category is provided
    if (ID_Category) {
      const categoryRows = await query('SELECT * FROM category WHERE ID_Category = ?', [ID_Category]);
      if (!categoryRows || categoryRows.length === 0) {
        return res.status(400).json({ message: 'Invalid ID_Category' });
      }
      fields.push('ID_Category = ?');
      values.push(ID_Category);
    }

    // Allow admins to change the tool owner
    if (New_ID_User) {
      if (userRole !== 3) {
        return res.status(403).json({ message: 'Only admins can change tool ownership' });
      }
      
      // Verify that the new owner exists
      const newOwnerRows = await query('SELECT ID_User FROM users WHERE ID_User = ?', [New_ID_User]);
      if (!newOwnerRows || newOwnerRows.length === 0) {
        return res.status(400).json({ message: 'Invalid New_ID_User' });
      }
      
      fields.push('ID_User = ?');
      values.push(New_ID_User);
      console.log(`UPDATE TOOL - Changing owner to user ID: ${New_ID_User}`);
    }

    if (fields.length === 0) {
      console.log('UPDATE TOOL - No fields to update');
      return res.status(400).json({ message: 'No fields provided to update' });
    }

    values.push(id);
    
    // Dynamic update
    const updateQuery = `UPDATE tools SET ${fields.join(', ')} WHERE ID_Tools = ?`;
    console.log('UPDATE TOOL - SQL Query:', updateQuery);
    
    await query(updateQuery, values);

    // Handle OS if provided
    if (Name_OS !== undefined) {
      // Delete old OS associations
      await query('DELETE FROM run_on WHERE ID_Tools = ?', [id]);
      
      if (Name_OS && Name_OS.trim() !== '') {
        const osList = Name_OS.split(',').map(os => os.trim()).filter(os => os);
        for (const osName of osList) {
          // Check if the OS exists, otherwise create it
          let osRows = await query('SELECT ID_OS FROM os WHERE Name_OS = ?', [osName]);
          let osId;
          
          if (!osRows || osRows.length === 0) {
            // Create the new OS
            const insertResult = await query('INSERT INTO os (Name_OS) VALUES (?)', [osName]);
            osId = insertResult.insertId;
          } else {
            osId = osRows[0].ID_OS;
          }
          
          // Create the association
          await query('INSERT INTO run_on (ID_Tools, ID_OS) VALUES (?, ?)', [id, osId]);
        }
      }
    }

    // Handle platforms if provided
    if (Platform_Name !== undefined) {
      // Delete old platform associations
      await query('DELETE FROM need_platform WHERE ID_Tools = ?', [id]);
      
      if (Platform_Name && Platform_Name.trim() !== '') {
        const platformList = Platform_Name.split(',').map(platform => platform.trim()).filter(platform => platform);
        for (const platformName of platformList) {
          // Check if the platform exists, otherwise create it
          let platformRows = await query('SELECT ID_Platform FROM platforms WHERE Platform_Name = ?', [platformName]);
          let platformId;
          
          if (!platformRows || platformRows.length === 0) {
            // Create the new platform
            const insertResult = await query('INSERT INTO platforms (Platform_Name) VALUES (?)', [platformName]);
            platformId = insertResult.insertId;
          } else {
            platformId = platformRows[0].ID_Platform;
          }
          
          // Create the platform association
          await query('INSERT INTO need_platform (ID_Tools, ID_Platform) VALUES (?, ?)', [id, platformId]);
        }
      }
    }

    const rows = await query('SELECT * FROM tools WHERE ID_Tools = ?', [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ message: 'Tool not found' });

    res.json(rows[0]);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a tool from the database
export async function deleteTool(req, res) {
  const { id } = req.params;
  const { ID_User } = req.body || {};
  
  // User verification
  if (!ID_User) {
    return res.status(400).json({ message: 'ID_User is required for tool deletion.' });
  }
  
  try {
    // Check that the tool exists
    const toolRows = await query('SELECT ID_User FROM tools WHERE ID_Tools = ?', [id]);
    if (!toolRows || toolRows.length === 0) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    
    // Check if the user is an admin
    const userRows = await query('SELECT ID_Role FROM users WHERE ID_User = ?', [ID_User]);
    if (!userRows || userRows.length === 0) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const userRole = userRows[0].ID_Role;
    const toolOwner = toolRows[0].ID_User;
    
    // Allow deletion if the user is the owner OR an admin (ID_Role = 3)
    if (toolOwner !== ID_User && userRole !== 3) {
      return res.status(403).json({ message: 'You can only delete tools that you created, unless you are an admin.' });
    }
    
    // Use a transaction with temporary constraint disabling
    await query('START TRANSACTION');
    
    try {
      console.log(`Attempting to delete tool ${id} for user ${ID_User}`);
      
      // Temporarily disable foreign key checks
      await query('SET FOREIGN_KEY_CHECKS = 0');
      console.log('Foreign key checks disabled');
      
      // First verify what exists
      const ratingCount = await query('SELECT COUNT(*) as count FROM rating WHERE ID_Tools = ?', [id]);
      const runOnCount = await query('SELECT COUNT(*) as count FROM run_on WHERE ID_Tools = ?', [id]);
      const needPlatformCount = await query('SELECT COUNT(*) as count FROM need_platform WHERE ID_Tools = ?', [id]);
      
      console.log(`Found ${ratingCount[0].count} ratings, ${runOnCount[0].count} run_on, ${needPlatformCount[0].count} need_platform`);
      
      // Delete all related records
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
      
      // Delete the main tool
      await query('DELETE FROM tools WHERE ID_Tools = ?', [id]);
      console.log('Deleted main tool');
      
      // Re-enable foreign key checks
      await query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('Foreign key checks re-enabled');
      
      // Commit the transaction
      await query('COMMIT');
      console.log('Transaction committed successfully');
      res.status(204).end();
      
    } catch (deleteError) {
      // Re-enable constraints and roll back the transaction in case of error
      try {
        await query('SET FOREIGN_KEY_CHECKS = 1');
        await query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError);
      }
      console.error('Delete error:', deleteError);
      
      // Try an alternative method without a transaction
      try {
        await query('SET FOREIGN_KEY_CHECKS = 0');
        
        // Delete directly without a transaction
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
