// inner function to generate the signup page
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
        <div id="errorMessage" class="error-message" style="display: none;"></div>
        <div id="successMessage" class="success-message" style="display: none;"></div>
        <label for="username"><span>Username:</span></label>
        <input type="text" id="username" name="username" placeholder="your username" required autocomplete="username">
        <label for="email"><span>E-mail:</span></label>
        <input type="email" id="email" name="email" placeholder="your e-mail" required>
        <label for="password"><span>Password:</span></label>
        <input type="password" id="password" name="password" placeholder="your password" required autocomplete="new-password">
        <label for="confirm-password"><span>Confirm Password:</span></label>
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
            <p>&copy; 2025 ToolHub. All rights reserved.</p>
        </div> 
       
     </footer>
    `;
  document.body.innerHTML = templatesignup;
  
  // Add event listener for signup form
  setupSignupForm();
}

function setupSignupForm() {
  const signupForm = document.getElementById('signupForm');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      if (!username || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
      }
      
      if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
      }
      
      if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
      }
      
      try {
        const response = await fetch('http://localhost:3001/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            username, 
            email, 
            password, 
            confirmPassword 
          })
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
          
          showSuccess('Account created successfully! Redirecting...');
          
          // Redirect to home page after 2 seconds
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 2000);
        } else {
          showError(data.error || 'Signup failed');
        }
      } catch (error) {
        console.error('Signup error:', error);
        showError('Network error. Please try again.');
      }
    });
  }
  
  function showError(message) {
    // Show fixed notification so it's visible even when scrolled
    showNotification(message, 'error');
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
  }
  
  function showSuccess(message) {
    // Show fixed notification so it's visible even when scrolled
    showNotification(message, 'success');
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
  }
}

// Local notification utility matching site style (fixed top-right)
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()" aria-label="Close">&times;</button>
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