import {
  installSVGElementConstructor,
} from "../api/dom/svg-element-constructor.js";
import { installSVGElementMembers } from "../api/svg/svg-element-members.js";

export function installSVGElement() {
  installSVGElementConstructor();
  installSVGElementMembers();
}
