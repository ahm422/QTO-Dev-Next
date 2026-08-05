import { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

interface SEOMetadataProps {
  title: string;
  description: string;
  image?: string;
  /** Path relative to site root, e.g. `/careers` or `/`. Used for canonical + OG url. */
  url?: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  robots?: Metadata['robots'];
}

/** Build an absolute URL from SITE_URL + path (leading slash optional). */
export function absoluteUrl(path: string = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized === '/') return SITE_URL;
  return `${SITE_URL.replace(/\/$/, '')}${normalized}`;
}

function clampMeta(text: string, max: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  const cut = trimmed.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[.,;:\s]+$/, '')}…`;
}

export function generateSEOMetadata(props: SEOMetadataProps): Metadata {
  const title = clampMeta(props.title, TITLE_MAX);
  const description = clampMeta(props.description, DESCRIPTION_MAX);
  const imageUrl = props.image || absoluteUrl('/og/default.png');
  const canonical = props.url !== undefined ? absoluteUrl(props.url) : undefined;

  const og: Metadata['openGraph'] = {
    title,
    description,
    url: canonical ?? SITE_URL,
    images: [{ url: imageUrl }],
    type: props.publishedAt ? 'article' : 'website',
    ...(props.publishedAt ? { publishedTime: props.publishedAt } : {}),
    ...(props.updatedAt ? { modifiedTime: props.updatedAt } : {}),
    ...(props.author ? { authors: [props.author] } : {}),
  };

  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(props.robots !== undefined ? { robots: props.robots } : {}),
    openGraph: og,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}
