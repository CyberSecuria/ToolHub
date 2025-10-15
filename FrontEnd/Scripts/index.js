// Import card data and loading function
import { cardsData, loadCardsData } from "../Data/carditem.js";
// Import filter and search functionality
import { setupFilterSearch, initFilters } from "./controller/filterController.js";
// Import burger menu utility
import { setupBurgerMenu } from "./Tools/burgerMenu.js";
// Import header event listeners
import { addHeaderEventListeners } from "./controller/headerController.js";
// Import star rating renderer
import { renderStars } from "./Tools/stars.js";
// Import homepage inner logic and modal setup
import { homepageInner, setupHomeModal } from "./view/indexinner.js";
// Import bookmark popup functionality
import { setupBookmarkPopup } from "./controller/bookmarkController.js";
// Import authentication manager
import { authManager } from "./utils/auth.js";
// Import cookie consent banner
import { showCookieConsent } from "./utils/cookies.js";

// Setup event listeners for tool action buttons (edit/delete)
function setupToolActions() {
  // Event listeners for edit buttons
  document.querySelectorAll('.edit-tool').forEach(button => {
    button.addEventListener('click', (e) => {
      const toolId = e.target.getAttribute('data-tool-id');
      // Call editTool from indexinner.js if available
      window.editTool && window.editTool(toolId);
    });
  });

  // Event listeners for delete buttons
  document.querySelectorAll('.delete-tool').forEach(button => {
    button.addEventListener('click', (e) => {
      const toolId = e.target.getAttribute('data-tool-id');
      // Call deleteTool from indexinner.js if available
      window.deleteTool && window.deleteTool(toolId);
    });
  });
}

// Asynchronous initialization function for homepage
async function initIndex() {
  // Load card data from API
  await loadCardsData();
  
  // Inject the main template with the first card (for the structure)
  document.querySelector("body").innerHTML = homepageInner(cardsData[0] || {});
  
  // Generate the HTML for all cards and inject into .items container
  const itemsHTML = cardsData
    .map((card) => {
     
      const temp = document.createElement("div");
      temp.innerHTML = homepageInner(card);
      const itemDiv = temp.querySelector(".item");
      return itemDiv ? itemDiv.outerHTML : "";
    })
    .join("");
  // Inject the generated HTML into the .items container
  document.querySelector(".items").innerHTML = itemsHTML;

  addHeaderEventListeners();
  
  renderStars();
  
  setupFilterSearch();
  initFilters();
  
  setupBurgerMenu();
  
  setupBookmarkPopup();
  
  setupHomeModal();
  
  // Setup event listeners for tool action buttons
  setupToolActions();
  
  // Initialize authentication UI
  authManager.updateUI();
  
  // Show/hide Add Tool button based on authentication status
  updateFabVisibility();

  // Display cookie consent banner if needed
  showCookieConsent();
}

// Launch initialization
initIndex().catch(console.error);

// Show the Add Tool button only when authenticated
function updateFabVisibility() {
  const fabContainer = document.querySelector('.fab-container');
  const addToolModal = document.getElementById('add-tool-modal-index');
  const isAuth = authManager.isAuthenticated();

  if (fabContainer) {
    fabContainer.style.display = isAuth ? '' : 'none';
  }
  // Ensure modal cannot remain open when user is not authenticated
  if (!isAuth && addToolModal) {
    addToolModal.setAttribute('aria-hidden', 'true');
  }
}

// React to authentication changes from other tabs/windows
window.addEventListener('storage', (e) => {
  // Update FAB visibility when auth tokens change
  if (e.key === 'accessToken' || e.key === 'user' || e.key === 'refreshToken') {
    updateFabVisibility();
  }
});