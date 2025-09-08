import { query } from '../Config/database.js';
import bcrypt from 'bcrypt';


// --- GET ALL USERS ---
export async function getAllUsers(req, res) {
  try {
    const rows = await query(
      'SELECT ID_User AS id, Name AS username, Email AS email, Register_date AS registeredAt, ID_Role AS roleId FROM users'
    );
    res.json({ users: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// --- GET USER BY ID ---
export async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const rows = await query(
      'SELECT ID_User AS id, Name AS username, Email AS email, Register_date AS registeredAt, ID_Role AS roleId FROM users WHERE ID_User = ?',
      [id]
    );
    if (!rows?.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// Crée un utilisateur
// Crée un utilisateur

export async function createUser(req, res) {
  const body = req.body || {};
  const username = body.username;
  const email = body.email;
  const password = body.password;

  if (!username || !email || !password) 
    return res.status(400).json({ error: 'username, email and password are required' });

  const roleId = 1; // forcer rôle existant

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (Name, Email, Password, Register_date, ID_Role) VALUES (?, ?, ?, NOW(), ?)',
      [username, email, hash, roleId]
    );

    const rows = await query(
      'SELECT ID_User AS id, Name AS username, Email AS email, Register_date AS registeredAt, ID_Role AS roleId FROM users WHERE ID_User = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const body = req.body || {};
  let { username, email, password, roleId } = body;

  try {
    // Récupérer l'utilisateur existant
    const existing = await query('SELECT Name, Email, ID_Role FROM users WHERE ID_User = ?', [id]);
    if (!existing?.length) return res.status(404).json({ error: 'User not found' });

    // Si un champ n'est pas fourni ou vide, garder l'existant
    username = username?.trim() ? username : existing[0].Name;
    email = email?.trim() ? email : existing[0].Email;
    roleId = Number.isInteger(roleId) ? roleId : existing[0].ID_Role;

    if (password?.trim()) {
      const hash = await bcrypt.hash(password, 10);
      await query(
        'UPDATE users SET Name = ?, Email = ?, Password = ?, ID_Role = ? WHERE ID_User = ?',
        [username, email, hash, roleId, id]
      );
    } else {
      await query(
        'UPDATE users SET Name = ?, Email = ?, ID_Role = ? WHERE ID_User = ?',
        [username, email, roleId, id]
      );
    }

    const rows = await query(
      'SELECT ID_User AS id, Name AS username, Email AS email, Register_date AS registeredAt, ID_Role AS roleId FROM users WHERE ID_User = ?',
      [id]
    );

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Supprime un utilisateur
export async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    await query('DELETE FROM users WHERE ID_User = ?', [id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
