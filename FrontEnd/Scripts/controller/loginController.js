// Login Controller - Handles all login-related logic and utilities

// EVENT LISTENERS SETUP

export function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      
      if (!username || !password) {
        showError(errorMessage, successMessage, 'Please fill in all fields');
        return;
      }
      
      await handleLogin(username, password, errorMessage, successMessage);
    });
  }
}

// LOGIN HANDLER

async function handleLogin(username, password, errorMessage, successMessage) {
  try {
    console.log('🔐 Attempting login with:', { username, password: '***' });
    
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', response.headers);
    
    let data;
    try {
      data = await response.json();
      console.log('📦 Response data:', data);
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
      
      showSuccess(errorMessage, successMessage, 'Login successful! Redirecting...');
      
      // Redirect to home page after 1 second
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      showError(errorMessage, successMessage, data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    showError(errorMessage, successMessage, 'Network error. Please try again.');
  }
}

// MESSAGE UTILITIES

function showError(errorElement, successElement, message) {
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  successElement.style.display = 'none';
}

function showSuccess(errorElement, successElement, message) {
  successElement.textContent = message;
  successElement.style.display = 'block';
  errorElement.style.display = 'none';
}
