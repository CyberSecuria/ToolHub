import { authManager } from '../utils/auth.js';

// Generate the profile page content
export function profileInner() {
  const user = authManager.getCurrentUser();
  
  if (!user) {
    // Redirect to login if not authenticated
    window.location.href = 'login.html';
    return;
  }

  // Get user initials for avatar
  const initials = user.username ? user.username.substring(0, 2).toUpperCase() : 'U';
  
  const templateProfile = `
    <header>
      <nav>
        <div class="logo">
          <img src="Assets/logo ToolHub.png" alt="logo">
          <h1>ToolHub</h1>
        </div>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="toolbox.html">Toolbox</a></li>
          <li><a href="ressource.html">Ressources</a></li>
        </ul>
        <div class="login">
          <button id="userMenuBtn">Hello, ${user.username}</button>
          <button id="logoutBtn">Logout</button>
        </div>
        <button class="burger">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>

    <main>
      <div class="profile-container">
        <h2>My Profile</h2>
        
        <div class="profile-header">
          <div class="profile-avatar">${initials}</div>
          <div class="profile-info">
            <h3>${user.username}</h3>
            <p>${user.email}</p>
            <p>Member since ${user.registeredAt ? new Date(user.registeredAt).toLocaleDateString() : 'Recently'}</p>
          </div>
        </div>

        <!-- Personal Information Section -->
        <div class="profile-section">
          <h3>Personal Information</h3>
          <div id="personalInfoMessages"></div>
          
          <form id="personalInfoForm">
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" value="${user.username}" autocomplete="username" required>
            </div>
            
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" name="email" value="${user.email}" autocomplete="email" required>
            </div>
            
            <div class="btn-group">
              <button type="button" class="btn btn-secondary" id="cancelPersonalInfo">Cancel</button>
              <button type="submit" class="btn btn-primary">Update Information</button>
            </div>
          </form>
        </div>

        <!-- Password Section -->
        <div class="profile-section">
          <h3>Change Password</h3>
          <div id="passwordMessages"></div>
          
          <form id="passwordForm">
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input type="password" id="currentPassword" name="currentPassword" autocomplete="current-password" required>
            </div>
            
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input type="password" id="newPassword" name="newPassword" autocomplete="new-password" required minlength="6">
            </div>
            
            <div class="form-group">
              <label for="confirmNewPassword">Confirm New Password</label>
              <input type="password" id="confirmNewPassword" name="confirmNewPassword" autocomplete="new-password" required minlength="6">
            </div>
            
            <div class="btn-group">
              <button type="button" class="btn btn-secondary" id="cancelPassword">Cancel</button>
              <button type="submit" class="btn btn-primary">Change Password</button>
            </div>
          </form>
        </div>

        <!-- Account Actions -->
        <div class="profile-section">
          <h3>Account Actions</h3>
          <div class="info-message">
            <strong>Note:</strong> These actions will affect your account permanently.
          </div>
          
          <div class="btn-group">
            <button type="button" class="btn btn-secondary" onclick="window.location.href='index.html'">Back to Home</button>
            <button type="button" class="btn btn-danger" id="deleteAccountBtn">Delete Account</button>
          </div>
        </div>
      </div>
    </main>

    <footer class="site-footer">
      <div class="footer-content">
        <p>&copy; 2025 ToolHub. All rights reserved.</p>
      </div>
    </footer>
  `;

  document.body.innerHTML = templateProfile;
  
  // Setup event listeners
  setupProfileEventListeners();
}

function setupProfileEventListeners() {
  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      authManager.handleLogout();
    });
  }

  // User menu button (could show dropdown in future)
  const userMenuBtn = document.getElementById('userMenuBtn');
  if (userMenuBtn) {
    userMenuBtn.addEventListener('click', () => {
      // For now, just show user info
      authManager.showUserMenu();
    });
  }

  // Personal info form
  const personalInfoForm = document.getElementById('personalInfoForm');
  if (personalInfoForm) {
    personalInfoForm.addEventListener('submit', handlePersonalInfoUpdate);
  }

  // Password form
  const passwordForm = document.getElementById('passwordForm');
  if (passwordForm) {
    passwordForm.addEventListener('submit', handlePasswordChange);
  }

  // Cancel buttons
  const cancelPersonalInfo = document.getElementById('cancelPersonalInfo');
  if (cancelPersonalInfo) {
    cancelPersonalInfo.addEventListener('click', resetPersonalInfoForm);
  }

  const cancelPassword = document.getElementById('cancelPassword');
  if (cancelPassword) {
    cancelPassword.addEventListener('click', resetPasswordForm);
  }

  // Delete account button
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', handleDeleteAccount);
  }
}

