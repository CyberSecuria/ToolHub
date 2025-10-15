// Import of the login controller
import { setupLoginForm } from '../controller/loginController.js';

// Inner function to generate the login page
export function loginInner() {
  const templatelogin = ` <header>
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
    <main> 
    <section>        
 <form class="login-container" id="loginForm">
        <h2>Login</h2>
        <div id="errorMessage" class="error-message hidden"></div>
        <div id="successMessage" class="success-message hidden"></div>
        <label for="username"><span class="fixuser">Username or Email:</span></label>
        <input type="text" id="username" name="username" placeholder="your username or email" required autocomplete="username">
        <label for="password"><span>Password:</span></label>
        <input type="password" id="password" name="password" placeholder="your password" required autocomplete="current-password">
        <button type="submit">Login</button>
        <div class="register-link">
            No account? <a href="signup.html">Create an account</a>
        </div>
        
    </form>
</section>
</main>
    <footer class="site-footer">
        <div class="footer-content">
            <a href="rgpd.html">Privacy Policy & GDPR</a>
            <p>&copy; 2025 ToolHub. All rights reserved.</p>
        </div>    
    </footer>`;
  document.body.innerHTML = templatelogin;
  
  // Add event listener for login form
  setupLoginForm();
}