// Import database query function
import { query } from '../Config/database.js';
// Import bcrypt for password hashing
import bcrypt from 'bcrypt';
// Import jsonwebtoken for JWT token generation
import jwt from 'jsonwebtoken';

// Token expiration constants
const ACCESS_EXP = '1h'; // Access token expires in 1 hours
const REFRESH_EXP = '7d'; // Refresh token expires in 7 days
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'; // JWT secret key

// Generate access token for authenticated user
function signAccess(user) {
  return jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: ACCESS_EXP });
}

// Generate refresh token for token renewal
function signRefresh(user) {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: REFRESH_EXP });
}


// Retrieve all users from the database
export async function getAllUsers(req, res) {
  try {
    // Get all users with their basic information
    const rows = await query(
      'SELECT ID_User AS id, Name AS username, Email AS email, Register_date AS registeredAt, ID_Role AS roleId FROM users'
    );
    res.json({ users: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get a specific user by ID
export async function getUserById(req, res) {
  const { id } = req.params;
  try {
    // Find user by ID
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

// Create a new user
export async function createUser(req, res) {
  const body = req.body || {};
  const username = body.username;
  const email = body.email;
  const password = body.password;
  const roleId = body.roleId || 2; // Use provided role or default to 2 (Member)

  console.log('Create user request:', { username, email, roleId });

  if (!username || !email || !password) 
    return res.status(400).json({ error: 'username, email and password are required' });

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

// Update an existing user
export async function updateUser(req, res) {
  const { id } = req.params;
  const body = req.body || {};
  let { username, email, password, currentPassword, roleId } = body;
  
  try {
    // Fetch the existing user including the password
    const existing = await query('SELECT Name, Email, Password, ID_Role FROM users WHERE ID_User = ?', [id]);
    if (!existing?.length) return res.status(404).json({ error: 'User not found' });

    const existingUser = existing[0];

    // If a field is not provided or empty, keep the existing value
    username = username?.trim() ? username : existingUser.Name;
    email = email?.trim() ? email : existingUser.Email;
    roleId = Number.isInteger(roleId) ? roleId : existingUser.ID_Role;

    // Check the uniqueness of the username and email (except for the current user)
    if (username !== existingUser.Name || email !== existingUser.Email) {
      const duplicateCheck = await query(
        'SELECT ID_User FROM users WHERE (Name = ? OR Email = ?) AND ID_User != ?',
        [username, email, id]
      );
      
      if (duplicateCheck && duplicateCheck.length > 0) {
        return res.status(409).json({ error: 'Username or email already exists' });
      }
    }

    // If changing the password
    if (password?.trim()) {
      // Check if the user making the modification is an admin
      const requestingUserRows = await query('SELECT ID_Role FROM users WHERE ID_User = ?', [req.user.id]);
      const isAdmin = requestingUserRows && requestingUserRows[0] && requestingUserRows[0].ID_Role === 3;
      
      // If the user is not an admin AND is modifying their own profile, ask for the current password
      if (!isAdmin && parseInt(req.user.id) === parseInt(id)) {
        if (!currentPassword) {
          return res.status(400).json({ error: 'Current password is required to change password' });
        }

        // Verify the current password
        const match = await bcrypt.compare(currentPassword, existingUser.Password);
        if (!match) {
          return res.status(401).json({ error: 'Current password is incorrect' });
        }
      }
      // If it's an admin, they can change the password without knowing the old one

      // Hash the new password
      const hash = await bcrypt.hash(password, 10);
      await query(
        'UPDATE users SET Name = ?, Email = ?, Password = ?, ID_Role = ? WHERE ID_User = ?',
        [username, email, hash, roleId, id]
      );
    } else {
      // Update without changing the password
      await query(
        'UPDATE users SET Name = ?, Email = ?, ID_Role = ? WHERE ID_User = ?',
        [username, email, roleId, id]
      );
    }

    // Retrieve the updated data
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

// Delete a user
export async function deleteUser(req, res) {
  const { id } = req.params;
  const TRANSFER_USER_ID = 8; // ID of the user to transfer the tools to
  
  try {
    // Check if the user exists
    const userExists = await query('SELECT ID_User FROM users WHERE ID_User = ?', [id]);
    if (!userExists || userExists.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the transfer user exists
    const transferUserExists = await query('SELECT ID_User FROM users WHERE ID_User = ?', [TRANSFER_USER_ID]);
    if (!transferUserExists || transferUserExists.length === 0) {
      return res.status(500).json({ error: 'Transfer user (ID 8) not found' });
    }

    // Start a transaction
    await query('START TRANSACTION');

    try {
      // Transfer all tools from the user to user ID 8
      const toolsToTransfer = await query('SELECT ID_Tools FROM tools WHERE ID_User = ?', [id]);
      
      if (toolsToTransfer && toolsToTransfer.length > 0) {
        await query('UPDATE tools SET ID_User = ? WHERE ID_User = ?', [TRANSFER_USER_ID, id]);
        console.log(`Transferred ${toolsToTransfer.length} tools from user ${id} to user ${TRANSFER_USER_ID}`);
      }

      // Delete the user's bookmarks
      await query('DELETE FROM bookmarks WHERE ID_User = ?', [id]);

      // Delete the user's ratings
      await query('DELETE FROM rating WHERE ID_User = ?', [id]);

      // Delete the user
      await query('DELETE FROM users WHERE ID_User = ?', [id]);

      // Commit the transaction
      await query('COMMIT');
      
      res.status(204).end();
      
    } catch (transactionError) {
      // Roll back the transaction in case of error
      await query('ROLLBACK');
      throw transactionError;
    }
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: err.message });
  }
}

// AUTHENTICATION FUNCTIONS

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
    
    // Return user info without the password
    
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

// Signup function
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
    // Hash the password with bcrypt (10 salt rounds)
    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (Name, Email, Password, Register_date, ID_Role) VALUES (?, ?, ?, NOW(), ?)',
      [username, email, hash, roleId]
    );
    // Retrieve the newly created user
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
