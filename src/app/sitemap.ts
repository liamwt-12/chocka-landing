import { MetadataRoute } from 'next';
import { NE_TOWNS, TRADES, townSlug, tradeSlug } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://chocka.co.uk';
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  entries.push(
    { url: baseUrl, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/index`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/for-tradespeople`, lastModified, changeFrequency: 'monthly', priority: 0.8 }
  );

  // Town hub pages
  for (const town of NE_TOWNS) {
    entries.push({
      url: `${baseUrl}/index/${townSlug(town)}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Trade hub pages
  for (const trade of TRADES) {
    entries.push({
      url: `${baseUrl}/index/${tradeSlug(trade)}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // League table pages (15 towns × 20 trades)
  for (const town of NE_TOWNS) {
    for (const trade of TRADES) {
      entries.push({
        url: `${baseUrl}/index/${townSlug(town)}/${tradeSlug(trade)}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
