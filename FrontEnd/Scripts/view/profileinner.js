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

      <!-- Delete Account Modal -->
      <div id="deleteAccountModal" class="th-modal" aria-hidden="true" role="dialog" aria-labelledby="delete-account-title">
        <div class="th-modal-overlay" data-close-modal></div>
        <div class="th-modal-content delete-modal-content" role="document">
          <button class="th-modal-close" type="button" aria-label="Close" data-close-modal>&times;</button>
          <h3 id="delete-account-title" class="delete-title">⚠️ Delete Account</h3>
          
          <div class="delete-warning">
            <p><strong>Are you sure you want to delete your account?</strong></p>
            <p>This action cannot be undone and will permanently delete:</p>
            <ul>
              <li>Your profile information</li>
              <li>Your bookmarks and saved tools</li>
              <li>Your ratings and reviews</li>
            </ul>
          </div>

          <div class="delete-confirmation">
            <label for="deleteConfirmInput">Type <strong>"DELETE"</strong> to confirm:</label>
            <input type="text" id="deleteConfirmInput" placeholder="Type DELETE here" class="delete-input">
          </div>

          <div class="th-form-actions delete-actions">
            <button type="button" class="th-btn-secondary" data-close-modal>Cancel</button>
            <button type="button" class="th-btn-danger" id="confirmDeleteBtn" disabled>Delete Account</button>
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
  
  // Load modal styles immediately
  ensureModalStyles();
  
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

  // User menu button - since we're already on profile page, no need to redirect
  const userMenuBtn = document.getElementById('userMenuBtn');
  if (userMenuBtn) {
    userMenuBtn.addEventListener('click', () => {
      // Already on profile page, no action needed or could scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    cancelPassword.addEventListener('click', () => resetPasswordForm(true));
  }

  // Delete account button
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', handleDeleteAccount);
  }

  // Setup delete modal event listeners
  setupDeleteModalEventListeners();
}

function setupDeleteModalEventListeners() {
  console.log('Setting up delete modal event listeners...');
  
  const modal = document.getElementById('deleteAccountModal');
  const confirmInput = document.getElementById('deleteConfirmInput');
  const confirmBtn = document.getElementById('confirmDeleteBtn');
  
  console.log('Modal elements found:', { modal, confirmInput, confirmBtn });
  
  if (!modal || !confirmInput || !confirmBtn) {
    console.warn('Some modal elements not found, skipping event listeners setup');
    return;
  }

  // Close modal functionality
  const closeElements = modal.querySelectorAll('[data-close-modal]');
  closeElements.forEach(el => {
    el.addEventListener('click', closeDeleteModal);
  });

  // Close on escape key
  let escHandler = (e) => {
    if (e.key === 'Escape') closeDeleteModal();
  };
  
  // Input validation for DELETE confirmation
  confirmInput.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    confirmBtn.disabled = value !== 'DELETE';
  });

  // Confirm delete button
  confirmBtn.addEventListener('click', () => {
    if (confirmInput.value.trim() === 'DELETE') {
      deleteUserAccount();
    }
  });

  // Add escape handler when modal opens
  modal.addEventListener('focusin', () => {
    window.addEventListener('keydown', escHandler);
  });

  // Remove escape handler when modal closes
  modal.addEventListener('focusout', () => {
    window.removeEventListener('keydown', escHandler);
  });
}

function closeDeleteModal() {
  const modal = document.getElementById('deleteAccountModal');
  const confirmInput = document.getElementById('deleteConfirmInput');
  const confirmBtn = document.getElementById('confirmDeleteBtn');
  
  if (modal) {
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }
  
  // Reset form
  if (confirmInput) {
    confirmInput.value = '';
  }
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Delete Account';
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
    // Vérifier et rafraîchir le token si nécessaire
    const isTokenValid = await authManager.verifyToken();
    if (!isTokenValid) {
      showMessage(messagesDiv, 'Your session has expired. Please login again.', 'error');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
      return;
    }

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
    console.log('Update response:', { status: response.status, data });

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
    // Vérifier et rafraîchir le token si nécessaire
    const isTokenValid = await authManager.verifyToken();
    if (!isTokenValid) {
      showMessage(messagesDiv, 'Your session has expired. Please login again.', 'error');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
      return;
    }

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
      resetPasswordForm(false);
    } else {
      showMessage(messagesDiv, data.error || 'Failed to change password', 'error');
    }
  } catch (error) {
    console.error('Password change error:', error);
    showMessage(messagesDiv, 'Network error. Please try again.', 'error');
  }
}

