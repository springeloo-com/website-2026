# Decap Boundary Confirmation (T005)

**Date**: 2026-08-05  
**Contract**: [cms-boundary.md](../contracts/cms-boundary.md)

## Confirmed rules for this implementation

1. Do **not** overwrite `src/content/pages/home.yaml` or `src/content/site/globals.yaml` with Figma placeholder copy/images.
2. Layout/composition changes land in `.astro` / CSS / components only.
3. Keep `src/lib/content.ts` validation (e.g. three Leistungen cards).
4. Expand `public/admin/config.yml` only if design introduces a **new** editable copy/image need.

## New editable fields implied by current Figma review

| Candidate | Decision |
|-----------|----------|
| Hero / Leistungen / globals fields already in Decap | Keep as-is |
| New section copy visible only in Figma and not in YAML | **None identified yet** from public prototype — revisit after design-file Variables/structure pass if new sections appear |

## Note

Editable design file requires Figma login; prototype is sufficient for visual QA reference. Content authority remains Decap.
