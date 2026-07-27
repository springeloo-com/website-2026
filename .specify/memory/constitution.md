<!--
Sync Impact Report
- Version change: (uninitialized template) → 1.0.0
- Modified principles: N/A (initial ratification from docs/constitution.md)
  - Placeholders [PRINCIPLE_1–5] replaced by fifteen Springeloo principles
- Added sections:
  - Mission
  - Development Workflow
  - Governance (with amendment, versioning, compliance rules)
- Removed sections: N/A (template placeholders only)
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check gates)
  - ✅ .specify/templates/spec-template.md (design/responsive/a11y/SEO constraints)
  - ✅ .specify/templates/tasks-template.md (Astro paths + quality-gate polish tasks)
  - ✅ .specify/templates/constitution-template.md (unchanged; source of future resets)
  - ⚠ .specify/templates/commands/*.md (none present)
  - ⚠ README.md (stub only; project guidance deferred)
- Follow-up TODOs: None
-->
# Springeloo Website Constitution

## Core Principles

### I. Design-First Source of Truth
The approved Figma export is the visual source of truth. SPEC.md is the
implementation source of truth and MUST be derived from the Figma export before
coding begins. If design and code conflict, update the spec and reconcile the
implementation — do not improvise.

**Rationale**: Prevents visual drift and keeps implementation decisions
traceable to an approved design.

### II. Static-First Architecture
The website MUST remain static by default. Use Astro to produce lean HTML, CSS,
and only minimal JavaScript when truly required. Do not introduce WordPress, a
database, a CMS, or backend services unless explicitly approved later.

**Rationale**: Keeps delivery simple, fast, and compatible with GitHub Pages.

### III. Figma-to-Spec Discipline
Do not convert Figma directly into production code without an intermediate
SPEC.md. All Figma-derived information MUST be organized into sections,
components, tokens, breakpoints, and acceptance criteria before implementation
starts. The goal is faithful translation, not creative redesign.

**Rationale**: Normalizes design into explicit, reviewable requirements.

### IV. Reusable Component Structure
Every repeated visual pattern MUST become a reusable Astro component. Layout,
navigation, buttons, cards, hero sections, and footer content MUST be
implemented modularly so the site can be maintained without duplicating markup.

**Rationale**: Reduces duplication and makes Cursor-driven edits safer.

### V. Responsive Parity
Desktop, tablet, and mobile behavior MUST be explicitly represented in the spec
and implemented in code. Layout changes across breakpoints MUST follow the
Figma export, not arbitrary framework defaults. Responsive behavior is a
required deliverable, not an afterthought.

**Rationale**: Ensures the shipped site matches approved layouts at every
viewport.

### VI. Accessibility by Default
All generated work MUST follow accessible HTML and CSS practices. Use semantic
landmarks, heading order, keyboard navigation, visible focus states, and
meaningful alt text. Do not ship text-only image content when real text is
possible.

**Rationale**: Accessibility is a baseline quality requirement, not optional
polish.

### VII. SEO-Ready Output
The site MUST ship with correct metadata, page titles, descriptions, canonical
URLs, Open Graph tags, and clean heading structure. The implementation MUST
support search visibility and professional sharing from day one.

**Rationale**: Corporate sites need discoverability and shareable previews
without a later retrofit.

### VIII. Minimal Dependency Policy
Prefer built-in browser features, plain CSS, and Astro-native patterns over
additional libraries. New dependencies require a clear reason and MUST be
justified against maintenance cost, bundle size, and long-term support.

**Rationale**: Fewer dependencies mean a smaller attack surface and easier
handover.

### IX. GitHub Pages Delivery
The site MUST deploy to GitHub Pages as the default hosting target. The repo,
build pipeline, and folder structure MUST be compatible with static deployment
and GitHub Actions. Production delivery MUST stay simple enough for small-team
maintenance.

**Rationale**: Matches the approved hosting constraint and keeps ops light.

### X. Spec-Driven Implementation Order
Implementation MUST follow the spec workflow: analyze Figma export, write
SPEC.md, plan the work, then implement task by task. Do not jump directly into
code generation before the design has been normalized into explicit
requirements.

**Rationale**: Spec-first work prevents unscoped coding and rework.

### XI. Cursor-Friendly Workflow
The codebase MUST be organized so Cursor can work safely and predictably in
small steps. Instructions MUST live in project-level documentation and clear
task files. Changes SHOULD be made one component or one page section at a time.

**Rationale**: Predictable structure improves agent accuracy and reviewability.

### XII. Maintainability over Novelty
Choose solutions that are easy to understand, debug, and hand over later. Avoid
clever abstractions, experimental architecture, or unnecessary animation unless
the Figma design clearly requires it.

**Rationale**: Longevity and clarity beat cleverness for a corporate site.

### XIII. Asset Hygiene
Only export and commit assets that are required for production. Optimize
images, prefer SVG for logos and icons, and keep filenames and folders
predictable. Generated files MUST not be confused with source files.

**Rationale**: Keeps the repo lean and deployment artifacts unambiguous.

### XIV. No Silent Assumptions
If the Figma export or spec is unclear, stop and record the uncertainty instead
of inventing content, layout, or interactions. Ambiguities MUST be resolved
before implementation proceeds.

**Rationale**: Invented details create design debt and false confidence.

### XV. Quality Gate
A feature is not complete until it matches the spec, builds successfully, and
is visually checked against the Figma export. The final result MUST be
consistent, responsive, accessible, and ready for static deployment.

**Rationale**: Completion means verified fidelity, not merely compiling code.

## Mission

Build and maintain a static, polished, and fast corporate website for
Springeloo using a spec-driven workflow. The site MUST translate the approved
Figma design into an Astro implementation that is easy to maintain, deploy, and
evolve, and MUST be hosted on GitHub Pages.

## Development Workflow

1. Analyze the approved Figma export.
2. Write or update SPEC.md (sections, components, tokens, breakpoints,
   acceptance criteria).
3. Plan implementation tasks from the spec.
4. Implement task by task — one component or page section at a time.
5. Resolve any recorded ambiguities before continuing.
6. Pass the quality gate: spec match, successful build, visual check vs Figma,
   responsive/accessibility/SEO readiness, static-deploy readiness.

Complexity Tracking in plans MUST justify any deviation from static-first,
minimal-dependency, or GitHub Pages constraints.

## Governance

This constitution supersedes conflicting informal practices for this project.
Amendments MUST be documented in `.specify/memory/constitution.md` with an
updated version, last-amended date, and Sync Impact Report. Dependent templates
and guidance MUST be reviewed for consistency when principles change.

Versioning policy:
- MAJOR: Backward-incompatible principle removals or redefinitions
- MINOR: New principle/section or materially expanded guidance
- PATCH: Clarifications, wording, and non-semantic refinements

Compliance review expectations:
- Plans MUST pass the Constitution Check before research/design proceeds
- Specs MUST encode Figma-derived requirements without silent assumptions
- Tasks MUST reflect spec-driven order and quality-gate completion criteria
- PRs and reviews MUST verify compliance with these principles; unjustified
  complexity or new dependencies MUST be rejected or explicitly approved

**Version**: 1.0.0 | **Ratified**: 2026-07-27 | **Last Amended**: 2026-07-27
