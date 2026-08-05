# Contract: Figma Source of Truth

**Feature**: `004-figma-design-parity`

## File binding

| Field | Value |
|-------|-------|
| Name | Springeloo _ Webdesign (team copy) |
| File key | `lhqqJkipcRchejNEqQ1ehb` |
| Role | **Implementation / MCP source** (Full seat on owner team) |

Legacy stakeholder file (protos may still point here): `QLSDfzdupEsnPJ4WY528O5`.

Editable file is the implementation source for Variables, structure, and assets.
Prefer **instance** node IDs for `get_design_context` (not empty breakpoint canvases).

## Breakpoint canvases

| Band | Canvas node | Acceptance | Design URL |
|------|-------------|------------|------------|
| Desktop | `1924:34092` | 1280px | [link](https://www.figma.com/design/lhqqJkipcRchejNEqQ1ehb/Springeloo-_-Webdesign?node-id=1924-34092) |
| Tablet quer | `1924:34096` | 1024px | [link](https://www.figma.com/design/lhqqJkipcRchejNEqQ1ehb/Springeloo-_-Webdesign?node-id=1924-34096) |
| Tablet hoch | `1924:34095` | 768px | [link](https://www.figma.com/design/lhqqJkipcRchejNEqQ1ehb/Springeloo-_-Webdesign?node-id=1924-34095) |
| Mobile | `1924:34093` | 390px | [link](https://www.figma.com/design/lhqqJkipcRchejNEqQ1ehb/Springeloo-_-Webdesign?node-id=1924-34093) |

## Homepage landing instances

| Band | Landing instance | Layer |
|------|------------------|-------|
| Desktop | `2109:78609` | `01-landingpage-Desktop` |
| Tablet quer | `2109:91364` | `01-landingpage-Tablet-quer` |
| Tablet hoch | `2109:104991` | `01-landingpage-Tablet-hoch` |
| Mobile | `2109:114327` | `01-landingpage-Mobile` |

Runtime homepage map: `src/lib/breakpoints.ts` → `VIEWPORT_BANDS`.

### Hero layout notes (MCP 2026-08-05)

| Band | Combined boxes | HR+AI | CTA card |
|------|----------------|-------|----------|
| Desktop | right cluster | 284×284 square | 567×284 |
| Tablet quer | right cluster | 223×223 | 447×223 |
| Tablet hoch | lower-left stack | 239×239 above card | 479×239 |
| Mobile | bottom row | 28×200 vertical strip | ~399×200 |

## Secondary routes (all bands)

Code map: `src/lib/breakpoints.ts` → `SECONDARY_ROUTES`.

| Route | Desktop | Tablet quer | Tablet hoch | Mobile |
|-------|---------|-------------|-------------|--------|
| `/projektunterstuetzung` | `2109:78610` | `2109:91361` | `2109:104987` | `2109:114324` |
| `/produkte` | `2109:78612` | `2109:91363` | `2109:116435` | `2109:114326` |
| `/springeloo` | `2109:78608` | `2109:91360` | `2109:104986` | `2109:114323` |
| `/kontakt` | `2109:78611` | `2109:91362` | `2109:104988` | `2109:114325` |

Also on tablet-hoch / mobile canvases: menu overlays `05-Menue-*`
(`2109:104990`, `2109:114328`).

### Subsection notes (MCP)

| Route | Status | Notes |
|-------|--------|-------|
| `/kontakt` | Implemented (desktop layout) | Dark page + contact box + management 3-up |
| `/produkte` | **Fetched all 4 bands** 2026-08-05 | Dark theme; spring id.a2 / suiteCRM / Host Ablöse modules |
| `/projektunterstuetzung` | **Fetched all 4 bands** 2026-08-05 | Hero → intro → Kompetenz tabs → frameworks → Branchen → CTA |
| `/springeloo` | Desktop fetched earlier | Brand/about — not re-pulled this pass |

Full section inventory + asset list:
[`research-secondary-pages.md`](../research-secondary-pages.md).

**CMS boundary**: do not overwrite Decap/YAML copy with Figma placeholder Lorem; layout chrome only unless fields already exist.

## Rules

1. Layout implementation MUST target these frames (or a later approved Design Drop
   that updates this contract + spec FR-012 together).
2. Secondary pages use the same file when frames exist; missing frames → no
   speculative redesign.
3. Faithful translation only — no creative redesign when resolving conflicts;
   update spec if design changes.
4. Production assets called out by design MUST be identified before visual
   sign-off of affected sections.
5. Prefer landing **instance** node IDs for MCP `get_design_context` (not the
   empty breakpoint canvas wrappers).
