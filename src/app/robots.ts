import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/'],
      // Never disallow /_next — Next.js CSS/JS and /_next/image must remain crawlable.
      // Blocking it causes Semrush "Blocked internal resources" and can hurt rendering/indexing signals.
      disallow: ['/admin', '/api'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
