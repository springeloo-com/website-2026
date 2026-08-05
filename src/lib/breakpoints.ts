/**
 * Single source of truth for Figma acceptance bands ↔ CSS layout switches.
 * Keep `@media` literals in sync with `min` values (CSS cannot read these).
 *
 * Source frames: specs/004-figma-design-parity/contracts/figma-source.md
 * Implementation file (team copy): lhqqJkipcRchejNEqQ1ehb
 */

/** Editable copy in Thomas Kamsker's team (MCP-ready). */
export const FIGMA_FILE_KEY = 'lhqqJkipcRchejNEqQ1ehb';

/** Stakeholder / original file (proto reference). */
export const FIGMA_FILE_KEY_LEGACY = 'QLSDfzdupEsnPJ4WY528O5';

export type ViewportBandId = 'mobile' | 'tablet-hoch' | 'tablet-quer' | 'desktop';

export type ViewportBand = {
  id: ViewportBandId;
  /** Inclusive min width in CSS px (0 = base / mobile-first). */
  min: number;
  /** Inclusive max width in CSS px; Infinity for desktop+. */
  max: number;
  /** Visual QA / design acceptance width. */
  acceptanceWidth: number;
  /** Breakpoint canvas page node (user design URL). */
  figmaCanvasNodeId: string;
  /** Homepage landing instance to fetch with get_design_context. */
  figmaNodeId: string;
  /** Layer name fragment in the design file. */
  figmaLayer: string;
  label: string;
};

export const VIEWPORT_BANDS: readonly ViewportBand[] = [
  {
    id: 'mobile',
    min: 0,
    max: 767,
    acceptanceWidth: 390,
    figmaCanvasNodeId: '1924:34093',
    figmaNodeId: '2109:114327',
    figmaLayer: '01-landingpage-Mobile',
    label: 'Mobile',
  },
  {
    id: 'tablet-hoch',
    min: 768,
    max: 1023,
    acceptanceWidth: 768,
    figmaCanvasNodeId: '1924:34095',
    figmaNodeId: '2109:104991',
    figmaLayer: '01-landingpage-Tablet-hoch',
    label: 'Tablet hoch',
  },
  {
    id: 'tablet-quer',
    min: 1024,
    max: 1279,
    acceptanceWidth: 1024,
    figmaCanvasNodeId: '1924:34096',
    figmaNodeId: '2109:91364',
    figmaLayer: '01-landingpage-Tablet-quer',
    label: 'Tablet quer',
  },
  {
    id: 'desktop',
    min: 1280,
    max: Number.POSITIVE_INFINITY,
    acceptanceWidth: 1280,
    figmaCanvasNodeId: '1924:34092',
    figmaNodeId: '2109:78609',
    figmaLayer: '01-landingpage-Desktop',
    label: 'Desktop',
  },
] as const;

/** Named mins for documentation / tooling (match breakpoints.css). */
export const BP = {
  mobile: 390,
  tabletHoch: 768,
  tabletQuer: 1024,
  desktop: 1280,
  optional2k: 1920,
} as const;

/** Secondary marketing routes → Figma landing instances per viewport band. */
export type SecondaryRouteId =
  | 'projektunterstuetzung'
  | 'produkte'
  | 'springeloo'
  | 'kontakt';

export type SecondaryRouteFrames = {
  path: `/${SecondaryRouteId}`;
  label: string;
  nodes: Record<ViewportBandId, string>;
};

export const SECONDARY_ROUTES: readonly SecondaryRouteFrames[] = [
  {
    path: '/projektunterstuetzung',
    label: 'Projektunterstützung',
    nodes: {
      desktop: '2109:78610',
      'tablet-quer': '2109:91361',
      'tablet-hoch': '2109:104987',
      mobile: '2109:114324',
    },
  },
  {
    path: '/produkte',
    label: 'Produkte',
    nodes: {
      desktop: '2109:78612',
      'tablet-quer': '2109:91363',
      'tablet-hoch': '2109:116435',
      mobile: '2109:114326',
    },
  },
  {
    path: '/springeloo',
    label: 'Springeloo',
    nodes: {
      desktop: '2109:78608',
      'tablet-quer': '2109:91360',
      'tablet-hoch': '2109:104986',
      mobile: '2109:114323',
    },
  },
  {
    path: '/kontakt',
    label: 'Kontakt',
    nodes: {
      desktop: '2109:78611',
      'tablet-quer': '2109:91362',
      'tablet-hoch': '2109:104988',
      mobile: '2109:114325',
    },
  },
] as const;

export function secondaryRouteNode(
  route: SecondaryRouteId,
  band: ViewportBandId = 'desktop',
): string {
  const entry = SECONDARY_ROUTES.find((r) => r.path === `/${route}`);
  if (!entry) throw new Error(`Unknown secondary route: ${route}`);
  return entry.nodes[band];
}

export function viewportBandFromWidth(width: number): ViewportBandId {
  if (width >= BP.desktop) return 'desktop';
  if (width >= BP.tabletQuer) return 'tablet-quer';
  if (width >= BP.tabletHoch) return 'tablet-hoch';
  return 'mobile';
}

export function getViewportBand(id: ViewportBandId): ViewportBand {
  const band = VIEWPORT_BANDS.find((b) => b.id === id);
  if (!band) throw new Error(`Unknown viewport band: ${id}`);
  return band;
}

export function figmaDesignUrl(nodeId: string): string {
  const node = nodeId.replace(':', '-');
  return `https://www.figma.com/design/${FIGMA_FILE_KEY}/Springeloo-_-Webdesign?node-id=${node}`;
}

/** @deprecated Prefer figmaDesignUrl — kept for older proto links. */
export function figmaProtoUrl(nodeId: string): string {
  return figmaDesignUrl(nodeId);
}
