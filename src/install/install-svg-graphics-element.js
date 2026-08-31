import {
  finishSVGGraphicsElementConstructor,
  installSVGGraphicsElementConstructor,
  SVGGraphicsElement,
} from "../api/dom/svg-graphics-element-constructor.js";
import {
  definePrototypeGetter,
  definePrototypeMethod,
} from "../webidl/descriptor.js";
import {
  farthestViewportElement,
  getBBox,
  getCTM,
  getScreenCTM,
  nearestViewportElement,
  requiredExtensions,
  systemLanguage,
  transform,
} from "../api/svg/svg-graphics-element-members.js";

export function installSVGGraphicsElement() {
  installSVGGraphicsElementConstructor();
  definePrototypeGetter(SVGGraphicsElement.prototype, "transform", transform);
  definePrototypeGetter(
    SVGGraphicsElement.prototype,
    "nearestViewportElement",
    nearestViewportElement,
  );
  definePrototypeGetter(
    SVGGraphicsElement.prototype,
    "farthestViewportElement",
    farthestViewportElement,
  );
  definePrototypeGetter(
    SVGGraphicsElement.prototype,
    "requiredExtensions",
    requiredExtensions,
  );
  definePrototypeGetter(
    SVGGraphicsElement.prototype,
    "systemLanguage",
    systemLanguage,
  );
  definePrototypeMethod(SVGGraphicsElement.prototype, "getBBox", getBBox);
  definePrototypeMethod(SVGGraphicsElement.prototype, "getCTM", getCTM);
  definePrototypeMethod(SVGGraphicsElement.prototype, "getScreenCTM", getScreenCTM);
  finishSVGGraphicsElementConstructor();
}
