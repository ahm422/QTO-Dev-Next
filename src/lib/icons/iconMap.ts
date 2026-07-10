import type { AppIconName } from "@/components/ui/shared/AppIcon";

/** Lucide picker name → persisted AppIcon name */
export const LUCIDE_TO_APP_ICON: Record<string, AppIconName> = {
  Briefcase: "building",
  Code: "laptop-code",
  Globe: "globe",
  Layers: "layers",
  Cpu: "robot",
  Database: "server",
  Shield: "shield-halved",
  Zap: "bolt",
  Star: "star",
  Heart: "heart",
  Target: "bullseye",
  Rocket: "rocket",
  Users: "users",
  Building2: "building",
  Award: "star",
  CheckCircle: "circle-check",
  TrendingUp: "arrow-trending-up",
  BarChart2: "chart-line",
  PieChart: "chart-line",
  LineChart: "chart-line",
  Settings: "gear",
  Wrench: "hammer",
  Cloud: "cloud",
  Lock: "lock",
  Key: "lock",
  Mail: "envelope",
  Phone: "phone",
  MessageSquare: "envelope",
  FileText: "list",
  Folder: "shapes",
  Image: "shapes",
  Video: "shapes",
  Music: "shapes",
  Camera: "shapes",
  Map: "location-dot",
  Navigation: "compass",
  Compass: "compass",
  Search: "magnifying-glass",
  Eye: "universal-access",
  ThumbsUp: "check",
  Package: "shapes",
  Truck: "plane",
  ShoppingCart: "cart-shopping",
  CreditCard: "shapes",
  DollarSign: "chart-line",
  Headphones: "headphones",
  Mic: "headphones",
  Monitor: "laptop-code",
  Smartphone: "mobile-screen",
  Tablet: "mobile-screen",
  Watch: "clock",
  Pen: "hammer",
  Edit: "hammer",
  Scissors: "hammer",
  Palette: "palette",
  Brush: "palette",
  Sparkles: "sparkles",
  Sun: "sun",
  Moon: "moon",
  Leaf: "sparkles",
  Flower: "sparkles",
  Mountain: "compass",
  Waves: "compass",
};

export const MAPPED_LUCIDE_ICON_NAMES = Object.keys(LUCIDE_TO_APP_ICON);

export function lucideToAppIcon(lucideName: string): AppIconName | null {
  return LUCIDE_TO_APP_ICON[lucideName] ?? null;
}

/** For picker highlight when `value` is already an AppIcon key */
export function isLucideIconSelected(lucideName: string, storedValue: string): boolean {
  if (storedValue === lucideName) return true;
  return LUCIDE_TO_APP_ICON[lucideName] === storedValue;
}

export function normalizeStoredIcon(value: string): string {
  if (!value) return "";
  if (value in LUCIDE_TO_APP_ICON) return LUCIDE_TO_APP_ICON[value]!;
  return value;
}