function handleDeleteAccount() {
  console.log('Delete account button clicked');
  
  // Ensure styles are loaded first
  ensureModalStyles();
  
  // Open the delete account modal
  const modal = document.getElementById('deleteAccountModal');
  console.log('Modal element found:', modal);
  
  if (modal) {
    console.log('Opening modal...');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    
    // Focus on the input field
    const input = document.getElementById('deleteConfirmInput');
    if (input) {
      setTimeout(() => input.focus(), 100);
    }
  } else {
    console.error('Modal not found! Check if the HTML is properly rendered.');
  }
}

// Function to ensure modal styles are loaded
function ensureModalStyles() {
  // Remove any existing modal styles first
  const existingStyles = document.querySelector('style[data-modal-styles]');
  if (existingStyles) {
    existingStyles.remove();
  }
  
  // Add fresh modal styles
  const style = document.createElement('style');
  style.setAttribute('data-modal-styles', 'true');
  style.textContent = `
      /* Base modal styles */
      .th-modal {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background: rgba(0, 0, 0, 0.5) !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        z-index: 9999 !important;
        opacity: 0 !important;
        visibility: hidden !important;
        transition: opacity 0.3s ease, visibility 0.3s ease !important;
      }
      
      .th-modal[aria-hidden="false"] {
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      .th-modal-overlay {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: transparent !important;
        cursor: pointer !important;
      }
      
      .th-modal-content {
        position: relative !important;
        background: white !important;
        border-radius: 8px !important;
        padding: 2rem !important;
        max-width: 90vw !important;
        max-height: 90vh !important;
        overflow-y: auto !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
        z-index: 1 !important;
      }
      
      .delete-modal-content {
        max-width: 500px !important;
      }
      
      .delete-title {
        color: #dc3545 !important;
        text-align: center !important;
        margin-bottom: 1.5rem !important;
      }
      
      .delete-warning {
        background: #fff3cd !important;
        border: 1px solid #ffeaa7 !important;
        border-radius: 8px !important;
        padding: 1rem !important;
        margin-bottom: 1.5rem !important;
      }
      
      .delete-input {
        width: 100% !important;
        padding: 0.75rem !important;
        border: 2px solid #ddd !important;
        border-radius: 4px !important;
        font-size: 1rem !important;
        box-sizing: border-box !important;
      }
      
      .th-btn-danger {
        background-color: #dc3545 !important;
        color: white !important;
        border: none !important;
        padding: 0.75rem 1.5rem !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 1rem !important;
      }
      
      .th-btn-danger:disabled {
        background-color: #6c757d !important;
        cursor: not-allowed !important;
      }
      
      .th-btn-secondary {
        background-color: #6c757d !important;
        color: white !important;
        border: none !important;
        padding: 0.75rem 1.5rem !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 1rem !important;
      }
      
      .th-form-actions {
        display: flex !important;
        gap: 1rem !important;
        justify-content: flex-end !important;
        margin-top: 1.5rem !important;
      }
      
      .th-modal-close {
        position: absolute !important;
        top: 1rem !important;
        right: 1rem !important;
        background: none !important;
        border: none !important;
        font-size: 1.5rem !important;
        cursor: pointer !important;
        color: #666 !important;
        width: 30px !important;
        height: 30px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 50% !important;
      }
    `;
    document.head.appendChild(style);
  }


async function deleteUserAccount() {
  try {
    // Show loading state
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Deleting...';
    }

    const user = authManager.getCurrentUser();
    const response = await fetch(`http://localhost:3001/api/users/${user.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authManager.getAuthHeader()
      }
    });

    if (response.ok) {
      // Close modal
      closeDeleteModal();
      
      // Show success message
      showNotification('Account deleted successfully. Redirecting to home page...', 'success');
      
      // Logout and redirect after a short delay
      setTimeout(() => {
        authManager.logout();
        window.location.href = 'index.html';
      }, 2000);
    } else {
      const data = await response.json();
      showNotification('Failed to delete account: ' + (data.error || 'Unknown error'), 'error');
      
      // Reset button
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Delete Account';
      }
    }
  } catch (error) {
    console.error('Delete account error:', error);
    showNotification('Network error. Please try again.', 'error');
    
    // Reset button
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Delete Account';
    }
  }
}

function resetPersonalInfoForm() {
  const user = authManager.getCurrentUser();
  document.getElementById('username').value = user.username;
  document.getElementById('email').value = user.email;
  document.getElementById('personalInfoMessages').innerHTML = '';
}

function resetPasswordForm(clearMessages = true) {
  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmNewPassword').value = '';
  if (clearMessages) {
    document.getElementById('passwordMessages').innerHTML = '';
  }
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

// Global notification system (similar to the one in indexinner.js)
function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.closest('.notification').remove()">&times;</button>
    </div>
  `;

  // Styles are now handled by CSS classes


  // Add to body
  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}
