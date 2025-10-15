// Import burger menu utility
import { setupBurgerMenu } from './Tools/burgerMenu.js';
// Import authentication manager
import { authManager } from './utils/auth.js';
// Import admin panel inner logic
import  adminInner  from './view/admininner.js';

// Make authManager available globally for inline event handlers
window.authManager = authManager;

// Debug function to update status information
function updateDebugInfo(status, auth = null, admin = null) {
    document.getElementById('status').textContent = status;
    if (auth !== null) document.getElementById('auth-status').textContent = auth ? 'Yes' : 'No';
    if (admin !== null) document.getElementById('admin-status').textContent = admin ? 'Yes' : 'No';
}

// Initialize admin panel with authentication checks
async function initAdmin() {
    try {
        updateDebugInfo('Importing modules...');
        
        updateDebugInfo('Auth module loaded');
        
        // Check if user is authenticated and has admin role
        const isAuth = authManager.isAuthenticated();
        const isAdmin = authManager.isAdmin();
        
        updateDebugInfo('Checking auth', isAuth, isAdmin);
        
        // If not authenticated or not admin, redirect to login
        if (!isAuth || !isAdmin) {
            document.body.innerHTML = `
                <div class="error-container">
                    <h2>Access Denied</h2>
                    <p>You must be logged in as an administrator to access this page.</p>
                    <button onclick="window.location.href='login.html'" class="home">
                        Go to Login
                    </button>
                </div>
            `;
            throw new Error('Not authenticated or not admin');
        }
        
        // Load and initialize admin interface
        updateDebugInfo('Loading admin interface...');
        
        updateDebugInfo('Running admin...');
        
        // Wait a bit to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Initialize admin panel and burger menu
        adminInner();
        setupBurgerMenu();
        
        // Debug elements are removed by createAdminInterface()
        // So we can't update them after this point
        console.log('Admin loaded successfully!');
        
    } catch (error) {
        console.error('Admin page error:', error);
        
        // Safe debug update
        try {
            updateDebugInfo(`Error: ${error.message}`);
        } catch (debugError) {
            console.error('Debug error:', debugError);
        }

        // Check if error is related to expired token
        if (error.message && error.message.toLowerCase().includes('token expired')) {
            authManager.clearAuth(true); // Call with isTokenExpired = true
        } else {
            // Display generic error for other types of errors
            document.body.innerHTML = `
                <div class="error-container">
                    <h2>Admin Panel Loading Error</h2>
                    <p><strong>Error:</strong> ${error.message}</p>
                    <p>Check the console for more details.</p>
                    <button onclick="location.reload()" class="reload">
                        Reload Page
                    </button>
                    <button onclick="window.location.href='index.html'" class="home">
                        Back to Home
                    </button>
                </div>
            `;
        }
    }
}

// Initialize admin panel when DOM is ready
document.addEventListener('DOMContentLoaded', initAdmin);
