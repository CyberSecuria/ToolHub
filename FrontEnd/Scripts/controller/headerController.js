// Add event listeners to header buttons and links after HTML injection
export function addHeaderEventListeners() {
  // Logo click handler - redirect to homepage
  const logoDiv = document.querySelector('.logo');
  if (logoDiv) {
    logoDiv.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }

  // Login and Signup button handlers
  const loginBtn = document.querySelector('.login button:first-child');
  const signupBtn = document.querySelector('.login button:last-child');

  // Login button - redirect to login page
  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      window.location.href = 'login.html'
    });
  }
  // Signup button - redirect to signup page
  if (signupBtn) {
    signupBtn.addEventListener('click', function() {
      window.location.href = 'signup.html'
    });
  }
}