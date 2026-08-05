# Token Sync Note (T007)

**Date**: 2026-08-05

## Access

- Public **prototype** frames are readable (visual QA).
- Editable **design file** (`/design/...`) requires Figma login — Variables panel /
  MCP extract unavailable in this agent session.

## Decision

Keep the existing Figma-derived system in `src/styles/tokens.css` as the active
Design Token Set for this pass. Prototype inspection confirms brand blue, navy
chrome, cream surfaces, white type on hero, and Figtree-adjacent sans usage
align with current tokens (no invented replacement palette).

## Follow-up (when design-file auth available)

1. Diff Figma Variables → `tokens.css` / `breakpoints.css`.
2. Replace any drifted component hardcodes found in that pass.
3. Re-run four-width visual QA.
