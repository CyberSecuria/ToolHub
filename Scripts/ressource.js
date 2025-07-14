import { addHeaderEventListeners } from "./controler/headercontroler.js";
import { ressourceInner } from "./view/ressourceinner.js";
import { setupBurgerMenu } from "./Tools/burgerMenu.js";

ressourceInner();

addHeaderEventListeners();

setupBurgerMenu();

