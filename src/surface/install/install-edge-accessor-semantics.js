import {
  definePrototypeSetter,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
} from "../../engine/webidl/native-function.js";
import {
  requireCSSKeywordValue,
  requireCSSUnitValue,
  requireCSSVariableReferenceValue,
} from "../api/css/css-typed-om-state.js";
import {
  requireCSSPositionValue,
  requireCSSTransformComponent,
} from "../api/css/css-transform-state.js";
import {
  requireSVGAnimatedValue,
} from "../api/svg/svg-animated-values.js";
import {
  requireSVGValue,
} from "../api/svg/svg-value-state.js";

function ignoreAssignment() {}

function addSetter(interfaceName, name, implementation = ignoreAssignment) {
  definePrototypeSetter(
    globalThis[interfaceName].prototype,
    name,
    implementation,
  );
}

function removeSetter(interfaceName, name) {
  const prototype = globalThis[interfaceName].prototype;
  const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
  Object.defineProperty(prototype, name, {
    get: descriptor.get,
    set: undefined,
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
  });
}

function addReplaceableGlobalSetter(name) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
  const setter = Object.getOwnPropertyDescriptor({
    set [name](value) {
      Object.defineProperty(this, name, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    },
  }, name).set;
  registerNativeFunction(setter, `set ${name}`);
  Object.defineProperty(globalThis, name, {
    get: descriptor.get,
    set: setter,
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
  });
}

function setCSSUnitValue(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError("The value must be finite");
  requireCSSUnitValue(this).value = number;
}

function setCSSKeywordValue(value) {
  const keyword = `${value}`;
  if (keyword === "") throw new TypeError("The value cannot be empty");
  requireCSSKeywordValue(this).value = keyword;
}

function setCSSVariable(value) {
  const variable = `${value}`;
  if (!variable.startsWith("--") || variable.length < 3) {
    throw new TypeError("A custom property name is required");
  }
  requireCSSVariableReferenceValue(this).variable = variable;
}

function setTransformComponent(name) {
  return function (value) {
    requireCSSTransformComponent(this)[name] = value;
  };
}

function setPosition(name) {
  return function (value) {
    requireCSSPositionValue(this)[name] = value;
  };
}

function setSVGRecord(kind, name) {
  return function (value) {
    const record = requireSVGValue(this, kind);
    const number = Number(value);
    if (!Number.isFinite(number)) throw new TypeError("The value must be finite");
    if (kind === "matrix") {
      record.values["abcdef".indexOf(name)] = number;
    } else {
      record[name] = number;
    }
  };
}

function setSVGSpecified(kind, name) {
  return function (value) {
    const record = requireSVGValue(this, kind);
    if (name === "valueAsString") {
      const match = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))/u.exec(`${value}`);
      if (match === null) throw new SyntaxError("Invalid SVG value");
      record.valueInSpecifiedUnits = Number(match[1]);
      return;
    }
    const number = Number(value);
    if (!Number.isFinite(number)) throw new TypeError("The value must be finite");
    record.valueInSpecifiedUnits = number;
  };
}

function setSVGAnimatedBase(value) {
  const record = requireSVGAnimatedValue(this);
  if (record.animVal === record.baseVal) record.animVal = value;
  record.baseVal = value;
}

