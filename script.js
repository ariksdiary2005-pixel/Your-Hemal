(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeLabel = document.querySelector('.theme-label');
  const themeIcon = document.querySelector('.theme-icon');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const progress = document.getElementById('scrollProgress');
  const toast = document.getElementById('toast');

  // Restore the selected theme when supported; this preference is stored locally in the browser.
  try {
    const savedTheme = localStorage.getItem('hemal-portfolio-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
  } catch (_) {}
  updateThemeControl();

  themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('hemal-portfolio-theme', root.dataset.theme); } catch (_) {}
    updateThemeControl();
  });
  function updateThemeControl() {
    const light = root.dataset.theme === 'light';
    themeLabel.textContent = light ? 'Dark mode' : 'Light mode';
    themeIcon.textContent = light ? '☾' : '☼';
    themeToggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', light ? '#f5f5f2' : '#14151a');
  }

  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open navigation');
  }));

  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const amount = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${amount}%`;
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('is-visible'));

  function showToast(message) {
    toast.textContent = message; toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 3600);
  }
  document.getElementById('year').textContent = new Date().getFullYear();
})();
