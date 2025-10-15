// Index Controller - Handles all homepage-related logic and utilities
import { authManager } from '../utils/auth.js';
import { cardsData } from '../../Data/carditem.js';
import { renderStars } from '../Tools/stars.js';
import { homepageInner } from '../view/indexinner.js';

// MODAL MANAGEMENT - ADD TOOL

export function setupHomeModal() {
  let escHandler = null;

  async function openModal() {
    // Check if user is authenticated
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

  // Attach event listeners
  function attach() {
    const openBtn = document.getElementById("btn-add-tool-index");
    const modal = document.getElementById("add-tool-modal-index");
    const form = document.getElementById("add-tool-form-index");
    if (!openBtn || !modal || !form) return;

    openBtn.addEventListener("click", openModal);
    modal.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await handleAddTool(form, closeModal);
    });
  }

  // Ensure DOM is ready
  setTimeout(attach, 0);
}

// ADD TOOL HANDLER

async function handleAddTool(form, closeModal) {
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

  // Convert to comma-separated string for backend
  const osString = platform.map(p => p.name).join(', ');

  // Get current user ID from authManager
  const currentUser = authManager.getCurrentUser();
  if (!currentUser || !currentUser.id) {
    showErrorMessage('Unable to get user information. Please login again.');
    return;
  }

  // Prepare payload for backend
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
      
      showSuccessMessage(`Tool "${name}" has been successfully added!`);
      
      // Infer platform name for display based on selected OS
      const osTokens = selectedOs.map(s => s.toLowerCase());
      const inferredPlatforms = [];
      if (osTokens.some(x => x.includes('android') || x.includes('ios'))) {
        inferredPlatforms.push('Mobile');
      }
      if (osTokens.some(x => x.includes('windows') || x.includes('mac') || x.includes('macos') || x.includes('linux'))) {
        inferredPlatforms.push('Desktop');
      }
      const inferredPlatformName = inferredPlatforms.join(', ');

      // Add the new tool to the local cardsData for immediate display
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
        userId: currentUser.id
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
      
      // Re-setup action buttons
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
}

// REVIEWS MODAL SETUP

export function setupReviewsModal() {
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
    
    // Close the modal
    const closeBtn = document.querySelector('.close-modal');
    if(closeBtn) closeBtn.onclick = function() {
      document.getElementById('reviews-modal').style.display = 'none';
    };
    
    // Close by clicking outside the content
    const modal = document.getElementById('reviews-modal');
    if(modal) {
      modal.addEventListener('click', function(e) {
        if(e.target === modal) modal.style.display = 'none';
      });
    }
  }, 0);
}

// TOOL ACTIONS - EDIT & DELETE

// Variables to track current tool being edited or deleted
let currentEditToolId = null;
let currentDeleteToolId = null;

export function setupIndexToolActions() {
  // Event listeners for edit buttons
  document.querySelectorAll('.edit-tool').forEach(button => {
    button.addEventListener('click', (e) => {
      const toolId = e.currentTarget.getAttribute('data-tool-id');
      editIndexTool(toolId);
    });
  });

  // Event listeners for delete buttons
  document.querySelectorAll('.delete-tool').forEach(button => {
    button.addEventListener('click', (e) => {
      const toolId = e.currentTarget.getAttribute('data-tool-id');
      deleteIndexTool(toolId);
    });
  });
}

// Function to open the edit modal and populate with tool data
async function editIndexTool(toolId) {
  const currentUser = authManager.getCurrentUser();
  if (!currentUser) {
    showErrorMessage('Vous devez être connecté pour modifier un outil.');
    return;
  }

  // Find the tool in the data
  const tool = cardsData.find(card => card.id == toolId);
  if (!tool) {
    showErrorMessage('Outil non trouvé.');
    return;
  }

  // Fill the form with tool data
  document.getElementById('edit-tool-name').value = tool.name;
  document.getElementById('edit-tool-description').value = tool.description;
  document.getElementById('edit-tool-link').value = tool.link;
  document.getElementById('edit-tool-image').value = tool.image || '';
  
  currentEditToolId = toolId;
  
  // Show the modal
  const modal = document.getElementById('edit-tool-modal');
  document.body.classList.add('modal-open');
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('show'), 10);
}

// Function to close the edit modal
function closeEditModal() {
  const modal = document.getElementById('edit-tool-modal');
  modal.classList.remove('show');
  document.body.classList.remove('modal-open');
  setTimeout(() => {
    modal.style.display = 'none';
    currentEditToolId = null;
  }, 300);
}

// Function to submit the edit form
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
      // Reload the page after a short delay
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

// Delete tool function
async function deleteIndexTool(toolId) {
  const currentUser = authManager.getCurrentUser();
  if (!currentUser) {
    showErrorMessage('You must be logged in to delete a tool.');
    return;
  }

  // Find the tool in the data
  const tool = cardsData.find(card => card.id == toolId);
  if (!tool) {
    showErrorMessage('Tool not found.');
    return;
  }

  // Show modal confirmation
  document.getElementById('delete-tool-name').textContent = tool.name;
  currentDeleteToolId = toolId;
  
  const modal = document.getElementById('delete-tool-modal');
  document.body.classList.add('modal-open');
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('show'), 10);
}

// Function to close the delete modal
function closeDeleteModal() {
  const modal = document.getElementById('delete-tool-modal');
  modal.classList.remove('show');
  document.body.classList.remove('modal-open');
  setTimeout(() => {
    modal.style.display = 'none';
    currentDeleteToolId = null;
  }, 300);
}

// Function to confirm deletion
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
      // Reload the page after a short delay
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

// Re-setup action buttons after rendering
function setupToolActions() {
  // Event listeners for edit buttons
  document.querySelectorAll('.edit-tool').forEach(button => {
    button.addEventListener('click', (e) => {
      const toolId = e.target.getAttribute('data-tool-id');
      editIndexTool(toolId);
    });
  });

  // Event listeners for delete buttons
  document.querySelectorAll('.delete-tool').forEach(button => {
    button.addEventListener('click', (e) => {
      const toolId = e.target.getAttribute('data-tool-id');
      deleteIndexTool(toolId);
    });
  });
}

// EDIT FORM SETUP

export function setupEditForm() {
  const editForm = document.getElementById('edit-tool-form');
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitEditTool();
    });
  }
  
  // Close modals when clicking outside the content
  document.querySelectorAll('.action-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (modal.id === 'edit-tool-modal') closeEditModal();
        if (modal.id === 'delete-tool-modal') closeDeleteModal();
      }
    });
  });
}

// NOTIFICATION UTILITIES

function showSuccessMessage(message) {
  showNotification(message, 'success');
}

function showErrorMessage(message) {
  showNotification(message, 'error');
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// GLOBAL EXPORTS FOR WINDOW

// Export functions to window for inline onclick handlers
window.closeEditModal = closeEditModal;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;
window.editTool = editIndexTool;
window.deleteTool = deleteIndexTool;
