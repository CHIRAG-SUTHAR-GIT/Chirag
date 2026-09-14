import type { MetadataRoute } from 'next';
import { site } from '@/lib/data/site';
import { projects } from '@/lib/data/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${site.url}/work`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/resume`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];
  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${site.url}/work/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  return [...staticPages, ...projectPages];
}
