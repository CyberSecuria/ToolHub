// Fonction pour afficher dynamiquement les étoiles selon un nombre (1 à 5)
// Utilise l'attribut data-stars sur chaque .stars
export function renderStars() {
  document.querySelectorAll('.stars').forEach(function(starSpan) {
    let stars = parseFloat(starSpan.getAttribute('data-stars'));
    if (!stars || stars < 1) stars = 5;
    let full = Math.floor(stars);
    let half = (stars % 1) >= 0.5 ? 1 : 0;
    let empty = 5 - full - half;
    let html = '★'.repeat(full);
    if (half) html += '⯨'; // Unicode demi-étoile (ou utilise une image/svg si tu veux mieux)
    html += '☆'.repeat(empty);
    starSpan.textContent = html;
  });
}
// Pour l'utiliser :
// import { renderStars } from './stars.js';
// renderStars();
// Appelle cette fonction après avoir injecté le HTML des cards !
