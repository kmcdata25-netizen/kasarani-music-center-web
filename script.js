(() => {
  const header = document.getElementById('site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.querySelector('.site-nav');

  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (!menuToggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('is-open');
    header.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    header.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  // Dynamically sync latest version information from GitHub releases
  fetch('https://raw.githubusercontent.com/kmcdata25-netizen/kasarani-app-releases/main/version.json')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (!data) return;
      if (data.apk_url) {
        document.querySelectorAll('a[data-apk-download]').forEach((el) => {
          el.href = data.apk_url;
        });
      }
      if (data.latest_version) {
        const badge = document.querySelector('.app-badge');
        if (badge) {
          badge.textContent = `Official Release v${data.latest_version}`;
        }
      }
    })
    .catch(() => {
      // Graceful fallback to static URLs already embedded in HTML
    });
})();