async function handlePersonalInfoUpdate(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const messagesDiv = document.getElementById('personalInfoMessages');
  
  if (!username || !email) {
    showMessage(messagesDiv, 'Please fill in all fields', 'error');
    return;
  }

  try {
    const user = authManager.getCurrentUser();
    const response = await fetch(`http://localhost:3001/api/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authManager.getAuthHeader()
      },
      body: JSON.stringify({ username, email })
    });

    const data = await response.json();

    if (response.ok) {
      // Update local user data
      const updatedUser = { ...user, username: data.username, email: data.email };
      authManager.setAuth({
        accessToken: authManager.accessToken,
        refreshToken: authManager.refreshToken,
        user: updatedUser
      });

      showMessage(messagesDiv, 'Personal information updated successfully!', 'success');
      
      // Update the header and avatar
      setTimeout(() => {
        location.reload();
      }, 1500);
    } else {
      showMessage(messagesDiv, data.error || 'Failed to update information', 'error');
    }
  } catch (error) {
    console.error('Update error:', error);
    showMessage(messagesDiv, 'Network error. Please try again.', 'error');
  }
}

async function handlePasswordChange(e) {
  e.preventDefault();
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmNewPassword = document.getElementById('confirmNewPassword').value;
  const messagesDiv = document.getElementById('passwordMessages');
  
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    showMessage(messagesDiv, 'Please fill in all fields', 'error');
    return;
  }

  if (newPassword !== confirmNewPassword) {
    showMessage(messagesDiv, 'New passwords do not match', 'error');
    return;
  }

  if (newPassword.length < 6) {
    showMessage(messagesDiv, 'New password must be at least 6 characters long', 'error');
    return;
  }

  try {
    const user = authManager.getCurrentUser();
    const response = await fetch(`http://localhost:3001/api/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authManager.getAuthHeader()
      },
      body: JSON.stringify({ 
        currentPassword,
        password: newPassword 
      })
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(messagesDiv, 'Password changed successfully!', 'success');
      resetPasswordForm();
    } else {
      showMessage(messagesDiv, data.error || 'Failed to change password', 'error');
    }
  } catch (error) {
    console.error('Password change error:', error);
    showMessage(messagesDiv, 'Network error. Please try again.', 'error');
  }
}

function handleDeleteAccount() {
  const confirmed = confirm(
    'Are you sure you want to delete your account?\n\n' +
    'This action cannot be undone and will permanently delete:\n' +
    '• Your profile information\n' +
    '• Your bookmarks and saved tools\n' +
    '• All associated data\n\n' +
    'Type "DELETE" to confirm:'
  );

  if (confirmed) {
    const confirmation = prompt('Please type "DELETE" to confirm account deletion:');
    
    if (confirmation === 'DELETE') {
      deleteUserAccount();
    } else {
      alert('Account deletion cancelled.');
    }
  }
}

async function deleteUserAccount() {
  try {
    const user = authManager.getCurrentUser();
    const response = await fetch(`http://localhost:3001/api/users/${user.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authManager.getAuthHeader()
      }
    });

    if (response.ok) {
      alert('Your account has been deleted successfully.');
      authManager.logout();
      window.location.href = 'index.html';
    } else {
      const data = await response.json();
      alert('Failed to delete account: ' + (data.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Delete account error:', error);
    alert('Network error. Please try again.');
  }
}

function resetPersonalInfoForm() {
  const user = authManager.getCurrentUser();
  document.getElementById('username').value = user.username;
  document.getElementById('email').value = user.email;
  document.getElementById('personalInfoMessages').innerHTML = '';
}

function resetPasswordForm() {
  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmNewPassword').value = '';
  document.getElementById('passwordMessages').innerHTML = '';
}

function showMessage(container, message, type) {
  const messageClass = type === 'error' ? 'error-message' : 
                     type === 'success' ? 'success-message' : 'info-message';
  
  container.innerHTML = `<div class="${messageClass}">${message}</div>`;
  
  // Auto-hide success messages after 3 seconds
  if (type === 'success') {
    setTimeout(() => {
      container.innerHTML = '';
    }, 3000);
  }
}
