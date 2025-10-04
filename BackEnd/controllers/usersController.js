import { query } from '../Config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const ACCESS_EXP = '15m';
const REFRESH_EXP = '7d';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

function signAccess(user) {
  return jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: ACCESS_EXP });
}

function signRefresh(user) {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: REFRESH_EXP });
}


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
  let { username, email, password, currentPassword, roleId } = body;
  
  console.log('Update request:', { id, body });
  console.log('User from token:', req.user);

  try {
    // Récupérer l'utilisateur existant avec le mot de passe
    const existing = await query('SELECT Name, Email, Password, ID_Role FROM users WHERE ID_User = ?', [id]);
    if (!existing?.length) return res.status(404).json({ error: 'User not found' });

    const existingUser = existing[0];

    // Si un champ n'est pas fourni ou vide, garder l'existant
    username = username?.trim() ? username : existingUser.Name;
    email = email?.trim() ? email : existingUser.Email;
    roleId = Number.isInteger(roleId) ? roleId : existingUser.ID_Role;

    // Vérifier l'unicité du nom d'utilisateur et email (sauf pour l'utilisateur actuel)
    if (username !== existingUser.Name || email !== existingUser.Email) {
      const duplicateCheck = await query(
        'SELECT ID_User FROM users WHERE (Name = ? OR Email = ?) AND ID_User != ?',
        [username, email, id]
      );
      
      if (duplicateCheck && duplicateCheck.length > 0) {
        return res.status(409).json({ error: 'Username or email already exists' });
      }
    }

    // Si on veut changer le mot de passe, vérifier le mot de passe actuel
    if (password?.trim()) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to change password' });
      }

      // Vérifier le mot de passe actuel
      const match = await bcrypt.compare(currentPassword, existingUser.Password);
      if (!match) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Hasher le nouveau mot de passe
      const hash = await bcrypt.hash(password, 10);
      await query(
        'UPDATE users SET Name = ?, Email = ?, Password = ?, ID_Role = ? WHERE ID_User = ?',
        [username, email, hash, roleId, id]
      );
    } else {
      // Mise à jour sans changer le mot de passe
      await query(
        'UPDATE users SET Name = ?, Email = ?, ID_Role = ? WHERE ID_User = ?',
        [username, email, roleId, id]
      );
    }

    // Récupérer les données mises à jour
    const rows = await query(
      'SELECT ID_User AS id, Name AS username, Email AS email, Register_date AS registeredAt, ID_Role AS roleId FROM users WHERE ID_User = ?',
      [id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: err.message });
  }
}

// Supprime un utilisateur
export async function deleteUser(req, res) {
  const { id } = req.params;
  const TRANSFER_USER_ID = 8; // ID de l'utilisateur vers qui transférer les outils
  
  try {
    // Vérifier que l'utilisateur existe
    const userExists = await query('SELECT ID_User FROM users WHERE ID_User = ?', [id]);
    if (!userExists || userExists.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Vérifier que l'utilisateur de transfert existe
    const transferUserExists = await query('SELECT ID_User FROM users WHERE ID_User = ?', [TRANSFER_USER_ID]);
    if (!transferUserExists || transferUserExists.length === 0) {
      return res.status(500).json({ error: 'Transfer user (ID 8) not found' });
    }

    // Commencer une transaction
    await query('START TRANSACTION');

    try {
      // Transférer tous les outils de l'utilisateur vers l'utilisateur ID 8
      const toolsToTransfer = await query('SELECT ID_Tools FROM tools WHERE ID_User = ?', [id]);
      
      if (toolsToTransfer && toolsToTransfer.length > 0) {
        await query('UPDATE tools SET ID_User = ? WHERE ID_User = ?', [TRANSFER_USER_ID, id]);
        console.log(`Transferred ${toolsToTransfer.length} tools from user ${id} to user ${TRANSFER_USER_ID}`);
      }

      // Supprimer les bookmarks de l'utilisateur
      await query('DELETE FROM bookmarks WHERE ID_User = ?', [id]);

      // Supprimer les ratings de l'utilisateur
      await query('DELETE FROM rating WHERE ID_User = ?', [id]);

      // Supprimer l'utilisateur
      await query('DELETE FROM users WHERE ID_User = ?', [id]);

      // Valider la transaction
      await query('COMMIT');
      
      console.log(`User ${id} deleted successfully, tools transferred to user ${TRANSFER_USER_ID}`);
      res.status(204).end();
      
    } catch (transactionError) {
      // Annuler la transaction en cas d'erreur
      await query('ROLLBACK');
      throw transactionError;
    }
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: err.message });
  }
}

// --- AUTHENTICATION FUNCTIONS ---

// Login function
export async function loginUser(req, res) {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  
  try {
    // Try to find user by username or email
    const rows = await query(
      'SELECT ID_User AS id, Name AS username, Email AS email, Password AS password, ID_Role AS roleId FROM users WHERE Name = ? OR Email = ? LIMIT 1',
      [username, username]
    );
    
    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);
    
    // Store refresh token in a simple way (you might want to create a refresh_tokens table)
    // For now, we'll just return the tokens
    
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
    res.status(500).json({ error: err.message });
  }
}

// Signup function (using existing createUser logic)
export async function signupUser(req, res) {
  const body = req.body || {};
  const username = body.username;
  const email = body.email;
  const password = body.password;
  const confirmPassword = body.confirmPassword;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email and password are required' });
  }

  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const roleId = 1; // Default role

  try {
    // Check if user already exists
    const existingUser = await query(
      'SELECT ID_User FROM users WHERE Name = ? OR Email = ?',
      [username, email]
    );
    
    if (existingUser && existingUser.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (Name, Email, Password, Register_date, ID_Role) VALUES (?, ?, ?, NOW(), ?)',
      [username, email, hash, roleId]
    );

    const rows = await query(
      'SELECT ID_User AS id, Name AS username, Email AS email, Register_date AS registeredAt, ID_Role AS roleId FROM users WHERE ID_User = ?',
      [result.insertId]
    );

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
    res.status(500).json({ error: err.message });
  }
}

// Verify token function
export async function verifyToken(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const rows = await query(
      'SELECT ID_User AS id, Name AS username, Email AS email, ID_Role AS roleId FROM users WHERE ID_User = ?',
      [decoded.id]
    );
    
    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    res.json({ valid: true, user: rows[0] });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
