// Main profile script
import { addHeaderEventListeners } from "./controller/headerController.js";
import { profileInner } from "./view/profileinner.js";
import { setupBurgerMenu } from "./Tools/burgerMenu.js";
import { authManager } from "./utils/auth.js";
import { showCookieConsent } from "./utils/cookies.js";

// Check if user is authenticated before loading profile
if (!authManager.isAuthenticated()) {
    window.location.href = 'login.html';
} else {
    // Load profile page
    profileInner();
    
    // Setup event listeners
    addHeaderEventListeners();
    setupBurgerMenu();
    showCookieConsent();
    
    // Initialize auth UI
    authManager.updateUI();
}
