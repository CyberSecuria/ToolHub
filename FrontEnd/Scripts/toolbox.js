import { cardsData } from "../Data/carditem.js";
import { renderStars } from "./Tools/stars.js";
import { addHeaderEventListeners } from "./controler/headercontroler.js";
import { toolsInner } from "./view/toolboxinner.js";
import { setupToolboxSearch, filterAndRenderTools } from "./controler/filtercontroler.js";
import { setupBurgerMenu } from "./Tools/burgerMenu.js";

toolsInner();

addHeaderEventListeners();

renderStars();

setupToolboxSearch();

filterAndRenderTools();

setupBurgerMenu();