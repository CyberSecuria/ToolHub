// Import of the card data
import { cardsData } from "../../Data/carditem.js";
// Import of the star rendering function
import { renderStars } from "../Tools/stars.js";
// Import of auth manager
import { authManager } from "../utils/auth.js";
// Import of the index controller
import { setupIndexToolActions, setupReviewsModal, setupEditForm, setupHomeModal } from "../controller/indexController.js";

// Inner function to generate the homepage with a card object
export function homepageInner(card) {
  // If no card is provided, use safe defaults so the UI can render a fallback
  // instead of throwing an error. This prevents uncaught exceptions when the
  // data hasn't loaded yet or when an individual card is missing.
  if (!card) {
    card = {
      image: 'Assets/Card Product Icons/figma icon.png',
      name: 'No tool available',
      description: 'There is currently no tool data to display.',
      category: 'Divers',
      platform: [],
      rating: 1,
      link: '#',
    };
  }
  
  let template = `<header>
        <nav>
            <div class="logo">
                <img src="Assets/logo ToolHub.png" alt="logo">
                <h1>ToolHub</h1>
        </div>
        <ul>
            <li><a href="#">Home</a></li>
            <li><a href="toolbox.html">Toolbox</a></li>
            <li><a href="ressource.html">Ressources</a></li>
        </ul>
        <div class="login">
            <button href="login.html">Login</button>
            <button href="signup.html">Sign Up</button>
        </div>
    </nav>
    </header>
    <main>
        <div class="hero">
            <h2 class="titlehero">Discover ToolHub - Your Centralized Tools</h2>
            <p class="texthero">Find, organize, and use the best tools to boost your productivity.</p>
        </div>
        <div class="content">
            <div class="items">
                <div class="item" data-tool-id="{{cardid}}">
                    {{actionbuttons}}
                    <img src="Assets/bookmark icons/bookmark-empty.svg" class="bookmark-icon" title="Bookmark" alt="Bookmark">
                    <img src="{{cardimage}}" alt="{{cardalt}}">
                    <h3>{{cardname}}</h3>
                    <p><strong>Description :</strong> {{carddescription}}</p>
                    <p><strong>Catégorie :</strong> {{cardcategory}}</p>
                    <p><strong>OS :</strong> {{cardplatform}} <span class="platformicon"></span></p>
                    <div class="item-bottom">
                        <span class="stars" data-stars="{{cardrating}}" title="See reviews"></span>
                        <a class="visited" href="{{cardlink}}" target="_blank" rel="noopener noreferrer">
                          <button>Let see</button>
                        </a>
                    </div>
                </div>
            </div>
            <aside>
                <h3>Filters</h3>
                <div class="filter">
                    <input type="text" placeholder="Search">
                    <button>Search</button>
                    <div class="w-64 p-4 space-y-6 bg-white border-r">
                        <!-- Star Category -->
                        <div>
                          <h2 class="text-sm font-semibold mb-2">Stars</h2>
                          <ul class="space-y-1 text-sm">
                            <li><label><input type="checkbox"> <span class="stars" data-stars="5" title="See reviews"></span> </label></li>
                            <li><label><input type="checkbox"> <span class="stars" data-stars="4" title="See reviews"></span> </label></li>
                            <li><label><input type="checkbox"> <span class="stars" data-stars="3" title="See reviews"></span> </label></li>
                            <li><label><input type="checkbox"> <span class="stars" data-stars="2" title="See reviews"></span> </label></li>
                            <li><label><input type="checkbox"> <span class="stars" data-stars="1" title="See reviews"></span> </label></li>
                          </ul>
                        </div>
                        <div>
                          <h2 class="text-sm font-semibold mb-2">Category</h2>
                          <ul id="filter-category-list" class="space-y-1 text-sm" aria-live="polite">
                            <li>Loading categories...</li>
                          </ul>
                        </div>
                        <div>
                          <h2>Plaform</h2>
                          <ul id="filter-platform-list" aria-live="polite">
                            <li>Loading platforms...</li>
                          </ul>
                        </div>
                        <div>
                          <h2>OS</h2>
                          <ul id="filter-os-list" aria-live="polite">
                            <li>Loading OS...</li>
                          </ul>
                        </div>
                      </div>
                </div>
            </aside>
        </div>
        <!-- Modal for reviews -->
        <div id="reviews-modal" class="hidden">
          <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Reviews</h2>
            <div class="reviews-list">
              <!-- Example comments, replace with dynamic if needed -->
              <p>No reviews yet.</p>
            </div>
          </div>
        </div>
      <div class="fab-container">
        <span class="fab-label">Add a Tool</span>
        <button class="fab" id="btn-add-tool-index" type="button">+</button>
      </div>

      <!-- Add Tool Modal (Home) -->
      <div id="add-tool-modal-index" class="th-modal" aria-hidden="true" role="dialog" aria-labelledby="add-tool-title-index">
        <div class="th-modal-overlay" data-close-modal></div>
        <div class="th-modal-content" role="document">
          <button class="th-modal-close" type="button" aria-label="Close" data-close-modal>&times;</button>
          <h3 id="add-tool-title-index">Add a new tool</h3>
          <form id="add-tool-form-index">
            <div class="th-form-row">
              <label for="tool-name-index">Name</label>
              <input id="tool-name-index" name="name" type="text" required placeholder="e.g. Notion">
            </div>
            <div class="th-form-row">
              <label for="tool-description-index">Description</label>
              <textarea id="tool-description-index" name="description" rows="3" required placeholder="Short description"></textarea>
            </div>
            <div class="th-form-row">
              <label for="tool-category-index">Category</label>
              <select id="tool-category-index" name="category" required>
                <option value="" disabled selected>Loading categories...</option>
              </select>
            </div>
            <div class="th-form-row">
              <label for="tool-link-index">Link</label>
              <input id="tool-link-index" name="link" type="url" placeholder="https://example.com" required>
            </div>
            <div class="th-form-row">
              <label for="tool-image-index">Image URL</label>
              <input id="tool-image-index" name="image" type="url" placeholder="https://.../logo.png">
            </div>
            <div class="th-form-row">
              <label>Operating System</label>
              <div id="tool-os-group-index" class="th-checkbox-group" aria-live="polite">Loading OS...</div>
            </div>
            <div class="th-form-actions">
              <button type="button" class="th-btn-secondary" data-close-modal>Cancel</button>
              <button type="submit" class="th-btn-primary">Add tool</button>
            </div>
          </form>
        </div>
      </div>

    </main>
    
    <!-- Modal for edit a tool -->
    <div id="edit-tool-modal" class="action-modal">
      <div class="action-modal-content">
        <h3>Edit Tool</h3>
        <form id="edit-tool-form">
          <div class="form-group">
            <label for="edit-tool-name">Tool Name</label>
            <input type="text" id="edit-tool-name" required>
          </div>
          <div class="form-group">
            <label for="edit-tool-description">Description</label>
            <textarea id="edit-tool-description" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label for="edit-tool-link">Website Link</label>
            <input type="url" id="edit-tool-link" required>
          </div>
          <div class="form-group">
            <label for="edit-tool-image">Image URL</label>
            <input type="url" id="edit-tool-image" placeholder="https://example.com/logo.png">
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-cancel" onclick="closeEditModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Update Tool</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal for delete a tool -->
    <div id="delete-tool-modal" class="action-modal">
      <div class="action-modal-content">
        <h3>Delete Tool</h3>
        <p>Are you sure you want to delete the tool <strong id="delete-tool-name"></strong>?</p>
        <p class="error-text">This action cannot be undone.</p>
        <div class="modal-actions">
          <button type="button" class="btn btn-cancel" onclick="closeDeleteModal()">Cancel</button>
          <button type="button" class="btn btn-danger" onclick="confirmDelete()">Delete Tool</button>
        </div>
      </div>
    </div>
    
    <footer class="site-footer">
        <div class="footer-content">
            
            <a href="rgpd.html">Privacy Policy & GDPR</a>
            <p>&copy; 2025 ToolHub. All rights reserved.</p>
        </div>
    </footer>`;
  
  // Check if the current user is the owner of the card
  const currentUser = authManager.getCurrentUser();
  const isOwner = currentUser && currentUser.id === card.userId;
  
  const actionButtons = isOwner ? `
    <div class="tool-actions">
      <button class="edit-tool" data-tool-id="${card.id}" title="Edit tool">Edit</button>
      <button class="delete-tool" data-tool-id="${card.id}" title="Delete tool">Delete</button>
    </div>
  ` : '';
  
  // Replacing the placeholders in the template with the card data
  template = template
    .replace(/{{cardid}}/g, card.id || '')
    .replace(/{{cardimage}}/g, card.image)
    .replace(/{{cardname}}/g, card.name)
    .replace(/{{carddescription}}/g, card.description)
    .replace(/{{cardcategory}}/g, card.category)
    .replace(/{{cardalt}}/g, (card.alt && card.alt.trim()) ? card.alt : `${card.name} icon`)
    .replace(/{{cardplatform}}/g, Array.isArray(card.platform) ? card.platform.map(p => `<img src='${p.icon}' alt='${p.name}' class='platformicon'/>`).join(' ') : card.platform)
    .replace(/{{cardrating}}/g, card.rating > 0 ? card.rating : 1)
    .replace(/{{cardlink}}/g, card.link)
    .replace(/{{actionbuttons}}/g, actionButtons);

  // Setup event listeners from controller
  setTimeout(() => {
    setupReviewsModal();
    setupIndexToolActions();
    setupEditForm();
  }, 0);

  return template;
}

// Export setupHomeModal from controller for use in index.js
export { setupHomeModal } from '../controller/indexController.js';
