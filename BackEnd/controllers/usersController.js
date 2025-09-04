import { query } from '../Config/database.js';
import bcrypt from 'bcrypt';

export async function createUser(req, res) {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
    const insertId = result && result.insertId ? result.insertId : null;
    if (insertId) {
      const rows = await query('SELECT id, username FROM users WHERE id = ?', [insertId]);
      return res.status(201).json(rows[0]);
    }
    res.status(201).json({ username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAllUsers(req, res) {
  try {
    const rows = await query('SELECT id, username FROM users LIMIT 100');
    res.json({ users: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const rows = await query('SELECT id, username FROM users WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const { username, password } = req.body || {};
  try {
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await query('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, hash, id]);
    } else {
      await query('UPDATE users SET username = ? WHERE id = ?', [username, id]);
    }
    const rows = await query('SELECT id, username FROM users WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    await query('DELETE FROM users WHERE id = ?', [id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
