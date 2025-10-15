// Import card data and loading function
import { cardsData, loadCardsData } from "../Data/carditem.js";
// Import star rating renderer
import { renderStars } from "./Tools/stars.js";
// Import header event listeners
import { addHeaderEventListeners } from "./controller/headerController.js";
// Import toolbox page inner logic
import { toolsInner } from "./view/toolboxinner.js";
// Import toolbox search and filter functionality
import { setupToolboxSearch, filterAndRenderTools } from "./controller/filterController.js";
// Import burger menu utility
import { setupBurgerMenu } from "./Tools/burgerMenu.js";
// Import authentication manager
import { authManager } from "./utils/auth.js";
// Import cookie consent banner
import { showCookieConsent } from "./utils/cookies.js";

// Asynchronous initialization function for toolbox page
async function initToolbox() {
  // Load card data from API
  await loadCardsData();
  
  // Expose authManager globally BEFORE everything else
  window.authManager = authManager;
  
  // Generate page with loaded data
  toolsInner();
  
  // Setup header event listeners
  addHeaderEventListeners();
  
  // Initialize authentication UI AFTER DOM generation
  authManager.updateUI();
  
  // Render star ratings
  renderStars();
  
  // Setup toolbox search functionality
  setupToolboxSearch();
  
  // Apply initial filters and render tools
  filterAndRenderTools();
  
  // Setup burger menu for mobile navigation
  setupBurgerMenu();

  // Display cookie consent banner if needed
  showCookieConsent();
}

// Launch initialization
initToolbox().catch(console.error);