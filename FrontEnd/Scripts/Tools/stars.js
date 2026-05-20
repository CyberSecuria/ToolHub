// Function to dynamically display stars based on a rating number (1 to 5)
export function renderStars() {
  // Find all elements with 'stars' class and render their rating
  document.querySelectorAll('.stars').forEach(function(starSpan) {
    let stars = parseFloat(starSpan.getAttribute('data-stars'));
    // If no rating or 0, display 1 star as default
    if (isNaN(stars)) stars = 1;
    if (stars <= 0) stars = 1;
    if (stars > 5) stars = 5; // Limit to maximum 5 stars
    
    // Calculate full, half, and empty stars
    let full = Math.floor(stars);
    let half = (stars % 1) >= 0.5 ? 1 : 0;
    let empty = 5 - full - half;
    // Build star HTML string
    let html = '★'.repeat(full); // Full stars
    if (half) html += '⯪'; // Half star
    html += '☆'.repeat(empty); // Empty stars
    starSpan.textContent = html;
  });
}

