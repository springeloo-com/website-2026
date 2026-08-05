# Contract: Four-Width Visual QA

**Feature**: `004-figma-design-parity`

## Viewports (mandatory)

| Name | Width | Figma frame (home) |
|------|------:|--------------------|
| Mobile | 390px | `2108:58686` |
| Tablet hoch | 768px | `2108:58680` |
| Tablet quer | 1024px | `2108:58675` |
| Desktop | 1280px | `2108:58670` |

QA against live or `npm run preview` at these widths (browser responsive mode or
device). Between named widths, layout MUST follow the nearest approved frames
without broken overflow, clipped CTAs, or unusable navigation.

## Severity-1 (blocks sign-off)

Any of the following vs the corresponding Figma frame:

- Wrong **section order**
- Wrong **alignment** of major blocks
- Broken **spacing rhythm** (section/component spacing clearly off design)
- Wrong **type hierarchy** (display/body/role mismatch)
- Wrong **major media placement** (hero/key imagery composition)

**Not** severity-1: sub-pixel differences, anti-aliasing, font hinting, or
minor Decap content length differences that still wrap readably (flag extreme
overflow for design follow-up).

## Checklist items (homepage — minimum)

For **each** of the four widths:

- [ ] Section order matches frame
- [ ] Header / nav behavior matches frame
- [ ] Hero composition matches frame (layout; Decap content may differ in wording)
- [ ] Primary CTA(s) visible and usable
- [ ] Spacing/type hierarchy matches frame intent
- [ ] Footer matches shared chrome expectations
- [ ] No horizontal overflow / clipped interactive controls
- [ ] Decorative images are not the sole carrier of essential text that exists as
      real text in Figma

Target: ≥95% checklist items pass on first structured review after the parity
pass (SC-002); remaining items tracked with owners. **Zero** open severity-1
before designer OK.

## Sign-off roles

| Role | Responsibility |
|------|----------------|
| Designer | Visual OK — no open severity-1 |
| Stakeholder | Explicit acceptance of 1:1 at four breakpoints (SC-008) |
| Engineering | Build green; a11y/SEO baseline preserved (AR-001/AR-002) |

Homepage release requires designer OK **and** stakeholder acceptance.
Secondary-page QA uses the same severity rules but MUST NOT block homepage
release.
