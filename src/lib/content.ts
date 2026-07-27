import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

export type NavChild = {
  label: string;
  href: string;
};

export type NavItem = {
  id: string;
  label: string;
  href: string;
  children?: NavChild[];
};

export type LegalLink = {
  label: string;
  href: string;
};

export type Cta = {
  label: string;
  href: string;
};

export type ContentImage = {
  src: string;
  alt: string;
};

export type GlobalContent = {
  brandName: string;
  nav: NavItem[];
  footer: {
    tagline: string;
    company: string;
    addressLines: string[];
    phone: string;
    email: string;
    linkedIn: string;
    legal: LegalLink[];
  };
  contact: {
    addressLines: string[];
    phone: string;
    email: string;
  };
};

export type HomeCard = {
  eyebrow?: string;
  title: string;
  body: string;
  image?: ContentImage;
  cta: Cta;
};

export type HomeContent = {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    badge: string;
    image: ContentImage;
    primaryCta: Cta;
    secondaryCta: Cta;
  };
  leistungen: {
    cards: HomeCard[];
  };
};

const ROOT = process.cwd();
const REQUIRED_NAV_IDS = [
  'projektunterstuetzung',
  'produkte',
  'springeloo',
  'kontakt',
] as const;

function readYaml<T>(relativePath: string): T {
  const filePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Content file missing: ${relativePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  return parse(raw) as T;
}

function requireNonEmpty(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Content validation failed: ${field} is required`);
  }
  return value.trim();
}

function requireCta(value: unknown, field: string): Cta {
  if (!value || typeof value !== 'object') {
    throw new Error(`Content validation failed: ${field} is required`);
  }
  const cta = value as Partial<Cta>;
  return {
    label: requireNonEmpty(cta.label, `${field}.label`),
    href: requireNonEmpty(cta.href, `${field}.href`),
  };
}

function requireImage(value: unknown, field: string): ContentImage {
  if (!value || typeof value !== 'object') {
    throw new Error(`Content validation failed: ${field} is required`);
  }
  const image = value as Partial<ContentImage>;
  return {
    src: requireNonEmpty(image.src, `${field}.src`),
    alt: requireNonEmpty(image.alt, `${field}.alt`),
  };
}

function optionalImage(value: unknown, field: string): ContentImage | undefined {
  if (value == null) return undefined;
  return requireImage(value, field);
}

function validateGlobals(data: GlobalContent): GlobalContent {
  requireNonEmpty(data.brandName, 'brandName');
  if (!Array.isArray(data.nav) || data.nav.length !== REQUIRED_NAV_IDS.length) {
    throw new Error(
      `Content validation failed: nav must have exactly ${REQUIRED_NAV_IDS.length} items`,
    );
  }
  for (let i = 0; i < REQUIRED_NAV_IDS.length; i++) {
    const item = data.nav[i];
    const expectedId = REQUIRED_NAV_IDS[i];
    requireNonEmpty(item?.id, `nav[${i}].id`);
    if (item.id !== expectedId) {
      throw new Error(
        `Content validation failed: nav[${i}].id must be "${expectedId}" (got "${item.id}")`,
      );
    }
    requireNonEmpty(item.label, `nav[${i}].label`);
    requireNonEmpty(item.href, `nav[${i}].href`);
    if (item.children) {
      for (let j = 0; j < item.children.length; j++) {
        requireNonEmpty(item.children[j]?.label, `nav[${i}].children[${j}].label`);
        requireNonEmpty(item.children[j]?.href, `nav[${i}].children[${j}].href`);
      }
    }
  }

  requireNonEmpty(data.footer?.tagline, 'footer.tagline');
  requireNonEmpty(data.footer?.company, 'footer.company');
  if (!Array.isArray(data.footer?.addressLines) || data.footer.addressLines.length === 0) {
    throw new Error('Content validation failed: footer.addressLines is required');
  }
  requireNonEmpty(data.footer.phone, 'footer.phone');
  requireNonEmpty(data.footer.email, 'footer.email');
  requireNonEmpty(data.footer.linkedIn, 'footer.linkedIn');
  if (!Array.isArray(data.footer.legal)) {
    throw new Error('Content validation failed: footer.legal is required');
  }
  for (let i = 0; i < data.footer.legal.length; i++) {
    requireNonEmpty(data.footer.legal[i]?.label, `footer.legal[${i}].label`);
    requireNonEmpty(data.footer.legal[i]?.href, `footer.legal[${i}].href`);
  }

  if (!Array.isArray(data.contact?.addressLines) || data.contact.addressLines.length === 0) {
    throw new Error('Content validation failed: contact.addressLines is required');
  }
  requireNonEmpty(data.contact.phone, 'contact.phone');
  requireNonEmpty(data.contact.email, 'contact.email');

  return data;
}

function validateHome(data: HomeContent): HomeContent {
  requireNonEmpty(data.meta?.title, 'meta.title');
  requireNonEmpty(data.meta?.description, 'meta.description');

  requireNonEmpty(data.hero?.eyebrow, 'hero.eyebrow');
  requireNonEmpty(data.hero?.headline, 'hero.headline');
  requireNonEmpty(data.hero?.badge, 'hero.badge');
  data.hero.image = requireImage(data.hero?.image, 'hero.image');
  data.hero.primaryCta = requireCta(data.hero?.primaryCta, 'hero.primaryCta');
  data.hero.secondaryCta = requireCta(data.hero?.secondaryCta, 'hero.secondaryCta');

  const cards = data.leistungen?.cards;
  if (!Array.isArray(cards) || cards.length !== 3) {
    throw new Error(
      `Content validation failed: leistungen.cards must have exactly 3 items (got ${cards?.length ?? 0})`,
    );
  }

  data.leistungen.cards = cards.map((card, i) => {
    const title = requireNonEmpty(card?.title, `leistungen.cards[${i}].title`);
    const body = typeof card?.body === 'string' ? card.body : '';
    return {
      eyebrow: card.eyebrow?.trim() || undefined,
      title,
      body,
      image: optionalImage(card.image, `leistungen.cards[${i}].image`),
      cta: requireCta(card.cta, `leistungen.cards[${i}].cta`),
    };
  });

  return data;
}

/** Prefix a public path with Astro `base` when needed. */
export function publicUrl(src: string, baseUrl = import.meta.env.BASE_URL): string {
  if (!src || src.startsWith('http') || src.startsWith('data:') || src.startsWith('//')) {
    return src;
  }
  const base = (baseUrl || '/').replace(/\/$/, '');
  const pathPart = src.startsWith('/') ? src : `/${src}`;
  return `${base}${pathPart}`;
}

let globalsCache: GlobalContent | null = null;
let homeCache: HomeContent | null = null;

export function getGlobals(): GlobalContent {
  if (!globalsCache) {
    globalsCache = validateGlobals(readYaml<GlobalContent>('src/content/site/globals.yaml'));
  }
  return globalsCache;
}

export function getHomeContent(): HomeContent {
  if (!homeCache) {
    homeCache = validateHome(readYaml<HomeContent>('src/content/pages/home.yaml'));
  }
  return homeCache;
}

/** Legacy-shaped meta for components that previously used `siteMeta`. */
export function getSiteMeta() {
  const g = getGlobals();
  return {
    name: g.brandName,
    tagline: 'future by professionals.',
    footerTagline: g.footer.tagline,
    company: g.footer.company,
    addressLines: g.footer.addressLines,
    phone: g.footer.phone,
    email: g.footer.email,
    contactAddressLines: g.contact.addressLines,
    contactPhone: g.contact.phone,
    contactEmail: g.contact.email,
    linkedIn: g.footer.linkedIn,
    legal: g.footer.legal,
  };
}

export function getPrimaryNav(): NavItem[] {
  return getGlobals().nav;
}
