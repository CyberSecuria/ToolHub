import { cardsData } from "../../Data/carditem.js";
import { renderStars } from "../Tools/stars.js";
import { authManager } from "../utils/auth.js";

// inner function to generate the homepage with a card object
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
        <div id="reviews-modal" style="display:none;">
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
    
    <!-- Modal pour modifier un outil -->
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
    
    <!-- Modal pour supprimer un outil -->
    <div id="delete-tool-modal" class="action-modal">
      <div class="action-modal-content">
        <h3>Delete Tool</h3>
        <p>Are you sure you want to delete the tool <strong id="delete-tool-name"></strong>?</p>
        <p style="color: #dc2626; font-size: 14px;">This action cannot be undone.</p>
        <div class="modal-actions">
          <button type="button" class="btn btn-cancel" onclick="closeDeleteModal()">Cancel</button>
          <button type="button" class="btn btn-danger" onclick="confirmDelete()">Delete Tool</button>
        </div>
      </div>
    </div>
    
    <footer class="site-footer">
        <div class="footer-content">
            <p>&copy; 2025 ToolHub. All rights reserved.</p>
        </div>
    </footer>`;
  // Vérifier si l'utilisateur est propriétaire de cet outil
  const currentUser = authManager.getCurrentUser();
  const isOwner = currentUser && currentUser.id === card.userId;
  
  const actionButtons = isOwner ? `
    <div class="tool-actions">
      <button class="edit-tool" data-tool-id="${card.id}" title="Edit tool">✏️</button>
      <button class="delete-tool" data-tool-id="${card.id}" title="Delete tool">🗑️</button>
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

  // Adding the JavaScript to handle the reviews modal
  setTimeout(() => {
    // For all the stars, we add hover and click
    document.querySelectorAll('.stars').forEach(star => {
      star.setAttribute('title', 'See reviews');
      star.style.cursor = 'pointer';
      star.addEventListener('click', function(e) {
        const modal = document.getElementById('reviews-modal');
        if(modal) modal.style.display = 'flex';
      });
    });
    // close the modal
    const closeBtn = document.querySelector('.close-modal');
    if(closeBtn) closeBtn.onclick = function() {
      document.getElementById('reviews-modal').style.display = 'none';
    };
    // "Close by clicking outside the content
    const modal = document.getElementById('reviews-modal');
    if(modal) {
      modal.addEventListener('click', function(e) {
        if(e.target === modal) modal.style.display = 'none';
      });
    }
    
    // Setup des boutons d'action pour les outils
    setupIndexToolActions();
    
    // Setup du formulaire d'édition
    const editForm = document.getElementById('edit-tool-form');
    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitEditTool();
      });
    }
    
    // Fermer les modales en cliquant à l'extérieur
    document.querySelectorAll('.action-modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          if (modal.id === 'edit-tool-modal') closeEditModal();
          if (modal.id === 'delete-tool-modal') closeDeleteModal();
        }
      });
    });
  }, 0);

  return template;
}

