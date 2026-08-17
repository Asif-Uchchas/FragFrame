import type { MetadataRoute } from 'next';
import { caseStudies } from '@/data/projects';
import { site } from '@/data/site';

/** Static pages plus one entry per case study. New case studies appear here
 *  automatically when they are added to data/projects.ts. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = ['', '/work', '/reel', '/services', '/about', '/contact'].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const studies = caseStudies().map((project) => ({
    url: `${site.url}/work/${project.slug}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [...pages, ...studies];
}
