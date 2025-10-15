// Import database query function
import { query } from '../Config/database.js';
// Import bcrypt for password hashing
import bcrypt from 'bcrypt';
// Import jsonwebtoken for JWT token generation and verification
import jwt from 'jsonwebtoken';

// Token expiration constants
const ACCESS_EXP = '1h'; // Access token expires in 1 hours
const REFRESH_EXP = '7d'; // Refresh token expires in 7 days
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'; // JWT secret key from environment or default

// Generate access token for authenticated user
function signAccess(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: ACCESS_EXP });
}

// Generate refresh token for token renewal
function signRefresh(user) {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: REFRESH_EXP });
}

// Register a new user account
export async function register(req, res) {
  const { username, email, password, confirmPassword } = req.body || {};
  // Validate required fields
  if (!username || !email || !password) return res.status(400).json({ error: 'username, email and password required' });
  
  // Check if passwords match when confirmPassword is provided
  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }
  
  try {
    // Check if user already exists
    const existingUser = await query('SELECT ID_User FROM users WHERE Name = ? OR Email = ?', [username, email]);
    if (existingUser && existingUser.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    
    // Hash the password with bcrypt (10 salt rounds)
    const hash = await bcrypt.hash(password, 10);
    const roleId = 1; // Default role (visitor)
    // Insert new user into database
    const result = await query('INSERT INTO users (Name, Email, Password, Register_date, ID_Role) VALUES (?, ?, ?, NOW(), ?)', [username, email, hash, roleId]);
    
    // Retrieve the newly created user
    const rows = await query('SELECT ID_User AS id, Name AS username, Email AS email, Register_date AS registeredAt, ID_Role AS roleId FROM users WHERE ID_User = ?', [result.insertId]);
    const newUser = rows[0];
    
    // Generate JWT tokens for the new user
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

// Authenticate user and return JWT tokens
export async function login(req, res) {
  const { username, password } = req.body || {};
  // Validate required fields
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  try {
    // Find user by username or email
    const rows = await query('SELECT ID_User AS id, Name AS username, Email AS email, Password AS password, ID_Role AS roleId FROM users WHERE Name = ? OR Email = ? LIMIT 1', [username, username]);
    if (!rows || rows.length === 0) return res.status(401).json({ error: 'invalid credentials' });
    const user = rows[0];
    // Verify password with bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'invalid credentials' });
    // Generate JWT tokens for authenticated user
    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);
     
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

// Refresh access token using refresh token
export async function refresh(req, res) {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });
  try {
    // Verify refresh token
    const payload = jwt.verify(refreshToken, JWT_SECRET);
    // Check if token exists in database
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

// Logout user and invalidate refresh token
export async function logout(req, res) {
  const { refreshToken } = req.body || {};
  
  try {
    // Try to delete refresh token from database if it exists
    if (refreshToken) {
      try {
        await query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
      } catch (err) {
        // Ignore error if table doesn't exist
        console.log('Refresh tokens table not found, skipping token deletion');
      }
    }
    
    // Always return success for client-side logout
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    // Even on error, consider logout successful
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  }
}

// Get current authenticated user information
export async function me(req, res) {
  // req.user is set by authentication middleware
  if (!req.user) return res.status(401).json({ error: 'unauthorized' });
  res.json({ id: req.user.id, username: req.user.username });
}

