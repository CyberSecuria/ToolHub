// Import header event listeners
import { addHeaderEventListeners } from "./controller/headerController.js";
// Import login page inner logic
import { loginInner } from "./view/logininner.js";
// Import burger menu utility
import { setupBurgerMenu } from "./Tools/burgerMenu.js";
// Import cookie consent banner
import { showCookieConsent } from "./utils/cookies.js";

// Initialize login page
loginInner();

// Setup header event listeners
addHeaderEventListeners();

// Setup burger menu for mobile navigation
setupBurgerMenu(); 

// Display cookie consent banner if needed
showCookieConsent();