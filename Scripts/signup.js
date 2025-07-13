import { signupInner } from "./view/signupinner.js";
import { addHeaderEventListeners } from "./controler/headercontroler.js";
import { setupBurgerMenu } from "./controler/filtercontroler.js";

signupInner();

addHeaderEventListeners();

setupBurgerMenu();