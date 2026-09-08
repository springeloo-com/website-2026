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

export type ProductTextItem = {
  title: string;
  body: string;
};

export type ProductSlideContent = {
  id: string;
  name: string;
  description: string[];
  image: ContentImage;
};

export type ProductBlock = {
  id: string;
  category: string;
  name: string;
  logo?: ContentImage;
  mock: ContentImage;
  features: ProductTextItem[];
  summary: string;
  details: ProductTextItem[];
};

export type ProdukteContent = {
  meta: {
    title: string;
    description: string;
  };
  intro: {
    headline: string;
    image: ContentImage;
    columnA: string;
    columnB: string;
  };
  lead: {
    kicker: string;
    headline: string;
    body: string;
  };
  slider: {
    startIndex: number;
    slides: ProductSlideContent[];
  };
  products: ProductBlock[];
  oss: {
    kicker: string;
    headline: string;
    body: string;
  };
  cta: Cta & {
    headline: string;
  };
};

export type ProjektunterstuetzungContent = {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    image: ContentImage;
  };
  intro: {
    lead: string;
    body: string;
  };
  kompetenzen: {
    kicker: string;
    headline: string;
    tabs: Array<{
      id: string;
      label: string;
      bodyStrong: string;
      body: string;
      image: ContentImage;
    }>;
  };
  frameworks: {
    kicker: string;
    headline: string;
    body: string;
    kernbereicheKicker: string;
    kernbereiche: string[];
    pillars: Array<{
      title: string;
      body: string;
      icon: string;
    }>;
    closing: string;
  };
  solutions: {
    kicker: string;
    headline: string;
    columnA: string;
    columnB: string;
    merkmalLabel: string;
    merkmalBody: string;
  };
  branchen: {
    kicker: string;
    headline: string;
    lead: string;
    groups: Array<{
      title: string;
      items: string[];
    }>;
  };
  cta: Cta & {
    kicker: string;
    headline: string;
    aside: string;
  };
};

export type SpringelooContent = {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    brand: string;
    headline: string;
    image: ContentImage;
  };
  intro: {
    lead: string;
    columnA: string;
    columnB: string;
  };
  numbers: {
    strong: string;
    body: string;
    stats: Array<{
      value: string;
      label: string;
    }>;
  };
  insights: {
    kicker: string;
    headline: string;
    image: ContentImage;
    tabs: Array<{
      id: string;
      label: string;
      title: string;
      lead: string;
      body: string;
    }>;
  };
  management: {
    kicker: string;
    headline: string;
    quote: string;
    team: Array<{
      name: string;
      role: string;
      tags: string[];
      image: ContentImage;
    }>;
  };
  cta: Cta & {
    kicker: string;
    headline: string;
    aside: string;
  };
};

