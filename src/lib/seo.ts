import { Metadata } from 'next';

interface SEOMetadataProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
}

export function generateSEOMetadata(props: SEOMetadataProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qtodev.com';
  const imageUrl = props.image || `${baseUrl}/og/default.png`;
  const url = props.url ? `${baseUrl}${props.url}` : baseUrl;

  const og: any = {
    title: props.title,
    description: props.description,
    url: url,
    images: [{ url: imageUrl }],
    type: props.publishedAt ? 'article' : 'website',
  };

  if (props.publishedAt) {
    og.publishedTime = props.publishedAt;
  }
  if (props.updatedAt) {
    og.modifiedTime = props.updatedAt;
  }
  if (props.author) {
    og.authors = [props.author];
  }

  return {
    title: props.title,
    description: props.description,
    openGraph: og,
    twitter: {
      card: 'summary_large_image',
      title: props.title,
      description: props.description,
      images: [imageUrl],
    },
  };
}
