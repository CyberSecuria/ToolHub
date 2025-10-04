import { cardsData, loadCardsData } from "../Data/carditem.js";
import { setupFilterSearch, initFilters } from "./controler/filtercontroler.js";
import { setupBurgerMenu } from "./Tools/burgerMenu.js";
import { addHeaderEventListeners } from "./controler/headercontroler.js";
import { renderStars } from "./Tools/stars.js";
import { homepageInner, setupHomeModal } from "./view/indexinner.js";
import { setupBookmarkPopup } from "./controler/bookmark-controler.js";
import { authManager } from "./utils/auth.js";

// Fonction pour configurer les event listeners des boutons d'action
function setupToolActions() {
  // Event listeners pour les boutons de modification
  document.querySelectorAll('.edit-tool').forEach(button => {
    button.addEventListener('click', (e) => {
      const toolId = e.target.getAttribute('data-tool-id');
      // Importer et appeler editTool depuis indexinner.js
      window.editTool && window.editTool(toolId);
    });
  });

  // Event listeners pour les boutons de suppression
  document.querySelectorAll('.delete-tool').forEach(button => {
    button.addEventListener('click', (e) => {
      const toolId = e.target.getAttribute('data-tool-id');
      // Importer et appeler deleteTool depuis indexinner.js
      window.deleteTool && window.deleteTool(toolId);
    });
  });
}

// Fonction d'initialisation asynchrone
async function initIndex() {
  // Charger les données depuis l'API
  await loadCardsData();
  
  // Inject the main template with the first card (for the structure).
  document.querySelector("body").innerHTML = homepageInner(cardsData[0] || {});
  
  // Generate the HTML for all the cards and inject it into .items
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
  
  // Configurer les event listeners pour les boutons d'action
  setupToolActions();
  
  // Initialize authentication UI
  authManager.updateUI();
  
  // Show/hide Add Tool button based on auth status
  updateFabVisibility();
}

// Lancer l'initialisation
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

// Optional: react to auth UI refreshes triggered elsewhere
window.addEventListener('storage', (e) => {
  if (e.key === 'accessToken' || e.key === 'user' || e.key === 'refreshToken') {
    updateFabVisibility();
  }
});