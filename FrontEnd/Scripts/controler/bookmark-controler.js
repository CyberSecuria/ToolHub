// Add an event handler to all bookmarks to display a popup
export function setupBookmarkPopup() {
  document.addEventListener('click', function(e) {
    const target = e.target;
    if (target.classList.contains('bookmark-icon')) {
      showBookmarkPopup(target);
    }
  });
}

function showBookmarkPopup(target) {
  // Create the popup
  const popup = document.createElement('div');
  popup.textContent = 'Added to your bookmark';
  popup.className = 'bookmark-popup';
  document.body.appendChild(popup);
  setTimeout(() => { popup.style.opacity = '1'; }, 10);
  setTimeout(() => {
    popup.style.opacity = '0';
    setTimeout(() => popup.remove(), 300);
  }, 3000);
}
