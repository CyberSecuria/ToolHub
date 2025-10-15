// Import GDPR/privacy policy page inner logic
import { rgpdInner } from "./view/rgpdinner.js";
// Import authentication manager
import { authManager } from "./utils/auth.js";
// Import header event listeners
import { addHeaderEventListeners } from "./controller/headerController.js";
// Import burger menu utility
import { setupBurgerMenu} from "./Tools/burgerMenu.js";
// Import cookie consent banner
import { showCookieConsent } from "./utils/cookies.js";

// Initialize GDPR page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Inject HTML content
    document.body.innerHTML = rgpdInner();
    

    // Update UI based on authentication state
    const updateUI = () => {
        const loginDiv = document.querySelector('.login');
        const adminLink = document.querySelector('.admin-link');
        
        if (loginDiv) {
            if (authManager.isAuthenticated()) {
                // User is authenticated
                const user = authManager.getCurrentUser();
                loginDiv.innerHTML = `
                    <button>Hello, ${user.username}</button>
                    <button onclick="authManager.logout()">Logout</button>
                `;
                
                // Show admin link if user is administrator
                if (user.role === 'admin' && adminLink) {
                    adminLink.classList.remove('hidden');
                }
            } else {
                // User is not authenticated
                loginDiv.innerHTML = `
                    <button onclick="window.location.href='login.html'">Login</button>
                    <button onclick="window.location.href='signup.html'">Sign Up</button>
                `;
                // Hide admin link
                if (adminLink) {
                    adminLink.classList.add('hidden');
                }
            }
        }
    };
    
    
    // Setup header event listeners
    addHeaderEventListeners();

    // Display cookie consent banner if needed
    showCookieConsent();
   
    // Update UI on page load
    authManager.updateUI();

    // Listen for authentication state changes
    window.addEventListener('authStateChanged', updateUI);
    
    // Setup burger menu for mobile navigation
    setupBurgerMenu();
});