export type KontaktContent = {
  meta: {
    title: string;
    description: string;
  };
  intro: {
    kicker: string;
    headline: string;
    aside: string;
  };
  box: {
    kicker: string;
  };
  office: {
    kicker: string;
  };
  management: {
    kicker: string;
    headline: string;
    connectLabel: string;
    team: Array<{
      name: string;
      role: string;
      tags: string[];
      image: ContentImage;
    }>;
  };
  legal: {
    impressumTitle: string;
    datenschutzTitle: string;
    datenschutzBody: string;
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
  if (typeof value === 'object') {
    const image = value as Partial<ContentImage>;
    if (!image.src?.trim()) return undefined;
  }
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

function requireTextItems(value: unknown, field: string): ProductTextItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Content validation failed: ${field} must have at least 1 item`);
  }
  return value.map((item, i) => ({
    title: requireNonEmpty((item as ProductTextItem)?.title, `${field}[${i}].title`),
    body: requireNonEmpty((item as ProductTextItem)?.body, `${field}[${i}].body`),
  }));
}

function validateProdukte(data: ProdukteContent): ProdukteContent {
  requireNonEmpty(data.meta?.title, 'meta.title');
  requireNonEmpty(data.meta?.description, 'meta.description');

  requireNonEmpty(data.intro?.headline, 'intro.headline');
  data.intro.image = requireImage(data.intro?.image, 'intro.image');
  data.intro.columnA = requireNonEmpty(data.intro?.columnA, 'intro.columnA');
  data.intro.columnB = requireNonEmpty(data.intro?.columnB, 'intro.columnB');

  requireNonEmpty(data.lead?.kicker, 'lead.kicker');
  requireNonEmpty(data.lead?.headline, 'lead.headline');
  requireNonEmpty(data.lead?.body, 'lead.body');

  const slides = data.slider?.slides;
  if (!Array.isArray(slides) || slides.length !== 3) {
    throw new Error(
      `Content validation failed: slider.slides must have exactly 3 items (got ${slides?.length ?? 0})`,
    );
  }
  const startIndex = Number(data.slider?.startIndex ?? 0);
  data.slider.startIndex = Number.isFinite(startIndex)
    ? Math.min(2, Math.max(0, Math.trunc(startIndex)))
    : 0;
  data.slider.slides = slides.map((slide, i) => {
    const rawLines = Array.isArray(slide?.description) ? slide.description : [];
    const description = rawLines.map((line, j) => {
      if (typeof line === 'string') {
        return requireNonEmpty(line, `slider.slides[${i}].description[${j}]`);
      }
      if (line && typeof line === 'object' && 'line' in line) {
        return requireNonEmpty(String((line as { line: unknown }).line), `slider.slides[${i}].description[${j}]`);
      }
      throw new Error(`Content validation failed: slider.slides[${i}].description[${j}] is required`);
    });
    if (description.length === 0) {
      throw new Error(`Content validation failed: slider.slides[${i}].description is required`);
    }
    return {
      id: requireNonEmpty(slide?.id, `slider.slides[${i}].id`),
      name: requireNonEmpty(slide?.name, `slider.slides[${i}].name`),
      description,
      image: requireImage(slide?.image, `slider.slides[${i}].image`),
    };
  });

  const products = data.products;
  if (!Array.isArray(products) || products.length !== 3) {
    throw new Error(
      `Content validation failed: products must have exactly 3 items (got ${products?.length ?? 0})`,
    );
  }
  data.products = products.map((product, i) => ({
    id: requireNonEmpty(product?.id, `products[${i}].id`),
    category: requireNonEmpty(product?.category, `products[${i}].category`),
    name: requireNonEmpty(product?.name, `products[${i}].name`),
    logo: optionalImage(product?.logo, `products[${i}].logo`),
    mock: requireImage(product?.mock, `products[${i}].mock`),
    features: requireTextItems(product?.features, `products[${i}].features`),
    summary: requireNonEmpty(product?.summary, `products[${i}].summary`),
    details: requireTextItems(product?.details, `products[${i}].details`),
  }));

  requireNonEmpty(data.oss?.kicker, 'oss.kicker');
  requireNonEmpty(data.oss?.headline, 'oss.headline');
  requireNonEmpty(data.oss?.body, 'oss.body');

  requireNonEmpty(data.cta?.headline, 'cta.headline');
  data.cta = {
    headline: data.cta.headline.trim(),
    ...requireCta(data.cta, 'cta'),
  };

  return data;
}

function requireStringList(value: unknown, field: string, min = 1): string[] {
  if (!Array.isArray(value) || value.length < min) {
    throw new Error(`Content validation failed: ${field} must have at least ${min} item(s)`);
  }
  return value.map((item, i) => {
    if (typeof item === 'string') {
      return requireNonEmpty(item, `${field}[${i}]`);
    }
    if (item && typeof item === 'object') {
      const record = item as Record<string, unknown>;
      for (const key of ['line', 'item', 'tag', 'label', 'value']) {
        if (typeof record[key] === 'string') {
          return requireNonEmpty(record[key], `${field}[${i}]`);
        }
      }
    }
    throw new Error(`Content validation failed: ${field}[${i}] is required`);
  });
}

function validateProjektunterstuetzung(
  data: ProjektunterstuetzungContent,
): ProjektunterstuetzungContent {
  requireNonEmpty(data.meta?.title, 'meta.title');
  requireNonEmpty(data.meta?.description, 'meta.description');

  requireNonEmpty(data.hero?.eyebrow, 'hero.eyebrow');
  requireNonEmpty(data.hero?.headline, 'hero.headline');
  data.hero.image = requireImage(data.hero?.image, 'hero.image');

  requireNonEmpty(data.intro?.lead, 'intro.lead');
  requireNonEmpty(data.intro?.body, 'intro.body');

  requireNonEmpty(data.kompetenzen?.kicker, 'kompetenzen.kicker');
  requireNonEmpty(data.kompetenzen?.headline, 'kompetenzen.headline');
  const kompTabs = data.kompetenzen?.tabs;
  if (!Array.isArray(kompTabs) || kompTabs.length < 1) {
    throw new Error('Content validation failed: kompetenzen.tabs must have at least 1 item');
  }
  data.kompetenzen.tabs = kompTabs.map((tab, i) => ({
    id: requireNonEmpty(tab?.id, `kompetenzen.tabs[${i}].id`),
    label: requireNonEmpty(tab?.label, `kompetenzen.tabs[${i}].label`),
    bodyStrong: requireNonEmpty(tab?.bodyStrong, `kompetenzen.tabs[${i}].bodyStrong`),
    body: requireNonEmpty(tab?.body, `kompetenzen.tabs[${i}].body`),
    image: requireImage(tab?.image, `kompetenzen.tabs[${i}].image`),
  }));

  requireNonEmpty(data.frameworks?.kicker, 'frameworks.kicker');
  requireNonEmpty(data.frameworks?.headline, 'frameworks.headline');
  requireNonEmpty(data.frameworks?.body, 'frameworks.body');
  requireNonEmpty(data.frameworks?.kernbereicheKicker, 'frameworks.kernbereicheKicker');
  data.frameworks.kernbereiche = requireStringList(
    data.frameworks?.kernbereiche,
    'frameworks.kernbereiche',
  );
  const pillars = data.frameworks?.pillars;
  if (!Array.isArray(pillars) || pillars.length < 1) {
    throw new Error('Content validation failed: frameworks.pillars must have at least 1 item');
  }
  data.frameworks.pillars = pillars.map((pillar, i) => ({
    title: requireNonEmpty(pillar?.title, `frameworks.pillars[${i}].title`),
    body: requireNonEmpty(pillar?.body, `frameworks.pillars[${i}].body`),
    icon: requireNonEmpty(pillar?.icon, `frameworks.pillars[${i}].icon`),
  }));
  requireNonEmpty(data.frameworks?.closing, 'frameworks.closing');

  requireNonEmpty(data.solutions?.kicker, 'solutions.kicker');
  requireNonEmpty(data.solutions?.headline, 'solutions.headline');
  requireNonEmpty(data.solutions?.columnA, 'solutions.columnA');
  requireNonEmpty(data.solutions?.columnB, 'solutions.columnB');
  requireNonEmpty(data.solutions?.merkmalLabel, 'solutions.merkmalLabel');
  requireNonEmpty(data.solutions?.merkmalBody, 'solutions.merkmalBody');

  requireNonEmpty(data.branchen?.kicker, 'branchen.kicker');
  requireNonEmpty(data.branchen?.headline, 'branchen.headline');
  requireNonEmpty(data.branchen?.lead, 'branchen.lead');
  const groups = data.branchen?.groups;
  if (!Array.isArray(groups) || groups.length < 1) {
    throw new Error('Content validation failed: branchen.groups must have at least 1 item');
  }
  data.branchen.groups = groups.map((group, i) => ({
    title: requireNonEmpty(group?.title, `branchen.groups[${i}].title`),
    items: requireStringList(group?.items, `branchen.groups[${i}].items`),
  }));

  requireNonEmpty(data.cta?.kicker, 'cta.kicker');
  requireNonEmpty(data.cta?.headline, 'cta.headline');
  requireNonEmpty(data.cta?.aside, 'cta.aside');
  data.cta = {
    kicker: data.cta.kicker.trim(),
    headline: data.cta.headline.trim(),
    aside: data.cta.aside.trim(),
    ...requireCta(data.cta, 'cta'),
  };

  return data;
}

function validateSpringeloo(data: SpringelooContent): SpringelooContent {
  requireNonEmpty(data.meta?.title, 'meta.title');
  requireNonEmpty(data.meta?.description, 'meta.description');

  requireNonEmpty(data.hero?.eyebrow, 'hero.eyebrow');
  requireNonEmpty(data.hero?.brand, 'hero.brand');
  requireNonEmpty(data.hero?.headline, 'hero.headline');
  data.hero.image = requireImage(data.hero?.image, 'hero.image');

  requireNonEmpty(data.intro?.lead, 'intro.lead');
  requireNonEmpty(data.intro?.columnA, 'intro.columnA');
  requireNonEmpty(data.intro?.columnB, 'intro.columnB');

  requireNonEmpty(data.numbers?.strong, 'numbers.strong');
  requireNonEmpty(data.numbers?.body, 'numbers.body');
  const stats = data.numbers?.stats;
  if (!Array.isArray(stats) || stats.length < 1) {
    throw new Error('Content validation failed: numbers.stats must have at least 1 item');
  }
  data.numbers.stats = stats.map((stat, i) => ({
    value: requireNonEmpty(stat?.value, `numbers.stats[${i}].value`),
    label: requireNonEmpty(stat?.label, `numbers.stats[${i}].label`),
  }));

  requireNonEmpty(data.insights?.kicker, 'insights.kicker');
  requireNonEmpty(data.insights?.headline, 'insights.headline');
  data.insights.image = requireImage(data.insights?.image, 'insights.image');
  const insightTabs = data.insights?.tabs;
  if (!Array.isArray(insightTabs) || insightTabs.length < 1) {
    throw new Error('Content validation failed: insights.tabs must have at least 1 item');
  }
  data.insights.tabs = insightTabs.map((tab, i) => ({
    id: requireNonEmpty(tab?.id, `insights.tabs[${i}].id`),
    label: requireNonEmpty(tab?.label, `insights.tabs[${i}].label`),
    title: requireNonEmpty(tab?.title, `insights.tabs[${i}].title`),
    lead: requireNonEmpty(tab?.lead, `insights.tabs[${i}].lead`),
    body: requireNonEmpty(tab?.body, `insights.tabs[${i}].body`),
  }));

  requireNonEmpty(data.management?.kicker, 'management.kicker');
  requireNonEmpty(data.management?.headline, 'management.headline');
  requireNonEmpty(data.management?.quote, 'management.quote');
  const team = data.management?.team;
  if (!Array.isArray(team) || team.length < 1) {
    throw new Error('Content validation failed: management.team must have at least 1 item');
  }
  data.management.team = team.map((person, i) => ({
    name: requireNonEmpty(person?.name, `management.team[${i}].name`),
    role: requireNonEmpty(person?.role, `management.team[${i}].role`),
    tags: requireStringList(person?.tags, `management.team[${i}].tags`),
    image: requireImage(person?.image, `management.team[${i}].image`),
  }));

  requireNonEmpty(data.cta?.kicker, 'cta.kicker');
  requireNonEmpty(data.cta?.headline, 'cta.headline');
  requireNonEmpty(data.cta?.aside, 'cta.aside');
  data.cta = {
    kicker: data.cta.kicker.trim(),
    headline: data.cta.headline.trim(),
    aside: data.cta.aside.trim(),
    ...requireCta(data.cta, 'cta'),
  };

  return data;
}

function validateKontakt(data: KontaktContent): KontaktContent {
  requireNonEmpty(data.meta?.title, 'meta.title');
  requireNonEmpty(data.meta?.description, 'meta.description');

  requireNonEmpty(data.intro?.kicker, 'intro.kicker');
  requireNonEmpty(data.intro?.headline, 'intro.headline');
  requireNonEmpty(data.intro?.aside, 'intro.aside');

  requireNonEmpty(data.box?.kicker, 'box.kicker');
  requireNonEmpty(data.office?.kicker, 'office.kicker');

  requireNonEmpty(data.management?.kicker, 'management.kicker');
  requireNonEmpty(data.management?.headline, 'management.headline');
  requireNonEmpty(data.management?.connectLabel, 'management.connectLabel');
  const team = data.management?.team;
  if (!Array.isArray(team) || team.length < 1) {
    throw new Error('Content validation failed: management.team must have at least 1 item');
  }
  data.management.team = team.map((person, i) => ({
    name: requireNonEmpty(person?.name, `management.team[${i}].name`),
    role: requireNonEmpty(person?.role, `management.team[${i}].role`),
    tags: requireStringList(person?.tags, `management.team[${i}].tags`),
    image: requireImage(person?.image, `management.team[${i}].image`),
  }));

  requireNonEmpty(data.legal?.impressumTitle, 'legal.impressumTitle');
  requireNonEmpty(data.legal?.datenschutzTitle, 'legal.datenschutzTitle');
  requireNonEmpty(data.legal?.datenschutzBody, 'legal.datenschutzBody');

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
let produkteCache: ProdukteContent | null = null;
let projektunterstuetzungCache: ProjektunterstuetzungContent | null = null;
let springelooCache: SpringelooContent | null = null;
let kontaktCache: KontaktContent | null = null;

export function getGlobals(): GlobalContent {
  if (!globalsCache) {
    globalsCache = validateGlobals(readYaml<GlobalContent>('src/content/site/globals.yaml'));
  }
  return globalsCache;
}

export function getHomeContent(): HomeContent {
  if (import.meta.env.DEV || !homeCache) {
    homeCache = validateHome(readYaml<HomeContent>('src/content/pages/home.yaml'));
  }
  return homeCache;
}

export function getProdukteContent(): ProdukteContent {
  if (import.meta.env.DEV || !produkteCache) {
    produkteCache = validateProdukte(readYaml<ProdukteContent>('src/content/pages/produkte.yaml'));
  }
  return produkteCache;
}

export function getProjektunterstuetzungContent(): ProjektunterstuetzungContent {
  if (import.meta.env.DEV || !projektunterstuetzungCache) {
    projektunterstuetzungCache = validateProjektunterstuetzung(
      readYaml<ProjektunterstuetzungContent>('src/content/pages/projektunterstuetzung.yaml'),
    );
  }
  return projektunterstuetzungCache;
}

export function getSpringelooContent(): SpringelooContent {
  if (import.meta.env.DEV || !springelooCache) {
    springelooCache = validateSpringeloo(
      readYaml<SpringelooContent>('src/content/pages/springeloo.yaml'),
    );
  }
  return springelooCache;
}

export function getKontaktContent(): KontaktContent {
  if (import.meta.env.DEV || !kontaktCache) {
    kontaktCache = validateKontakt(readYaml<KontaktContent>('src/content/pages/kontakt.yaml'));
  }
  return kontaktCache;
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
