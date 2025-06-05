import { cardsData } from "../../Data/carditem.js";
import { homepageInner } from "../view/homepageinner.js";
import { renderStars } from "../Tools/stars.js";

// Fonction principale pour activer tous les filtres
export function setupFilterSearch() {
  // Rendu initial
  filterAndRender();

  // Ajout listeners sur la barre de recherche
  const searchInput = document.querySelector('.filter input[type="text"]');
  if (searchInput) {
    searchInput.addEventListener('input', filterAndRender);
  }

  // Ajout listeners sur tous les checkboxes
  document.querySelectorAll('.filter input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', filterAndRender);
  });
}

// Fonction de filtrage et de rendu
function filterAndRender() {
  // Recherche texte
  const searchValue = document.querySelector('.filter input[type="text"]')?.value.trim().toLowerCase() || "";

  // Stars cochées
  const checkedStars = Array.from(document.querySelectorAll('.filter h2, .filter h2.text-sm'))
    .filter(h2 => h2.textContent.trim().toLowerCase() === "stars")
    .flatMap(h2 => Array.from(h2.nextElementSibling?.querySelectorAll('input[type="checkbox"]:checked') || []))
    .map(cb => parseInt(cb.parentElement.querySelector('.stars')?.getAttribute('data-stars')));

  // Catégories cochées
  const checkedCategories = Array.from(document.querySelectorAll('.filter h2, .filter h2.text-sm'))
    .filter(h2 => h2.textContent.trim().toLowerCase() === "category")
    .flatMap(h2 => Array.from(h2.nextElementSibling?.querySelectorAll('input[type="checkbox"]:checked') || []))
    .map(cb => cb.parentElement.textContent.trim().toLowerCase());

  // Platforms cochées (web, desktop, mobile)
  const checkedPlatforms = Array.from(document.querySelectorAll('.filter h2, .filter h2.text-sm'))
    .filter(h2 => h2.textContent.trim().toLowerCase() === "plaform" || h2.textContent.trim().toLowerCase() === "platform")
    .flatMap(h2 => Array.from(h2.nextElementSibling?.querySelectorAll('input[type="checkbox"]:checked') || []))
    .map(cb => cb.parentElement.textContent.trim().toLowerCase());

  // OS cochés (windows, macos, linux, android, ios)
  const checkedOS = Array.from(document.querySelectorAll('.filter h2, .filter h2.text-sm'))
    .filter(h2 => h2.textContent.trim().toLowerCase() === "os")
    .flatMap(h2 => Array.from(h2.nextElementSibling?.querySelectorAll('input[type="checkbox"]:checked') || []))
    .map(cb => cb.parentElement.textContent.trim().toLowerCase());

  // Filtrage
  const filtered = cardsData.filter(card => {
    // Search
    const matchSearch =
      !searchValue ||
      card.name.toLowerCase().includes(searchValue) ||
      card.description.toLowerCase().includes(searchValue) ||
      card.category.toLowerCase().includes(searchValue);

    // Stars
    const matchStars =
      checkedStars.length === 0 ||
      checkedStars.includes(Math.round(card.rating));

    // Category
    const matchCategory =
      checkedCategories.length === 0 ||
      checkedCategories.includes(card.category.toLowerCase());

    // Platform (web, desktop, mobile)
    const deviceList = typeof card.device === "string"
      ? card.device.toLowerCase().split(",").map(d => d.trim())
      : [];
    const matchPlatform =
      checkedPlatforms.length === 0 ||
      checkedPlatforms.some(platform => deviceList.includes(platform));

    // OS (windows, macos, linux, android, ios)
    const osList = Array.isArray(card.platform)
     ? card.platform.map(p => p.name.toLowerCase().replace(/\s/g, ''))
  : [];
    const matchOS =
      checkedOS.length === 0 ||
      checkedOS.some(os => osList.some(p =>
        (os === "macos" && p.includes("macos")) ||
        (os === "windows" && p.includes("windows")) ||
        (os === "linux" && p.includes("linux")) ||
        (os === "android" && p.includes("android")) ||
        (os === "ios" && p.includes("ios"))
      ));

    return matchSearch && matchStars && matchCategory && matchPlatform && matchOS;
  });

  // Rendu
  const itemsHTML = filtered.map(card => {
    const temp = document.createElement("div");
    temp.innerHTML = homepageInner(card);
    const itemDiv = temp.querySelector(".item");
    return itemDiv ? itemDiv.outerHTML : "";
  }).join("");
  document.querySelector(".items").innerHTML = itemsHTML;
  renderStars();
}