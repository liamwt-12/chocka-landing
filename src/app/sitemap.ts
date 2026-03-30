import { MetadataRoute } from 'next';
import { NE_TOWNS, TRADES, townSlug, tradeSlug } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://chocka.co.uk';
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  entries.push(
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/index`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 }
  );

  // Town hub pages
  for (const town of NE_TOWNS) {
    entries.push({
      url: `${baseUrl}/index/${townSlug(town)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Trade hub pages
  for (const trade of TRADES) {
    entries.push({
      url: `${baseUrl}/index/${tradeSlug(trade)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // League table pages
  for (const town of NE_TOWNS) {
    for (const trade of TRADES) {
      entries.push({
        url: `${baseUrl}/index/${townSlug(town)}/${tradeSlug(trade)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // Profile pages
  const { data: businesses } = await supabase
    .from('businesses')
    .select('slug, updated_at');

  if (businesses) {
    for (const biz of businesses) {
      entries.push({
        url: `${baseUrl}/index/profile/${biz.slug}`,
        lastModified: new Date(biz.updated_at),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
