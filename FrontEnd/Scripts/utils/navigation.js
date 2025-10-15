// Import authentication manager
import { authManager } from './auth.js';

// Generate dynamic navigation based on user authentication status
export function generateNavigation(currentPage = '') {
    // Check user authentication and role
    const isAuthenticated = authManager.isAuthenticated();
    const isAdmin = authManager.isAdmin();
    const currentUser = authManager.getCurrentUser();

    // Build navigation links with active state
    let navLinks = `
        <li><a href="index.html" ${currentPage === 'home' ? 'class="active"' : ''}>Home</a></li>
        <li><a href="toolbox.html" ${currentPage === 'toolbox' ? 'class="active"' : ''}>Toolbox</a></li>
        <li><a href="ressource.html" ${currentPage === 'ressource' ? 'class="active"' : ''}>Ressources</a></li>
    `;

    // Add admin link if user is admin
    if (isAuthenticated && isAdmin) {
        navLinks += `<li><a href="admin.html" ${currentPage === 'admin' ? 'class="active"' : ''}>Admin</a></li>`;
    }

    // Build login/user section based on authentication status
    let loginSection;
    if (isAuthenticated) {
        // Show user menu and logout button for authenticated users
        loginSection = `
            <button onclick="authManager.showUserMenu()" id="user-menu-btn">Hello, ${currentUser?.username || currentUser?.Name || 'User'}</button>
            <button onclick="authManager.handleLogout()">Logout</button>
        `;
    } else {
        // Show login and signup buttons for guests
        loginSection = `
            <button onclick="window.location.href='login.html'">Login</button>
            <button onclick="window.location.href='signup.html'">Sign Up</button>
        `;
    }

    return `
        <header>
            <nav>
                <div class="logo" onclick="window.location.href='index.html'">
                    <img src="Assets/logo ToolHub.png" alt="ToolHub Logo">
                    <h1>ToolHub</h1>
                </div>
                <ul>
                    ${navLinks}
                </ul>
                <div class="login">
                    ${loginSection}
                </div>
            </nav>
        </header>
    `;
}

// Make authManager available globally for onclick handlers
window.authManager = authManager;
