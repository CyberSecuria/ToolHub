// Ajoute un gestionnaire d'événement sur tous les bookmarks pour afficher un popup
export function setupBookmarkPopup() {
  document.addEventListener('click', function(e) {
    const target = e.target;
    if (target.classList.contains('bookmark-icon')) {
      showBookmarkPopup(target);
    }
  });
}

function showBookmarkPopup(target) {
  // Crée le popup
  const popup = document.createElement('div');
  popup.textContent = 'Added to your bookmark';
  popup.style.position = 'fixed';
  popup.style.bottom = '32px';
  popup.style.right = '32px';
  popup.style.background = 'rgba(124,58,237,0.18)';
  popup.style.backdropFilter = 'blur(12px)';
  popup.style.webkitBackdropFilter = 'blur(12px)';
  popup.style.border = '1.5px solid rgba(255,255,255,0.32)';
  popup.style.color = '#fff';
  popup.style.padding = '16px 28px';
  popup.style.borderRadius = '18px';
  popup.style.fontSize = '1.1em';
  popup.style.fontWeight = '600';
  popup.style.boxShadow = '0 8px 32px 0 rgba(31,38,135,0.18), 0 2px 12px 0 rgba(124,58,237,0.18)';
  popup.style.textShadow = '0 2px 8px rgba(31,38,135,0.25), 0 1px 2px rgba(0,0,0,0.18)';
  popup.style.zIndex = '9999';
  popup.style.opacity = '0';
  popup.style.transition = 'opacity 0.3s';
  document.body.appendChild(popup);
  setTimeout(() => { popup.style.opacity = '1'; }, 10);
  setTimeout(() => {
    popup.style.opacity = '0';
    setTimeout(() => popup.remove(), 300);
  }, 3000);
}
