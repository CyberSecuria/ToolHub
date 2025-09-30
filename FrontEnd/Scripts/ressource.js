import { addHeaderEventListeners } from "./controler/headercontroler.js";
import { ressourceInner } from "./view/ressourceinner.js";
import { setupBurgerMenu } from "./Tools/burgerMenu.js";
import { authManager } from "./utils/auth.js";

ressourceInner();

addHeaderEventListeners();

setupBurgerMenu();

// Initialize authentication UI
authManager.updateUI();

async function loadResources() {
  const list = document.getElementById('resource-list');
  if (!list) return;
  list.innerHTML = '<li>Loading…</li>';
  try {
    const res = await fetch('http://localhost:3001/api/resources');
    if (!res.ok) throw new Error('Failed to load resources');
    const data = await res.json();
    const resources = Array.isArray(data) ? data : (data.resources || []);
    if (!resources.length) {
      list.innerHTML = '<li>No resources found.</li>';
      return;
    }
    list.innerHTML = resources.map(r => {
      const title = r.Title || r.title || 'Untitled';
      const url = r.Path || r.path || '#';
      const safeTitle = String(title).replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const safeUrl = String(url);
      return `<li><a href="${safeUrl}" target="_blank"><strong>${safeTitle}</strong></a></li>`;
    }).join('');
  } catch (err) {
    list.innerHTML = `<li>Error: ${err.message}</li>`;
  }
}

window.addEventListener('DOMContentLoaded', loadResources);
