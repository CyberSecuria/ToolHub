// Function to dynamically display stars based on a number (1 to 5) 
export function renderStars() {
  document.querySelectorAll('.stars').forEach(function(starSpan) {
    let stars = parseFloat(starSpan.getAttribute('data-stars'));
    // Si pas de rating ou 0, afficher 0 étoiles
    if (isNaN(stars)) stars = 1;
    if (stars <= 0) stars = 1;
    if (stars > 5) stars = 5; // Limiter à 5 max
    
    let full = Math.floor(stars);
    let half = (stars % 1) >= 0.5 ? 1 : 0;
    let empty = 5 - full - half;
    let html = '★'.repeat(full);
    if (half) html += '⯨';
    html += '☆'.repeat(empty);
    starSpan.textContent = html;
  });
}

