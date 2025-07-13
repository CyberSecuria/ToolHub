import { addHeaderEventListeners } from "./controler/headercontroler.js";
import { ressourceInner } from "./view/ressourceinner.js";
import { setupBurgerMenu } from "./controler/filtercontroler.js";
ressourceInner();

addHeaderEventListeners();

setupBurgerMenu();

