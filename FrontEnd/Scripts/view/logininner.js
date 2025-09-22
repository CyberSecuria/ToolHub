// inner function to generate the login page
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
        <h2>Connexion</h2>
        <div id="errorMessage" class="error-message" style="display: none;"></div>
        <div id="successMessage" class="success-message" style="display: none;"></div>
        <label for="username"><span>Username or Email:</span></label>
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
            <p>&copy; 2025 ToolHub. All rights reserved.</p>
        </div>
    
    </footer>`;
  document.body.innerHTML = templatelogin;
  
  // Add event listener for login form
  setupLoginForm();
}

function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      
      if (!username || !password) {
        showError('Please fill in all fields');
        return;
      }
      
      try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password })
        });
        
        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          showError('Server response error. Please try again.');
          return;
        }
        
        if (response.ok && data.success) {
          // Store tokens in localStorage
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          showSuccess('Login successful! Redirecting...');
          
          // Redirect to home page after 1 second
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1000);
        } else {
          showError(data.error || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        showError('Network error. Please try again.');
      }
    });
  }
  
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
  }
  
  function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
  }
}