import {
  finishSVGCircleElementConstructor,
  installSVGCircleElementConstructor,
} from "../api/dom/svg-circle-element-constructor.js";
import { installSVGCircleElementMembers } from "./install-svg-shape-elements.js";

export function installSVGCircleElement() {
  installSVGCircleElementConstructor();
  installSVGCircleElementMembers();
  finishSVGCircleElementConstructor();
}
