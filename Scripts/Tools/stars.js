// Function to dynamically display stars based on a number (1 to 5) 
export function renderStars() {
  document.querySelectorAll('.stars').forEach(function(starSpan) {
    let stars = parseFloat(starSpan.getAttribute('data-stars'));
    if (!stars || stars < 1) stars = 5;
    let full = Math.floor(stars);
    let half = (stars % 1) >= 0.5 ? 1 : 0;
    let empty = 5 - full - half;
    let html = '★'.repeat(full);
    if (half) html += '⯨';
    html += '☆'.repeat(empty);
    starSpan.textContent = html;
  });
}

