import { cardsData } from "../Data/carditem.js";
import { setupFilterSearch } from "./controler/filtercontroler.js";
import { setupBurgerMenu } from "./Tools/burgerMenu.js";
import { addHeaderEventListeners } from "./controler/headercontroler.js";
import { renderStars } from "./Tools/stars.js";
import { homepageInner } from "./view/indexinner.js";
import { setupBookmarkPopup } from "./controler/bookmark-controler.js";

// Inject the main template with the first card (for the structure).
document.querySelector("body").innerHTML = homepageInner(cardsData[0]);

// Generate the HTML for all the cards and inject it into .items
const itemsHTML = cardsData
  .map((card) => {
   
    const temp = document.createElement("div");
    temp.innerHTML = homepageInner(card);
    const itemDiv = temp.querySelector(".item");
    return itemDiv ? itemDiv.outerHTML : "";
  })
  .join("");
// Inject the generated HTML into the .items container
document.querySelector(".items").innerHTML = itemsHTML;

addHeaderEventListeners();

renderStars();

setupFilterSearch();

setupBurgerMenu();

setupBookmarkPopup() 