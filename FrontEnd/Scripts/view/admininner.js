// Import auth manager
import { authManager } from '../utils/auth.js';
// Import admin controller functions
import { setupGlobalFunctions, setupEventListeners, loadInitialData } from '../controller/adminController.js';

// Inner function for admin page
export default function adminInner() {
    console.log('adminInner() called');
    
    // Check authentication and admin status
    if (!authManager.isAuthenticated()) {
        console.log('User not authenticated, redirecting to login');
        window.location.href = '/FrontEnd/login.html';
        return;
    }

    const currentUser = authManager.getCurrentUser();
    console.log('Current user:', currentUser);
    console.log('Is admin:', authManager.isAdmin());
    
    if (!authManager.isAdmin()) {
        alert('Access denied. You must be an administrator to access this page.');
        window.location.href = 'index.html';
        return;
    }

    console.log('Creating admin interface...');
    createAdminInterface(currentUser);
}

// Create the admin interface HTML structure
function createAdminInterface(currentUser) {
    // Ensure CSS is loaded
    if (!document.querySelector('link[href*="admin.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'CSS/admin.css';
        document.head.appendChild(link);
    }
    
    document.body.innerHTML = `
        <!-- Header -->
        <header>
            <nav>
                <div class="logo" onclick="window.location.href='index.html'">
                    <img src="Assets/logo ToolHub.png" alt="ToolHub Logo">
                    <h1>ToolHub Admin</h1>
                </div>
                <ul>
                    <li><a href="index.html">Home</a></li>
                </ul>
                <div class="login">
                    <button onclick="authManager.showUserMenu()" id="user-menu-btn">Hello, ${currentUser?.username || currentUser?.Name || 'User'}</button>
                </div>
            </nav>
        </header>

        <!-- Hero Section -->
        <section class="hero">
            <span class="titlehero">Administration Panel</span>
            <span class="texthero">Manage your content and users easily</span>
        </section>

        <!-- Main Content -->
        <main>
            <div class="admin-tabs">
                <button class="tab-button active" data-tab="tools">Tools</button>
                <button class="tab-button" data-tab="users">Users</button>
            </div>

            <!-- Tools Management -->
            <div id="tools-tab" class="tab-content active">
                <div class="section-header">
                    <h2>Tools Management</h2>
                    <button class="add-button" onclick="openAddToolModal()">Add Tool</button>
                </div>
                <div class="admin-table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Creator</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="tools-table-body">
                            <!-- Tools will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Users Management -->
            <div id="users-tab" class="tab-content">
                <div class="section-header">
                    <h2>Users Management</h2>
                    <button class="add-button" onclick="openAddUserModal()">Add User</button>
                </div>
                <div class="admin-table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Registered At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="users-table-body">
                            <!-- Users will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </main>

        <!-- Tool Modal -->
        <div id="tool-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="tool-modal-title">Add Tool</h3>
                    <span class="close" onclick="closeModal('tool-modal')">&times;</span>
                </div>
                <form id="tool-form">
                    <input type="hidden" id="tool-id">
                    <div class="form-group">
                        <label for="tool-name">Tool Name:</label>
                        <input type="text" id="tool-name" name="tool-name" placeholder="Tool Name" required>
                    </div>
                    <div class="form-group">
                        <label for="tool-description">Description:</label>
                        <textarea id="tool-description" name="tool-description" placeholder="Tool Description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="tool-link">Link:</label>
                        <input type="url" id="tool-link" name="tool-link" required>
                    </div>
                    <div class="form-group">
                        <label for="tool-image">Image URL</label>
                        <input type="url" id="tool-image">
                    </div>
                    <div class="form-group">
                        <label for="tool-category">Category</label>
                        <select id="tool-category" required>
                            <!-- Categories will be loaded here -->
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="tool-user">User</label>
                        <select id="tool-user" required>
                            <!-- Users will be loaded here -->
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Operating Systems</label>
                        <div id="tool-os-checkboxes" class="checkbox-group">
                            <!-- OS checkboxes will be loaded here -->
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Platforms</label>
                        <div id="tool-platform-checkboxes" class="checkbox-group">
                            <!-- Platform checkboxes will be loaded here -->
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-secondary" onclick="closeModal('tool-modal')">Cancel</button>
                        <button type="submit" class="btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- User Modal -->
        <div id="user-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="user-modal-title">Add User</h3>
                    <span class="close" onclick="closeModal('user-modal')">&times;</span>
                </div>
                <form id="user-form">
                    <input type="hidden" id="user-id">
                    <div class="form-group">
                        <label for="user-name">Username:</label>
                        <input type="text" id="user-name" required>
                    </div>
                    <div class="form-group">
                        <label for="user-email">Email:</label>
                        <input type="email" id="user-email" required>
                    </div>
                    <div class="form-group">
                        <label for="user-password">Password:</label>
                        <input type="password" id="user-password">
                        <small>Leave empty to keep current password</small>
                    </div>
                    <div class="form-group">
                        <label for="user-role">Role</label>
                        <select id="user-role" required>
                            <option value="user">User</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-secondary" onclick="closeModal('user-modal')">Cancel</button>
                        <button type="submit" class="btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div id="delete-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Confirm Deletion</h3>
                    <span class="close" onclick="closeModal('delete-modal')">&times;</span>
                </div>
                <p id="delete-message">Are you sure you want to delete this item?</p>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="closeModal('delete-modal')">Cancel</button>
                    <button type="button" class="btn-danger" id="confirm-delete">Delete</button>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer>
            <div class="footer-content">
                <a href="rgpd.html">Privacy Policy & GDPR</a>
                <p>&copy; 2025 ToolHub. All rights reserved.</p>
            </div>
        </footer>
    `;

    setupEventListeners();
    
    // Ensure all functions are available globally
    setupGlobalFunctions();
    
    // Load initial data after DOM is ready
    setTimeout(() => {
        loadInitialData();
    }, 100);
}
