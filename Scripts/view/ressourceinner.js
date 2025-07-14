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
            <ul class="ressource-list">
                <!-- Développement Web -->
                <li><a href="https://developer.mozilla.org/fr/" target="_blank"><strong>MDN Web Docs</strong> – Comprehensive documentation on HTML, CSS, JavaScript, and more.</a></li>
                <li><a href="https://www.w3schools.com/" target="_blank"><strong>W3Schools</strong> – Tutorials and web references.</a></li>
                <li><a href="https://css-tricks.com/" target="_blank"><strong>CSS-Tricks</strong> – Tips and articles on CSS and front-end development.</a></li>
                <li><a href="https://www.freecodecamp.org/" target="_blank"><strong>freeCodeCamp</strong> – Free courses to learn coding.</a></li>
                <li><a href="https://openclassrooms.com/fr/" target="_blank"><strong>OpenClassrooms</strong> – Online courses for web development and more.</a></li>
                <li><a href="https://github.com/" target="_blank"><strong>GitHub</strong> – Code hosting and collaboration.</a></li>
                <!-- Outils de Design & Assets -->
                <li><a href="https://www.figma.com/community" target="_blank"><strong>Figma Community</strong> – UI kits, icons, templates, and resources shared by the community.</a></li>
                <li><a href="https://www.figma.com/resources/learn-design/" target="_blank"><strong>Figma Learn Design</strong> – Tutorials and guides to get started with Figma.</a></li>
                <li><a href="https://www.flaticon.com/" target="_blank"><strong>Flaticon</strong> – Millions of free vector icons.</a></li>
                <li><a href="https://unsplash.com/" target="_blank"><strong>Unsplash</strong> – Royalty-free and free photos for your projects.</a></li>
                <li><a href="https://fonts.google.com/" target="_blank"><strong>Google Fonts</strong> – Free and open-source fonts for the web.</a></li>
                <!-- Tutoriels & Astuces Photoshop -->
                <li><a href="https://helpx.adobe.com/fr/photoshop/tutorials.html" target="_blank"><strong>Official Photoshop tutorials</strong> – Learn the basics and advanced techniques.</a></li>
                <li><a href="https://www.photoshopessentials.com/" target="_blank"><strong>Photoshop Essentials</strong> – Practical tutorials, effects, filters, and tips.</a></li>
                <li><a href="https://www.creativebloq.com/how-to/photoshop" target="_blank"><strong>Creative Bloq – Photoshop Tips</strong> – Tips, guides, and inspiration for Photoshop.</a></li>
                <!-- Tutoriels & Astuces Visual Studio Code -->
                <li><a href="https://code.visualstudio.com/docs" target="_blank"><strong>VS Code Docs</strong> – Official documentation and user guides.</a></li>
                <li><a href="https://www.freecodecamp.org/news/the-visual-studio-code-handbook/" target="_blank"><strong>VS Code Handbook</strong> – Tips, extensions, and productivity in VS Code.</a></li>
                <!-- Tutoriels & Astuces Slack -->
                <li><a href="https://slack.com/help/categories/200111606" target="_blank"><strong>Slack Help Center</strong> – Tutorials, integrations, and best practices.</a></li>
                <li><a href="https://zapier.com/blog/slack-tips/" target="_blank"><strong>Zapier – Slack Tips</strong> – Tips to automate and save time on Slack.</a></li>
                <!-- Tutoriels & Astuces Google Analytics -->
                <li><a href="https://analytics.google.com/analytics/academy/" target="_blank"><strong>Google Analytics Academy</strong> – Free training on Google Analytics.</a></li>
                <li><a href="https://www.lovesdata.com/blog/google-analytics-tips" target="_blank"><strong>Loves Data – Google Analytics Tips</strong> – Tips and tricks for effectively analyzing your data.</a></li>
                <!-- Tutoriels & Astuces Google Meet -->
                <li><a href="https://support.google.com/meet/answer/9302870?hl=fr" target="_blank"><strong>Google Meet Help</strong> – User guide and best practices for online meetings.</a></li>
                <li><a href="https://zapier.com/blog/google-meet-tips/" target="_blank"><strong>Zapier – Google Meet Tips</strong> – Tips for effective video conferences.</a></li>
            </ul>
        </section>
    </main>
     <footer class="site-footer">
        <div class="footer-content">
            <p>&copy; 2025 ToolHub. All rights reserved.</p>
        </div>
    </footer>`;
  document.body.innerHTML = templateressource;
}