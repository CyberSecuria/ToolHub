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
            <li><a href="#">Tools</a></li>
            <li><a href="#">Resources</a></li>
        </ul>
        <div class="login">
            <button>Login</button>
            <button>Signup</button>
        </div>
    </nav>
    </header>
    <main>
        <div class="hero">
            <h2 class="titlehero">Découvrez ToolHub - Vos Outils Centralisés</h2>
            <p class="texthero">Trouvez, organisez et utilisez les meilleurs outils pour booster votre productivité.</p>
        </div>
        <div class="content">
            <div class="items">
                <div class="item">
                    <img src="{{cardimage}}" alt="card">
                    <h3>{{cardname}}</h3>
                    <p><strong>Description :</strong> {{carddescription}}</p>
                    <p><strong>Catégorie :</strong> {{cardcategory}}</p>
                    <p><strong>Platforms :</strong> {{cardplatform}} <span class="platformicon"></span></p>
                    <div class="item-bottom">
                        <span class="stars" data-stars="{{cardrating}}"></span>
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
                            <li><label><input type="checkbox"> <span class="stars" data-stars="5"></span> (15)</label></li>
                            <li><label><input type="checkbox"> <span class="stars" data-stars="4"></span> (10)</label></li>
                            <li><label><input type="checkbox"> <span class="stars" data-stars="3"></span> (22)</label></li>
                            <li><label><input type="checkbox"> <span class="stars" data-stars="2"></span> (8)</label></li>
                            <li><label><input type="checkbox"> <span class="stars" data-stars="1"></span> (8)</label></li>
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
    </main>
    <footer class="site-footer">
        <div class="footer-content" style="text-align:center; padding: 24px 0; background: #ede9fe; color: #334155; font-size: 1em;">
            <p>&copy; 2025 ToolHub. Tous droits réservés.</p>
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
  return template;
}





