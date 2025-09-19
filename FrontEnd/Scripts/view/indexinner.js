import { cardsData } from "../../Data/carditem.js";
import { renderStars } from "../Tools/stars.js";

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
                <div class="item">
                    <img src="Assets/bookmark icons/bookmark-empty.svg" class="bookmark-icon" title="Bookmark" alt="Bookmark">
                    <img src="{{cardimage}}" alt="card">
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
                          <ul class="space-y-1 text-sm">
                            <li><label><input type="checkbox">Design</label></li>
                            <li><label><input type="checkbox"> Developement</label></li>
                            <li><label><input type="checkbox"> Communication</label></li>
                            <li><label><input type="checkbox">Data Analysis</label></li>
                          </ul>
                        </div>
                        <div>
                          <h2>Plaform</h2>
                          <ul>
                            <li><label><input type="checkbox">Web</label></li>
                            <li><label><input type="checkbox">Desktop</label></li>
                            <li><label><input type="checkbox">Mobile</label></li>
                          </ul>
                        </div>
                        <div>
                          <h2>OS</h2>
                          <ul>
                            <li><label><input type="checkbox">Windows</label></li>
                            <li><label><input type="checkbox">MacOS</label></li>
                            <li><label><input type="checkbox">Linux</label></li>
                            <li><label><input type="checkbox">Android</label></li>
                            <li><label><input type="checkbox">iOS</label></li>
                        </div>
                      </div>
                </div>
            </aside>
        </div>
        <!-- Modal for reviews -->
        <div id="reviews-modal" class="modal" style="display:none;position:fixed;z-index:1000;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);justify-content:center;align-items:center;">
          <div class="modal-content" style="background:#fff;padding:2rem;border-radius:8px;max-width:400px;position:relative;">
            <span class="close-modal" style="position:absolute;top:10px;right:20px;font-size:2rem;cursor:pointer;">&times;</span>
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
              <input id="tool-category-index" name="category" type="text" required placeholder="e.g. Productivity">
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
              <label for="tool-os-index">OS (comma separated)</label>
              <input id="tool-os-index" name="os" type="text" placeholder="Windows, macOS, Linux, Android, IOS">
            </div>
            <div class="th-form-actions">
              <button type="button" class="th-btn-secondary" data-close-modal>Cancel</button>
              <button type="submit" class="th-btn-primary">Add tool</button>
            </div>
          </form>
        </div>
      </div>

    </main>
    <footer class="site-footer">
        <div class="footer-content">
            <p>&copy; 2025 ToolHub. All rights reserved.</p>
        </div>
    </footer>`;
  // Replacing the placeholders in the template with the card data
  template = template
    .replace(/{{cardimage}}/g, card.image)
    .replace(/{{cardname}}/g, card.name)
    .replace(/{{carddescription}}/g, card.description)
    .replace(/{{cardcategory}}/g, card.category)
    .replace(/{{cardplatform}}/g, Array.isArray(card.platform) ? card.platform.map(p => `<img src='${p.icon}' alt='${p.name}' class='platformicon'/>`).join(' ') : card.platform)
    .replace(/{{cardrating}}/g, card.rating > 0 ? card.rating : 1)
    .replace(/{{cardlink}}/g, card.link);

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
  }, 0);

  return template;
}

// Setup handlers for the Home Add Tool modal and submission
export function setupHomeModal() {
  let escHandler = null;

  function openModal() {
    const modal = document.getElementById("add-tool-modal-index");
    if (modal) modal.setAttribute("aria-hidden", "false");
    document.body.classList.add('modal-open');
    escHandler = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', escHandler);
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

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = String(formData.get('name') || '').trim();
      const description = String(formData.get('description') || '').trim();
      const category = String(formData.get('category') || '').trim();
      const image = String(formData.get('image') || '').trim();
      const link = String(formData.get('link') || '').trim();
      const os = String(formData.get('os') || '').trim();

      if (!name || !description || !category || !link) {
        alert('Please fill name, description, category and link.');
        return;
      }

      const platform = os
        .split(',')
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

      const newCard = {
        id: `local-${Date.now()}`,
        image: image || 'Assets/Card Product Icons/figma icon.png',
        alt: name,
        name,
        description,
        category,
        platform,
        rating: 4,
        link
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
      closeModal();
      form.reset();
    });
  }

  // Ensure DOM is ready (template has been injected already in index.js)
  setTimeout(attach, 0);
}