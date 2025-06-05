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
      alert('Login cliqué !');
      // Ici, tu peux ouvrir un modal ou rediriger
    });
  }
  if (signupBtn) {
    signupBtn.addEventListener('click', function() {
      alert('Signup cliqué !');
      // Ici, tu peux ouvrir un modal ou rediriger
    });
  }

  // Liens de navigation
  document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Navigation vers ' + link.textContent);
      // Ici, tu peux gérer la navigation SPA ou autre
    });
  });
}