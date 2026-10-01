async function loadNavigation() {
  const container = document.querySelector('[data-shared-nav]');
  if (!container) return;
  try {
    const response = await fetch('nav.html');
    if (!response.ok) throw new Error('Navigation unavailable');
    container.innerHTML = await response.text();
    const menuButton = container.querySelector('.menu-button');
    const nav = container.querySelector('.primary-nav');
    const guides = container.querySelector('.guides-dropdown');
    if (location.pathname.endsWith('view-guide.html')) {
      guides.querySelector('summary').setAttribute('aria-current', 'page');
      const name = new URLSearchParams(location.search).get('guide');
      guides.querySelectorAll('a').forEach((link) => {
        if (new URL(link.href).searchParams.get('guide') === name) {
          link.setAttribute('aria-current', 'page');
        }
      });
    } else {
      container.querySelectorAll('a[href^="index.html#"]').forEach((link) => {
        link.setAttribute('href', new URL(link.href).hash);
      });
    }
    const closeMenu = () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      guides.open = false;
    };
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      if (!isOpen) guides.open = false;
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('click', (event) => {
      if (!guides.contains(event.target)) guides.open = false;
    });
    container.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (guides.open) {
        guides.open = false;
        guides.querySelector('summary').focus();
      } else if (nav.classList.contains('open')) {
        closeMenu();
        menuButton.focus();
      }
    });
  } catch (error) {
    const fallback = document.createElement('p');
    fallback.className = 'shell';
    const home = document.createElement('a');
    home.href = 'index.html';
    home.textContent = 'LFKShibari home';
    fallback.append(home, ' — Navigation could not load. Please refresh to try again.');
    container.replaceChildren(fallback);
  }
}
loadNavigation();
