// Import jsonwebtoken for JWT verification
import jwt from 'jsonwebtoken';
// Import database query function
import { query } from '../Config/database.js';

// JWT secret key from environment or default
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// Middleware to verify JWT token and authenticate user
export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  // Check if Authorization header exists and starts with 'Bearer '
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'missing token' });
  const token = auth.split(' ')[1];
  try {
    // Verify JWT token and extract payload
    const payload = jwt.verify(token, JWT_SECRET);
    // Attach user information to request object
    req.user = { id: payload.id, username: payload.username, email: payload.email };
    next();
  } catch (err) {
    res.status(401).json({ error: 'invalid token' });
  }
}

// Middleware to check if user can modify the resource (own profile only)
export function requireOwnership(req, res, next) {
  const resourceId = parseInt(req.params.id);
  const userId = parseInt(req.user.id);
  
  // Verify that the resource ID matches the authenticated user's ID
  if (resourceId !== userId) {
    return res.status(403).json({ error: 'You can only modify your own profile' });
  }
  
  next();
}

// Middleware to check if user is admin or owns the resource
export async function requireAdminOrOwnership(req, res, next) {
  const resourceId = parseInt(req.params.id);
  const userId = parseInt(req.user.id);
  
  try {
    // Query database to check user's role
    const userRows = await query('SELECT ID_Role FROM users WHERE ID_User = ?', [userId]);
    if (!userRows || userRows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    const userRole = userRows[0].ID_Role;
    
    // Allow access if user is admin (role 3) or owns the resource
    if (userRole === 3 || resourceId === userId) {
      next();
    } else {
      return res.status(403).json({ error: 'You can only modify your own profile unless you are an admin' });
    }
  } catch (error) {
    console.error('Error in requireAdminOrOwnership middleware:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Export requireAuth as default export
export default requireAuth;
