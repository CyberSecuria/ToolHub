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
  const { username, email, password, confirmPassword } = req.body || {};
  if (!username || !email || !password) return res.status(400).json({ error: 'username, email and password required' });
  
  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }
  
  try {
    // Check if user already exists
    const existingUser = await query('SELECT ID_User FROM users WHERE Name = ? OR Email = ?', [username, email]);
    if (existingUser && existingUser.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    
    const hash = await bcrypt.hash(password, 10);
    const roleId = 1; // Default role
    const result = await query('INSERT INTO users (Name, Email, Password, Register_date, ID_Role) VALUES (?, ?, ?, NOW(), ?)', [username, email, hash, roleId]);
    
    const rows = await query('SELECT ID_User AS id, Name AS username, Email AS email, Register_date AS registeredAt, ID_Role AS roleId FROM users WHERE ID_User = ?', [result.insertId]);
    const newUser = rows[0];
    
    const accessToken = signAccess(newUser);
    const refreshToken = signRefresh(newUser);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        roleId: newUser.roleId
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  try {
    // Use your actual database structure
    const rows = await query('SELECT ID_User AS id, Name AS username, Email AS email, Password AS password, ID_Role AS roleId FROM users WHERE Name = ? OR Email = ? LIMIT 1', [username, username]);
    if (!rows || rows.length === 0) return res.status(401).json({ error: 'invalid credentials' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'invalid credentials' });
    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);
    
    // For now, we'll skip storing refresh tokens in a separate table since it doesn't exist
    // await query('INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)', [user.id, refreshToken]);
    
    res.json({ 
      success: true,
      accessToken, 
      refreshToken, 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        roleId: user.roleId 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
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
  
  try {
    // Essayer de supprimer le refresh token s'il existe dans la base
    if (refreshToken) {
      try {
        await query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
      } catch (err) {
        // Ignorer l'erreur si la table n'existe pas
        console.log('Refresh tokens table not found, skipping token deletion');
      }
    }
    
    // Toujours retourner un succès pour le logout côté client
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    // Même en cas d'erreur, on considère le logout comme réussi
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  }
}

export async function me(req, res) {
  // req.user set by middleware
  if (!req.user) return res.status(401).json({ error: 'unauthorized' });
  res.json({ id: req.user.id, username: req.user.username });
}

