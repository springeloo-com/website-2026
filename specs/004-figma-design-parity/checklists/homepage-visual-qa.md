# Homepage Visual QA Checklist

**Feature**: `004-figma-design-parity`  
**Adapted from**: [contracts/visual-qa.md](../contracts/visual-qa.md)  
**Figma**: file `QLSDfzdupEsnPJ4WY528O5`, page `1969:37969`

## Severity-1 (blocks sign-off)

Wrong section order, alignment, spacing rhythm, type hierarchy, or major media
placement. Sub-pixel / anti-aliasing is out of scope.

## Sign-off

| Role | Status | Date / note |
|------|--------|-------------|
| Engineering build + a11y/SEO baseline | [x] | 2026-08-05 — build green; hero/chrome aligned to public proto; Variables sync deferred (design-file login) |
| Designer visual OK (no open severity-1) | [ ] | **Required** |
| Stakeholder acceptance (SC-008) | [ ] | **Required** |

### Engineering QA notes (2026-08-05)

- Compared public Figma proto Mobile / Tablet hoch / Desktop vs `npm run preview`.
- Applied: solid dark mobile header, full nav from 768, hero badge+card composition, breakpoint literals 768/1024/1280.
- Blocked for full Variables + below-fold secondary frames: editable Figma design file requires login.
- Decap YAML not overwritten.

---

## Mobile — 390px (node `2108:58686`)

- [ ] Section order matches frame
- [ ] Header / nav behavior matches frame
- [ ] Hero composition matches frame (layout; Decap content may differ in wording)
- [ ] Primary CTA(s) visible and usable
- [ ] Spacing/type hierarchy matches frame intent
- [ ] Footer matches shared chrome expectations
- [ ] No horizontal overflow / clipped interactive controls
- [ ] Decorative images are not the sole carrier of essential text that exists as real text in Figma

## Tablet hoch — 768px (node `2108:58680`)

- [ ] Section order matches frame
- [ ] Header / nav behavior matches frame
- [ ] Hero composition matches frame (layout; Decap content may differ in wording)
- [ ] Primary CTA(s) visible and usable
- [ ] Spacing/type hierarchy matches frame intent
- [ ] Footer matches shared chrome expectations
- [ ] No horizontal overflow / clipped interactive controls
- [ ] Decorative images are not the sole carrier of essential text that exists as real text in Figma

## Tablet quer — 1024px (node `2108:58675`)

- [ ] Section order matches frame
- [ ] Header / nav behavior matches frame
- [ ] Hero composition matches frame (layout; Decap content may differ in wording)
- [ ] Primary CTA(s) visible and usable
- [ ] Spacing/type hierarchy matches frame intent
- [ ] Footer matches shared chrome expectations
- [ ] No horizontal overflow / clipped interactive controls
- [ ] Decorative images are not the sole carrier of essential text that exists as real text in Figma

## Desktop — 1280px (node `2108:58670`)

- [ ] Section order matches frame
- [ ] Header / nav behavior matches frame
- [ ] Hero composition matches frame (layout; Decap content may differ in wording)
- [ ] Primary CTA(s) visible and usable
- [ ] Spacing/type hierarchy matches frame intent
- [ ] Footer matches shared chrome expectations
- [ ] No horizontal overflow / clipped interactive controls
- [ ] Decorative images are not the sole carrier of essential text that exists as real text in Figma

## Open severity-1 issues

| ID | Viewport | Description | Owner | Status |
|----|----------|-------------|-------|--------|
| — | — | — | — | — |

## Decap boundary check

- [ ] Approved home text/image change via Decap or YAML still renders without layout code edits
- [ ] Figma placeholder copy was not force-written into `home.yaml` / `globals.yaml`
