type DetailItem = {
  title: string;
  body: string;
};

type Slide = {
  name: string;
  description: string[];
  body: string;
  details: DetailItem[];
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
  const bodyEl = root.querySelector<HTMLElement>('[data-phs-body]');
  const detailsList = root.querySelector<HTMLElement>('[data-phs-details-list]');
  const detailsPanel = root.querySelector<HTMLElement>('[data-phs-details]');
  const detailsToggle = root.querySelector<HTMLButtonElement>('[data-phs-details-toggle]');
  const infoLink = root.querySelector<HTMLAnchorElement>('[data-phs-info]');
  const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-phs-tile]'));

  let index = 0;
  const start = Number.parseInt(root.dataset.startIndex ?? '0', 10);
  if (!Number.isNaN(start)) index = ((start % slides.length) + slides.length) % slides.length;

  const at = (i: number) => slides[((i % slides.length) + slides.length) % slides.length];

  const setDetailsOpen = (open: boolean) => {
    root.classList.toggle('is-details-open', open);
    detailsToggle?.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (detailsPanel) {
      detailsPanel.hidden = !open;
    }
  };

  const paintTile = (tile: HTMLElement, slide: Slide, size: 'big' | 'small') => {
    const img = tile.querySelector('img');
    if (img) {
      img.src = slide.image;
      img.alt = size === 'big' ? slide.alt : '';
    }
    tile.dataset.phsSize = size;
    tile.setAttribute('aria-hidden', size === 'big' ? 'false' : 'true');
  };

  const paintDetails = (slide: Slide) => {
    if (!detailsList) return;
    detailsList.replaceChildren(
      ...slide.details.map((item) => {
        const wrap = document.createElement('div');
        wrap.className = 'phs__details-item';
        const title = document.createElement('p');
        title.className = 'phs__details-item-title';
        title.textContent = item.title;
        const body = document.createElement('p');
        body.className = 'phs__details-item-body';
        body.textContent = item.body;
        wrap.append(title, body);
        return wrap;
      }),
    );
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
    if (bodyEl) bodyEl.textContent = current.body;
    paintDetails(current);
    setDetailsOpen(false);

    if (infoLink) {
      infoLink.href = current.href;
      infoLink.setAttribute('aria-label', `Mehr zu ${current.name}`);
    }

    root.dataset.activeIndex = String(index);
  };

  detailsToggle?.addEventListener('click', () => {
    const open = detailsToggle.getAttribute('aria-expanded') !== 'true';
    setDetailsOpen(open);
  });

  prevBtn?.addEventListener('click', () => show(index - 1));
  nextBtn?.addEventListener('click', () => show(index + 1));

  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      show(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      show(index + 1);
    } else if (event.key === 'Escape' && detailsToggle?.getAttribute('aria-expanded') === 'true') {
      event.preventDefault();
      setDetailsOpen(false);
    }
  });

  show(index);
}

function boot() {
  document.querySelectorAll<HTMLElement>('[data-product-header-slider]').forEach(initProductHeaderSlider);
}

boot();
document.addEventListener('astro:page-load', boot);
