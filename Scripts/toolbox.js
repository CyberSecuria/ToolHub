import { cardsData } from "../Data/carditem.js";
import { renderStars } from "./Tools/stars.js";
import { addHeaderEventListeners } from "./controler/headercontroler.js";
import { toolsInner } from "./view/toolboxinner.js";
import { setupToolboxSearch, filterAndRenderTools, setupBurgerMenu } from "./controler/filtercontroler.js";

toolsInner();
addHeaderEventListeners();
renderStars();

setupToolboxSearch();
filterAndRenderTools();
setupBurgerMenu();