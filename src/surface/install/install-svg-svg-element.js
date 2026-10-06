import {
  finishSVGSVGElementConstructor,
  installSVGSVGElementConstructor,
} from "../api/dom/svg-svg-element-constructor.js";
import {
  definePrototypeGetter,
  definePrototypeMethod,
} from "../../engine/webidl/descriptor.js";
import { SVGSVGElement } from "../api/dom/svg-svg-element-constructor.js";
import {
  createSVGAngleMethod,
  createSVGLengthMethod,
  createSVGMatrixMethod,
  createSVGNumberMethod,
  createSVGPointMethod,
  createSVGRectMethod,
  createSVGTransformFromMatrixMethod,
  createSVGTransformMethod,
} from "../api/svg/svg-svg-element-value-methods.js";
import {
  animationsPaused,
  checkEnclosure,
  checkIntersection,
  currentScale,
  currentTranslate,
  deselectAll,
  forceRedraw,
  getCurrentTime,
  getElementById,
  getEnclosureList,
  getIntersectionList,
  height,
  pauseAnimations,
  preserveAspectRatio,
  setCurrentTime,
  suspendRedraw,
  unpauseAnimations,
  unsuspendRedraw,
  unsuspendRedrawAll,
  viewBox,
  width,
  x,
  y,
  zoomAndPan,
} from "../api/svg/svg-svg-element-members.js";

export function installSVGSVGElement() {
  installSVGSVGElementConstructor();

    definePrototypeGetter(SVGSVGElement.prototype, "x", ((((["x", x]))[1])));

    definePrototypeGetter(SVGSVGElement.prototype, "y", ((((["y", y]))[1])));

    definePrototypeGetter(SVGSVGElement.prototype, "width", ((((["width", width]))[1])));

    definePrototypeGetter(SVGSVGElement.prototype, "height", ((((["height", height]))[1])));

    definePrototypeGetter(SVGSVGElement.prototype, "currentScale", ((((["currentScale", currentScale]))[1])));

    definePrototypeGetter(SVGSVGElement.prototype, "currentTranslate", ((((["currentTranslate", currentTranslate]))[1])));

    definePrototypeGetter(SVGSVGElement.prototype, "viewBox", ((((["viewBox", viewBox]))[1])));

    definePrototypeGetter(SVGSVGElement.prototype, "preserveAspectRatio", ((((["preserveAspectRatio", preserveAspectRatio]))[1])));

    definePrototypeGetter(SVGSVGElement.prototype, "zoomAndPan", ((((["zoomAndPan", zoomAndPan]))[1])));

    defineConstant(SVGSVGElement.prototype, "SVG_ZOOMANDPAN_UNKNOWN", 0);
    defineConstant(SVGSVGElement, "SVG_ZOOMANDPAN_UNKNOWN", 0);

    defineConstant(SVGSVGElement.prototype, "SVG_ZOOMANDPAN_DISABLE", 1);
    defineConstant(SVGSVGElement, "SVG_ZOOMANDPAN_DISABLE", 1);

    defineConstant(SVGSVGElement.prototype, "SVG_ZOOMANDPAN_MAGNIFY", 2);
    defineConstant(SVGSVGElement, "SVG_ZOOMANDPAN_MAGNIFY", 2);

    definePrototypeMethod(SVGSVGElement.prototype, "animationsPaused", ((((["animationsPaused", animationsPaused]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "checkEnclosure", ((((["checkEnclosure", checkEnclosure]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "checkIntersection", ((((["checkIntersection", checkIntersection]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "createSVGAngle", ((((["createSVGAngle", createSVGAngleMethod]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "createSVGLength", ((((["createSVGLength", createSVGLengthMethod]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "createSVGMatrix", ((((["createSVGMatrix", createSVGMatrixMethod]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "createSVGNumber", ((((["createSVGNumber", createSVGNumberMethod]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "createSVGPoint", ((((["createSVGPoint", createSVGPointMethod]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "createSVGRect", ((((["createSVGRect", createSVGRectMethod]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "createSVGTransform", ((((["createSVGTransform", createSVGTransformMethod]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "createSVGTransformFromMatrix", ((((["createSVGTransformFromMatrix", createSVGTransformFromMatrixMethod]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "deselectAll", ((((["deselectAll", deselectAll]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "forceRedraw", ((((["forceRedraw", forceRedraw]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "getCurrentTime", ((((["getCurrentTime", getCurrentTime]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "getElementById", ((((["getElementById", getElementById]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "getEnclosureList", ((((["getEnclosureList", getEnclosureList]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "getIntersectionList", ((((["getIntersectionList", getIntersectionList]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "pauseAnimations", ((((["pauseAnimations", pauseAnimations]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "setCurrentTime", ((((["setCurrentTime", setCurrentTime]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "suspendRedraw", ((((["suspendRedraw", suspendRedraw]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "unpauseAnimations", ((((["unpauseAnimations", unpauseAnimations]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "unsuspendRedraw", ((((["unsuspendRedraw", unsuspendRedraw]))[1])));

    definePrototypeMethod(SVGSVGElement.prototype, "unsuspendRedrawAll", ((((["unsuspendRedrawAll", unsuspendRedrawAll]))[1])));

  finishSVGSVGElementConstructor();
}

function defineConstant(target, name, value) {
  Object.defineProperty(target, name, {
    value,
    writable: false,
    enumerable: true,
    configurable: false,
  });
}
