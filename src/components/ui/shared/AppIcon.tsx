"use client";

import {
  faArrowRight,
  faArrowTrendUp,
  faBars,
  faBolt,
  faBuilding,
  faBullseye,
  faCalendar,
  faCartShopping,
  faChartLine,
  faCheck,
  faClock,
  faCloud,
  faCompass,
  faEnvelope,
  faFlaskVial,
  faGear,
  faGlobe,
  faHammer,
  faHeadphones,
  faHeart,
  faLaptopCode,
  faLayerGroup,
  faLightbulb,
  faLink,
  faList,
  faLocationDot,
  faLock,
  faMagnifyingGlass,
  faMobileScreen,
  faMoon,
  faPalette,
  faPhone,
  faPlane,
  faRobot,
  faRocket,
  faServer,
  faShareNodes,
  faShapes,
  faShieldHalved,
  faStar,
  faSun,
  faUsers,
  faUniversalAccess,
  faWandSparkles,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { cn } from "@/components/theme/cn";

/** Font Awesome icon name (solid + brands). Add new names and map entries below when needed. */
export type AppIconName =
  | "arrow-right"
  | "laptop-code"
  | "mobile-screen"
  | "palette"
  | "chart-line"
  | "cloud"
  | "robot"
  | "server"
  | "shapes"
  | "bolt"
  | "lock"
  | "universal-access"
  | "globe"
  | "envelope"
  | "phone"
  | "location-dot"
  | "cart-shopping"
  | "building"
  | "bullseye"
  | "compass"
  | "hammer"
  | "flask-vial"
  | "rocket"
  | "check"
  | "shield-halved"
  | "gear"
  | "magnifying-glass"
  | "sun"
  | "moon"
  | "bars"
  | "xmark"
  | "calendar"
  | "clock"
  | "heart"
  | "plane"
  | "headphones"
  | "lightbulb"
  | "link"
  | "list"
  | "share-nodes"
  | "circle-check"
  | "x-twitter"
  | "linkedin-in"
  | "sparkles"
  | "arrow-trending-up"
  | "layers"
  | "star"
  | "users";

const iconMap: Record<AppIconName, IconDefinition> = {
  "arrow-right": faArrowRight,
  "laptop-code": faLaptopCode,
  "mobile-screen": faMobileScreen,
  palette: faPalette,
  "chart-line": faChartLine,
  cloud: faCloud,
  robot: faRobot,
  server: faServer,
  shapes: faShapes,
  bolt: faBolt,
  lock: faLock,
  "universal-access": faUniversalAccess,
  globe: faGlobe,
  envelope: faEnvelope,
  phone: faPhone,
  "location-dot": faLocationDot,
  "cart-shopping": faCartShopping,
  building: faBuilding,
  bullseye: faBullseye,
  compass: faCompass,
  hammer: faHammer,
  "flask-vial": faFlaskVial,
  rocket: faRocket,
  heart: faHeart,
  plane: faPlane,
  check: faCheck,
  headphones: faHeadphones,
  lightbulb: faLightbulb,
  link: faLink,
  list: faList,
  "share-nodes": faShareNodes,
  "circle-check": faCheck,
  "shield-halved": faShieldHalved,
  star: faStar,
  users: faUsers,
  gear: faGear,
  "magnifying-glass": faMagnifyingGlass,
  sun: faSun,
  moon: faMoon,
  bars: faBars,
  xmark: faXmark,
  calendar: faCalendar,
  clock: faClock,
  "x-twitter": faXTwitter,
  "linkedin-in": faLinkedinIn,
  sparkles: faWandSparkles,
  "arrow-trending-up": faArrowTrendUp,
  layers: faLayerGroup,
};

interface AppIconProps {
  name: AppIconName;
  className?: string;
  size?: "sm" | "base" | "lg" | "xl";
}

const sizeMap = {
  sm: "text-lg",
  base: "text-2xl",
  lg: "text-4xl",
  xl: "text-5xl",
};

export function AppIcon({ name, className, size = "base" }: AppIconProps) {
  const icon = iconMap[name];
  if (!icon) return null;
  return (
    <FontAwesomeIcon
      icon={icon}
      className={cn(sizeMap[size], "shrink-0", className)}
      aria-hidden
    />
  );
}
