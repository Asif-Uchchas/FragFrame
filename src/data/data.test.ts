import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { aboutHero, timeline } from './about';
import { jobOptions } from './contact';
import { homeSelection, heroStats, selectedWork } from './home';
import { contactProcess, homeProcess } from './process';
import { bySlugs, byKind, caseStudies, projects, projectBySlug } from './projects';
import { reel, chapters } from './reel';
import { addOns, plans, showPrices } from './services';
import { navLinks, footerLinks, primaryCta, site } from './site';
import { workStats } from './work';

const PUBLIC = path.join(process.cwd(), 'public');
const assetExists = (src: string) => existsSync(path.join(PUBLIC, src.replace(/^\//, '')));

/**
 * These guard the edits a non-developer is most likely to make: adding a piece
 * of work, swapping an image, reordering the home page. Every one of them
 * would otherwise fail silently or only at runtime.
 */
describe('project archive', () => {
  it('has unique slugs', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('uses url-safe slugs', () => {
    for (const project of projects) {
      expect(project.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('points every image at a file that exists on disk', () => {
    for (const project of projects) {
      expect(assetExists(project.image), `${project.slug} → ${project.image}`).toBe(true);
    }
  });

  it('gives every image descriptive alt text', () => {
    for (const project of projects) {
      expect(project.alt.length, project.slug).toBeGreaterThan(4);
      // Alt text describing itself as an image is noise for a screen reader.
      expect(project.alt.toLowerCase()).not.toMatch(/^(image|picture|photo) of/);
    }
  });

  it('has at most one featured piece — two would both claim the full grid row', () => {
    expect(projects.filter((p) => p.featured)).toHaveLength(1);
  });

  it('gives the featured piece the wide aspect it is designed for', () => {
    expect(projects.find((p) => p.featured)?.aspect).toBe('32/9');
  });

  it('matches the "Eleven pieces" claim in the approved copy', () => {
    expect(projects).toHaveLength(11);
    expect(selectedWork.body).toContain('Eleven');
  });

  it('agrees with the piece count advertised on the Work page', () => {
    const advertised = workStats.find((s) => s.label === 'pieces')?.value;
    expect(Number(advertised)).toBe(projects.length);
  });

  it('advertises the right number of distinct games', () => {
    const advertised = workStats.find((s) => s.label === 'titles')?.value;
    const games = new Set(projects.map((p) => p.game));
    expect(Number(advertised)).toBe(games.size);
  });

  it('sorts every piece into exactly one filter tab', () => {
    const counts = (['montage', 'poster', 'ad'] as const).map((kind) => byKind(kind).length);
    expect(counts.reduce((a, b) => a + b, 0)).toBe(projects.length);
  });

  it('gives montages a duration and posters none', () => {
    for (const project of byKind('montage')) {
      expect(project.duration, project.slug).toMatch(/^\d+:\d{2}$/);
    }
    for (const project of byKind('poster')) {
      expect(project.duration, project.slug).toBeUndefined();
    }
  });

  it('uses only youtube ids of the right shape, when present', () => {
    for (const project of projects) {
      if (project.youtubeId) expect(project.youtubeId).toMatch(/^[\w-]{11}$/);
    }
  });
});

describe('case studies', () => {
  it('has at least one', () => {
    expect(caseStudies().length).toBeGreaterThan(0);
  });

  it('references only images that exist', () => {
    for (const project of caseStudies()) {
      const study = project.caseStudy!;
      expect(assetExists(study.heroImage), study.heroImage).toBe(true);
      expect(assetExists(study.grade.image), study.grade.image).toBe(true);
      for (const step of study.build) {
        expect(assetExists(step.image), step.image).toBe(true);
      }
    }
  });

  it('has a complete two-line title, a lead and facts', () => {
    for (const project of caseStudies()) {
      const study = project.caseStudy!;
      expect(study.titleLines).toHaveLength(2);
      expect(study.titleLines.every(Boolean)).toBe(true);
      expect(study.lead.length).toBeGreaterThan(20);
      expect(study.facts.length).toBeGreaterThan(0);
      expect(study.outcome.length).toBeGreaterThan(0);
    }
  });

  it('points its CTA at a real internal route', () => {
    for (const project of caseStudies()) {
      expect(project.caseStudy!.cta.href).toMatch(/^\//);
    }
  });

  it('resolves by slug', () => {
    for (const project of caseStudies()) {
      expect(projectBySlug(project.slug)).toBe(project);
    }
  });

  it('returns undefined for an unknown slug rather than throwing', () => {
    expect(projectBySlug('no-such-piece')).toBeUndefined();
  });
});

describe('curated selections', () => {
  it('resolves every slug the home page asks for', () => {
    for (const [kind, slugs] of Object.entries(homeSelection)) {
      expect(bySlugs(slugs), kind).toHaveLength(slugs.length);
    }
  });

  it('only puts pieces in the tab they belong to', () => {
    for (const [kind, slugs] of Object.entries(homeSelection)) {
      for (const project of bySlugs(slugs)) {
        expect(project.kind, project.slug).toBe(kind);
      }
    }
  });

  it('resolves every slug the reel asks for', () => {
    expect(bySlugs(reel.fullCuts.slugs)).toHaveLength(reel.fullCuts.slugs.length);
  });

  it('drops unknown slugs instead of rendering a hole', () => {
    expect(bySlugs(['nope', 'radiant-run-act-iii'])).toHaveLength(1);
  });
});

describe('reel', () => {
  it('has chapters with unique ids', () => {
    const ids = chapters.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('uses valid timecodes that exist within the runtime', () => {
    const seconds = (t: string) => t.split(':').map(Number).reduce((a, b) => a * 60 + b, 0);
    const total = seconds(reel.runtime);
    for (const chapter of chapters) {
      expect(chapter.start, chapter.id).toMatch(/^\d+:\d{2}$/);
      expect(seconds(chapter.start), chapter.id).toBeLessThan(total);
    }
  });

  it('orders chapters by start time', () => {
    const seconds = (t: string) => t.split(':').map(Number).reduce((a, b) => a * 60 + b, 0);
    const starts = chapters.map((c) => seconds(c.start));
    expect([...starts].sort((a, b) => a - b)).toEqual(starts);
  });

  it('starts the first chapter at zero', () => {
    expect(chapters[0]?.start).toBe('0:00');
  });

  it('points every chapter still at a real file', () => {
    for (const chapter of chapters) {
      expect(assetExists(chapter.image), chapter.image).toBe(true);
    }
  });
});

describe('pricing', () => {
  it('keeps prices hidden while the numbers are unconfirmed', () => {
    // A deliberate guard: flipping this on with placeholder numbers would
    // publish prices Ahad never agreed to.
    expect(showPrices).toBe(false);
  });

  it('carries both currencies for every plan and both billing modes', () => {
    for (const plan of plans) {
      for (const mode of ['once', 'retainer'] as const) {
        expect(plan[mode].price.usd, `${plan.title} ${mode}`).toBeGreaterThan(0);
        expect(plan[mode].price.bdt, `${plan.title} ${mode}`).toBeGreaterThan(0);
        expect(plan[mode].bullets.length).toBeGreaterThan(0);
        expect(plan[mode].unit).toBeTruthy();
      }
    }
  });

  it('prices the retainer per unit below the one-off rate, as "save 15%" claims', () => {
    // Retainers advertise a discount; a retainer that costs more per piece
    // than buying one-off would make the toggle label a lie.
    const units = { 0: 4, 1: 6, 2: 4 } as Record<number, number>;
    plans.forEach((plan, index) => {
      const perPiece = plan.retainer.price.usd / units[index]!;
      expect(perPiece, plan.title).toBeLessThan(plan.once.price.usd);
    });
  });

  it('carries both currencies for numeric add-ons', () => {
    for (const addOn of addOns) {
      if (typeof addOn.price !== 'string') {
        expect(addOn.price.usd).toBeGreaterThan(0);
        expect(addOn.price.bdt).toBeGreaterThan(0);
      }
    }
  });

  it('flags exactly one plan as most booked', () => {
    expect(plans.filter((p) => p.featured)).toHaveLength(1);
  });
});

describe('site identity', () => {
  it('has a whatsapp number that is digits only with a country code', () => {
    expect(site.contact.whatsapp).toMatch(/^\d{10,15}$/);
  });

  it('has a plausible email address', () => {
    expect(site.contact.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('has an absolute url with no trailing slash, so sitemap joins cleanly', () => {
    expect(site.url).toMatch(/^https?:\/\//);
    expect(site.url.endsWith('/')).toBe(false);
  });

  it('points the avatar and portrait at real files', () => {
    expect(assetExists(site.avatar.src), site.avatar.src).toBe(true);
    expect(assetExists(site.portrait.src), site.portrait.src).toBe(true);
  });

  it('uses only internal, root-relative nav links', () => {
    for (const link of [...navLinks, ...footerLinks, primaryCta]) {
      expect(link.href, link.label).toMatch(/^\//);
    }
  });

  it('has no duplicate nav destinations', () => {
    const hrefs = navLinks.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it('keeps a description short enough for search results', () => {
    expect(site.description.length).toBeLessThanOrEqual(200);
    expect(site.description.length).toBeGreaterThan(50);
  });
});

describe('page content', () => {
  it('has four hero stats and three work stats, matching the fixed grid tracks', () => {
    // Both grids use fixed track counts, so an extra entry would overflow.
    expect(heroStats).toHaveLength(4);
    expect(workStats).toHaveLength(3);
  });

  it('has four process steps on both Home and Contact', () => {
    expect(homeProcess).toHaveLength(4);
    expect(contactProcess).toHaveLength(4);
  });

  it('numbers the process steps in order', () => {
    homeProcess.forEach((step, index) => {
      expect(step.marker).toBe(`STEP 0${index + 1}`);
    });
  });

  it('offers a job option for each kind, each with helper copy', () => {
    expect(jobOptions.map((o) => o.id).sort()).toEqual(['ad', 'montage', 'thumbnail']);
    for (const option of jobOptions) {
      expect(option.helper.length).toBeGreaterThan(20);
      expect(option.briefPlaceholder.length).toBeGreaterThan(10);
    }
  });

  it('has a timeline ending in the present', () => {
    expect(timeline.length).toBeGreaterThan(2);
    expect(timeline.at(-1)?.marker).toBe('Now');
  });

  it('writes about copy in the first person, as the approved voice does', () => {
    expect(aboutHero.paragraphs[0]).toMatch(/\bI\b/);
  });
});
