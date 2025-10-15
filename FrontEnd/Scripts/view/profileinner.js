// Import of the auth manager
import { authManager } from '../utils/auth.js';
// Import of the profile controller
import { setupProfileEventListeners } from '../controller/profileController.js';

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
        <a href="rgpd.html">Privacy Policy & GDPR</a>
        <p>&copy; 2025 ToolHub. All rights reserved.</p>
      </div>
    </footer>
  `;

  document.body.innerHTML = templateProfile;
  
  // Setup event listeners
  setupProfileEventListeners();
}
