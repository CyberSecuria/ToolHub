import { cardsData } from "../../Data/carditem.js";
import { homepageInner } from "../view/indexinner.js";
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
  updateStarCounts(filtered);
}

// Met à jour le nombre de cards pour chaque filtre étoiles
function updateStarCounts(filteredCards = cardsData) {
  document.querySelectorAll('.filter h2, .filter h2.text-sm').forEach(h2 => {
    if (h2.textContent.trim().toLowerCase() === "stars") {
      const checkboxes = h2.nextElementSibling?.querySelectorAll('input[type="checkbox"]') || [];
      checkboxes.forEach(cb => {
        const starsElem = cb.parentElement.querySelector('.stars');
        if (starsElem) {
          const starValue = parseInt(starsElem.getAttribute('data-stars'));
          const count = filteredCards.filter(card => Math.round(card.rating) === starValue).length;
          let countSpan = cb.parentElement.querySelector('.star-count');
          if (!countSpan) {
            countSpan = document.createElement('span');
            countSpan.className = 'star-count';
            countSpan.style.marginLeft = '6px';
            cb.parentElement.appendChild(countSpan);
          }
          countSpan.textContent = `(${count})`;
        }
      });
    }
  });
}

// Ajoute le menu burger dynamiquement et la logique d'ouverture/fermeture
export function setupBurgerMenu() {
  // Crée le bouton burger si absent
  if (!document.querySelector('.burger')) {
    const burger = document.createElement('div');
    burger.className = 'burger';
    burger.innerHTML = '<span></span><span></span><span></span>';
    document.querySelector('nav').appendChild(burger);
  }
  const burger = document.querySelector('.burger');
  const navUl = document.querySelector('nav ul');
  burger.addEventListener('click', () => {
    navUl.classList.toggle('active');
    burger.classList.toggle('open');
  });
  // Ferme le menu si on clique sur un lien
  navUl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navUl.classList.remove('active');
      burger.classList.remove('open');
    });
  });
}

// Barre de recherche simple pour toolsinner.js
export function setupToolboxSearch() {
  const searchInput = document.querySelector('.toolbox-search input[type="text"]');
  if (!searchInput) return;
  searchInput.addEventListener('input', filterAndRenderTools);
}

export function filterAndRenderTools() {
  const searchValue = document.querySelector('.toolbox-search input[type="text"]')?.value.trim().toLowerCase() || "";
  const filtered = cardsData.filter(card =>
    card.name.toLowerCase().includes(searchValue) ||
    card.description.toLowerCase().includes(searchValue) ||
    card.category.toLowerCase().includes(searchValue)
  );
  const itemsHTML = filtered.map(card => {
    return `
      <div class="item">
        <img src="${card.image}" alt="${card.alt || card.name}">
        <h3>${card.name}</h3>
        <p><strong>Description :</strong> ${card.description}</p>
        <p><strong>Catégorie :</strong> ${card.category}</p>
        <p><strong>OS :</strong><span class="platformicon">
          ${card.platform.map(p => `<img src="${p.icon}" alt="${p.name}" class="platformicon">`).join(' ')}
        </span></p>
        <div class="item-bottom">
          <span class="stars" data-stars="${card.rating}"></span>
          <button>Add to toolbox</button>
        </div>
      </div>
    `;
  }).join("");
  // Correction : vérifier l'existence du conteneur avant d'injecter
  const itemsContainer = document.querySelector(".items.toolbox-cards") || document.querySelector(".toolbox-cards-list") || document.querySelector(".items");
  if (itemsContainer) {
    itemsContainer.innerHTML = itemsHTML;
    renderStars();
  }
}