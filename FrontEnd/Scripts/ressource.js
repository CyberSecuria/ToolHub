// Import header event listeners
import { addHeaderEventListeners } from "./controller/headerController.js";
// Import resources page inner logic
import { ressourceInner } from "./view/ressourceinner.js";
// Import burger menu utility
import { setupBurgerMenu } from "./Tools/burgerMenu.js";
// Import authentication manager
import { authManager } from "./utils/auth.js";
// Import cookie consent banner
import { showCookieConsent } from "./utils/cookies.js";

// Initialize resources page
ressourceInner();

// Setup header event listeners
addHeaderEventListeners();

// Setup burger menu for mobile navigation
setupBurgerMenu();

// Display cookie consent banner if needed
showCookieConsent();

// Initialize authentication UI
authManager.updateUI();

// Load and display educational resources from API
async function loadResources() {
  const list = document.getElementById('resource-list');
  if (!list) return;
  // Show loading state
  list.innerHTML = '<li>Loading…</li>';
  try {
    // Fetch resources from backend API
    const res = await fetch('http://localhost:3001/api/resources');
    if (!res.ok) throw new Error('Failed to load resources');
    const data = await res.json();
    // Handle different response formats
    const resources = Array.isArray(data) ? data : (data.resources || []);
    if (!resources.length) {
      list.innerHTML = '<li>No resources found.</li>';
      return;
    }
    // Generate HTML list of resources
    list.innerHTML = resources.map(r => {
      const title = r.Title || r.title || 'Untitled';
      const url = r.Path || r.path || '#';
      // Sanitize title to prevent XSS
      const safeTitle = String(title).replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const safeUrl = String(url);
      return `<li><a href="${safeUrl}" target="_blank"><strong>${safeTitle}</strong></a></li>`;
    }).join('');
  } catch (err) {
    // Display error message
    list.innerHTML = `<li>Error: ${err.message}</li>`;
  }
}

// Load resources when DOM is ready
window.addEventListener('DOMContentLoaded', loadResources);
