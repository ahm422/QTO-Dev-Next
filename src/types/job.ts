export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  /** Full URL — typically QTO House career portal (register/apply). */
  applyUrl: string;
  workMode?: string;
  /** Short teaser shown on listing cards */
  description?: string;
  tags?: string[];
  /** e.g. "Posted 24 Feb 2026" */
  postedLabel?: string;
  /** e.g. "5+ years shipping production web UIs" */
  experience?: string;
  /** e.g. "PKR — competitive, benchmarked to senior market" */
  compensationNote?: string;
  roleSummary?: string;
  responsibilities?: string[];
  requirements?: string[];
  /** Maps to AppIcon name for card header */
  icon?: "laptop-code" | "palette" | "users" | "building" | "chart-line";
}

