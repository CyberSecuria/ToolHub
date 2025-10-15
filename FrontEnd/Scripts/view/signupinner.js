// Import of the signup controller
import { setupSignupForm } from '../controller/signupController.js';

// Inner function to generate the signup page
export function signupInner() {
  const templatesignup = `<header>
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

    <form class="signup-container" id="signupForm">
        <h2>Create an Account</h2>
        <div id="errorMessage" class="error-message hidden"></div>
        <div id="successMessage" class="success-message hidden"></div>
        <label for="username"><span>Username:</span></label>
        <input type="text" id="username" name="username" placeholder="your username" required autocomplete="username">
        <label for="email"><span>E-mail:</span></label>
        <input type="email" id="email" name="email" placeholder="your e-mail" required>
        <label for="password"><span>Password:</span></label>
        <input type="password" id="password" name="password" placeholder="your password" required autocomplete="new-password">
        <label for="confirm-password"><span class="fixconfirm">Confirm Password:</span></label>
        <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm your password" required autocomplete="new-password">
        <button type="submit">Signup</button>
        <div class="login-link">
            Already got an account? <a href="login.html">login</a>
        </div>
    </form>
    </section> 
    </main>
     <footer class="site-footer">
        <div class="footer-content">
            <a href="rgpd.html">Privacy Policy & GDPR</a>
            <p>&copy; 2025 ToolHub. All rights reserved.</p>
        </div> 
       
     </footer>
    `;
  document.body.innerHTML = templatesignup;
  
  // Add event listener for signup form
  setupSignupForm();
}