// Setup handlers for the Home Add Tool modal and submission
export function setupHomeModal() {
  let escHandler = null;

  async function openModal() {
    // Vérifier si l'utilisateur est connecté
    if (!authManager.isAuthenticated()) {
      showErrorMessage('You must be logged in to add a tool. Please login first.');
      window.location.href = 'login.html';
      return;
    }

    const modal = document.getElementById("add-tool-modal-index");
    if (modal) modal.setAttribute("aria-hidden", "false");
    document.body.classList.add('modal-open');
    escHandler = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', escHandler);

    // Load categories when opening the modal
    const categorySelect = document.getElementById('tool-category-index');
    if (categorySelect) {
      // Show loading state
      categorySelect.innerHTML = '<option value="" disabled selected>Loading categories...</option>';
      categorySelect.disabled = true;
      try {
        const response = await fetch('http://localhost:3001/api/category');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const categories = Array.isArray(data.categories) ? data.categories : [];
        if (categories.length === 0) {
          categorySelect.innerHTML = '<option value="" disabled selected>No categories available</option>';
        } else {
          categorySelect.innerHTML = '<option value="" disabled selected>Select a category</option>' +
            categories.map(c => `<option value="${c.ID_Category}">${c.Name_Category}</option>`).join('');
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
        categorySelect.innerHTML = '<option value="" disabled selected>Error loading categories</option>';
      } finally {
        categorySelect.disabled = false;
      }
    }

    // Load OS list when opening the modal
    const osGroup = document.getElementById('tool-os-group-index');
    if (osGroup) {
      osGroup.textContent = 'Loading OS...';
      try {
        const response = await fetch('http://localhost:3001/api/os');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const osList = Array.isArray(data.os) ? data.os : [];
        if (osList.length === 0) {
          osGroup.textContent = 'No OS available';
        } else {
          osGroup.innerHTML = osList
            .map(o => {
              const id = `os-${o.ID_OS}`;
              const label = (o.Name_OS || '').trim();
              return `<label class="th-checkbox"><input type="checkbox" name="os" value="${label}"> ${label}</label>`;
            })
            .join('');
        }
      } catch (err) {
        console.error('Failed to load OS:', err);
        osGroup.textContent = 'Error loading OS';
      }
    }
  }

  function closeModal() {
    const modal = document.getElementById("add-tool-modal-index");
    if (modal) modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove('modal-open');
    if (escHandler) { window.removeEventListener('keydown', escHandler); escHandler = null; }
  }

  function attach() {
    const openBtn = document.getElementById("btn-add-tool-index");
    const modal = document.getElementById("add-tool-modal-index");
    const form = document.getElementById("add-tool-form-index");
    if (!openBtn || !modal || !form) return;

    openBtn.addEventListener("click", openModal);
    modal.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = String(formData.get('name') || '').trim();
      const description = String(formData.get('description') || '').trim();
      const categorySelect = document.getElementById('tool-category-index');
      const selectedCategoryId = categorySelect && categorySelect.value ? Number(categorySelect.value) : null;
      const selectedCategoryName = categorySelect ? (categorySelect.options[categorySelect.selectedIndex] ? categorySelect.options[categorySelect.selectedIndex].text : '') : '';
      const image = String(formData.get('image') || '').trim();
      const link = String(formData.get('link') || '').trim();
      // Collect selected OS checkboxes
      const selectedOs = Array.from(document.querySelectorAll('#tool-os-group-index input[name="os"]:checked'))
        .map((el) => String(el.value || '').trim())
        .filter(Boolean);

      if (!name || !description || !selectedCategoryId || !link) {
        alert('Please fill name, description, category and link.');
        return;
      }

      const platform = selectedOs
        .map(s => s.trim().toLowerCase())
        .filter(Boolean)
        .map(osName => {
          let icon = '';
          if (osName.includes('windows')) icon = 'Assets/Platform Icon/icons8-windows-os.svg';
          else if (osName.includes('mac')) icon = 'Assets/Platform Icon/icons8-mac-os.svg';
          else if (osName.includes('linux')) icon = 'Assets/Platform Icon/linux-svgrepo-com.svg';
          else if (osName.includes('android')) icon = 'Assets/Platform Icon/icons8-android.svg';
          else if (osName.includes('ios')) icon = 'Assets/Platform Icon/icons8-ios.svg';
          return icon ? { name: osName, icon } : null;
        })
        .filter(Boolean);

      // Convertir les plateformes en chaîne d'OS pour la base de données
      const osString = platform.map(p => p.name).join(', ');

      // Récupérer l'ID de l'utilisateur connecté
      const currentUser = authManager.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        showErrorMessage('Unable to get user information. Please login again.');
        return;
      }

      // Adapter les champs au format attendu par le backend (createTool)
      const payload = {
        Name_Tools: name,
        Description_Tools: description,
        Link_Tools: link,
        ImageTools: image || 'Assets/Card Product Icons/figma icon.png',
        Image_Alt: `${name} icon`,
        ID_Category: selectedCategoryId,
        Name_OS: osString || null,
        Platform_Name: 'Desktop',
        ID_User: currentUser.id
      };

      try {
        // Envoyer les données à la route POST /api/tools (montée dans index.js)
        // FORCER L'APPEL AU BON SERVEUR BACKEND
        const apiUrl = `http://localhost:3001/api/tools`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const result = await response.json();
          
          // Message de confirmation dans la page
          showSuccessMessage(`Tool "${name}" has been successfully added!`);
          
          // Déduire les plateformes (Desktop/Mobile) à partir des OS sélectionnés
          const osTokens = selectedOs.map(s => s.toLowerCase());
          const inferredPlatforms = [];
          if (osTokens.some(x => x.includes('android') || x.includes('ios'))) {
            inferredPlatforms.push('Mobile');
          }
          if (osTokens.some(x => x.includes('windows') || x.includes('mac') || x.includes('macos') || x.includes('linux'))) {
            inferredPlatforms.push('Desktop');
          }
          const inferredPlatformName = inferredPlatforms.join(', ');

          // Ajouter le nouvel outil à la liste locale pour l'affichage immédiat
          const newCard = {
            id: result.ID_Tools || result.id || `local-${Date.now()}`,
            image: payload.ImageTools,
            alt: `${name} icon`,
            name,
            description,
            category: selectedCategoryName,
            platform,
            Platform_Name: inferredPlatformName,
            rating: 4,
            link,
            userId: currentUser.id // Ajouter l'ID de l'utilisateur créateur
          };

          cardsData.unshift(newCard);

          // Re-render home cards
          const itemsHTML = cardsData
            .map((card) => {
              const temp = document.createElement("div");
              temp.innerHTML = homepageInner(card);
              const itemDiv = temp.querySelector(".item");
              return itemDiv ? itemDiv.outerHTML : "";
            })
            .join("");
          const items = document.querySelector(".items");
          if (items) items.innerHTML = itemsHTML;
          renderStars();
          
          // Reconfigurer les event listeners pour les boutons d'action
          setupToolActions();
          
          closeModal();
          form.reset();
        } else {
          let message = 'Unknown error';
          try {
            const maybeJson = await response.json();
            message = maybeJson.message || JSON.stringify(maybeJson);
          } catch (_) {
            try {
              message = await response.text();
            } catch (__) {}
          }
          showErrorMessage(`Error adding tool (HTTP ${response.status}): ${message}`);
        }
      } catch (error) {
        console.error('Error sending tool data:', error);
        showErrorMessage(`Network error: Unable to add tool. Please check your connection.`);
      }
    });
  }

  // Ensure DOM is ready (template has been injected already in index.js)
  setTimeout(attach, 0);
}

