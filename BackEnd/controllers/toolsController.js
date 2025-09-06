import { query } from '../Config/database.js';

export async function getAllTools(req, res) {
  try {
    const rows = await query(
      'SELECT * FROM tools'
    );
    res.json({ tools: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getToolById(req, res) {
  const { id } = req.params;
  try {
     const rows = await query('SELECT * FROM tools WHERE ID_Tools = ?', [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Tool not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/* export async function createTool(req, res) {
  const body = req.body || {};
  const name = body.name ?? body.Name_Tools ?? body.Name ?? body.NameTools;
  const description = body.description ?? body.Description_Tools ?? body.Description;
  if (!name) return res.status(400).json({ error: 'name required' });
  try {
    const result = await query(
      'INSERT INTO tools (Name_Tools, Description_Tools) VALUES (?, ?)',
      [name, description || null]
    );
    const insertId = result && result.insertId ? result.insertId : null;
    if (insertId) {
      const rows = await query(
        'SELECT * FROM tools WHERE ID_Tools = ?',
        [insertId]
      );
      return res.status(201).json(rows[0]);
    }
    // fallback: return submitted data
    res.status(201).json({ name, description });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
} */


export const createTool = async (req, res) => {
  const {
    Name_Tools,
    Description_Tools,
    Link_Tools,
    ImageTools,
    Image_Alt,
    ID_Statut = 1,   // par défaut Active
    ID_Category
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

    // Insérer le nouvel outil
    const result = await query(
      `INSERT INTO tools
       (Name_Tools, Description_Tools, Link_Tools, ImageTools, Image_Alt, ID_Statut, ID_Category, Add_Date)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [Name_Tools, Description_Tools, Link_Tools, ImageTools, Image_Alt, ID_Statut, ID_Category]
    );

    const newTool = {
      ID_Tools: result.insertId,
      Name_Tools,
      Description_Tools,
      Link_Tools,
      ImageTools,
      Image_Alt,
      ID_Statut,
      ID_Category
    };

    res.status(201).json(newTool);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* export async function updateTool(req, res) {
  const { id } = req.params;
  const body = req.body || {};
  const name = body.name ?? body.Name_Tools ?? body.Name ?? body.NameTools;
  const description = body.description ?? body.Description_Tools ?? body.Description;
  try {
    await query('UPDATE tools SET Name_Tools = ?, Description_Tools = ? WHERE ID_Tools = ?', [
      name,
      description,
      id,
    ]);
    const rows = await query(
      'SELECT ID_Tools AS id, Name_Tools AS name, Description_Tools AS description FROM tools WHERE ID_Tools = ?',
      [id]
    );
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Tool not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
} */

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
