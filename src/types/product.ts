export interface ProductFeature {
  name: string;
  description: string;
  icon?: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  shortDescription?: string;
  description: string;
  statusLabel?: string;
  titleHighlight?: string;
  image?: string;
  imageAlt?: string;
  features: ProductFeature[];
  order: number;
}
