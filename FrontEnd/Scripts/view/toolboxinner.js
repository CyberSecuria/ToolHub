console.log("toolboxinner.js loaded");
import { cardsData } from "../../Data/carditem.js";
import { authManager } from "../utils/auth.js";

// inner function to generate the toolbox page
export function toolsInner() {
  let templatetools = `<header>
    <nav>
            <div class="logo">
                <img src="Assets/logo ToolHub.png" alt="logo">
                <h1>ToolHub</h1>
        </div>
        <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="toolbox.html">Toolbox</a></li>
            <li><a href="ressource.html">Ressources</a></li>
        </ul>
        <div class="login">
            <button href="login.html">Login</button>
            <button href="signup.html">Sign Up</button>
        </div>
    </nav> 
</header>
    <main class="toolbox-main">
        <div class="toolbox-left">
            <div class="toolbox-container">
                <h1><img src="Assets/toolboox icon.png" alt="toolbox icon" class="toolbox-icon">Build your custom Toolbox</h1>
                <p>Select the tools you use or discover, and build your own toolbox!</p>
                <h2 class="toolbox-selection-title"><button>My selection</button></h2>
                <ul class="toolbox-list" id="my-toolbox-list"></ul>
                <div class="toolbox-empty" id="toolbox-empty-msg">No tools selected yet.</div>
            </div>
            <div class="toolbox-search">
                <input type="text" placeholder="Search">
                <button>Search</button>
            </div>
            <div class="content">
                <div class="items" id="toolbox-cards-list">
                    <!-- Les cards seront injectées ici -->
                </div>
            </div>
        </div>
        <aside class="community-toolboxes">
            <h2 class="community-title">Community Toolbox</h2>
            <ul class="community-list">
                <li class="community-item">
                    <strong>Frontend Developer</strong>
                    <ul class="community-sublist">
                        <li>Visual Studio Code</li>
                        <li>Figma</li>
                        <li>Slack</li>
                        <li>Photoshop</li>
                    </ul>
                </li>
                <li class="community-item">
                    <strong>Data Analyst</strong>
                    <ul class="community-sublist">
                        <li>Google Analytics</li>
                        <li>Excel</li>
                        <li>Slack</li>
                    </ul>
                </li>
                <li class="community-item">
                    <strong>Product Designer</strong>
                    <ul class="community-sublist">
                        <li>Figma</li>
                        <li>Photoshop</li>
                        <li>Slack</li>
                    </ul>
                </li>
                <li class="community-item">
                    <strong>Remote Team</strong>
                    <ul class="community-sublist">
                        <li>Slack</li>
                        <li>Google Meet</li>
                        <li>VS Code</li>
                    </ul>
                </li>
            </ul>
        </aside>
    </main>

    
   <footer class="site-footer">
        <div class="footer-content">
            <p>&copy; 2025 ToolHub. All rights reserved.</p>
        </div>
     </footer>
    `;

  document.body.innerHTML = templatetools;

  // Generate all the cards dynamically
  const cardsList = document.getElementById("toolbox-cards-list");
  if (cardsList) {
    cardsList.innerHTML = cardsData.map(card => {
      const currentUser = authManager.getCurrentUser();
      const isOwner = currentUser && currentUser.id === card.userId;
      
      let toolActionsHTML = '';
      if (isOwner) {
        toolActionsHTML = ``;
        console.log("toolActionsHTML is now: ", toolActionsHTML);
      }

      console.log("card.rating:", card.rating);
      return `
        <div class="item" data-tool-id="${card.id}">
          ${toolActionsHTML}
          <img src="${card.image}" alt="${card.name}">
          <h3>${card.name}</h3>
          <p><strong>Description :</strong> ${card.description}</p>
          <p><strong>Catégorie :</strong> ${card.category}</p>
          <p><strong>OS :</strong> ${Array.isArray(card.platform) ? card.platform.map(p => `<img src='${p.icon}' alt='${p.name}' class='platformicon'/>`).join(' ') : card.platform} <span class="platformicon"></span></p>
          <div class="item-bottom">
            <span class="stars" data-stars="${card.rating >= 0 ? Math.max(card.rating, 1) : 1}"></span>
            <button class="add-to-toolbox">Add to toolbox</button>
          </div>
        </div>
      `;
    }).join("");
    
    // Ajouter les event listeners pour les boutons avec un délai pour s'assurer que le DOM est mis à jour
    setTimeout(() => {
      setupToolActions();
    }, 100);
    
    // Setup du formulaire d'édition
    const editForm = document.getElementById('edit-tool-form');
    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.submitEditTool();
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
  }
}

