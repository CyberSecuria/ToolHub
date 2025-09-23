import { addHeaderEventListeners } from "./controler/headercontroler.js";
import { ressourceInner } from "./view/ressourceinner.js";
import { setupBurgerMenu } from "./Tools/burgerMenu.js";
import { authManager } from "./utils/auth.js";

ressourceInner();

addHeaderEventListeners();

setupBurgerMenu();

// Initialize authentication UI
authManager.updateUI();

