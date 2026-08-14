/**
 * Figma menue-01 Version-menue:
 * Interaktionsfläche (top 2/3 of Header-clip) + menu chrome
 * MOUSE_ENTER → Hintergrund, MOUSE_LEAVE → Transparent (0.5s delay).
 */
const SOLID_CLASS = 'site-header--hintergrund';
const LEAVE_DELAY_MS = 500;

function initHeaderMenueVersion() {
  const header = document.querySelector<HTMLElement>('[data-menue-version]');
  if (!header || header.dataset.menueVersionInit === '1') return;
  header.dataset.menueVersionInit = '1';

  if (header.dataset.menueVersionMode === 'static') return;

  const hit = document.querySelector<HTMLElement>('[data-interaktionsflaeche]');
  const zones = [header, hit].filter((el): el is HTMLElement => Boolean(el));

  let leaveTimer: number | undefined;

  const toHintergrund = () => {
    window.clearTimeout(leaveTimer);
    header.classList.add(SOLID_CLASS);
  };

  const toTransparent = () => {
    window.clearTimeout(leaveTimer);
    leaveTimer = window.setTimeout(() => {
      header.classList.remove(SOLID_CLASS);
    }, LEAVE_DELAY_MS);
  };

  for (const zone of zones) {
    zone.addEventListener('mouseenter', toHintergrund);
    zone.addEventListener('mouseleave', toTransparent);
  }

  header.addEventListener('focusin', toHintergrund);
  header.addEventListener('focusout', (event) => {
    const next = event.relatedTarget;
    if (next instanceof Node && header.contains(next)) return;
    toTransparent();
  });
}

initHeaderMenueVersion();
document.addEventListener('astro:page-load', initHeaderMenueVersion);
