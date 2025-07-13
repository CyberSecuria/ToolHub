export function homepageInner(card) {
  if (!card) throw new Error("Aucun objet card fourni à homepageInner(card)");
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
    </main>
    <footer class="site-footer">
        <div class="footer-content">
            <p>&copy; 2025 ToolHub. All rights reserved.</p>
        </div>
    </footer>`;
  template = template
    .replace(/{{cardimage}}/g, card.image)
    .replace(/{{cardname}}/g, card.name)
    .replace(/{{carddescription}}/g, card.description)
    .replace(/{{cardcategory}}/g, card.category)
    .replace(/{{cardplatform}}/g, Array.isArray(card.platform) ? card.platform.map(p => `<img src='${p.icon}' alt='${p.name}' class='platformicon'/>`).join(' ') : card.platform)
    .replace(/{{cardrating}}/g, card.rating > 0 ? card.rating : 1)
    .replace(/{{cardlink}}/g, card.link);

  // Ajout du JS pour gérer le modal des reviews
  setTimeout(() => {
    // Pour toutes les étoiles, on ajoute le hover et le click
    document.querySelectorAll('.stars').forEach(star => {
      star.setAttribute('title', 'See reviews');
      star.style.cursor = 'pointer';
      star.addEventListener('click', function(e) {
        const modal = document.getElementById('reviews-modal');
        if(modal) modal.style.display = 'flex';
      });
    });
    // Fermer le modal
    const closeBtn = document.querySelector('.close-modal');
    if(closeBtn) closeBtn.onclick = function() {
      document.getElementById('reviews-modal').style.display = 'none';
    };
    // Fermer en cliquant en dehors du contenu
    const modal = document.getElementById('reviews-modal');
    if(modal) {
      modal.addEventListener('click', function(e) {
        if(e.target === modal) modal.style.display = 'none';
      });
    }
  }, 0);

  return template;
}





