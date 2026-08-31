import {
  finishSVGPathElementConstructor,
  installSVGPathElementConstructor,
} from "../api/dom/svg-path-element-constructor.js";

export function installSVGPathElement() {
  installSVGPathElementConstructor();
  finishSVGPathElementConstructor();
}
