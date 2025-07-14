// Add the listeners to the buttons and links in the header after injecting the HTML
export function addHeaderEventListeners() {
  const logoDiv = document.querySelector('.logo');
  if (logoDiv) {
    logoDiv.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }

  // Login and Signup buttons
  const loginBtn = document.querySelector('.login button:first-child');
  const signupBtn = document.querySelector('.login button:last-child');

  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      window.location.href = 'login.html'
    });
  }
  if (signupBtn) {
    signupBtn.addEventListener('click', function() {
      window.location.href = 'signup.html'
    });
  }

 
}