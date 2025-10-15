// Signup Controller - Handles all signup-related logic and utilities

// EVENT LISTENERS SETUP

export function setupSignupForm() {
  const signupForm = document.getElementById('signupForm');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      // Validate form inputs
      if (!username || !email || !password || !confirmPassword) {
        showError(errorMessage, successMessage, 'Please fill in all fields');
        return;
      }
      
      if (password !== confirmPassword) {
        showError(errorMessage, successMessage, 'Passwords do not match');
        return;
      }
      
      if (password.length < 6) {
        showError(errorMessage, successMessage, 'Password must be at least 6 characters long');
        return;
      }
      
      await handleSignup(username, email, password, confirmPassword, errorMessage, successMessage);
    });
  }
}

// SIGNUP HANDLER

async function handleSignup(username, email, password, confirmPassword, errorMessage, successMessage) {
  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username, 
        email, 
        password, 
        confirmPassword 
      })
    });
    
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      showError(errorMessage, successMessage, 'Server response error. Please try again.');
      return;
    }
    
    if (response.ok && data.success) {
      // Store tokens in localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      showSuccess(errorMessage, successMessage, 'Account created successfully! Redirecting...');
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      showError(errorMessage, successMessage, data.error || 'Signup failed');
    }
  } catch (error) {
    console.error('Signup error:', error);
    showError(errorMessage, successMessage, 'Network error. Please try again.');
  }
}

// MESSAGE UTILITIES

function showError(errorElement, successElement, message) {
  // Show fixed notification so it's visible even when scrolled
  showNotification(message, 'error');
  errorElement.style.display = 'none';
  successElement.style.display = 'none';
}

function showSuccess(errorElement, successElement, message) {
  // Show fixed notification so it's visible even when scrolled
  showNotification(message, 'success');
  errorElement.style.display = 'none';
  successElement.style.display = 'none';
}

// NOTIFICATION SYSTEM

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()" aria-label="Close">&times;</button>
    </div>
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}
