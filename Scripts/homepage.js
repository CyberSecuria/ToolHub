import { cardsData } from "../Data/carditem.js";
import { setupFilterSearch } from "./controler/filtercontroler.js";
import { addHeaderEventListeners } from "./controler/homepagecontroler.js";
import { renderStars } from "./Tools/stars.js";
import { homepageInner } from "./view/homepageinner.js";

// Injecte le squelette principal avec la première card (pour la structure)
document.querySelector("body").innerHTML = homepageInner(cardsData[0]);

// Génère le HTML de toutes les cards et l'injecte dans .items
const itemsHTML = cardsData
  .map((card) => {
    // homepageInner retourne tout le squelette, il faut donc une fonction séparée pour une card
    // On extrait le HTML d'une card depuis homepageInner (temporairement)
    // Ici, on prend le bloc .item généré par homepageInner(card)
    const temp = document.createElement("div");
    temp.innerHTML = homepageInner(card);
    // Cherche le premier .item dans le HTML généré
    const itemDiv = temp.querySelector(".item");
    return itemDiv ? itemDiv.outerHTML : "";
  })
  .join("");
document.querySelector(".items").innerHTML = itemsHTML;

addHeaderEventListeners();
// Si tu veux les étoiles dynamiques, ajoute :
// import { renderStars } from "./Tools/stars.js";
// renderStars();
renderStars();
setupFilterSearch();