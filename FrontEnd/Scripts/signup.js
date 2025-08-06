import { signupInner } from "./view/signupinner.js";
import { addHeaderEventListeners } from "./controler/headercontroler.js";
import { setupBurgerMenu } from "./Tools/burgerMenu.js";

signupInner();

addHeaderEventListeners();

setupBurgerMenu();