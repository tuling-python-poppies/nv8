import {
  installScreenAvailHeight,
} from "../api/screen/screen-avail-height-getter.js";
import {
  installScreenAvailLeft,
} from "../api/screen/screen-avail-left-getter.js";
import {
  installScreenAvailTop,
} from "../api/screen/screen-avail-top-getter.js";
import {
  installScreenAvailWidth,
} from "../api/screen/screen-avail-width-getter.js";
import {
  installScreenColorDepth,
} from "../api/screen/screen-color-depth-getter.js";
import {
  installScreenConstructor,
  installScreenConstructorBacklink,
} from "../api/screen/screen-constructor.js";
import { installGlobalScreen } from "../api/screen/screen-global-getter.js";
import {
  installScreenHeight,
} from "../api/screen/screen-height-getter.js";
import {
  installScreenIsExtended,
} from "../api/screen/screen-is-extended-getter.js";
import {
  installScreenOnchange,
} from "../api/screen/screen-onchange-property.js";
import {
  installScreenOrientationGetter,
} from "../api/screen/screen-orientation-getter.js";
import {
  installScreenPixelDepth,
} from "../api/screen/screen-pixel-depth-getter.js";
import { installScreenWidth } from "../api/screen/screen-width-getter.js";

export function installScreen() {
  installScreenConstructor();
  installScreenAvailWidth();
  installScreenAvailHeight();
  installScreenWidth();
  installScreenHeight();
  installScreenColorDepth();
  installScreenPixelDepth();
  installScreenAvailLeft();
  installScreenAvailTop();
  installScreenOrientationGetter();
  installScreenConstructorBacklink();
  installScreenOnchange();
  installScreenIsExtended();
  installGlobalScreen();
}
