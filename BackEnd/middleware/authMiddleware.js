import jwt from 'jsonwebtoken';
import { query } from '../Config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'missing token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.id, username: payload.username, email: payload.email };
    next();
  } catch (err) {
    res.status(401).json({ error: 'invalid token' });
  }
}

// Middleware to check if user can modify the resource (own profile only)
export function requireOwnership(req, res, next) {
  const resourceId = parseInt(req.params.id);
  const userId = req.user.id;
  
  if (resourceId !== userId) {
    return res.status(403).json({ error: 'You can only modify your own profile' });
  }
  
  next();
}

export default requireAuth;