export function installEdgeAccessorSemantics() {
  addSetter("CSSCounterStyleRule", "additiveSymbols");
  addSetter("CSSCounterStyleRule", "fallback");
  addSetter("CSSCounterStyleRule", "name");
  addSetter("CSSCounterStyleRule", "negative");
  addSetter("CSSCounterStyleRule", "pad");
  addSetter("CSSCounterStyleRule", "prefix");
  addSetter("CSSCounterStyleRule", "range");
  addSetter("CSSCounterStyleRule", "speakAs");
  addSetter("CSSCounterStyleRule", "suffix");
  addSetter("CSSCounterStyleRule", "symbols");
  addSetter("CSSCounterStyleRule", "system");
  addSetter("CSSFontFeatureValuesRule", "fontFamily");
  addSetter("CSSFunctionDeclarations", "style");
  addSetter("CSSFunctionDescriptors", "result");
  addSetter("CSSImportRule", "media");
  addSetter("CSSKeyframeRule", "keyText");
  addSetter("CSSKeyframeRule", "style");
  addSetter("CSSKeyframesRule", "name");
  addSetter("CSSKeywordValue", "value", setCSSKeywordValue);
  addSetter("CSSMarginRule", "style");
  addSetter(
    "CSSMatrixComponent",
    "matrix",
    setTransformComponent("matrix"),
  );
  addSetter("CSSMediaRule", "media");
  addSetter("CSSNestedDeclarations", "style");
  addSetter("CSSPageRule", "selectorText");
  addSetter("CSSPageRule", "style");
  addSetter(
    "CSSPerspective",
    "length",
    setTransformComponent("length"),
  );
  addSetter("CSSPositionTryDescriptors", "align-self");
  addSetter("CSSPositionTryDescriptors", "alignSelf");
  addSetter("CSSPositionTryDescriptors", "block-size");
  addSetter("CSSPositionTryDescriptors", "blockSize");
  addSetter("CSSPositionTryDescriptors", "bottom");
  addSetter("CSSPositionTryDescriptors", "height");
  addSetter("CSSPositionTryDescriptors", "inline-size");
  addSetter("CSSPositionTryDescriptors", "inlineSize");
  addSetter("CSSPositionTryDescriptors", "inset-block-end");
  addSetter("CSSPositionTryDescriptors", "inset-block-start");
  addSetter("CSSPositionTryDescriptors", "inset-block");
  addSetter("CSSPositionTryDescriptors", "inset-inline-end");
  addSetter("CSSPositionTryDescriptors", "inset-inline-start");
  addSetter("CSSPositionTryDescriptors", "inset-inline");
  addSetter("CSSPositionTryDescriptors", "inset");
  addSetter("CSSPositionTryDescriptors", "insetBlock");
  addSetter("CSSPositionTryDescriptors", "insetBlockEnd");
  addSetter("CSSPositionTryDescriptors", "insetBlockStart");
  addSetter("CSSPositionTryDescriptors", "insetInline");
  addSetter("CSSPositionTryDescriptors", "insetInlineEnd");
  addSetter("CSSPositionTryDescriptors", "insetInlineStart");
  addSetter("CSSPositionTryDescriptors", "justify-self");
  addSetter("CSSPositionTryDescriptors", "justifySelf");
  addSetter("CSSPositionTryDescriptors", "left");
  addSetter("CSSPositionTryDescriptors", "margin-block-end");
  addSetter("CSSPositionTryDescriptors", "margin-block-start");
  addSetter("CSSPositionTryDescriptors", "margin-block");
  addSetter("CSSPositionTryDescriptors", "margin-bottom");
  addSetter("CSSPositionTryDescriptors", "margin-inline-end");
  addSetter("CSSPositionTryDescriptors", "margin-inline-start");
  addSetter("CSSPositionTryDescriptors", "margin-inline");
  addSetter("CSSPositionTryDescriptors", "margin-left");
  addSetter("CSSPositionTryDescriptors", "margin-right");
  addSetter("CSSPositionTryDescriptors", "margin-top");
  addSetter("CSSPositionTryDescriptors", "margin");
  addSetter("CSSPositionTryDescriptors", "marginBlock");
  addSetter("CSSPositionTryDescriptors", "marginBlockEnd");
  addSetter("CSSPositionTryDescriptors", "marginBlockStart");
  addSetter("CSSPositionTryDescriptors", "marginBottom");
  addSetter("CSSPositionTryDescriptors", "marginInline");
  addSetter("CSSPositionTryDescriptors", "marginInlineEnd");
  addSetter("CSSPositionTryDescriptors", "marginInlineStart");
  addSetter("CSSPositionTryDescriptors", "marginLeft");
  addSetter("CSSPositionTryDescriptors", "marginRight");
  addSetter("CSSPositionTryDescriptors", "marginTop");
  addSetter("CSSPositionTryDescriptors", "max-block-size");
  addSetter("CSSPositionTryDescriptors", "max-height");
  addSetter("CSSPositionTryDescriptors", "max-inline-size");
  addSetter("CSSPositionTryDescriptors", "max-width");
  addSetter("CSSPositionTryDescriptors", "maxBlockSize");
  addSetter("CSSPositionTryDescriptors", "maxHeight");
  addSetter("CSSPositionTryDescriptors", "maxInlineSize");
  addSetter("CSSPositionTryDescriptors", "maxWidth");
  addSetter("CSSPositionTryDescriptors", "min-block-size");
  addSetter("CSSPositionTryDescriptors", "min-height");
  addSetter("CSSPositionTryDescriptors", "min-inline-size");
  addSetter("CSSPositionTryDescriptors", "min-width");
  addSetter("CSSPositionTryDescriptors", "minBlockSize");
  addSetter("CSSPositionTryDescriptors", "minHeight");
  addSetter("CSSPositionTryDescriptors", "minInlineSize");
  addSetter("CSSPositionTryDescriptors", "minWidth");
  addSetter("CSSPositionTryDescriptors", "place-self");
  addSetter("CSSPositionTryDescriptors", "placeSelf");
  addSetter("CSSPositionTryDescriptors", "position-anchor");
  addSetter("CSSPositionTryDescriptors", "position-area");
  addSetter("CSSPositionTryDescriptors", "positionAnchor");
  addSetter("CSSPositionTryDescriptors", "positionArea");
  addSetter("CSSPositionTryDescriptors", "right");
  addSetter("CSSPositionTryDescriptors", "top");
  addSetter("CSSPositionTryDescriptors", "width");
  addSetter("CSSPositionTryRule", "style");
  addSetter("CSSPositionValue", "x", setPosition("x"));
  addSetter("CSSPositionValue", "y", setPosition("y"));
  addSetter("CSSRotate", "angle", setTransformComponent("angle"));
  addSetter("CSSRotate", "x", setTransformComponent("x"));
  addSetter("CSSRotate", "y", setTransformComponent("y"));
  addSetter("CSSRotate", "z", setTransformComponent("z"));
  addSetter("CSSScale", "x", setTransformComponent("x"));
  addSetter("CSSScale", "y", setTransformComponent("y"));
  addSetter("CSSScale", "z", setTransformComponent("z"));
  addSetter("CSSSkew", "ax", setTransformComponent("ax"));
  addSetter("CSSSkew", "ay", setTransformComponent("ay"));
  addSetter("CSSSkewX", "ax", setTransformComponent("ax"));
  addSetter("CSSSkewY", "ay", setTransformComponent("ay"));
  addSetter("CSSStyleRule", "style");
  addSetter("CSSTransformComponent", "is2D");
  addSetter("CSSTranslate", "x", setTransformComponent("x"));
  addSetter("CSSTranslate", "y", setTransformComponent("y"));
  addSetter("CSSTranslate", "z", setTransformComponent("z"));
  addSetter("CSSUnitValue", "value", setCSSUnitValue);
  addSetter("CSSVariableReferenceValue", "variable", setCSSVariable);
  addSetter("Document", "body");
  addSetter("Document", "fullscreen");
  addSetter("Document", "fullscreenElement");
  addSetter("Document", "fullscreenEnabled");
  addSetter("Element", "classList");
  addSetter("Element", "part");
  addSetter("HTMLAnchorElement", "relList");
  addSetter("HTMLElement", "style");
  addSetter("HTMLFormElement", "relList");
  addSetter("HTMLIFrameElement", "sandbox");
  addSetter("HTMLScriptElement", "blocking");
  addSetter("HTMLStyleElement", "blocking");
  addSetter("MathMLElement", "style");
  addSetter("RTCSessionDescription", "sdp");
  addSetter("RTCSessionDescription", "type");
  addSetter("ShadowRoot", "fullscreenElement");
  addSetter("SVGAElement", "interestForElement");
  addSetter("SVGAElement", "relList");
  addSetter("SVGAngle", "value", setSVGSpecified("angle", "value"));
  addSetter(
    "SVGAngle",
    "valueAsString",
    setSVGSpecified("angle", "valueAsString"),
  );
  addSetter(
    "SVGAngle",
    "valueInSpecifiedUnits",
    setSVGSpecified("angle", "valueInSpecifiedUnits"),
  );
  addSetter("SVGAnimatedBoolean", "baseVal", setSVGAnimatedBase);
  addSetter("SVGAnimatedEnumeration", "baseVal", setSVGAnimatedBase);
  addSetter("SVGAnimatedInteger", "baseVal", setSVGAnimatedBase);
  addSetter("SVGAnimatedNumber", "baseVal", setSVGAnimatedBase);
  addSetter("SVGAnimatedString", "baseVal", setSVGAnimatedBase);
  addSetter("SVGAnimationElement", "onbegin");
  addSetter("SVGAnimationElement", "onend");
  addSetter("SVGAnimationElement", "onrepeat");
  addSetter("SVGElement", "style");
  addSetter("SVGImageElement", "crossOrigin");
  addSetter("SVGImageElement", "decoding");
  addSetter("SVGLength", "value", setSVGSpecified("length", "value"));
  addSetter(
    "SVGLength",
    "valueAsString",
    setSVGSpecified("length", "valueAsString"),
  );
  addSetter(
    "SVGLength",
    "valueInSpecifiedUnits",
    setSVGSpecified("length", "valueInSpecifiedUnits"),
  );
  addSetter("SVGMatrix", "a", setSVGRecord("matrix", "a"));
  addSetter("SVGMatrix", "b", setSVGRecord("matrix", "b"));
  addSetter("SVGMatrix", "c", setSVGRecord("matrix", "c"));
  addSetter("SVGMatrix", "d", setSVGRecord("matrix", "d"));
  addSetter("SVGMatrix", "e", setSVGRecord("matrix", "e"));
  addSetter("SVGMatrix", "f", setSVGRecord("matrix", "f"));
  addSetter("SVGNumber", "value", setSVGRecord("number", "value"));
  addSetter("SVGPoint", "x", setSVGRecord("point", "x"));
  addSetter("SVGPoint", "y", setSVGRecord("point", "y"));
  addSetter(
    "SVGPreserveAspectRatio",
    "align",
    setSVGRecord("preserveAspectRatio", "align"),
  );
  addSetter(
    "SVGPreserveAspectRatio",
    "meetOrSlice",
    setSVGRecord("preserveAspectRatio", "meetOrSlice"),
  );
  addSetter("SVGRect", "height", setSVGRecord("rect", "height"));
  addSetter("SVGRect", "width", setSVGRecord("rect", "width"));
  addSetter("SVGRect", "x", setSVGRecord("rect", "x"));
  addSetter("SVGRect", "y", setSVGRecord("rect", "y"));
  addSetter("SVGSVGElement", "currentScale");
  addSetter("SVGSVGElement", "zoomAndPan");
  addSetter("SVGViewElement", "zoomAndPan");
  addSetter("XRCubeLayer", "orientation");
  addSetter("XRCubeLayer", "space");
  addSetter("XRCylinderLayer", "space");
  addSetter("XREquirectLayer", "space");
  addSetter("XRQuadLayer", "space");

  addReplaceableGlobalSetter("external");
  addReplaceableGlobalSetter("locationbar");
  addReplaceableGlobalSetter("menubar");
  addReplaceableGlobalSetter("navigation");
  addReplaceableGlobalSetter("parent");
  addReplaceableGlobalSetter("performance");
  addReplaceableGlobalSetter("personalbar");
  addReplaceableGlobalSetter("scheduler");
  addReplaceableGlobalSetter("screen");
  addReplaceableGlobalSetter("scrollbars");
  addReplaceableGlobalSetter("self");
  addReplaceableGlobalSetter("statusbar");
  addReplaceableGlobalSetter("toolbar");
  addReplaceableGlobalSetter("visualViewport");

  removeSetter("AudioSinkInfo", "type");
  removeSetter("SpeechSynthesisVoice", "lang");
  removeSetter("SVGAElement", "target");
  removeSetter("XRCamera", "height");
  removeSetter("XRCamera", "width");
  removeSetter("XRDepthInformation", "height");
  removeSetter("XRDepthInformation", "transform");
  removeSetter("XRDepthInformation", "width");
  removeSetter("XRJointPose", "radius");
}