// Fonctions pour afficher des messages de notification dans la page
function showSuccessMessage(message) {
  showNotification(message, 'success');
}

function showErrorMessage(message) {
  showNotification(message, 'error');
}

function showNotification(message, type) {
  // Créer l'élément de notification
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
    </div>
  `;

  // Styles are now handled by CSS classes

  // Ajouter la notification au body
  document.body.appendChild(notification);

  // Auto-suppression après 5 secondes
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Fonction pour configurer les event listeners des boutons d'action sur la page index
function setupIndexToolActions() {
  // Event listeners pour les boutons de modification
  document.querySelectorAll('.edit-tool').forEach(button => {
    button.addEventListener('click', (e) => {
      const toolId = e.target.getAttribute('data-tool-id');
      editIndexTool(toolId);
    });
  });

  // Event listeners pour les boutons de suppression
  document.querySelectorAll('.delete-tool').forEach(button => {
    button.addEventListener('click', (e) => {
      const toolId = e.target.getAttribute('data-tool-id');
      deleteIndexTool(toolId);
    });
  });
}

// Variables globales pour les modales
let currentEditToolId = null;
let currentDeleteToolId = null;

// Fonction pour modifier un outil depuis la page index
async function editIndexTool(toolId) {
  const currentUser = authManager.getCurrentUser();
  if (!currentUser) {
    showErrorMessage('Vous devez être connecté pour modifier un outil.');
    return;
  }

  // Trouver l'outil dans les données
  const { cardsData } = await import('../../Data/carditem.js');
  const tool = cardsData.find(card => card.id == toolId);
  if (!tool) {
    showErrorMessage('Outil non trouvé.');
    return;
  }

  // Remplir le formulaire avec les données actuelles
  document.getElementById('edit-tool-name').value = tool.name;
  document.getElementById('edit-tool-description').value = tool.description;
  document.getElementById('edit-tool-link').value = tool.link;
  document.getElementById('edit-tool-image').value = tool.image || '';
  
  currentEditToolId = toolId;
  
  // Afficher la modale
  const modal = document.getElementById('edit-tool-modal');
  document.body.classList.add('modal-open');
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('show'), 10);
}

// Fonction pour fermer la modale d'édition
function closeEditModal() {
  const modal = document.getElementById('edit-tool-modal');
  modal.classList.remove('show');
  document.body.classList.remove('modal-open');
  setTimeout(() => {
    modal.style.display = 'none';
    currentEditToolId = null;
  }, 300);
}
window.closeEditModal = closeEditModal;

// Fonction pour soumettre la modification
async function submitEditTool() {
  if (!currentEditToolId) return;
  
  const currentUser = authManager.getCurrentUser();
  const newName = document.getElementById('edit-tool-name').value.trim();
  const newDescription = document.getElementById('edit-tool-description').value.trim();
  const newLink = document.getElementById('edit-tool-link').value.trim();
  const newImage = document.getElementById('edit-tool-image').value.trim();
  
  if (!newName || !newDescription || !newLink) {
    showErrorMessage('Please fill in all required fields.');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3001/api/tools/${currentEditToolId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Name_Tools: newName,
        Description_Tools: newDescription,
        Link_Tools: newLink,
        ImageTools: newImage || 'Assets/Card Product Icons/figma icon.png',
        ID_User: currentUser.id
      })
    });

    if (response.ok) {
      showSuccessMessage(`Tool "${newName}" updated successfully!`);
      closeEditModal();
      // Recharger la page après un délai
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      const error = await response.json();
      showErrorMessage(`Error: ${error.message || 'Unable to update tool'}`);
    }
  } catch (error) {
    console.error('Erreur lors de la modification:', error);
    showErrorMessage('Network error during tool update.');
  }
}

// Fonction pour supprimer un outil depuis la page index
async function deleteIndexTool(toolId) {
  const currentUser = authManager.getCurrentUser();
  if (!currentUser) {
    showErrorMessage('You must be logged in to delete a tool.');
    return;
  }

  // Trouver l'outil dans les données
  const { cardsData } = await import('../../Data/carditem.js');
  const tool = cardsData.find(card => card.id == toolId);
  if (!tool) {
    showErrorMessage('Tool not found.');
    return;
  }

  // Afficher la modale de confirmation
  document.getElementById('delete-tool-name').textContent = tool.name;
  currentDeleteToolId = toolId;
  
  const modal = document.getElementById('delete-tool-modal');
  document.body.classList.add('modal-open');
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('show'), 10);
}

// Fonction pour fermer la modale de suppression
function closeDeleteModal() {
  const modal = document.getElementById('delete-tool-modal');
  modal.classList.remove('show');
  document.body.classList.remove('modal-open');
  setTimeout(() => {
    modal.style.display = 'none';
    currentDeleteToolId = null;
  }, 300);
}
window.closeDeleteModal = closeDeleteModal;

// Fonction pour confirmer la suppression
async function confirmDelete() {
  if (!currentDeleteToolId) return;
  
  const currentUser = authManager.getCurrentUser();
  
  try {
    const response = await fetch(`http://localhost:3001/api/tools/${currentDeleteToolId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ID_User: currentUser.id
      })
    });

    if (response.ok) {
      const toolName = document.getElementById('delete-tool-name').textContent;
      showSuccessMessage(`Tool "${toolName}" deleted successfully!`);
      closeDeleteModal();
      // Recharger la page après un délai
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      const errorText = await response.text();
      console.error('Delete error response:', errorText);
      try {
        const error = JSON.parse(errorText);
        showErrorMessage(`Error: ${error.message || error.error || 'Unable to delete tool'}`);
      } catch {
        showErrorMessage(`Server error (${response.status}): Unable to delete tool`);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    showErrorMessage('Network error during tool deletion.');
  }
}
window.confirmDelete = confirmDelete;
window.editTool = editIndexTool;
window.deleteTool = deleteIndexTool;

// Fonction pour configurer les event listeners des boutons d'action
function setupToolActions() {
  // Event listeners pour les boutons de modification
  document.querySelectorAll('.edit-tool').forEach(button => {
    button.addEventListener('click', (e) => {
      const toolId = e.target.getAttribute('data-tool-id');
      editIndexTool(toolId);
    });
  });

  // Event listeners pour les boutons de suppression
  document.querySelectorAll('.delete-tool').forEach(button => {
    button.addEventListener('click', (e) => {
      const toolId = e.target.getAttribute('data-tool-id');
      deleteIndexTool(toolId);
    });
  });
}