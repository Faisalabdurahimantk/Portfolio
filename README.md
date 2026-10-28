# Faisal Abdurahiman — Portfolio

An immersive, scroll-driven portfolio: a grey studio with weathered marble
columns on a moss mound, fog that parts as you scroll, and editorial sections
for About, Selected Work and Contact.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run lint
npm run assets     # regenerate the sculpture SVGs in public/sculpture
```

## Edit content

| What | Where |
| --- | --- |
| Name, email, LinkedIn, résumé PDF | `src/data/site.ts` |
| Projects (title, category, summary, focus, role, year, case-study link, cover image, layout) | `src/data/projects.ts` |
| Sculpture layers (swap any SVG for a transparent WebP/PNG) | `src/data/assets.ts` |

- `linkedinUrl: null` hides the LinkedIn link.
- `resumeUrl: null` makes every "Resume" link open a pre-filled email request.
  Put a PDF in `public/` (e.g. `public/resume.pdf`) and set `resumeUrl: '/resume.pdf'`.
- `caseStudyUrl: null` turns a project link into "Request case study" (email).
- `cover` replaces the generated sculptural artwork with a real project image.

## Fonts (Season by Displaay)

Typography uses **Season Mix** (titling), **Season Serif** (editorial lines)
and **Season Sans** (UI/body), declared in `src/styles/fonts.css`.

The font files are **not in this repository**: the trial licence allows
personal/internal use only, so `public/fonts/season/` is git-ignored. To see
them locally, copy the WOFF2 files from the Season download into
`public/fonts/season/` (flat, e.g. `public/fonts/season/SeasonMix-TRIAL-Bold.woff2`).
Without them the site falls back to Montserrat / Cormorant Garamond.

Before deploying publicly, buy a Season web licence from Displaay, add the
licensed WOFF2 files, update the file names in `fonts.css`, and remove the
ignore rule.

## Structure

```
src/
  components/   Navigation, SculptureHero, FogLayers, StoryTransition,
                AboutSection, ProjectShowcase, ProjectItem, ProjectPlate,
                ForestInterlude, ContactSection, Footer, …
  lib/          gsap.ts (plugin registration + matchMedia queries),
                smoothScroll.ts (Lenis ↔ ScrollTrigger),
                storyTimeline.ts (hero scene timelines)
  data/         site.ts, projects.ts, assets.ts
  hooks/        useReducedMotion.ts
  styles/       global.css, animations.css
scripts/        generate-sculptures.mjs
```

## Motion

- Each scene builds its own GSAP timelines inside `gsap.matchMedia()`, so
  desktop, tablet, mobile and `prefers-reduced-motion` get appropriate motion
  and everything is reverted on unmount or breakpoint change.
- The hero pins once; a single scrubbed master timeline nests the
  camera-approach and story-transition timelines. The About section is pulled
  up one viewport so it slides over the pinned stage, led by its drapery edge.
- With reduced motion there are no pins or scrubs and all content is static.
