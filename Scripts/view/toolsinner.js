import { cardsData } from "../../Data/carditem.js";

export function toolsInner() {
  let templatetools = `<header>
    <nav>
            <div class="logo">
                <img src="Assets/logo ToolHub.png" alt="logo">
                <h1>ToolHub</h1>
        </div>
        <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="tools.html">Toolbox</a></li>
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

  // Générer toutes les cards dynamiquement
  const cardsList = document.getElementById("toolbox-cards-list");
  if (cardsList) {
    cardsList.innerHTML = cardsData.map(card => `
      <div class="item">
        <img src="${card.image}" alt="${card.name}">
        <h3>${card.name}</h3>
        <p><strong>Description :</strong> ${card.description}</p>
        <p><strong>Catégorie :</strong> ${card.category}</p>
        <p><strong>OS :</strong> ${Array.isArray(card.platform) ? card.platform.map(p => `<img src='${p.icon}' alt='${p.name}' class='platformicon'/>`).join(' ') : card.platform} <span class="platformicon"></span></p>
        <div class="item-bottom">
          <span class="stars" data-stars="${card.rating > 0 ? card.rating : 1}"></span>
            <button>Add to toolbox</button>
          </a>
        </div>
      </div>
    `).join("");
  }
}