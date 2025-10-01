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
  clearAuth() {
    this.user = null;
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
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
    return !!(this.accessToken && this.user);
  }

  // Get current user
  getCurrentUser() {
    return this.user;
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
    this.clearAuth();
    // Optionally call logout endpoint
    if (this.refreshToken) {
      fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken })
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

      // Si le token est invalide (401), essayer de le rafraîchir
      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return true;
        }
        // Si le rafraîchissement échoue, déconnecter l'utilisateur
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
    
    if (this.isAuthenticated()) {
      // User is logged in
      if (loginButtons.length >= 2) {
        loginButtons[0].textContent = `Hello, ${this.user.username}`;
        loginButtons[0].onclick = () => this.showUserMenu();
        loginButtons[1].textContent = 'Logout';
        loginButtons[1].onclick = () => this.handleLogout();
      }
    } else {
      // User is not logged in
      if (loginButtons.length >= 2) {
        loginButtons[0].textContent = 'Login';
        loginButtons[0].onclick = () => window.location.href = 'login.html';
        loginButtons[1].textContent = 'Sign Up';
        loginButtons[1].onclick = () => window.location.href = 'signup.html';
      }
    }
  }

  // Handle logout
  handleLogout() {
    this.logout();
    this.updateUI();
    // Store a flash message to show after redirect
    this.setFlash('Logout successful.', 'success');
    // Redirect to home page
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
