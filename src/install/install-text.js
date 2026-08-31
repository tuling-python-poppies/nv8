import {
  finishTextConstructor,
  installTextConstructor,
} from "../api/dom/text-constructor.js";
import {
  installTextAssignedSlot,
} from "../api/dom/text-assigned-slot-getter.js";
import { installTextSplitText } from "../api/dom/text-split-text.js";
import { installTextWholeText } from "../api/dom/text-whole-text-getter.js";

export function installText() {
  installTextConstructor();
  installTextWholeText();
  installTextAssignedSlot();
  installTextSplitText();
  finishTextConstructor();
}
