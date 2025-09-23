// Authentication utility functions

export class AuthManager {
  constructor() {
    this.user = null;
    this.accessToken = null;
    this.refreshToken = null;
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

  // Verify token with server
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
        return true; // If we get a successful response, token is valid
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
    // Optionally redirect to home page
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
});