// Exposer setupToolActions globalement
window.setupToolActions = setupToolActions;

// Fonction pour configurer les event listeners des boutons d'action
function setupToolActions() {
  const cardsList = document.getElementById("toolbox-cards-list");
  const editButtons = cardsList ? cardsList.querySelectorAll('.edit-tool') : document.querySelectorAll('.edit-tool');
  const deleteButtons = cardsList ? cardsList.querySelectorAll('.delete-tool') : document.querySelectorAll('.delete-tool');
  
  // Event listeners pour les boutons de modification
  // editButtons.forEach(button => {
  //   button.addEventListener('click', (e) => {
  //     const toolId = e.target.getAttribute('data-tool-id');
  //     console.log('Edit button clicked for tool:', toolId);
  //     editTool(toolId);
  //   });
  // });

  // // Event listeners pour les boutons de suppression
  // deleteButtons.forEach(button => {
  //   button.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     const toolId = e.target.getAttribute('data-tool-id');
  //     deleteTool(toolId);
  //   });
  // });
}

// Variables globales pour les modales
let currentEditToolId = null;
let currentDeleteToolId = null;

// Fonction pour modifier un outil
async function editTool(toolId) {
  const currentUser = authManager.getCurrentUser();
  if (!currentUser) {
    alert('You must be logged in to edit a tool.');
    return;
  }

  // Trouver l'outil dans les données
  const tool = cardsData.find(card => card.id == toolId);
  if (!tool) {
    alert('Tool not found.');
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

// Fonction pour supprimer un outil
async function deleteTool(toolId) {
  const currentUser = authManager.getCurrentUser();
  if (!currentUser) {
    alert('You must be logged in to delete a tool.');
    return;
  }

  // Trouver l'outil dans les données
  const tool = cardsData.find(card => card.id == toolId);
  if (!tool) {
    alert('Tool not found.');
    return;
  }

  // Afficher la modale de confirmation
  const deleteToolNameEl = document.getElementById('delete-tool-name');
  const modal = document.getElementById('delete-tool-modal');
  
  if (!deleteToolNameEl || !modal) {
    if (confirm(`Are you sure you want to delete ${tool.name}?`)) {
      // Fallback: direct deletion
      confirmDelete();
    }
    return;
  }
  
  deleteToolNameEl.textContent = tool.name;
  currentDeleteToolId = toolId;
  
  document.body.classList.add('modal-open');
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('show'), 10);
}

// Fonctions globales pour les modales
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

async function submitEditTool() {
  if (!currentEditToolId) return;
  
  const currentUser = authManager.getCurrentUser();
  const newName = document.getElementById('edit-tool-name').value.trim();
  const newDescription = document.getElementById('edit-tool-description').value.trim();
  const newLink = document.getElementById('edit-tool-link').value.trim();
  const newImage = document.getElementById('edit-tool-image').value.trim();
  
  if (!newName || !newDescription || !newLink) {
    alert('Please fill in all required fields.');
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
      alert(`Tool "${newName}" updated successfully!`);
      closeEditModal();
      await reloadToolsData();
    } else {
      const error = await response.json();
      alert(`Error: ${error.message || 'Unable to update tool'}`);
    }
  } catch (error) {
    console.error('Erreur lors de la modification:', error);
    alert('Network error during tool update.');
  }
}
window.submitEditTool = submitEditTool;

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
      alert(`Tool "${toolName}" deleted successfully!`);
      closeDeleteModal();
      await reloadToolsData();
    } else {
      const errorText = await response.text();
      console.error('Delete error response:', errorText);
      try {
        const error = JSON.parse(errorText);
        alert(`Error: ${error.message || error.error || 'Unable to delete tool'}`);
      } catch {
        alert(`Server error (${response.status}): Unable to delete tool`);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    alert('Network error during tool deletion.');
  }
}
window.confirmDelete = confirmDelete;

// Fonction pour recharger les données et ré-afficher la page
async function reloadToolsData() {
  // Recharger les données depuis l'API
  const { loadCardsData } = await import('../../Data/carditem.js');
  await loadCardsData();
  
  // Ré-générer l'affichage
  toolsInner();
  
  // Remettre à jour l'UI d'authentification
  if (window.authManager) {
    window.authManager.updateUI();
  }
  
  // Forcer le rendu des étoiles après un délai
  setTimeout(async () => {
    const { renderStars } = await import('../Tools/stars.js');
    renderStars();
  }, 200);
}