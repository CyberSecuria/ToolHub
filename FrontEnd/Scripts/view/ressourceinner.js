// inner function to generate the resources page
export function ressourceInner() {
  const templateressource = `<header>
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
    <main class="content">
        <section class="ressources">
            <h1>Useful Ressources</h1>
            <ul class="ressource-list" id="resource-list"></ul>
        </section>
    </main>
     <footer class="site-footer">
        <div class="footer-content">
            <p>&copy; 2025 ToolHub. All rights reserved.</p>
        </div>
    </footer>`;
  document.body.innerHTML = templateressource;
}