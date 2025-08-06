// Burger menu logic externalized for reuse
export function setupBurgerMenu() {
  // Create the burger button if it is absent
  if (!document.querySelector('.burger')) {
    const burger = document.createElement('div');
    burger.className = 'burger';
    burger.innerHTML = '<span></span><span></span><span></span>';
    document.querySelector('nav').appendChild(burger);
  }
  const burger = document.querySelector('.burger');
  const navUl = document.querySelector('nav ul');
  burger.addEventListener('click', () => {
    navUl.classList.toggle('active');
    burger.classList.toggle('open');
  });
  // Close the menu if a link is clicked
  navUl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navUl.classList.remove('active');
      burger.classList.remove('open');
    });
  });
}
