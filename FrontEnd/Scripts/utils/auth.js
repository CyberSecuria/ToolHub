// Authentication utility functions

export class AuthManager {
  constructor() {
    this.user = null;
    this.accessToken = null;
    this.refreshToken = null;
    this.flash = null;
    this.loadFromStorage();
  }

  // Load authentication data from localStorage
  loadFromStorage() {
    try {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
      const userStr = localStorage.getItem('user');
      if (userStr) {
        this.user = JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Error loading auth data from storage:', error);
      this.clearAuth();
    }
  }

  // Save authentication data to localStorage
  saveToStorage() {
    if (this.accessToken) localStorage.setItem('accessToken', this.accessToken);
    if (this.refreshToken) localStorage.setItem('refreshToken', this.refreshToken);
    if (this.user) localStorage.setItem('user', JSON.stringify(this.user));
    if (this.flash) localStorage.setItem('flashMessage', JSON.stringify(this.flash));
  }

  // Clear authentication data
  clearAuth(isTokenExpired = false) {
    this.user = null;
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    const currentPath = window.location.pathname;
    if (currentPath.includes('admin.html') && isTokenExpired) {
      // Special handling for admin page when token expired
      document.body.innerHTML = `
        <div class="error-container">
          <h2>Session Expired</h2>
          <p>Your session has expired. Please log in again to continue.</p>
          <button onclick="window.location.href='login.html'" class="home">
            Go to Login
          </button>
        </div>
      `;
    } else if (!currentPath.includes('login.html')) {
      // Redirect to login page if not already there
      window.location.href = './login.html';
    }
  }

  // Flash message helpers
  setFlash(message, type = 'info') {
    this.flash = { message, type };
    localStorage.setItem('flashMessage', JSON.stringify(this.flash));
  }

  popFlash() {
    const str = localStorage.getItem('flashMessage');
    if (!str) return null;
    localStorage.removeItem('flashMessage');
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  }

  showFlashIfAny() {
    const flash = this.popFlash();
    if (!flash) return;
    // Defer display slightly to avoid being cleared by initial page rendering
    setTimeout(() => {
      // Prefer global notification UIs if available on page
      if (typeof window.showNotification === 'function') {
        window.showNotification(flash.message, flash.type);
        return;
      }
      // Use site notification styles as fallback
      const notification = document.createElement('div');
      const typeClass = flash.type === 'success' ? 'notification-success' : 'notification-error';
      notification.className = `notification ${typeClass}`;
      notification.innerHTML = `
        <div class="notification-content">
          <span class="notification-icon">${flash.type === 'success' ? '✅' : '❌'}</span>
          <span class="notification-message">${flash.message}</span>
          <button class="notification-close" aria-label="Close">&times;</button>
        </div>
      `;
      const closeBtn = notification.querySelector('.notification-close');
      if (closeBtn) closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
      });
      document.body.appendChild(notification);
      setTimeout(() => {
        if (notification.parentElement) {
          notification.style.animation = 'slideIn 0.3s ease-out reverse';
          setTimeout(() => notification.remove(), 300);
        }
      }, 3000);
    }, 700);
  }

  // Check if user is authenticated
  isAuthenticated() {
    if (!this.accessToken || !this.user) {
      return false;
    }
    try {
      // Check if the token is expired by decoding the JWT
      const tokenPayload = JSON.parse(atob(this.accessToken.split('.')[1]));
      const isExpired = tokenPayload.exp * 1000 < Date.now();
      
      if (isExpired) {
        // If the token is expired, clear auth with the appropriate flag
        this.clearAuth(true);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking token:', error);
      this.clearAuth(true);
      return false;
    }
  }

  // Get current user
  getCurrentUser() {
    if (!this.isAuthenticated()) {
      return null;
    }
    return this.user;
  }

  // Check if current user is admin
  isAdmin() {
    if (!this.isAuthenticated()) {
      return false;
    }
    return this.user && (this.user.roleId === 3 || this.user.ID_Role === 3);
  }

  // Set authentication data
  setAuth(authData) {
    this.accessToken = authData.accessToken;
    this.refreshToken = authData.refreshToken;
    this.user = authData.user;
    this.saveToStorage();
  }

  // Logout user
  logout() {
    const refreshToken = this.refreshToken;
    this.clearAuth();
    
    // Optionally call logout endpoint
    if (refreshToken) {
      fetch('http://localhost:3001/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshToken })
      }).catch(err => console.error('Logout error:', err));
    }
  }

  // Get authorization header
  getAuthHeader() {
    return this.accessToken ? `Bearer ${this.accessToken}` : null;
  }

  // Refresh the access token using the refresh token
  async refreshAccessToken() {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch('http://localhost:3001/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        this.accessToken = data.accessToken;
        this.saveToStorage();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  // Verify token with server and attempt refresh if needed
  async verifyToken() {
    if (!this.accessToken) return false;
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': this.getAuthHeader()
        }
      });
      
      if (response.ok) {
        return true;
      }

      // If the token is invalid (401), attempt to refresh it
      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return true;
        }
        // If the refresh fails, log out the user
        this.logout();
        window.location.href = 'login.html';
      }
      return false;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }

  // Update UI based on authentication status
  updateUI() {
    const loginButtons = document.querySelectorAll('.login button');
    const userInfo = document.querySelector('.user-info');
    
    // Add admin link to navigation if user is admin
    this.updateNavigation();
    
    if (this.isAuthenticated()) {
      // User is logged in
      if (loginButtons.length >= 2) {
        // Remove all existing event listeners
        loginButtons[0].replaceWith(loginButtons[0].cloneNode(true));
        loginButtons[1].replaceWith(loginButtons[1].cloneNode(true));
        
        // Retrieve the new buttons after replacement
        const newLoginButtons = document.querySelectorAll('.login button');
        
        newLoginButtons[0].textContent = `Hello, ${this.user.username || this.user.Name}`;
        newLoginButtons[0].onclick = () => this.showUserMenu();
        newLoginButtons[1].textContent = 'Logout';
        newLoginButtons[1].onclick = () => this.handleLogout();
      }
    } else {
      // User is not logged in
      if (loginButtons.length >= 2) {
        // Remove all existing event listeners
        loginButtons[0].replaceWith(loginButtons[0].cloneNode(true));
        loginButtons[1].replaceWith(loginButtons[1].cloneNode(true));
        
        // Fetch the new buttons after replacement
        const newLoginButtons = document.querySelectorAll('.login button');
        
        newLoginButtons[0].textContent = 'Login';
        newLoginButtons[0].onclick = () => window.location.href = 'login.html';
        newLoginButtons[1].textContent = 'Sign Up';
        newLoginButtons[1].onclick = () => window.location.href = 'signup.html';
      }
    }
  }

  // Update navigation to add/remove admin link
  updateNavigation() {
    const navUl = document.querySelector('nav ul');
    if (!navUl) return;

    // Remove existing admin link if present
    const existingAdminLink = navUl.querySelector('li a[href="admin.html"]');
    if (existingAdminLink) {
      existingAdminLink.parentElement.remove();
    }

    // Add admin link if user is admin
    if (this.isAuthenticated() && this.isAdmin()) {
      const adminLi = document.createElement('li');
      const adminLink = document.createElement('a');
      adminLink.href = 'admin.html';
      adminLink.textContent = 'Admin';
      adminLi.appendChild(adminLink);
      navUl.appendChild(adminLi);
    }
  }

  // Handle logout
  handleLogout() {
    this.logout();
    this.updateUI();
    // Store a flash message to show after redirect
    this.setFlash('Logout successful.', 'success');
    
    // Always redirect to index.html after logout
    // This ensures that the user lands on the home page
    console.log('Logout: redirecting to index.html');
    window.location.href = 'index.html';
  }

  // Redirect directly to profile page
  showUserMenu() {
    // Redirect directly to profile page when clicking on "Hello, username"
    window.location.href = 'profile.html';
  }
}

// Create global auth manager instance
export const authManager = new AuthManager();

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
  authManager.updateUI();
  authManager.showFlashIfAny();
});
