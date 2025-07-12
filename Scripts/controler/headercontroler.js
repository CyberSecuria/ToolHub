// header.js

// Ajoute les listeners sur les boutons et liens du header après l'injection du HTML
export function addHeaderEventListeners() {
  // Logo et titre ToolHub
  const logoDiv = document.querySelector('.logo');
  if (logoDiv) {
    logoDiv.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }

  // Boutons Login et Signup
  const loginBtn = document.querySelector('.login button:first-child');
  const signupBtn = document.querySelector('.login button:last-child');

  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      window.location.href = 'login.html'
      // Ici, tu peux ouvrir un modal ou rediriger
    });
  }
  if (signupBtn) {
    signupBtn.addEventListener('click', function() {
      window.location.href = 'signup.html'
      // Ici, tu peux ouvrir un modal ou rediriger
    });
  }

 
}