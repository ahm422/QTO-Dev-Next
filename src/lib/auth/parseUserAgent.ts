import { UAParser } from "ua-parser-js";

export function parseUserAgent(ua: string | null | undefined): string {
  if (!ua) return "Unknown device";

  const parser = new UAParser(ua);
  const browser = parser.getBrowser();
  const os = parser.getOS();

  const browserName = browser.name ?? "";
  const osName = os.name ?? "";

  if (!browserName && !osName) return "Unknown device";
  if (!osName) return browserName;
  if (!browserName) return osName;
  return `${browserName} on ${osName}`;
}
