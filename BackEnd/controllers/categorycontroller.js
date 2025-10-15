// Import database query function
import { query } from '../Config/database.js';

// Retrieve all categories from the database
export async function getAllCategories(req, res) {
  try {
    // Get all categories ordered by name
    const rows = await query('SELECT ID_Category, Name_Category FROM category ORDER BY Name_Category');
    res.json({ categories: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Create a new category
export async function createCategory(req, res) {
  const { Name_Category } = req.body;
  
  // Validate category name
  if (!Name_Category || Name_Category.trim() === '') {
    return res.status(400).json({ message: 'Name_Category is required' });
  }
  
  try {
    // Check if category already exists
    const existingRows = await query('SELECT ID_Category FROM category WHERE Name_Category = ?', [Name_Category.trim()]);
    if (existingRows && existingRows.length > 0) {
      return res.status(409).json({ message: 'Category already exists' });
    }
    
    // Insert new category into database
    const result = await query('INSERT INTO category (Name_Category) VALUES (?)', [Name_Category.trim()]);
    
    const newCategory = {
      ID_Category: result.insertId,
      Name_Category: Name_Category.trim()
    };
    
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update an existing category
export async function updateCategory(req, res) {
  const { id } = req.params;
  const { Name_Category } = req.body;
  
  // Validate category name
  if (!Name_Category || Name_Category.trim() === '') {
    return res.status(400).json({ message: 'Name_Category is required' });
  }
  
  try {
    // Check if category exists
    const existingRows = await query('SELECT ID_Category FROM category WHERE ID_Category = ?', [id]);
    if (!existingRows || existingRows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if new name is not already used by another category
    const duplicateRows = await query('SELECT ID_Category FROM category WHERE Name_Category = ? AND ID_Category != ?', [Name_Category.trim(), id]);
    if (duplicateRows && duplicateRows.length > 0) {
      return res.status(409).json({ message: 'Category name already exists' });
    }
    
    // Update category in database
    await query('UPDATE category SET Name_Category = ? WHERE ID_Category = ?', [Name_Category.trim(), id]);
    
    const updatedCategory = {
      ID_Category: parseInt(id),
      Name_Category: Name_Category.trim()
    };
    
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete a category by ID
export async function deleteCategory(req, res) {
  const { id } = req.params;
  
  try {
    // Check if category exists
    const existingRows = await query('SELECT ID_Category FROM category WHERE ID_Category = ?', [id]);
    if (!existingRows || existingRows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if any tools are using this category
    const toolsRows = await query('SELECT COUNT(*) as count FROM tools WHERE ID_Category = ?', [id]);
    if (toolsRows && toolsRows[0].count > 0) {
      return res.status(409).json({ message: 'Cannot delete category: it is used by existing tools' });
    }
    
    // Delete category from database
    await query('DELETE FROM category WHERE ID_Category = ?', [id]);
    
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}