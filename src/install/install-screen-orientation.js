import {
  installScreenOrientationAngle,
} from "../api/screen/screen-orientation-angle-getter.js";
import {
  installScreenOrientationConstructor,
  installScreenOrientationConstructorBacklink,
} from "../api/screen/screen-orientation-constructor.js";
import {
  installScreenOrientationLock,
} from "../api/screen/screen-orientation-lock.js";
import {
  installScreenOrientationOnchange,
} from "../api/screen/screen-orientation-onchange-property.js";
import {
  installScreenOrientationType,
} from "../api/screen/screen-orientation-type-getter.js";
import {
  installScreenOrientationUnlock,
} from "../api/screen/screen-orientation-unlock.js";

export function installScreenOrientation() {
  installScreenOrientationConstructor();
  installScreenOrientationAngle();
  installScreenOrientationType();
  installScreenOrientationOnchange();
  installScreenOrientationLock();
  installScreenOrientationUnlock();
  installScreenOrientationConstructorBacklink();
}
