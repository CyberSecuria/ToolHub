// Script pour afficher dynamiquement les étoiles selon l'attribut data-stars
// Fonctionne pour les cards et les filtres

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.stars').forEach(function(starSpan) {
    let stars = parseInt(starSpan.getAttribute('data-stars'));
    if (!stars || stars < 1) stars = 5;
    let full = '★'.repeat(stars);
    let empty = '☆'.repeat(5 - stars);
    starSpan.textContent = full + empty;
  });
});
