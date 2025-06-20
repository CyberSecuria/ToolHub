import { cardsData } from "../Data/carditem.js";
import { renderStars } from "./Tools/stars.js";
import { addHeaderEventListeners } from "./controler/homepagecontroler.js";
import { toolsInner } from "./view/toolsinner.js";
import { setupToolboxSearch, filterAndRenderTools } from "./controler/filtercontroler.js";

toolsInner();
addHeaderEventListeners();
renderStars();

setupToolboxSearch();
filterAndRenderTools();