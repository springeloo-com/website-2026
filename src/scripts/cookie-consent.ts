const STORAGE_KEY = 'springeloo-consent';
const CONSENT_EVENT = 'springeloo:consent-change';

export type ConsentChoice = 'necessary' | 'analytics' | 'all';

export type StoredConsent = {
  choice: ConsentChoice;
  analytics: boolean;
  ts: number;
};

type GtagCommand = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagCommand;
    __springelooConsent?: {
      open: () => void;
      get: () => StoredConsent | null;
    };
  }
}

function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  }
}

export function readConsent(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (!parsed || typeof parsed.analytics !== 'boolean' || !parsed.choice) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeConsent(choice: ConsentChoice): StoredConsent {
  const stored: StoredConsent = {
    choice,
    analytics: choice === 'analytics' || choice === 'all',
    ts: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  return stored;
}

function updateConsentMode(analyticsGranted: boolean) {
  ensureGtag();
  const state = analyticsGranted ? 'granted' : 'denied';
  window.gtag?.('consent', 'update', {
    analytics_storage: state,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

function loadGtm(gtmId: string) {
  if (!gtmId || document.getElementById('gtm-script')) return;

  ensureGtag();
  window.dataLayer?.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.id = 'gtm-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  document.head.appendChild(script);

  if (!document.getElementById('gtm-noscript')) {
    const noscript = document.createElement('noscript');
    noscript.id = 'gtm-noscript';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    iframe.title = 'Google Tag Manager';
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);
  }
}

export function applyConsent(choice: ConsentChoice, gtmId: string) {
  const stored = writeConsent(choice);
  updateConsentMode(stored.analytics);
  if (stored.analytics && gtmId) {
    loadGtm(gtmId);
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: stored }));
  return stored;
}

export function initCookieConsent(options: {
  gtmId: string;
  banner: HTMLElement;
  openTriggers?: NodeListOf<Element> | Element[];
}) {
  const { gtmId, banner } = options;
  ensureGtag();

  const show = () => {
    banner.hidden = false;
    banner.setAttribute('aria-hidden', 'false');
    const firstBtn = banner.querySelector<HTMLElement>('button');
    firstBtn?.focus();
  };

  const hide = () => {
    banner.hidden = true;
    banner.setAttribute('aria-hidden', 'true');
  };

  const existing = readConsent();
  if (existing) {
    updateConsentMode(existing.analytics);
    if (existing.analytics && gtmId) loadGtm(gtmId);
    hide();
  } else {
    show();
  }

  banner.querySelectorAll<HTMLButtonElement>('[data-consent-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      const choice = button.dataset.consentChoice as ConsentChoice | undefined;
      if (!choice) return;
      applyConsent(choice, gtmId);
      hide();
    });
  });

  const triggers = options.openTriggers ?? document.querySelectorAll('[data-cookie-settings]');
  triggers.forEach((el) => {
    el.addEventListener('click', (event) => {
      event.preventDefault();
      show();
    });
  });

  window.__springelooConsent = {
    open: show,
    get: readConsent,
  };
}
