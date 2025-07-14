import { addHeaderEventListeners } from "./controler/headercontroler.js";
import { loginInner } from "./view/logininner.js";
import { setupBurgerMenu } from "./Tools/burgerMenu.js";

loginInner();

addHeaderEventListeners();

setupBurgerMenu();  