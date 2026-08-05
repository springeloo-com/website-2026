# Research: Figma Design Parity (Multi-Breakpoint)

**Feature**: `004-figma-design-parity` | **Date**: 2026-08-05

## 1. Delivery approach (Figma → site)

**Decision**: Use **Figma-assisted coding** (Figma Desktop/MCP context in Cursor)
to edit the existing Astro/CSS codebase. Do not use third-party Figma-to-website
exporters or migrate to Framer/hosted builders.

**Rationale**: Preserves GitHub Pages, Decap, reusable components, and
constitution constraints. Matches clarify + docs verdict (`docs/I20260805_1401.md`).

**Alternatives considered**:
- Anima / figma.to.website / figma2html — fast dump, weak fit for Decap +
  component ownership
- Hand-code with Figma as screenshots only — highest craft, slower; MCP still
  preferred as assist
- Framer / visual builders — abandons Pages + Decap; rejected by spec
- Continuous auto Figma→production — not realistic; rejected by FR-009

## 2. Breakpoint / media-query strategy

**Decision**: Acceptance and layout switches use **Mobile 390px**, **Tablet hoch
768px**, **Tablet quer 1024px**, **Desktop 1280px**. Keep values documented in
`src/styles/breakpoints.css` (`--bp-*`). Because CSS custom properties cannot be
used inside standard `@media` conditions, **duplicate the numeric literals** in
queries but only those four widths (plus optional `--bp-2k` / 1920 if design
requires). Remove leftover **900px** / **960px** (and any other intermediate
layout thresholds that contradict the four frames).

**Rationale**: Clarify locked QA widths to current tokens; FR-002 requires
alignment; ad-hoc 900/960 already diverge on home/produkte/kontakt.

**Alternatives considered**:
- Adopt measured Figma frame widths if they differ — deferred unless token sync
  proves mismatch; then update tokens + spec together
- Desktop 1440 / Mobile 375 defaults — rejected (clarify chose existing tokens)
- Desktop+Mobile only — rejected (four-frame requirement)

## 3. Token sync process

**Decision**: Treat Figma Variables as source for color, type, spacing, and
related constants. On each design drop: diff Variables → update `tokens.css` /
`breakpoints.css` **before** large layout edits. Prefer CSS custom properties
already used by components; avoid one-off hex/font sizes on the homepage.

**Rationale**: US2 / FR-003; token-first reduces rework when frames shift.

**Alternatives considered**:
- Tokens-only pass without layout — insufficient for 1:1 (Option E alone)
- Inline Figma export CSS as a second stylesheet — duplicates system; prefer
  merging into existing token files

## 4. Content vs layout authority

**Decision**: **Layout/composition from Figma**; **live copy/images from Decap**
(`home.yaml` / `globals.yaml`). Do not overwrite Decap fields with Figma
placeholder text during parity. Expand Decap fields only when design introduces
new editable copy/image needs.

**Rationale**: Clarify Q3; FR-005/FR-006; preserves editorial workflow from 003.

**Alternatives considered**:
- Replace live content from Figma — conflates design drop with content migration
- Placeholder/lorem until editors update — harms production readiness

## 5. Visual QA / “1:1” definition

**Decision**: Structured human QA at the four widths. **Severity-1** (blocks
sign-off): wrong section order, alignment, spacing rhythm, type hierarchy, or
major media placement. Sub-pixel / anti-aliasing ignored. No CI pixel-diff gate.
Sign-off = **designer visual OK** + **stakeholder acceptance**.

**Rationale**: Clarify Q4/Q5; SC-001/SC-008; constitution Quality Gate without
brittle automation.

**Alternatives considered**:
- Near pixel-perfect ≤2px automated checks — high flake, not required
- Stakeholder “looks right” only — insufficient for severity-1 rigor
- Engineering checklist only — misses design/brand authority

## 6. Delivery sequencing

**Decision**: **Homepage four-width parity is the release gate.** Shared
header/footer/nav updated as needed for home. Secondary pages with frames follow
in the same feature but **must not block** home sign-off. Pages without frames
stay untouched (no speculative redesign).

**Rationale**: Clarify Q2; FR-007; P1 vs P2 stories.

**Alternatives considered**:
- Ship all framed pages together — delays home value
- Separate feature for all subpages — acceptable later, but in-feature follow-on
  is allowed when frames exist

## 7. Design-drop cadence (ongoing)

**Decision**: Document and follow: prepare/name frames → token sync → assisted
layout updates → four-width visual QA → merge. Human review mandatory; no
promise of instant Figma sync.

**Rationale**: US4 / FR-008 / FR-009; durable process after first pass.

**Alternatives considered**:
- Fully automated publish pipeline — rejected by scope and reliability
