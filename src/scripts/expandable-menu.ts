function initExpandable(root: HTMLElement) {
  const toggle = root.querySelector<HTMLButtonElement>('[data-expandable-toggle]');
  const panel = root.querySelector<HTMLElement>('[data-expandable-panel]');
  if (!toggle || !panel) return;

  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
  };

  const open = () => {
    toggle.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
  };

  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (expanded) close();
    else open();
  });

  document.addEventListener('click', (event) => {
    if (!root.contains(event.target as Node)) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}

function initMobileMenu(root: HTMLElement) {
  const toggle = root.querySelector<HTMLButtonElement>('[data-mobile-menu-toggle]');
  const panel = root.querySelector<HTMLElement>('[data-mobile-menu-panel]');
  if (!toggle || !panel) return;

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setOpen(open);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
}

function boot() {
  document.querySelectorAll<HTMLElement>('[data-expandable]').forEach(initExpandable);
  document.querySelectorAll<HTMLElement>('[data-mobile-menu]').forEach(initMobileMenu);
}

boot();
document.addEventListener('astro:page-load', boot);
