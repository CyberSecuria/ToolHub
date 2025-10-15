// Import database query function
import { query } from '../Config/database.js';

// Retrieve all roles from the database
export async function getAllRoles(req, res) {
  try {
    // Get all roles ordered by ID
    const rows = await query('SELECT ID_Role, Name_Role FROM roles ORDER BY ID_Role');
    res.json({ roles: rows });
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ error: err.message });
  }
}

// Update an existing role
export async function updateRole(req, res) {
  const { id } = req.params;
  const { Name_Role } = req.body;
  
  try {
    // Check if role exists
    const existingRows = await query('SELECT ID_Role FROM roles WHERE ID_Role = ?', [id]);
    if (!existingRows || existingRows.length === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    // Update role in database
    await query('UPDATE roles SET Name_Role = ? WHERE ID_Role = ?', [Name_Role, id]);
    
    // Retrieve the updated role
    const updatedRows = await query('SELECT ID_Role, Name_Role FROM roles WHERE ID_Role = ?', [id]);
    
    res.json(updatedRows[0]);
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ error: err.message });
  }
}
