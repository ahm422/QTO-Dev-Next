/**
 * Font Awesome icon library registration.
 * Import this once in the root layout so all icons are available as "fas" + name.
 */
import { config, library } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faBolt,
  faBuilding,
  faBullseye,
  faCartShopping,
  faChartLine,
  faCheck,
  faCloud,
  faCompass,
  faEnvelope,
  faFlaskVial,
  faGear,
  faHammer,
  faLaptopCode,
  faLocationDot,
  faLock,
  faMagnifyingGlass,
  faMobileScreen,
  faMoon,
  faPalette,
  faPhone,
  faRobot,
  faRocket,
  faServer,
  faShapes,
  faShieldHalved,
  faSun,
  faUniversalAccess,
  faXmark,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";

// Prevent FA from adding its own CSS (we use inline SVG only).
config.autoAddCss = false;

library.add(
  faBars,
  faBolt,
  faBuilding,
  faBullseye,
  faCartShopping,
  faChartLine,
  faCheck,
  faCloud,
  faCompass,
  faEnvelope,
  faFlaskVial,
  faGear,
  faGlobe,
  faHammer,
  faLaptopCode,
  faLocationDot,
  faLock,
  faMagnifyingGlass,
  faMobileScreen,
  faMoon,
  faPalette,
  faPhone,
  faRobot,
  faRocket,
  faServer,
  faShieldHalved,
  faShapes,
  faSun,
  faUniversalAccess,
  faXmark
);
