# Contract: UI Components

**Feature**: `001-springeloo-website`  
**Consumer**: Astro pages/layouts composing the public UI

Components are the reusable building blocks required by the constitution and
spec. Props are conceptual contracts for implementers (not a runtime API).

## SiteHeader

| Prop / slot | Required | Notes |
|-------------|----------|-------|
| logo | yes | Links to `/` |
| items | yes | Top-level NavigationItems |
| activePath | yes | Current path for current-page indication |

**Behavior**: Desktop shows inline nav; small viewports defer to MobileMenu
pattern. Keyboard focus visible.

## NavLink

| Prop | Required | Notes |
|------|----------|-------|
| href | yes | In-scope path or anchor |
| label | yes | Visible text (not image-only) |
| current | no | `aria-current="page"` when active |

## MobileMenu

| Prop | Required | Notes |
|------|----------|-------|
| items | yes | Same IA as header, including nested groups |
| open | controlled/internal | Toggle; Escape closes |

**Behavior**: Progressive enhancement — primary links still in DOM if JS fails.

## ExpandableNav

| Prop | Required | Notes |
|------|----------|-------|
| label | yes | Group label |
| children | yes | Nested NavLinks (in-scope hrefs only) |

**Behavior**: Button toggles disclosure; `aria-expanded` reflects state.

## HeroBanner / HeroCarousel

| Prop | Required | Notes |
|------|----------|-------|
| slides | yes (≥1) | Image + headline/support text from Figma |
| autoplay | yes | Default on unless reduced motion |

**Behavior**: Autoplay + pause/next/prev controls; autoplay off under
`prefers-reduced-motion: reduce`. Meaningful alt text per slide image.

## SectionHeading

| Prop | Required | Notes |
|------|----------|-------|
| level | yes | `h2`–`h3` typically; respect document outline |
| text | yes | From Figma |

## ContentCard

| Prop | Required | Notes |
|------|----------|-------|
| title | yes | |
| body | no | |
| media | no | |
| href | no | If card is link-like |

## CTAButton

| Prop | Required | Notes |
|------|----------|-------|
| label | yes | Real text control |
| href | yes | In-scope |
| variant | no | Visual variant from tokens |

## SiteFooter

| Prop / slot | Required | Notes |
|-------------|----------|-------|
| nav / legal / contact bits | as in Figma | Only include legal copy if present in extract |

## Shared non-functional rules

- Semantic HTML preferred over anonymous wrappers
- Visible focus styles from tokens
- No text-only-in-image when real text is possible
- No new dependencies inside components without plan amendment
