import {
  finishCDATASectionConstructor,
  installCDATASectionConstructor,
} from "../api/dom/cdata-section-constructor.js";

export function installCDATASection() {
  installCDATASectionConstructor();
  finishCDATASectionConstructor();
}
