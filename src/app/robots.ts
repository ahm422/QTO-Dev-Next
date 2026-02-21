import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/'],
      disallow: ['/admin', '/api', '/_next'],
    },
    sitemap: 'https://qtodev.com/sitemap.xml',
  };
}
