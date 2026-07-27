/**
 * Navigation types and content-backed accessors.
 * Labels/contact live in `src/content/site/globals.yaml`; hrefs stay in that
 * file as developer-controlled fields (hidden from CloudCannon editors).
 */
export type { NavChild, NavItem } from '../lib/content';
export { getPrimaryNav, getSiteMeta, getGlobals } from '../lib/content';
