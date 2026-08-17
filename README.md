# FragFrame

A portfolio site for video editors and visual artists — built as a **reusable template**, not a one-off.

The first build is [Ahad Akib](https://ahadakib.com), a gameplay editor working out of Dhaka: montages, thumbnails and posters, ad cuts. Everything that makes it *his* site lives in data files and CSS tokens, so the same codebase re-skins for the next person in an afternoon.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · hand-written CSS Modules · zero runtime dependencies beyond the framework.

---

## Quick start

```bash
npm install
```

```bash
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

---

## Re-skinning it for someone else

Four steps, in order of how much they matter.

### 1. Identity → `src/data/site.ts`

Name, wordmark, role, description, domain, location, availability badge, contact routes (email, WhatsApp, Discord, Upwork, Fiverr), navigation, marquee titles, tools list. Nothing brand-specific is hardcoded in a component — change it here and it changes everywhere.

### 2. Images → `public/assets/`

Drop in replacements and update the paths in `src/data/`. Two notes carried over from the original handoff:

- `logo-mark.jpg` is pushed into the red palette with a CSS `hue-rotate(105deg)` filter (the source art is purple). Supply a properly recoloured source and delete the filter in `Header.module.css`, `Footer.module.css` and `page.module.css`.
- `portrait.jpg` is rendered with `saturate(.55) contrast(1.1) brightness(.9)`. Same story — prefer a graded original.

### 3. Colour and type → `src/app/globals.css`

The entire visual identity is the `:root` block at the top: ~17 colours, the alpha rules, the fluid type scale, spacing, glow values and animation timings. It is deliberately the only place colours are defined.

The design is a committed dark theme. There is no light mode and no `prefers-color-scheme` swap.

### 4. Content → `src/data/`

| File | Drives |
| --- | --- |
| `site.ts` | Identity, nav, contact routes, availability, marquee, tools |
| `projects.ts` | **The work archive** — one array behind the Home grids, the Work index and every case study |
| `home.ts` | Home hero, stats, section headings, the curated Home selection, CTA bands |
| `work.ts` | Work and Services page headers |
| `services.ts` | Service cards, plan tiers, prices, add-ons, FAQ |
| `about.ts` | Bio, timeline, working method |
| `reel.ts` | Reel runtime, chapters, "full cuts" selection |
| `contact.ts` | Job-type picker copy |
| `process.ts`, `testimonials.ts` | Process steps, client quotes |

---

## How the interesting parts work

### One archive, three surfaces

`src/data/projects.ts` is the single source of truth. A project entry decides its own behaviour:

```ts
{
  slug: 'roster-reveal-split-two',
  kind: 'montage',          // which filter tab it lands in
  aspect: '32/9',           // card shape
  featured: true,           // spans the full grid row
  youtubeId: 'dQw4w9WgXcQ', // optional → the card becomes a player
  caseStudy: { … },         // optional → generates /work/<slug>
}
```

Add a piece and it appears on Home, on Work, under the right tab, with a case-study route if it has one. Band counts ("// montages — 5") are derived, so they can never drift.

Home shows a *curated* subset in a hand-picked order — see `homeSelection` in `home.ts`. That is separate from the archive on purpose: the featured 32:9 card sits fourth on Home as a mid-grid break, but first on the Work index.

### Video without video files

No media is committed to this repo and none is self-hosted. A project with no `youtubeId` shows its still. Add one and the card becomes a **click-to-load facade**: the poster stays, and the YouTube iframe is only injected when someone presses play. An unplayed card costs zero requests, ships no YouTube JS and sets no cookies. Embeds use `youtube-nocookie.com`.

The reel player works the same way and seeks per chapter using each chapter's timecode.

### The contact form has no backend

It validates locally, then packs the answers into a **WhatsApp** (`wa.me`) or **email** (`mailto:`) message that the visitor sends themselves. No API keys, no third-party form processor holding client briefs, nothing to keep running — and the sender keeps a copy in their own sent messages.

Set `site.contact.whatsapp` to digits only, including country code (`8801…`).

### Pricing: two currencies, one flag

Ahad bills clients in Bangladesh and abroad, so prices are stored as `{ usd, bdt }` pairs — entered by hand, never converted at runtime, because a hardcoded exchange rate goes stale silently.

The default currency is guessed from the browser's timezone and language (`Asia/Dhaka` or a `bn` locale → BDT) and then **always overridable** by a visible ৳/$ toggle, remembered in `localStorage`. No IP geolocation: it needs a paid service, it is wrong behind VPNs, and the visitor cannot correct it.

**Prices are currently hidden.** `showPrices` in `src/data/services.ts` is `false`, so the plan cards show a "Quote in 24h" CTA instead of unconfirmed numbers. Replace the placeholder figures and flip that flag — that is the entire change.

### The chamfer

No `border-radius` anywhere. The signature notched corner is one utility in `globals.css`:

```css
.chamfer {
  clip-path: polygon(0 0, calc(100% - var(--notch)) 0, 100% var(--notch),
                     100% 100%, var(--notch) 100%, 0 calc(100% - var(--notch)));
}
```

Callers set `--notch` (9px badge → 20px form panel). The hairline grids work the same way: the grid's background is the accent tint, cells are the page ground, and a 1px gap lets the tint through as a rule.

### Rendering

Every page is a server component. There are exactly four client islands:

| Island | Why |
| --- | --- |
| `Header` | Active link + mobile drawer |
| `TabPanels` | Home filter — receives server-rendered grids as props, so the cards stay server components |
| `ReelPlayer` | Chapter state |
| `Pricing` | Plan + currency state |
| `BriefForm` | Field state and validation |

The Work filter is **not** a client component at all — the tabs are real links driven by `?filter=`, so filtered views are shareable, the back button works, and it functions with JavaScript off.

---

## Accessibility

The design prototypes omitted several things that are not optional. Added here:

- `:focus-visible` rings on every interactive element (chamfered elements get an inset glow ring, since `clip-path` crops a normal outline)
- A full `prefers-reduced-motion` block — the marquee and pulsing glows stop rather than merely slowing
- A skip link
- Real ARIA tabs on the Home filter, with arrow-key navigation
- Inline form errors wired via `aria-invalid` / `aria-describedby`, with focus moved to the first invalid field
- A mobile nav drawer with focus trap, Escape-to-close and scroll lock (the prototypes just let the nav wrap)
- Mono labels under 11px lifted from `#7d7d89` to `#9b9ba6` for contrast

---

## Deviations from the design handoff

Recorded deliberately, all reversible:

1. **Two Home-only cards dropped.** The Home prototype showed "Season Finale" and "Low-latency, loud", which were absent from the Work archive — keeping them would have made the approved "Eleven pieces" copy untrue. Re-add them to `projects.ts` if wanted.
2. **Services lead drops "in USD."** The currency is now switchable, so naming one currency directly above a ৳/$ toggle would contradict it.
3. **Reel "full cuts" reuse archive labels** rather than the prototype's per-page relabelling of the same pieces.
4. **WhatsApp added as a contact route**, per the brief for this build.
5. **Three supplied assets had wrong extensions or were oversized.** `val-2.jpg` was WebP data (renamed `.webp`); `portrait.jpg` was a PNG with a fully-opaque alpha channel; `logo-mark.png` was a 2.5MB PNG, also fully opaque. All re-encoded by `npm run optimise-images` — `public/assets` went from 5.9MB to 1.5MB with no visible loss.
6. **Nav includes Reel.** The handoff's shared-chrome section listed Work/Services/About, but every prototype page except Home also linked Reel.

---

## Before launch

- [ ] Real contact details in `src/data/site.ts` (email, WhatsApp number, Discord, Upwork, Fiverr, YouTube) — all currently placeholders
- [ ] Real domain in `site.url` (drives canonical URLs, sitemap, OG)
- [ ] Confirmed prices in `src/data/services.ts`, then `showPrices = true`
- [ ] Reel `youtubeId` in `src/data/reel.ts` once the master is uploaded
- [ ] Recoloured `logo-mark.jpg` and graded `portrait.jpg` to drop the CSS filters

---

## Credits

Design: "Redline" handoff — colours, type, spacing, copy and interaction states are from that spec and reproduced faithfully.
