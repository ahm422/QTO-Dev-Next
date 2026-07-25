/**
 * Static marketing / chrome assets hosted on R2 (issue #370).
 * Former paths under public/images/ → stable keys under static/images/.
 * See scripts/output/public-images-r2-map.json for the full audit map.
 */
const R2_STATIC =
  "https://pub-your-r2-bucket-id.r2.dev/static/images";

/** Build an absolute R2 URL for a path relative to static/images/. */
export function r2StaticImage(path: string): string {
  const clean = path.replace(/^\/+/, "").replace(/^images\//, "");
  return `${R2_STATIC}/${clean}`;
}

/** Former `/images/...` public paths → R2 public URLs (prefer-optimized where applicable). */
export const STATIC_IMAGE_URLS = {
  "/images/Frontend1.JPG": r2StaticImage("Frontend1.JPG"),
  "/images/Backend1.JPG": r2StaticImage("Backend1.JPG"),
  "/images/it-team-2.JPG": r2StaticImage("it-team-2.JPG"),
  "/images/ITTeam.JPG": r2StaticImage("ITTeam.JPG"),
  "/images/optimized/ceo-portrait-800.webp": r2StaticImage(
    "optimized/ceo-portrait-800.webp"
  ),
  "/images/optimized/ceo-800.webp": r2StaticImage("optimized/ceo-800.webp"),
  "/images/service-bg.jpg": r2StaticImage("service-bg.jpg"),
  "/images/projects-bg.jpg": r2StaticImage("projects-bg.jpg"),
  "/images/about-bg.jpg": r2StaticImage("about-bg.jpg"),
  "/images/blog-bg.jpg": r2StaticImage("blog-bg.jpg"),
  "/images/career-bg.jpg": r2StaticImage("career-bg.jpg"),
  "/images/contact-bg.jpg": r2StaticImage("contact-bg.jpg"),
  "/images/optimized/web-development-1920.webp": r2StaticImage(
    "optimized/web-development-1920.webp"
  ),
  "/images/optimized/mobile-app-developement-1920.webp": r2StaticImage(
    "optimized/mobile-app-developement-1920.webp"
  ),
  "/images/optimized/ui-ux-design-1920.webp": r2StaticImage(
    "optimized/ui-ux-design-1920.webp"
  ),
  "/images/optimized/ai-1920.webp": r2StaticImage("optimized/ai-1920.webp"),
  "/images/optimized/devops-1920.webp": r2StaticImage(
    "optimized/devops-1920.webp"
  ),
  "/images/optimized/technical-support-1920.webp": r2StaticImage(
    "optimized/technical-support-1920.webp"
  ),
  // Prefer optimized WebP for these three Pexels originals
  "/images/pexels-thisisengineering-3861958.jpg": r2StaticImage(
    "optimized/pexels-thisisengineering-3861958-1920.webp"
  ),
  "/images/pexels-thisisengineering-3861964.jpg": r2StaticImage(
    "optimized/pexels-thisisengineering-3861964-1920.webp"
  ),
  "/images/pexels-thisisengineering-3861967.jpg": r2StaticImage(
    "optimized/pexels-thisisengineering-3861967-1920.webp"
  ),
  "/images/pexels-kevin-ku-92347-577585.jpg": r2StaticImage(
    "pexels-kevin-ku-92347-577585.jpg"
  ),
  "/images/pexels-olia-danilevich-4974912.jpg": r2StaticImage(
    "pexels-olia-danilevich-4974912.jpg"
  ),
  "/images/pexels-djordje-petrovic-590080-2102416.jpg": r2StaticImage(
    "pexels-djordje-petrovic-590080-2102416.jpg"
  ),
  "/images/pexels-fotios-photos-16129728.jpg": r2StaticImage(
    "pexels-fotios-photos-16129728.jpg"
  ),
  "/images/pexels-mikhail-nilov-7988079.jpg": r2StaticImage(
    "pexels-mikhail-nilov-7988079.jpg"
  ),
  "/images/pexels-pixabay-256219.jpg": r2StaticImage(
    "pexels-pixabay-256219.jpg"
  ),
  "/images/logo.png": r2StaticImage("logo.png"),
  "/images/footer-logo.png": r2StaticImage("footer-logo.png"),
  "/images/fav-icon/icon.png": r2StaticImage("fav-icon/icon.png"),
} as const;

export type StaticImagePath = keyof typeof STATIC_IMAGE_URLS;

export function staticImageUrl(path: StaticImagePath): string {
  return STATIC_IMAGE_URLS[path];
}

/**
 * Resolve a CMS / legacy media URL for display.
 * Rewrites former `/images/...` public paths to R2; leaves absolute URLs untouched.
 */
export function resolveMediaUrl(
  url: string | null | undefined
): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("/images/")) {
    const known = STATIC_IMAGE_URLS[url as StaticImagePath];
    if (known) return known;
    return r2StaticImage(url.slice("/images/".length));
  }
  return url;
}

export function resolveMediaUrlOrEmpty(url: string | null | undefined): string {
  return resolveMediaUrl(url) ?? "";
}

/** Named chrome / hero helpers for call sites. */
export const SITE_LOGO_LIGHT = STATIC_IMAGE_URLS["/images/logo.png"];
export const SITE_LOGO_DARK = STATIC_IMAGE_URLS["/images/footer-logo.png"];
export const SITE_FAVICON = STATIC_IMAGE_URLS["/images/fav-icon/icon.png"];
