/** Official QTO House HRMS — role applications and onboarding */
export const CAREER_PORTAL_ORIGIN = "https://career.qtohouse.com.pk";

export function careerPortalRegisterUrl(jobId: string): string {
  const params = new URLSearchParams({
    utm_source: "qto_dev_website",
    utm_medium: "careers",
    utm_campaign: jobId,
  });
  return `${CAREER_PORTAL_ORIGIN}/register?${params.toString()}`;
}

export function careerPortalHomeUrl(): string {
  const params = new URLSearchParams({
    utm_source: "qto_dev_website",
    utm_medium: "careers",
  });
  return `${CAREER_PORTAL_ORIGIN}/?${params.toString()}`;
}

export function careerPortalLoginUrl(jobId: string): string {
  const params = new URLSearchParams({
    utm_source: "qto_dev_website",
    utm_medium: "careers",
    utm_campaign: jobId,
  });
  return `${CAREER_PORTAL_ORIGIN}/login?${params.toString()}`;
}
