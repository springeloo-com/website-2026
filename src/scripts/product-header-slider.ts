type Slide = {
  name: string;
  description: string[];
  href: string;
  image: string;
  alt: string;
};

function parseSlides(root: HTMLElement): Slide[] {
  try {
    const raw = root.dataset.slides;
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Slide[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function initProductHeaderSlider(root: HTMLElement) {
  const slides = parseSlides(root);
  if (slides.length === 0) return;

  const prevBtn = root.querySelector<HTMLButtonElement>('[data-phs-prev]');
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-phs-next]');
  const nameEl = root.querySelector<HTMLElement>('[data-phs-name]');
  const descEl = root.querySelector<HTMLElement>('[data-phs-desc]');
  const infoLink = root.querySelector<HTMLAnchorElement>('[data-phs-info]');
  const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-phs-tile]'));

  let index = 0;
  const start = Number.parseInt(root.dataset.startIndex ?? '0', 10);
  if (!Number.isNaN(start)) index = ((start % slides.length) + slides.length) % slides.length;

  const at = (i: number) => slides[((i % slides.length) + slides.length) % slides.length];

  const paintTile = (tile: HTMLElement, slide: Slide, size: 'big' | 'small') => {
    const img = tile.querySelector('img');
    if (img) {
      img.src = slide.image;
      img.alt = size === 'big' ? slide.alt : '';
    }
    tile.dataset.phsSize = size;
    tile.setAttribute('aria-hidden', size === 'big' ? 'false' : 'true');
  };

  const show = (nextIndex: number) => {
    index = ((nextIndex % slides.length) + slides.length) % slides.length;
    const current = at(index);
    const prev = at(index - 1);
    const next = at(index + 1);

    for (const tile of tiles) {
      const role = tile.dataset.phsTile;
      if (role === 'prev') paintTile(tile, prev, 'small');
      else if (role === 'next') paintTile(tile, next, 'small');
      else if (role === 'active') paintTile(tile, current, 'big');
    }

    if (nameEl) nameEl.textContent = current.name;
    if (descEl) {
      descEl.replaceChildren(
        ...current.description.map((line) => {
          const p = document.createElement('p');
          p.textContent = line;
          return p;
        }),
      );
    }
    if (infoLink) {
      infoLink.href = current.href;
      infoLink.setAttribute('aria-label', `Mehr Infos zu ${current.name}`);
    }

    root.dataset.activeIndex = String(index);
  };

  prevBtn?.addEventListener('click', () => show(index - 1));
  nextBtn?.addEventListener('click', () => show(index + 1));

  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      show(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      show(index + 1);
    }
  });

  show(index);
}

function boot() {
  document.querySelectorAll<HTMLElement>('[data-product-header-slider]').forEach(initProductHeaderSlider);
}

boot();
document.addEventListener('astro:page-load', boot);
