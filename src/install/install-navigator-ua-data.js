import {
  installNavigatorUADataBrands,
} from "../api/navigator/navigator-ua-data-brands-getter.js";
import {
  installNavigatorUADataConstructor,
  installNavigatorUADataConstructorBacklink,
} from "../api/navigator/navigator-ua-data-constructor.js";
import {
  installNavigatorUADataHighEntropy,
} from "../api/navigator/navigator-ua-data-high-entropy.js";
import {
  installNavigatorUADataMobile,
} from "../api/navigator/navigator-ua-data-mobile-getter.js";
import {
  installNavigatorUADataPlatform,
} from "../api/navigator/navigator-ua-data-platform-getter.js";
import {
  installNavigatorUADataToJSON,
} from "../api/navigator/navigator-ua-data-to-json.js";

export function installNavigatorUAData() {
  installNavigatorUADataConstructor();
  installNavigatorUADataBrands();
  installNavigatorUADataMobile();
  installNavigatorUADataPlatform();
  installNavigatorUADataHighEntropy();
  installNavigatorUADataToJSON();
  installNavigatorUADataConstructorBacklink();
}
