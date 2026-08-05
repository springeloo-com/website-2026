import { viewportBandFromWidth, type ViewportBandId } from '../lib/breakpoints';

const ATTR = 'data-viewport';

function applyBand(band: ViewportBandId) {
  document.documentElement.setAttribute(ATTR, band);
}

function syncFromWidth() {
  applyBand(viewportBandFromWidth(window.innerWidth));
}

/**
 * Keeps `<html data-viewport="…">` aligned with the four Figma bands so
 * layout CSS / QA / tooling can read the active frame without guessing.
 */
export function initViewportBand() {
  syncFromWidth();

  const queries = [
    window.matchMedia('(min-width: 1280px)'),
    window.matchMedia('(min-width: 1024px)'),
    window.matchMedia('(min-width: 768px)'),
  ];

  const onChange = () => syncFromWidth();
  for (const mq of queries) {
    mq.addEventListener('change', onChange);
  }

  window.addEventListener('resize', onChange, { passive: true });
}

initViewportBand();
