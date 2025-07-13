import { addHeaderEventListeners } from "./controler/headercontroler.js";
import { loginInner } from "./view/logininner.js";
import { setupBurgerMenu } from "./controler/filtercontroler.js";

loginInner();

addHeaderEventListeners();

setupBurgerMenu();  