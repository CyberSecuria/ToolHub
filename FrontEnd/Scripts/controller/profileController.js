// Profile Controller - Handles all profile-related logic and utilities
import { authManager } from '../utils/auth.js';

// EVENT LISTENERS SETUP

export function setupProfileEventListeners() {
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
      // Already on profile page, scroll to top
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

// DELETE MODAL MANAGEMENT

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

// FORM HANDLERS

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
    // Check and refresh token if needed
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
    // Check and refresh token if needed
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

// FORM UTILITIES

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

// NOTIFICATION UTILITIES

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
