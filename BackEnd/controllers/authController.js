import { query } from '../Config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const ACCESS_EXP = '15m';
const REFRESH_EXP = '7d';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

function signAccess(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: ACCESS_EXP });
}

function signRefresh(user) {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: REFRESH_EXP });
}

export async function register(req, res) {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
    const insertId = result && result.insertId ? result.insertId : null;
    const user = insertId ? (await query('SELECT id, username FROM users WHERE id = ?', [insertId]))[0] : { username };
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  try {
    const rows = await query('SELECT id, username, password FROM users WHERE username = ? LIMIT 1', [username]);
    if (!rows || rows.length === 0) return res.status(401).json({ error: 'invalid credentials' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'invalid credentials' });
    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);
    // store refresh token (simple storage)
    await query('INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)', [user.id, refreshToken]);
    res.json({ accessToken, refreshToken, user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function refresh(req, res) {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });
  try {
    // verify token
    const payload = jwt.verify(refreshToken, JWT_SECRET);
    // check stored
    const rows = await query('SELECT id FROM refresh_tokens WHERE token = ? LIMIT 1', [refreshToken]);
    if (!rows || rows.length === 0) return res.status(401).json({ error: 'invalid refresh token' });
    const userRows = await query('SELECT id, username FROM users WHERE id = ?', [payload.id]);
    if (!userRows || userRows.length === 0) return res.status(401).json({ error: 'user not found' });
    const user = userRows[0];
    const accessToken = signAccess(user);
    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ error: 'invalid token', message: err.message });
  }
}

export async function logout(req, res) {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });
  try {
    await query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function me(req, res) {
  // req.user set by middleware
  if (!req.user) return res.status(401).json({ error: 'unauthorized' });
  res.json({ id: req.user.id, username: req.user.username });
}

