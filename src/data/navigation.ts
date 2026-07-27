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

export const primaryNav: NavItem[] = [
  {
    id: 'projektunterstuetzung',
    label: 'Projektunterstützung',
    href: '/projektunterstuetzung',
    children: [
      { label: 'Kompetenzen', href: '/projektunterstuetzung#kompetenzen' },
      { label: 'Insight', href: '/projektunterstuetzung#insight' },
    ],
  },
  {
    id: 'produkte',
    label: 'Produkte',
    href: '/produkte',
    children: [
      { label: 'Host Ablöse', href: '/produkte#host-abloese' },
      { label: 'Übersicht', href: '/produkte#uebersicht' },
    ],
  },
  {
    id: 'springeloo',
    label: 'Springeloo',
    href: '/springeloo',
  },
  {
    id: 'kontakt',
    label: 'Kontakt',
    href: '/kontakt',
  },
];

export const siteMeta = {
  name: 'springeloo',
  tagline: 'future by professionals.',
  footerTagline: 'Frictionless digital experiences',
  company: 'Springeloo GmbH',
  addressLines: ['Reutstraße 2', 'D-72124 Pliezhausen'],
  phone: '+49 7127 94 99 90',
  email: 'hello@springeloo.com',
  contactAddressLines: ['Teybergasse 1', 'A-1140 Wien'],
  contactPhone: '+43 680 111 32 30',
  contactEmail: 'office@springeloo.com',
  linkedIn: 'https://www.linkedin.com/',
  legal: [
    { label: 'Impressum', href: '/kontakt#impressum' },
    { label: 'Datenschutzrichtlinien', href: '/kontakt#datenschutz' },
  ],
};
