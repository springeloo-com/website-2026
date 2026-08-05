# Secondary page inventory (MCP 2026-08-05)

File: `lhqqJkipcRchejNEqQ1ehb`. All four bands fetched for
`/projektunterstuetzung` and `/produkte`. Node IDs live in
`contracts/figma-source.md` / `src/lib/breakpoints.ts`.

**CMS**: layout from Figma; do not overwrite Decap/globals with placeholder
copy unless fields already exist.

---

## `/projektunterstuetzung`

| Band | Node |
|------|------|
| Desktop | `2109:78610` |
| Tablet quer | `2109:91361` |
| Tablet hoch | `2109:104987` |
| Mobile | `2109:114324` |

### Section order (desktop)

1. **Header-image-01** — full-bleed office photo; H1  
   “Inspiration schafft Ideen, Unternehmenskultur treibt Innovation.”  
   Transparent cream nav.
2. **Intro (cream)** — large blue lead + supporting grey body  
   (“Wir finden Menschen… Senior Experten…”).
3. **Kompetenzen band (blue)** — “Aufbau von Kompetenzen der Projektmitarbeiter”  
   Left vertical tabs + right detail panel + image:
   - Programmleitung + Projektleitung (active)
   - Analyse + Architektur
   - Testing
   - Systemadministration
   - Neues Rollen + Prompting
4. **Arguments-01 (cream)** — “Outside the box Denken, in etablierten Frameworks handeln”  
   Focus topics + **4 icon pillars**: Strukturelle Unterstützung, Fokus
   Transformation, Ganzheitlicher Ansatz, Innovationstreiber.
5. **Merkmale-01 (cream)** — “Customized Solutions durch ein Netzwerk an Wissensträgern”  
   + Merkmale carousel (“Zentrale Merkmale…”, e.g. Fokus auf Open Source).
6. **blue-box-01** — “Netzwerke in den Branchen die Technologie vorantreibt”  
   Columns: BFSI / Public & Healthcare / IT, Infrastruktur & Energie.
7. **CTA (dark)** — “Investieren Sie in den nächsten Schritt…” + Kontakt button.
8. **Footer (cream)** — shared site footer.

Responsive: same section stack; tabs/columns collapse on tablet hoch / mobile
(stacked panels, full-width media).

---

## `/produkte`

| Band | Node |
|------|------|
| Desktop | `2109:78612` |
| Tablet quer | `2109:91363` |
| Tablet hoch | `2109:116435` |
| Mobile | `2109:114326` |

### Section order (desktop) — dark theme (`#1d2228` / `#3c444d`)

1. **Header-slider-01** — dark product hero / slider chrome.
2. **picture-intro** — H2  
   “Aufbau von Kompetenz für und durch neue Werkzeuge — Transformation als Philosophie.”  
   + side image.
3. **Single-text** — “DIGITALE TRANSFORMATION” / products intro  
   “Digitale Produkte, basierend fokussiert auf Transformation…”
4. **Product block ×3** (each: `product-start` → device mock → `3xfunctions` → `name-text`):

| Product | Category label | Features (examples) | Accordion / Nutzen |
|---------|----------------|---------------------|--------------------|
| **spring id.a2** | Identity Management | 3 feature columns + icons | Touchpoint Management, Kundenservice-Tools, Nahtlose Migration (SuiteCRM-related accordion appears in file) |
| **spring suiteCRM** | CRM | Keine Lizenzkosten, DSGVO, Open-Source | Nutzen copy + list |
| **Host Ablöse** | Host modernization | Hohe Datensicherheit, De-Kapitalisierung, Moderne UI | Nutzen copy + list |

5. **Open Source / Digitale Souveränität** band (visual + logo).
6. **CTA (dark)** — same invest/Kontakt pattern as other subpages.
7. **Footer (cream)**.

Responsive: product stacks vertical; 3-up features → 1 column on mobile;
device mockups scale down.

---

## Assets to pull before implementation

- Hero / office photos for Projektunterstützung
- Tab detail photo(s)
- 4 framework icons
- Product device mockups (id.a2, SuiteCRM, Host Ablöse)
- Product logos (IDA etc.)
- Open-source / sovereignty visual

Prefer download-and-commit under `public/uploads/` (MCP asset URLs expire ~7 days).

---

## Implementation priority

1. `/produkte` desktop (dark, three product modules) — largest gap vs current thin page  
2. `/projektunterstuetzung` desktop (tabs + frameworks + Branchen)  
3. Responsive pass at 1024 / 768 / 390 using the fetched band nodes
