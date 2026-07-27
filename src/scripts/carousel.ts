function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initCarousel(root: HTMLElement) {
  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-carousel-slide]'));
  if (slides.length === 0) return;

  const prev = root.querySelector<HTMLButtonElement>('[data-carousel-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-carousel-next]');
  const toggle = root.querySelector<HTMLButtonElement>('[data-carousel-toggle]');
  const autoplayEnabled = root.dataset.autoplay === 'true' && !prefersReducedMotion();

  let index = 0;
  let playing = autoplayEnabled;
  let timer: number | undefined;

  const show = (nextIndex: number) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.hidden = !active;
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
  };

  const stop = () => {
    playing = false;
    if (timer) window.clearInterval(timer);
    timer = undefined;
    if (toggle) toggle.textContent = 'Play';
  };

  const start = () => {
    if (prefersReducedMotion() || slides.length < 2) {
      stop();
      return;
    }
    playing = true;
    if (toggle) toggle.textContent = 'Pause';
    if (timer) window.clearInterval(timer);
    timer = window.setInterval(() => show(index + 1), 5500);
  };

  prev?.addEventListener('click', () => {
    show(index - 1);
    if (playing) start();
  });
  next?.addEventListener('click', () => {
    show(index + 1);
    if (playing) start();
  });
  toggle?.addEventListener('click', () => {
    if (playing) stop();
    else start();
  });

  show(0);
  if (autoplayEnabled) start();
  else stop();
}

function boot() {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach(initCarousel);
}

boot();
document.addEventListener('astro:page-load', boot);
