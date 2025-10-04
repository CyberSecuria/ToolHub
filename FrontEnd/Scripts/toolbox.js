import { cardsData, loadCardsData } from "../Data/carditem.js";
import { renderStars } from "./Tools/stars.js";
import { addHeaderEventListeners } from "./controler/headercontroler.js";
import { toolsInner } from "./view/toolboxinner.js";
import { setupToolboxSearch, filterAndRenderTools } from "./controler/filtercontroler.js";
import { setupBurgerMenu } from "./Tools/burgerMenu.js";
import { authManager } from "./utils/auth.js";

// Fonction d'initialisation asynchrone
async function initToolbox() {
  // Charger les données depuis l'API
  await loadCardsData();
  
  // Expose authManager globally AVANT tout le reste
  window.authManager = authManager;
  
  // Générer la page avec les données chargées
  toolsInner();
  
  addHeaderEventListeners();
  
  // Initialize authentication UI APRES la génération du DOM
  authManager.updateUI();
  
  renderStars();
  
  setupToolboxSearch();
  
  filterAndRenderTools();
  
  setupBurgerMenu();
}

// Lancer l'initialisation
initToolbox().catch(console.error);