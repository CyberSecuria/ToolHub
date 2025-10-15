// Import signup page inner logic
import { signupInner } from "./view/signupinner.js";
// Import header event listeners
import { addHeaderEventListeners } from "./controller/headerController.js";
// Import burger menu utility
import { setupBurgerMenu } from "./Tools/burgerMenu.js";
// Import cookie consent banner
import { showCookieConsent } from "./utils/cookies.js";

// Initialize signup page
signupInner();

// Setup header event listeners
addHeaderEventListeners();

// Setup burger menu for mobile navigation
setupBurgerMenu();

// Display cookie consent banner if needed
showCookieConsent();