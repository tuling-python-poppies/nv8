// SVG 属性元素安装器：按真实 Edge 采集基准展开的安装语句。
// 直接编辑本文件；导出由 `npm run check:generated` 校验。
import { SVGClipPathElement } from "../api/dom/svgclip-path-element-factory-constructor.js";
import { SVGAnimationElement } from "../api/dom/svganimation-element-factory-constructor.js";
import { SVGFEComponentTransferElement } from "../api/dom/svgfecomponent-transfer-element-factory-constructor.js";
import { SVGFEBlendElement } from "../api/dom/svgfeblend-element-factory-constructor.js";
import { SVGFEColorMatrixElement } from "../api/dom/svgfecolor-matrix-element-factory-constructor.js";
import { SVGFECompositeElement } from "../api/dom/svgfecomposite-element-factory-constructor.js";
import { SVGFEConvolveMatrixElement } from "../api/dom/svgfeconvolve-matrix-element-factory-constructor.js";
import { SVGFEDistantLightElement } from "../api/dom/svgfedistant-light-element-factory-constructor.js";
import { SVGFEDiffuseLightingElement } from "../api/dom/svgfediffuse-lighting-element-factory-constructor.js";
import { SVGFEDropShadowElement } from "../api/dom/svgfedrop-shadow-element-factory-constructor.js";
import { SVGFEFloodElement } from "../api/dom/svgfeflood-element-factory-constructor.js";
import { SVGFEGaussianBlurElement } from "../api/dom/svgfegaussian-blur-element-factory-constructor.js";
import { SVGFEImageElement } from "../api/dom/svgfeimage-element-factory-constructor.js";
import { SVGFEMergeElement } from "../api/dom/svgfemerge-element-factory-constructor.js";
import { SVGFEMergeNodeElement } from "../api/dom/svgfemerge-node-element-factory-constructor.js";
import { SVGFEMorphologyElement } from "../api/dom/svgfemorphology-element-factory-constructor.js";
import { SVGFEOffsetElement } from "../api/dom/svgfeoffset-element-factory-constructor.js";
import { SVGFEPointLightElement } from "../api/dom/svgfepoint-light-element-factory-constructor.js";
import { SVGFESpecularLightingElement } from "../api/dom/svgfespecular-lighting-element-factory-constructor.js";
import { SVGFESpotLightElement } from "../api/dom/svgfespot-light-element-factory-constructor.js";
import { SVGFETileElement } from "../api/dom/svgfetile-element-factory-constructor.js";
import { SVGFETurbulenceElement } from "../api/dom/svgfeturbulence-element-factory-constructor.js";
import { SVGFEDisplacementMapElement } from "../api/dom/svgfedisplacement-map-element-factory-constructor.js";
import { SVGFilterElement } from "../api/dom/svgfilter-element-factory-constructor.js";
import { SVGForeignObjectElement } from "../api/dom/svgforeign-object-element-factory-constructor.js";
import { SVGGradientElement } from "../api/dom/svggradient-element-factory-constructor.js";
import { SVGImageElement } from "../api/dom/svgimage-element-factory-constructor.js";
import { SVGLinearGradientElement } from "../api/dom/svglinear-gradient-element-factory-constructor.js";
import { SVGMarkerElement } from "../api/dom/svgmarker-element-factory-constructor.js";
import { SVGMaskElement } from "../api/dom/svgmask-element-factory-constructor.js";
import { SVGMPathElement } from "../api/dom/svgmpath-element-factory-constructor.js";
import { SVGRadialGradientElement } from "../api/dom/svgradial-gradient-element-factory-constructor.js";
import { SVGScriptElement } from "../api/dom/svgscript-element-factory-constructor.js";
import { SVGStyleElement } from "../api/dom/svgstyle-element-factory-constructor.js";
import { SVGStopElement } from "../api/dom/svgstop-element-factory-constructor.js";
import { SVGSymbolElement } from "../api/dom/svgsymbol-element-factory-constructor.js";
import { SVGPatternElement } from "../api/dom/svgpattern-element-factory-constructor.js";
import { SVGTextPathElement } from "../api/dom/svgtext-path-element-factory-constructor.js";
import { SVGTextContentElement } from "../api/dom/svgtext-content-element-factory-constructor.js";
import { SVGTextPositioningElement } from "../api/dom/svgtext-positioning-element-factory-constructor.js";
import { SVGUseElement } from "../api/dom/svguse-element-factory-constructor.js";
import { SVGViewElement } from "../api/dom/svgview-element-factory-constructor.js";
import { SVGComponentTransferFunctionElement } from "../api/dom/svgcomponent-transfer-function-element-factory-constructor.js";
import { createDOMPoint } from "../api/geometry/dom-point-constructor.js";
import { createDOMRect } from "../api/geometry/dom-rect-constructor.js";
import {
  getAttributeValue,
  removeAttributeValue,
  setAttributeValue,
} from "../api/dom/element-state.js";
import { createDOMTokenList } from "../api/dom/dom-token-list-state.js";
import { styleElementSheet } from "../api/dom/html-style-element-sheet-state.js";
import { createSVGAttributeGetter } from "../api/svg/svg-attribute-members.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";
import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";

const definitions = [
  [SVGFEMergeNodeElement, [["in1", "string", "in"]]],
  [SVGMPathElement, [["href", "string"]]],
  [SVGStopElement, [["offset", "number"]]],
  [SVGClipPathElement, [
    ["clipPathUnits", "enumeration"],
    ["transform", "transform"],
  ]],
  [SVGFEDistantLightElement, [
    ["azimuth", "number"],
    ["elevation", "number"],
  ]],
  [SVGSymbolElement, [
    ["viewBox", "rect"],
    ["preserveAspectRatio", "aspectRatio"],
  ]],
  [SVGFEPointLightElement, [
    ["x", "number"],
    ["y", "number"],
    ["z", "number"],
  ]],
  [SVGForeignObjectElement, [
    ["x", "length"],
    ["y", "length"],
    ["width", "length"],
    ["height", "length"],
  ]],
  [SVGLinearGradientElement, [
    ["x1", "length"],
    ["y1", "length"],
    ["x2", "length"],
    ["y2", "length"],
  ]],
  [SVGUseElement, [
    ["x", "length"],
    ["y", "length"],
    ["width", "length"],
    ["height", "length"],
    ["href", "string"],
  ]],
  [SVGRadialGradientElement, [
    ["cx", "length"],
    ["cy", "length"],
    ["r", "length"],
    ["fx", "length"],
    ["fy", "length"],
    ["fr", "length"],
  ]],
  [SVGFilterElement, [
    ["filterUnits", "enumeration"],
    ["primitiveUnits", "enumeration"],
    ["x", "length"],
    ["y", "length"],
    ["width", "length"],
    ["height", "length"],
    ["href", "string"],
  ]],
  [SVGFETileElement, filterPrimitiveProperties(true)],
  [SVGFEOffsetElement, [
    ["in1", "string", "in"],
    ["dx", "number"],
    ["dy", "number"],
    ["x", "length"],
    ["y", "length"],
    ["width", "length"],
    ["height", "length"],
    ["result", "string"],
  ]],
  [SVGFEMergeElement, filterPrimitiveProperties(false)],
  [SVGFEImageElement, [
    ["preserveAspectRatio", "aspectRatio"],
    ["x", "length"],
    ["y", "length"],
    ["width", "length"],
    ["height", "length"],
    ["result", "string"],
    ["href", "string"],
  ]],
  [SVGFEFloodElement, filterPrimitiveProperties(false)],
  [SVGFEComponentTransferElement, filterPrimitiveProperties(true)],
  [SVGFESpotLightElement, [
    ["x", "number"],
    ["y", "number"],
    ["z", "number"],
    ["pointsAtX", "number", "pointsAtX"],
    ["pointsAtY", "number", "pointsAtY"],
    ["pointsAtZ", "number", "pointsAtZ"],
    ["specularExponent", "number"],
    ["limitingConeAngle", "number"],
  ]],
  [SVGFESpecularLightingElement, [
    ["in1", "string", "in"],
    ["surfaceScale", "number"],
    ["specularConstant", "number"],
    ["specularExponent", "number"],
    ["kernelUnitLengthX", "numberFirst", "kernelUnitLength"],
    ["kernelUnitLengthY", "numberSecond", "kernelUnitLength"],
    ...filterPrimitiveProperties(false),
  ]],
  [SVGFEMorphologyElement, [
    ["in1", "string", "in"],
    ["operator", "enumeration"],
    ["radiusX", "numberFirst", "radius"],
    ["radiusY", "numberSecond", "radius"],
    ...filterPrimitiveProperties(false),
  ]],
  [SVGFEGaussianBlurElement, [
    ["in1", "string", "in"],
    ["stdDeviationX", "numberFirst", "stdDeviation"],
    ["stdDeviationY", "numberSecond", "stdDeviation"],
    ...filterPrimitiveProperties(false),
  ]],
  [SVGFEDropShadowElement, [
    ["in1", "string", "in"],
    ["dx", "number"],
    ["dy", "number"],
    ["stdDeviationX", "numberFirst", "stdDeviation"],
    ["stdDeviationY", "numberSecond", "stdDeviation"],
    ...filterPrimitiveProperties(false),
  ]],
  [SVGFEDiffuseLightingElement, [
    ["in1", "string", "in"],
    ["surfaceScale", "number"],
    ["diffuseConstant", "number"],
    ["kernelUnitLengthX", "numberFirst", "kernelUnitLength"],
    ["kernelUnitLengthY", "numberSecond", "kernelUnitLength"],
    ...filterPrimitiveProperties(false),
  ]],
  [SVGFEColorMatrixElement, [
    ["in1", "string", "in"],
    ["type", "enumeration"],
    ["values", "numberList"],
    ...filterPrimitiveProperties(false),
  ]],
  [SVGComponentTransferFunctionElement, [
    ["type", "enumeration"],
    ["tableValues", "numberList"],
    ["slope", "number"],
    ["intercept", "number"],
    ["amplitude", "number"],
    ["exponent", "number"],
    ["offset", "number"],
  ]],
  [SVGGradientElement, [
    ["gradientUnits", "enumeration"],
    ["gradientTransform", "transform"],
    ["spreadMethod", "enumeration"],
    ["href", "string"],
  ]],
  [SVGFEDisplacementMapElement, [
    ["in1", "string", "in"],
    ["in2", "string", "in2"],
    ["scale", "number"],
    ["xChannelSelector", "enumeration"],
    ["yChannelSelector", "enumeration"],
    ...filterPrimitiveProperties(false),
  ]],
  [SVGFETurbulenceElement, [
    ["baseFrequencyX", "numberFirst", "baseFrequency"],
    ["baseFrequencyY", "numberSecond", "baseFrequency"],
    ["numOctaves", "integer"],
    ["seed", "number"],
    ["stitchTiles", "enumeration"],
    ["type", "enumeration"],
    ...filterPrimitiveProperties(false),
  ]],
  [SVGFEConvolveMatrixElement, [
    ["in1", "string", "in"],
    ["orderX", "integer", "order"],
    ["orderY", "integer", "order"],
    ["kernelMatrix", "numberList", "kernelMatrix"],
    ["divisor", "number"],
    ["bias", "number"],
    ["targetX", "integer"],
    ["targetY", "integer"],
    ["edgeMode", "enumeration"],
    ["kernelUnitLengthX", "numberFirst", "kernelUnitLength"],
    ["kernelUnitLengthY", "numberSecond", "kernelUnitLength"],
    ["preserveAlpha", "boolean"],
    ...filterPrimitiveProperties(false),
  ]],
  [SVGFECompositeElement, [
    ["in2", "string", "in2"],
    ["in1", "string", "in"],
    ["operator", "enumeration"],
    ["k1", "number"],
    ["k2", "number"],
    ["k3", "number"],
    ["k4", "number"],
    ...filterPrimitiveProperties(false),
  ]],
  [SVGFEBlendElement, [
    ["in1", "string", "in"],
    ["in2", "string", "in2"],
    ["mode", "enumeration"],
    ...filterPrimitiveProperties(false),
  ]],
  [SVGMarkerElement, [
    ["refX", "length"],
    ["refY", "length"],
    ["markerUnits", "enumeration"],
    ["markerWidth", "length"],
    ["markerHeight", "length"],
    ["orientType", "enumeration"],
    ["orientAngle", "angle", "orient"],
    ["viewBox", "rect"],
    ["preserveAspectRatio", "aspectRatio"],
  ]],
  [SVGTextPositioningElement, [
    ["x", "lengthList"],
    ["y", "lengthList"],
    ["dx", "lengthList"],
    ["dy", "lengthList"],
    ["rotate", "numberList"],
  ]],
  [SVGViewElement, [
    ["viewBox", "rect"],
    ["preserveAspectRatio", "aspectRatio"],
    ["zoomAndPan", "plainNumber", "zoomAndPan", 2],
  ]],
  [SVGTextPathElement, [
    ["startOffset", "length"],
    ["method", "enumeration"],
    ["spacing", "enumeration"],
    ["href", "string"],
  ]],
  [SVGMaskElement, [
    ["maskUnits", "enumeration"],
    ["maskContentUnits", "enumeration"],
    ["x", "length"],
    ["y", "length"],
    ["width", "length"],
    ["height", "length"],
    ["requiredExtensions", "stringList"],
    ["systemLanguage", "stringList"],
  ]],
  [SVGPatternElement, [
    ["patternUnits", "enumeration"],
    ["patternContentUnits", "enumeration"],
    ["patternTransform", "transform"],
    ["x", "length"],
    ["y", "length"],
    ["width", "length"],
    ["height", "length"],
    ["viewBox", "rect"],
    ["preserveAspectRatio", "aspectRatio"],
    ["href", "string"],
    ["requiredExtensions", "stringList"],
    ["systemLanguage", "stringList"],
  ]],
  [SVGImageElement, [
    ["x", "length"],
    ["y", "length"],
    ["width", "length"],
    ["height", "length"],
    ["preserveAspectRatio", "aspectRatio"],
    ["decoding", "plainString", "decoding", "auto"],
    ["crossOrigin", "plainNullableString", "crossorigin"],
    ["href", "string"],
  ]],
  [SVGAnimationElement, [
    ["targetElement", "plainNull"],
    ["onbegin", "plainNull"],
    ["onend", "plainNull"],
    ["onrepeat", "plainNull"],
    ["requiredExtensions", "stringList"],
    ["systemLanguage", "stringList"],
  ]],
  [SVGTextContentElement, [
    ["textLength", "length"],
    ["lengthAdjust", "enumeration"],
  ]],
];

export function installSVGBasicAttributeElementMembers() {
  do {
    reopenPrototype((((((definitions)[0]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[0]))[0])).prototype,
        ("in1"),
        createSVGAttributeGetter(
          (((((definitions)[0]))[0])).name,
          ("in1"),
          ("string"),
          ("in"),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[0]))[0])));
    installSpecialMethods((((((definitions)[0]))[0])));
    closePrototype((((((definitions)[0]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[1]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[1]))[0])).prototype,
        ("href"),
        createSVGAttributeGetter(
          (((((definitions)[1]))[0])).name,
          ("href"),
          ("string"),
          (("href")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[1]))[0])));
    installSpecialMethods((((((definitions)[1]))[0])));
    closePrototype((((((definitions)[1]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[2]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[2]))[0])).prototype,
        ("offset"),
        createSVGAttributeGetter(
          (((((definitions)[2]))[0])).name,
          ("offset"),
          ("number"),
          (("offset")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[2]))[0])));
    installSpecialMethods((((((definitions)[2]))[0])));
    closePrototype((((((definitions)[2]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[3]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[3]))[0])).prototype,
        ("clipPathUnits"),
        createSVGAttributeGetter(
          (((((definitions)[3]))[0])).name,
          ("clipPathUnits"),
          ("enumeration"),
          (("clipPathUnits")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[3]))[0])).prototype,
        ("transform"),
        createSVGAttributeGetter(
          (((((definitions)[3]))[0])).name,
          ("transform"),
          ("transform"),
          (("transform")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[3]))[0])));
    installSpecialMethods((((((definitions)[3]))[0])));
    closePrototype((((((definitions)[3]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[4]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[4]))[0])).prototype,
        ("azimuth"),
        createSVGAttributeGetter(
          (((((definitions)[4]))[0])).name,
          ("azimuth"),
          ("number"),
          (("azimuth")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[4]))[0])).prototype,
        ("elevation"),
        createSVGAttributeGetter(
          (((((definitions)[4]))[0])).name,
          ("elevation"),
          ("number"),
          (("elevation")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[4]))[0])));
    installSpecialMethods((((((definitions)[4]))[0])));
    closePrototype((((((definitions)[4]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[5]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[5]))[0])).prototype,
        ("viewBox"),
        createSVGAttributeGetter(
          (((((definitions)[5]))[0])).name,
          ("viewBox"),
          ("rect"),
          (("viewBox")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[5]))[0])).prototype,
        ("preserveAspectRatio"),
        createSVGAttributeGetter(
          (((((definitions)[5]))[0])).name,
          ("preserveAspectRatio"),
          ("aspectRatio"),
          (("preserveAspectRatio")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[5]))[0])));
    installSpecialMethods((((((definitions)[5]))[0])));
    closePrototype((((((definitions)[5]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[6]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[6]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[6]))[0])).name,
          ("x"),
          ("number"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[6]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[6]))[0])).name,
          ("y"),
          ("number"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[6]))[0])).prototype,
        ("z"),
        createSVGAttributeGetter(
          (((((definitions)[6]))[0])).name,
          ("z"),
          ("number"),
          (("z")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[6]))[0])));
    installSpecialMethods((((((definitions)[6]))[0])));
    closePrototype((((((definitions)[6]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[7]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[7]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[7]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[7]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[7]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[7]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[7]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[7]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[7]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[7]))[0])));
    installSpecialMethods((((((definitions)[7]))[0])));
    closePrototype((((((definitions)[7]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[8]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[8]))[0])).prototype,
        ("x1"),
        createSVGAttributeGetter(
          (((((definitions)[8]))[0])).name,
          ("x1"),
          ("length"),
          (("x1")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[8]))[0])).prototype,
        ("y1"),
        createSVGAttributeGetter(
          (((((definitions)[8]))[0])).name,
          ("y1"),
          ("length"),
          (("y1")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[8]))[0])).prototype,
        ("x2"),
        createSVGAttributeGetter(
          (((((definitions)[8]))[0])).name,
          ("x2"),
          ("length"),
          (("x2")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[8]))[0])).prototype,
        ("y2"),
        createSVGAttributeGetter(
          (((((definitions)[8]))[0])).name,
          ("y2"),
          ("length"),
          (("y2")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[8]))[0])));
    installSpecialMethods((((((definitions)[8]))[0])));
    closePrototype((((((definitions)[8]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[9]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[9]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[9]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[9]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[9]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[9]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[9]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[9]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[9]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[9]))[0])).prototype,
        ("href"),
        createSVGAttributeGetter(
          (((((definitions)[9]))[0])).name,
          ("href"),
          ("string"),
          (("href")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[9]))[0])));
    installSpecialMethods((((((definitions)[9]))[0])));
    closePrototype((((((definitions)[9]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[10]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[10]))[0])).prototype,
        ("cx"),
        createSVGAttributeGetter(
          (((((definitions)[10]))[0])).name,
          ("cx"),
          ("length"),
          (("cx")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[10]))[0])).prototype,
        ("cy"),
        createSVGAttributeGetter(
          (((((definitions)[10]))[0])).name,
          ("cy"),
          ("length"),
          (("cy")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[10]))[0])).prototype,
        ("r"),
        createSVGAttributeGetter(
          (((((definitions)[10]))[0])).name,
          ("r"),
          ("length"),
          (("r")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[10]))[0])).prototype,
        ("fx"),
        createSVGAttributeGetter(
          (((((definitions)[10]))[0])).name,
          ("fx"),
          ("length"),
          (("fx")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[10]))[0])).prototype,
        ("fy"),
        createSVGAttributeGetter(
          (((((definitions)[10]))[0])).name,
          ("fy"),
          ("length"),
          (("fy")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[10]))[0])).prototype,
        ("fr"),
        createSVGAttributeGetter(
          (((((definitions)[10]))[0])).name,
          ("fr"),
          ("length"),
          (("fr")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[10]))[0])));
    installSpecialMethods((((((definitions)[10]))[0])));
    closePrototype((((((definitions)[10]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[11]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[11]))[0])).prototype,
        ("filterUnits"),
        createSVGAttributeGetter(
          (((((definitions)[11]))[0])).name,
          ("filterUnits"),
          ("enumeration"),
          (("filterUnits")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[11]))[0])).prototype,
        ("primitiveUnits"),
        createSVGAttributeGetter(
          (((((definitions)[11]))[0])).name,
          ("primitiveUnits"),
          ("enumeration"),
          (("primitiveUnits")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[11]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[11]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[11]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[11]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[11]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[11]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[11]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[11]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[11]))[0])).prototype,
        ("href"),
        createSVGAttributeGetter(
          (((((definitions)[11]))[0])).name,
          ("href"),
          ("string"),
          (("href")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[11]))[0])));
    installSpecialMethods((((((definitions)[11]))[0])));
    closePrototype((((((definitions)[11]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[12]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[12]))[0])).prototype,
        ("in1"),
        createSVGAttributeGetter(
          (((((definitions)[12]))[0])).name,
          ("in1"),
          ("string"),
          ("in"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[12]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[12]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[12]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[12]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[12]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[12]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[12]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[12]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[12]))[0])).prototype,
        ("result"),
        createSVGAttributeGetter(
          (((((definitions)[12]))[0])).name,
          ("result"),
          ("string"),
          (("result")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[12]))[0])));
    installSpecialMethods((((((definitions)[12]))[0])));
    closePrototype((((((definitions)[12]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[13]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[13]))[0])).prototype,
        ("in1"),
        createSVGAttributeGetter(
          (((((definitions)[13]))[0])).name,
          ("in1"),
          ("string"),
          ("in"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[13]))[0])).prototype,
        ("dx"),
        createSVGAttributeGetter(
          (((((definitions)[13]))[0])).name,
          ("dx"),
          ("number"),
          (("dx")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[13]))[0])).prototype,
        ("dy"),
        createSVGAttributeGetter(
          (((((definitions)[13]))[0])).name,
          ("dy"),
          ("number"),
          (("dy")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[13]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[13]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[13]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[13]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[13]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[13]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[13]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[13]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[13]))[0])).prototype,
        ("result"),
        createSVGAttributeGetter(
          (((((definitions)[13]))[0])).name,
          ("result"),
          ("string"),
          (("result")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[13]))[0])));
    installSpecialMethods((((((definitions)[13]))[0])));
    closePrototype((((((definitions)[13]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[14]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[14]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[14]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[14]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[14]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[14]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[14]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[14]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[14]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[14]))[0])).prototype,
        ("result"),
        createSVGAttributeGetter(
          (((((definitions)[14]))[0])).name,
          ("result"),
          ("string"),
          (("result")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[14]))[0])));
    installSpecialMethods((((((definitions)[14]))[0])));
    closePrototype((((((definitions)[14]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[15]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[15]))[0])).prototype,
        ("preserveAspectRatio"),
        createSVGAttributeGetter(
          (((((definitions)[15]))[0])).name,
          ("preserveAspectRatio"),
          ("aspectRatio"),
          (("preserveAspectRatio")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[15]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[15]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[15]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[15]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[15]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[15]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[15]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[15]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[15]))[0])).prototype,
        ("result"),
        createSVGAttributeGetter(
          (((((definitions)[15]))[0])).name,
          ("result"),
          ("string"),
          (("result")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[15]))[0])).prototype,
        ("href"),
        createSVGAttributeGetter(
          (((((definitions)[15]))[0])).name,
          ("href"),
          ("string"),
          (("href")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[15]))[0])));
    installSpecialMethods((((((definitions)[15]))[0])));
    closePrototype((((((definitions)[15]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[16]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[16]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[16]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[16]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[16]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[16]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[16]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[16]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[16]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[16]))[0])).prototype,
        ("result"),
        createSVGAttributeGetter(
          (((((definitions)[16]))[0])).name,
          ("result"),
          ("string"),
          (("result")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[16]))[0])));
    installSpecialMethods((((((definitions)[16]))[0])));
    closePrototype((((((definitions)[16]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[17]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[17]))[0])).prototype,
        ("in1"),
        createSVGAttributeGetter(
          (((((definitions)[17]))[0])).name,
          ("in1"),
          ("string"),
          ("in"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[17]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[17]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[17]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[17]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[17]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[17]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[17]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[17]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[17]))[0])).prototype,
        ("result"),
        createSVGAttributeGetter(
          (((((definitions)[17]))[0])).name,
          ("result"),
          ("string"),
          (("result")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[17]))[0])));
    installSpecialMethods((((((definitions)[17]))[0])));
    closePrototype((((((definitions)[17]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[18]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[18]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[18]))[0])).name,
          ("x"),
          ("number"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[18]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[18]))[0])).name,
          ("y"),
          ("number"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[18]))[0])).prototype,
        ("z"),
        createSVGAttributeGetter(
          (((((definitions)[18]))[0])).name,
          ("z"),
          ("number"),
          (("z")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[18]))[0])).prototype,
        ("pointsAtX"),
        createSVGAttributeGetter(
          (((((definitions)[18]))[0])).name,
          ("pointsAtX"),
          ("number"),
          ("pointsAtX"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[18]))[0])).prototype,
        ("pointsAtY"),
        createSVGAttributeGetter(
          (((((definitions)[18]))[0])).name,
          ("pointsAtY"),
          ("number"),
          ("pointsAtY"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[18]))[0])).prototype,
        ("pointsAtZ"),
        createSVGAttributeGetter(
          (((((definitions)[18]))[0])).name,
          ("pointsAtZ"),
          ("number"),
          ("pointsAtZ"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[18]))[0])).prototype,
        ("specularExponent"),
        createSVGAttributeGetter(
          (((((definitions)[18]))[0])).name,
          ("specularExponent"),
          ("number"),
          (("specularExponent")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[18]))[0])).prototype,
        ("limitingConeAngle"),
        createSVGAttributeGetter(
          (((((definitions)[18]))[0])).name,
          ("limitingConeAngle"),
          ("number"),
          (("limitingConeAngle")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[18]))[0])));
    installSpecialMethods((((((definitions)[18]))[0])));
    closePrototype((((((definitions)[18]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[19]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[19]))[0])).prototype,
        ("in1"),
        createSVGAttributeGetter(
          (((((definitions)[19]))[0])).name,
          ("in1"),
          ("string"),
          ("in"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[19]))[0])).prototype,
        ("surfaceScale"),
        createSVGAttributeGetter(
          (((((definitions)[19]))[0])).name,
          ("surfaceScale"),
          ("number"),
          (("surfaceScale")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[19]))[0])).prototype,
        ("specularConstant"),
        createSVGAttributeGetter(
          (((((definitions)[19]))[0])).name,
          ("specularConstant"),
          ("number"),
          (("specularConstant")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[19]))[0])).prototype,
        ("specularExponent"),
        createSVGAttributeGetter(
          (((((definitions)[19]))[0])).name,
          ("specularExponent"),
          ("number"),
          (("specularExponent")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[19]))[0])).prototype,
        ("kernelUnitLengthX"),
        createSVGAttributeGetter(
          (((((definitions)[19]))[0])).name,
          ("kernelUnitLengthX"),
          ("numberFirst"),
          ("kernelUnitLength"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[19]))[0])).prototype,
        ("kernelUnitLengthY"),
        createSVGAttributeGetter(
          (((((definitions)[19]))[0])).name,
          ("kernelUnitLengthY"),
          ("numberSecond"),
          ("kernelUnitLength"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[19]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[19]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[19]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[19]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[19]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[19]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[19]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[19]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[19]))[0])).prototype,
        ("result"),
        createSVGAttributeGetter(
          (((((definitions)[19]))[0])).name,
          ("result"),
          ("string"),
          (("result")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[19]))[0])));
    installSpecialMethods((((((definitions)[19]))[0])));
    closePrototype((((((definitions)[19]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[20]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[20]))[0])).prototype,
        ("in1"),
        createSVGAttributeGetter(
          (((((definitions)[20]))[0])).name,
          ("in1"),
          ("string"),
          ("in"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[20]))[0])).prototype,
        ("operator"),
        createSVGAttributeGetter(
          (((((definitions)[20]))[0])).name,
          ("operator"),
          ("enumeration"),
          (("operator")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[20]))[0])).prototype,
        ("radiusX"),
        createSVGAttributeGetter(
          (((((definitions)[20]))[0])).name,
          ("radiusX"),
          ("numberFirst"),
          ("radius"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[20]))[0])).prototype,
        ("radiusY"),
        createSVGAttributeGetter(
          (((((definitions)[20]))[0])).name,
          ("radiusY"),
          ("numberSecond"),
          ("radius"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[20]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[20]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[20]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[20]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[20]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[20]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[20]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[20]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[20]))[0])).prototype,
        ("result"),
        createSVGAttributeGetter(
          (((((definitions)[20]))[0])).name,
          ("result"),
          ("string"),
          (("result")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[20]))[0])));
    installSpecialMethods((((((definitions)[20]))[0])));
    closePrototype((((((definitions)[20]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[21]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[21]))[0])).prototype,
        ("in1"),
        createSVGAttributeGetter(
          (((((definitions)[21]))[0])).name,
          ("in1"),
          ("string"),
          ("in"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[21]))[0])).prototype,
        ("stdDeviationX"),
        createSVGAttributeGetter(
          (((((definitions)[21]))[0])).name,
          ("stdDeviationX"),
          ("numberFirst"),
          ("stdDeviation"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[21]))[0])).prototype,
        ("stdDeviationY"),
        createSVGAttributeGetter(
          (((((definitions)[21]))[0])).name,
          ("stdDeviationY"),
          ("numberSecond"),
          ("stdDeviation"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[21]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[21]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[21]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[21]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[21]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[21]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[21]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[21]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[21]))[0])).prototype,
        ("result"),
        createSVGAttributeGetter(
          (((((definitions)[21]))[0])).name,
          ("result"),
          ("string"),
          (("result")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[21]))[0])));
    installSpecialMethods((((((definitions)[21]))[0])));
    closePrototype((((((definitions)[21]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[22]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[22]))[0])).prototype,
        ("in1"),
        createSVGAttributeGetter(
          (((((definitions)[22]))[0])).name,
          ("in1"),
          ("string"),
          ("in"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[22]))[0])).prototype,
        ("dx"),
        createSVGAttributeGetter(
          (((((definitions)[22]))[0])).name,
          ("dx"),
          ("number"),
          (("dx")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[22]))[0])).prototype,
        ("dy"),
        createSVGAttributeGetter(
          (((((definitions)[22]))[0])).name,
          ("dy"),
          ("number"),
          (("dy")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[22]))[0])).prototype,
        ("stdDeviationX"),
        createSVGAttributeGetter(
          (((((definitions)[22]))[0])).name,
          ("stdDeviationX"),
          ("numberFirst"),
          ("stdDeviation"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[22]))[0])).prototype,
        ("stdDeviationY"),
        createSVGAttributeGetter(
          (((((definitions)[22]))[0])).name,
          ("stdDeviationY"),
          ("numberSecond"),
          ("stdDeviation"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[22]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[22]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[22]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[22]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[22]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[22]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[22]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[22]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[22]))[0])).prototype,
        ("result"),
        createSVGAttributeGetter(
          (((((definitions)[22]))[0])).name,
          ("result"),
          ("string"),
          (("result")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[22]))[0])));
    installSpecialMethods((((((definitions)[22]))[0])));
    closePrototype((((((definitions)[22]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[23]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[23]))[0])).prototype,
        ("in1"),
        createSVGAttributeGetter(
          (((((definitions)[23]))[0])).name,
          ("in1"),
          ("string"),
          ("in"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[23]))[0])).prototype,
        ("surfaceScale"),
        createSVGAttributeGetter(
          (((((definitions)[23]))[0])).name,
          ("surfaceScale"),
          ("number"),
          (("surfaceScale")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[23]))[0])).prototype,
        ("diffuseConstant"),
        createSVGAttributeGetter(
          (((((definitions)[23]))[0])).name,
          ("diffuseConstant"),
          ("number"),
          (("diffuseConstant")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[23]))[0])).prototype,
        ("kernelUnitLengthX"),
        createSVGAttributeGetter(
          (((((definitions)[23]))[0])).name,
          ("kernelUnitLengthX"),
          ("numberFirst"),
          ("kernelUnitLength"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[23]))[0])).prototype,
        ("kernelUnitLengthY"),
        createSVGAttributeGetter(
          (((((definitions)[23]))[0])).name,
          ("kernelUnitLengthY"),
          ("numberSecond"),
          ("kernelUnitLength"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[23]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[23]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[23]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[23]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[23]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[23]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[23]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[23]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[23]))[0])).prototype,
        ("result"),
        createSVGAttributeGetter(
          (((((definitions)[23]))[0])).name,
          ("result"),
          ("string"),
          (("result")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[23]))[0])));
    installSpecialMethods((((((definitions)[23]))[0])));
    closePrototype((((((definitions)[23]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[24]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[24]))[0])).prototype,
        ("in1"),
        createSVGAttributeGetter(
          (((((definitions)[24]))[0])).name,
          ("in1"),
          ("string"),
          ("in"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[24]))[0])).prototype,
        ("type"),
        createSVGAttributeGetter(
          (((((definitions)[24]))[0])).name,
          ("type"),
          ("enumeration"),
          (("type")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[24]))[0])).prototype,
        ("values"),
        createSVGAttributeGetter(
          (((((definitions)[24]))[0])).name,
          ("values"),
          ("numberList"),
          (("values")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[24]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[24]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[24]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[24]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[24]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[24]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[24]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[24]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[24]))[0])).prototype,
        ("result"),
        createSVGAttributeGetter(
          (((((definitions)[24]))[0])).name,
          ("result"),
          ("string"),
          (("result")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[24]))[0])));
    installSpecialMethods((((((definitions)[24]))[0])));
    closePrototype((((((definitions)[24]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[25]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[25]))[0])).prototype,
        ("type"),
        createSVGAttributeGetter(
          (((((definitions)[25]))[0])).name,
          ("type"),
          ("enumeration"),
          (("type")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[25]))[0])).prototype,
        ("tableValues"),
        createSVGAttributeGetter(
          (((((definitions)[25]))[0])).name,
          ("tableValues"),
          ("numberList"),
          (("tableValues")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[25]))[0])).prototype,
        ("slope"),
        createSVGAttributeGetter(
          (((((definitions)[25]))[0])).name,
          ("slope"),
          ("number"),
          (("slope")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[25]))[0])).prototype,
        ("intercept"),
        createSVGAttributeGetter(
          (((((definitions)[25]))[0])).name,
          ("intercept"),
          ("number"),
          (("intercept")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[25]))[0])).prototype,
        ("amplitude"),
        createSVGAttributeGetter(
          (((((definitions)[25]))[0])).name,
          ("amplitude"),
          ("number"),
          (("amplitude")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[25]))[0])).prototype,
        ("exponent"),
        createSVGAttributeGetter(
          (((((definitions)[25]))[0])).name,
          ("exponent"),
          ("number"),
          (("exponent")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[25]))[0])).prototype,
        ("offset"),
        createSVGAttributeGetter(
          (((((definitions)[25]))[0])).name,
          ("offset"),
          ("number"),
          (("offset")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[25]))[0])));
    installSpecialMethods((((((definitions)[25]))[0])));
    closePrototype((((((definitions)[25]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[26]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[26]))[0])).prototype,
        ("gradientUnits"),
        createSVGAttributeGetter(
          (((((definitions)[26]))[0])).name,
          ("gradientUnits"),
          ("enumeration"),
          (("gradientUnits")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[26]))[0])).prototype,
        ("gradientTransform"),
        createSVGAttributeGetter(
          (((((definitions)[26]))[0])).name,
          ("gradientTransform"),
          ("transform"),
          (("gradientTransform")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[26]))[0])).prototype,
        ("spreadMethod"),
        createSVGAttributeGetter(
          (((((definitions)[26]))[0])).name,
          ("spreadMethod"),
          ("enumeration"),
          (("spreadMethod")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[26]))[0])).prototype,
        ("href"),
        createSVGAttributeGetter(
          (((((definitions)[26]))[0])).name,
          ("href"),
          ("string"),
          (("href")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[26]))[0])));
    installSpecialMethods((((((definitions)[26]))[0])));
    closePrototype((((((definitions)[26]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[27]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[27]))[0])).prototype,
        ("in1"),
        createSVGAttributeGetter(
          (((((definitions)[27]))[0])).name,
          ("in1"),
          ("string"),
          ("in"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[27]))[0])).prototype,
        ("in2"),
        createSVGAttributeGetter(
          (((((definitions)[27]))[0])).name,
          ("in2"),
          ("string"),
          ("in2"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[27]))[0])).prototype,
        ("scale"),
        createSVGAttributeGetter(
          (((((definitions)[27]))[0])).name,
          ("scale"),
          ("number"),
          (("scale")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[27]))[0])).prototype,
        ("xChannelSelector"),
        createSVGAttributeGetter(
          (((((definitions)[27]))[0])).name,
          ("xChannelSelector"),
          ("enumeration"),
          (("xChannelSelector")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[27]))[0])).prototype,
        ("yChannelSelector"),
        createSVGAttributeGetter(
          (((((definitions)[27]))[0])).name,
          ("yChannelSelector"),
          ("enumeration"),
          (("yChannelSelector")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[27]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[27]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[27]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[27]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[27]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[27]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[27]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[27]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[27]))[0])).prototype,
        ("result"),
        createSVGAttributeGetter(
          (((((definitions)[27]))[0])).name,
          ("result"),
          ("string"),
          (("result")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[27]))[0])));
    installSpecialMethods((((((definitions)[27]))[0])));
    closePrototype((((((definitions)[27]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[28]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[28]))[0])).prototype,
        ("baseFrequencyX"),
        createSVGAttributeGetter(
          (((((definitions)[28]))[0])).name,
          ("baseFrequencyX"),
          ("numberFirst"),
          ("baseFrequency"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[28]))[0])).prototype,
        ("baseFrequencyY"),
        createSVGAttributeGetter(
          (((((definitions)[28]))[0])).name,
          ("baseFrequencyY"),
          ("numberSecond"),
          ("baseFrequency"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[28]))[0])).prototype,
        ("numOctaves"),
        createSVGAttributeGetter(
          (((((definitions)[28]))[0])).name,
          ("numOctaves"),
          ("integer"),
          (("numOctaves")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[28]))[0])).prototype,
        ("seed"),
        createSVGAttributeGetter(
          (((((definitions)[28]))[0])).name,
          ("seed"),
          ("number"),
          (("seed")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[28]))[0])).prototype,
        ("stitchTiles"),
        createSVGAttributeGetter(
          (((((definitions)[28]))[0])).name,
          ("stitchTiles"),
          ("enumeration"),
          (("stitchTiles")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[28]))[0])).prototype,
        ("type"),
        createSVGAttributeGetter(
          (((((definitions)[28]))[0])).name,
          ("type"),
          ("enumeration"),
          (("type")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[28]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[28]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[28]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[28]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[28]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[28]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[28]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[28]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[28]))[0])).prototype,
        ("result"),
        createSVGAttributeGetter(
          (((((definitions)[28]))[0])).name,
          ("result"),
          ("string"),
          (("result")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[28]))[0])));
    installSpecialMethods((((((definitions)[28]))[0])));
    closePrototype((((((definitions)[28]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[29]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[29]))[0])).prototype,
        ("in1"),
        createSVGAttributeGetter(
          (((((definitions)[29]))[0])).name,
          ("in1"),
          ("string"),
          ("in"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[29]))[0])).prototype,
        ("orderX"),
        createSVGAttributeGetter(
          (((((definitions)[29]))[0])).name,
          ("orderX"),
          ("integer"),
          ("order"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[29]))[0])).prototype,
        ("orderY"),
        createSVGAttributeGetter(
          (((((definitions)[29]))[0])).name,
          ("orderY"),
          ("integer"),
          ("order"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[29]))[0])).prototype,
        ("kernelMatrix"),
        createSVGAttributeGetter(
          (((((definitions)[29]))[0])).name,
          ("kernelMatrix"),
          ("numberList"),
          ("kernelMatrix"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[29]))[0])).prototype,
        ("divisor"),
        createSVGAttributeGetter(
          (((((definitions)[29]))[0])).name,
          ("divisor"),
          ("number"),
          (("divisor")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[29]))[0])).prototype,
        ("bias"),
        createSVGAttributeGetter(
          (((((definitions)[29]))[0])).name,
          ("bias"),
          ("number"),
          (("bias")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[29]))[0])).prototype,
        ("targetX"),
        createSVGAttributeGetter(
          (((((definitions)[29]))[0])).name,
          ("targetX"),
          ("integer"),
          (("targetX")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[29]))[0])).prototype,
        ("targetY"),
        createSVGAttributeGetter(
          (((((definitions)[29]))[0])).name,
          ("targetY"),
          ("integer"),
          (("targetY")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[29]))[0])).prototype,
        ("edgeMode"),
        createSVGAttributeGetter(
          (((((definitions)[29]))[0])).name,
          ("edgeMode"),
          ("enumeration"),
          (("edgeMode")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[29]))[0])).prototype,
        ("kernelUnitLengthX"),
        createSVGAttributeGetter(
          (((((definitions)[29]))[0])).name,
          ("kernelUnitLengthX"),
          ("numberFirst"),
          ("kernelUnitLength"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[29]))[0])).prototype,
        ("kernelUnitLengthY"),
        createSVGAttributeGetter(
          (((((definitions)[29]))[0])).name,
          ("kernelUnitLengthY"),
          ("numberSecond"),
          ("kernelUnitLength"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[29]))[0])).prototype,
        ("preserveAlpha"),
        createSVGAttributeGetter(
          (((((definitions)[29]))[0])).name,
          ("preserveAlpha"),
          ("boolean"),
          (("preserveAlpha")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[29]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[29]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[29]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[29]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[29]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[29]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[29]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[29]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[29]))[0])).prototype,
        ("result"),
        createSVGAttributeGetter(
          (((((definitions)[29]))[0])).name,
          ("result"),
          ("string"),
          (("result")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[29]))[0])));
    installSpecialMethods((((((definitions)[29]))[0])));
    closePrototype((((((definitions)[29]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[30]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[30]))[0])).prototype,
        ("in2"),
        createSVGAttributeGetter(
          (((((definitions)[30]))[0])).name,
          ("in2"),
          ("string"),
          ("in2"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[30]))[0])).prototype,
        ("in1"),
        createSVGAttributeGetter(
          (((((definitions)[30]))[0])).name,
          ("in1"),
          ("string"),
          ("in"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[30]))[0])).prototype,
        ("operator"),
        createSVGAttributeGetter(
          (((((definitions)[30]))[0])).name,
          ("operator"),
          ("enumeration"),
          (("operator")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[30]))[0])).prototype,
        ("k1"),
        createSVGAttributeGetter(
          (((((definitions)[30]))[0])).name,
          ("k1"),
          ("number"),
          (("k1")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[30]))[0])).prototype,
        ("k2"),
        createSVGAttributeGetter(
          (((((definitions)[30]))[0])).name,
          ("k2"),
          ("number"),
          (("k2")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[30]))[0])).prototype,
        ("k3"),
        createSVGAttributeGetter(
          (((((definitions)[30]))[0])).name,
          ("k3"),
          ("number"),
          (("k3")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[30]))[0])).prototype,
        ("k4"),
        createSVGAttributeGetter(
          (((((definitions)[30]))[0])).name,
          ("k4"),
          ("number"),
          (("k4")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[30]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[30]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[30]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[30]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[30]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[30]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[30]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[30]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[30]))[0])).prototype,
        ("result"),
        createSVGAttributeGetter(
          (((((definitions)[30]))[0])).name,
          ("result"),
          ("string"),
          (("result")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[30]))[0])));
    installSpecialMethods((((((definitions)[30]))[0])));
    closePrototype((((((definitions)[30]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[31]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[31]))[0])).prototype,
        ("in1"),
        createSVGAttributeGetter(
          (((((definitions)[31]))[0])).name,
          ("in1"),
          ("string"),
          ("in"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[31]))[0])).prototype,
        ("in2"),
        createSVGAttributeGetter(
          (((((definitions)[31]))[0])).name,
          ("in2"),
          ("string"),
          ("in2"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[31]))[0])).prototype,
        ("mode"),
        createSVGAttributeGetter(
          (((((definitions)[31]))[0])).name,
          ("mode"),
          ("enumeration"),
          (("mode")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[31]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[31]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[31]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[31]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[31]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[31]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[31]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[31]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[31]))[0])).prototype,
        ("result"),
        createSVGAttributeGetter(
          (((((definitions)[31]))[0])).name,
          ("result"),
          ("string"),
          (("result")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[31]))[0])));
    installSpecialMethods((((((definitions)[31]))[0])));
    closePrototype((((((definitions)[31]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[32]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[32]))[0])).prototype,
        ("refX"),
        createSVGAttributeGetter(
          (((((definitions)[32]))[0])).name,
          ("refX"),
          ("length"),
          (("refX")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[32]))[0])).prototype,
        ("refY"),
        createSVGAttributeGetter(
          (((((definitions)[32]))[0])).name,
          ("refY"),
          ("length"),
          (("refY")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[32]))[0])).prototype,
        ("markerUnits"),
        createSVGAttributeGetter(
          (((((definitions)[32]))[0])).name,
          ("markerUnits"),
          ("enumeration"),
          (("markerUnits")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[32]))[0])).prototype,
        ("markerWidth"),
        createSVGAttributeGetter(
          (((((definitions)[32]))[0])).name,
          ("markerWidth"),
          ("length"),
          (("markerWidth")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[32]))[0])).prototype,
        ("markerHeight"),
        createSVGAttributeGetter(
          (((((definitions)[32]))[0])).name,
          ("markerHeight"),
          ("length"),
          (("markerHeight")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[32]))[0])).prototype,
        ("orientType"),
        createSVGAttributeGetter(
          (((((definitions)[32]))[0])).name,
          ("orientType"),
          ("enumeration"),
          (("orientType")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[32]))[0])).prototype,
        ("orientAngle"),
        createSVGAttributeGetter(
          (((((definitions)[32]))[0])).name,
          ("orientAngle"),
          ("angle"),
          ("orient"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[32]))[0])).prototype,
        ("viewBox"),
        createSVGAttributeGetter(
          (((((definitions)[32]))[0])).name,
          ("viewBox"),
          ("rect"),
          (("viewBox")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[32]))[0])).prototype,
        ("preserveAspectRatio"),
        createSVGAttributeGetter(
          (((((definitions)[32]))[0])).name,
          ("preserveAspectRatio"),
          ("aspectRatio"),
          (("preserveAspectRatio")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[32]))[0])));
    installSpecialMethods((((((definitions)[32]))[0])));
    closePrototype((((((definitions)[32]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[33]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[33]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[33]))[0])).name,
          ("x"),
          ("lengthList"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[33]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[33]))[0])).name,
          ("y"),
          ("lengthList"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[33]))[0])).prototype,
        ("dx"),
        createSVGAttributeGetter(
          (((((definitions)[33]))[0])).name,
          ("dx"),
          ("lengthList"),
          (("dx")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[33]))[0])).prototype,
        ("dy"),
        createSVGAttributeGetter(
          (((((definitions)[33]))[0])).name,
          ("dy"),
          ("lengthList"),
          (("dy")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[33]))[0])).prototype,
        ("rotate"),
        createSVGAttributeGetter(
          (((((definitions)[33]))[0])).name,
          ("rotate"),
          ("numberList"),
          (("rotate")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[33]))[0])));
    installSpecialMethods((((((definitions)[33]))[0])));
    closePrototype((((((definitions)[33]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[34]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[34]))[0])).prototype,
        ("viewBox"),
        createSVGAttributeGetter(
          (((((definitions)[34]))[0])).name,
          ("viewBox"),
          ("rect"),
          (("viewBox")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[34]))[0])).prototype,
        ("preserveAspectRatio"),
        createSVGAttributeGetter(
          (((((definitions)[34]))[0])).name,
          ("preserveAspectRatio"),
          ("aspectRatio"),
          (("preserveAspectRatio")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[34]))[0])).prototype,
        ("zoomAndPan"),
        createSVGAttributeGetter(
          (((((definitions)[34]))[0])).name,
          ("zoomAndPan"),
          ("plainNumber"),
          ("zoomAndPan"),
          (2),
        ),
      );
    } while (false);
    installConstants((((((definitions)[34]))[0])));
    installSpecialMethods((((((definitions)[34]))[0])));
    closePrototype((((((definitions)[34]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[35]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[35]))[0])).prototype,
        ("startOffset"),
        createSVGAttributeGetter(
          (((((definitions)[35]))[0])).name,
          ("startOffset"),
          ("length"),
          (("startOffset")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[35]))[0])).prototype,
        ("method"),
        createSVGAttributeGetter(
          (((((definitions)[35]))[0])).name,
          ("method"),
          ("enumeration"),
          (("method")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[35]))[0])).prototype,
        ("spacing"),
        createSVGAttributeGetter(
          (((((definitions)[35]))[0])).name,
          ("spacing"),
          ("enumeration"),
          (("spacing")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[35]))[0])).prototype,
        ("href"),
        createSVGAttributeGetter(
          (((((definitions)[35]))[0])).name,
          ("href"),
          ("string"),
          (("href")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[35]))[0])));
    installSpecialMethods((((((definitions)[35]))[0])));
    closePrototype((((((definitions)[35]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[36]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[36]))[0])).prototype,
        ("maskUnits"),
        createSVGAttributeGetter(
          (((((definitions)[36]))[0])).name,
          ("maskUnits"),
          ("enumeration"),
          (("maskUnits")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[36]))[0])).prototype,
        ("maskContentUnits"),
        createSVGAttributeGetter(
          (((((definitions)[36]))[0])).name,
          ("maskContentUnits"),
          ("enumeration"),
          (("maskContentUnits")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[36]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[36]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[36]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[36]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[36]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[36]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[36]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[36]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[36]))[0])).prototype,
        ("requiredExtensions"),
        createSVGAttributeGetter(
          (((((definitions)[36]))[0])).name,
          ("requiredExtensions"),
          ("stringList"),
          (("requiredExtensions")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[36]))[0])).prototype,
        ("systemLanguage"),
        createSVGAttributeGetter(
          (((((definitions)[36]))[0])).name,
          ("systemLanguage"),
          ("stringList"),
          (("systemLanguage")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[36]))[0])));
    installSpecialMethods((((((definitions)[36]))[0])));
    closePrototype((((((definitions)[36]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[37]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[37]))[0])).prototype,
        ("patternUnits"),
        createSVGAttributeGetter(
          (((((definitions)[37]))[0])).name,
          ("patternUnits"),
          ("enumeration"),
          (("patternUnits")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[37]))[0])).prototype,
        ("patternContentUnits"),
        createSVGAttributeGetter(
          (((((definitions)[37]))[0])).name,
          ("patternContentUnits"),
          ("enumeration"),
          (("patternContentUnits")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[37]))[0])).prototype,
        ("patternTransform"),
        createSVGAttributeGetter(
          (((((definitions)[37]))[0])).name,
          ("patternTransform"),
          ("transform"),
          (("patternTransform")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[37]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[37]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[37]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[37]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[37]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[37]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[37]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[37]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[37]))[0])).prototype,
        ("viewBox"),
        createSVGAttributeGetter(
          (((((definitions)[37]))[0])).name,
          ("viewBox"),
          ("rect"),
          (("viewBox")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[37]))[0])).prototype,
        ("preserveAspectRatio"),
        createSVGAttributeGetter(
          (((((definitions)[37]))[0])).name,
          ("preserveAspectRatio"),
          ("aspectRatio"),
          (("preserveAspectRatio")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[37]))[0])).prototype,
        ("href"),
        createSVGAttributeGetter(
          (((((definitions)[37]))[0])).name,
          ("href"),
          ("string"),
          (("href")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[37]))[0])).prototype,
        ("requiredExtensions"),
        createSVGAttributeGetter(
          (((((definitions)[37]))[0])).name,
          ("requiredExtensions"),
          ("stringList"),
          (("requiredExtensions")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[37]))[0])).prototype,
        ("systemLanguage"),
        createSVGAttributeGetter(
          (((((definitions)[37]))[0])).name,
          ("systemLanguage"),
          ("stringList"),
          (("systemLanguage")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[37]))[0])));
    installSpecialMethods((((((definitions)[37]))[0])));
    closePrototype((((((definitions)[37]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[38]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[38]))[0])).prototype,
        ("x"),
        createSVGAttributeGetter(
          (((((definitions)[38]))[0])).name,
          ("x"),
          ("length"),
          (("x")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[38]))[0])).prototype,
        ("y"),
        createSVGAttributeGetter(
          (((((definitions)[38]))[0])).name,
          ("y"),
          ("length"),
          (("y")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[38]))[0])).prototype,
        ("width"),
        createSVGAttributeGetter(
          (((((definitions)[38]))[0])).name,
          ("width"),
          ("length"),
          (("width")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[38]))[0])).prototype,
        ("height"),
        createSVGAttributeGetter(
          (((((definitions)[38]))[0])).name,
          ("height"),
          ("length"),
          (("height")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[38]))[0])).prototype,
        ("preserveAspectRatio"),
        createSVGAttributeGetter(
          (((((definitions)[38]))[0])).name,
          ("preserveAspectRatio"),
          ("aspectRatio"),
          (("preserveAspectRatio")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[38]))[0])).prototype,
        ("decoding"),
        createSVGAttributeGetter(
          (((((definitions)[38]))[0])).name,
          ("decoding"),
          ("plainString"),
          ("decoding"),
          ("auto"),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[38]))[0])).prototype,
        ("crossOrigin"),
        createSVGAttributeGetter(
          (((((definitions)[38]))[0])).name,
          ("crossOrigin"),
          ("plainNullableString"),
          ("crossorigin"),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[38]))[0])).prototype,
        ("href"),
        createSVGAttributeGetter(
          (((((definitions)[38]))[0])).name,
          ("href"),
          ("string"),
          (("href")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[38]))[0])));
    installSpecialMethods((((((definitions)[38]))[0])));
    closePrototype((((((definitions)[38]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[39]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[39]))[0])).prototype,
        ("targetElement"),
        createSVGAttributeGetter(
          (((((definitions)[39]))[0])).name,
          ("targetElement"),
          ("plainNull"),
          (("targetElement")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[39]))[0])).prototype,
        ("onbegin"),
        createSVGAttributeGetter(
          (((((definitions)[39]))[0])).name,
          ("onbegin"),
          ("plainNull"),
          (("onbegin")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[39]))[0])).prototype,
        ("onend"),
        createSVGAttributeGetter(
          (((((definitions)[39]))[0])).name,
          ("onend"),
          ("plainNull"),
          (("onend")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[39]))[0])).prototype,
        ("onrepeat"),
        createSVGAttributeGetter(
          (((((definitions)[39]))[0])).name,
          ("onrepeat"),
          ("plainNull"),
          (("onrepeat")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[39]))[0])).prototype,
        ("requiredExtensions"),
        createSVGAttributeGetter(
          (((((definitions)[39]))[0])).name,
          ("requiredExtensions"),
          ("stringList"),
          (("requiredExtensions")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[39]))[0])).prototype,
        ("systemLanguage"),
        createSVGAttributeGetter(
          (((((definitions)[39]))[0])).name,
          ("systemLanguage"),
          ("stringList"),
          (("systemLanguage")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[39]))[0])));
    installSpecialMethods((((((definitions)[39]))[0])));
    closePrototype((((((definitions)[39]))[0])));
  } while (false);
do {
    reopenPrototype((((((definitions)[40]))[0])));
    do {
      definePrototypeGetter(
        (((((definitions)[40]))[0])).prototype,
        ("textLength"),
        createSVGAttributeGetter(
          (((((definitions)[40]))[0])).name,
          ("textLength"),
          ("length"),
          (("textLength")),
          (0),
        ),
      );
    } while (false);
do {
      definePrototypeGetter(
        (((((definitions)[40]))[0])).prototype,
        ("lengthAdjust"),
        createSVGAttributeGetter(
          (((((definitions)[40]))[0])).name,
          ("lengthAdjust"),
          ("enumeration"),
          (("lengthAdjust")),
          (0),
        ),
      );
    } while (false);
    installConstants((((((definitions)[40]))[0])));
    installSpecialMethods((((((definitions)[40]))[0])));
    closePrototype((((((definitions)[40]))[0])));
  } while (false);
  installScriptMembers();
  installAnchorMembers();
  installStyleMembers();
}

function installScriptMembers() {
  reopenPrototype(SVGScriptElement);
  definePrototypeAccessor(
    SVGScriptElement.prototype,
    "type",
    reflectedGetter("type", ""),
    reflectedSetter("type"),
  );
  definePrototypeGetter(
    SVGScriptElement.prototype,
    "href",
    createSVGAttributeGetter("SVGScriptElement", "href", "string"),
  );
  definePrototypeAccessor(
    SVGScriptElement.prototype,
    "async",
    reflectedGetter("async", false),
    reflectedSetter("async"),
  );
  closePrototype(SVGScriptElement);
}

function installAnchorMembers() {
  reopenPrototype(SVGAElement);
  do {
    definePrototypeAccessor(
      SVGAElement.prototype,
      ("target"),
      elementGetter(SVGAElement, ("target"), ("target"), ""),
      elementSetter(SVGAElement, ("target")),
    );
  } while (false);
do {
    definePrototypeAccessor(
      SVGAElement.prototype,
      ("rel"),
      elementGetter(SVGAElement, ("rel"), ("rel"), ""),
      elementSetter(SVGAElement, ("rel")),
    );
  } while (false);
  const relLists = new WeakMap();
  const relList = function () {
    requireInstance(this, SVGAElement);
    let result = relLists.get(this);
    if (result === undefined) {
      result = createDOMTokenList(this, "rel");
      relLists.set(this, result);
    }
    return result;
  };
  registerNativeGetter(relList, "relList");
  definePrototypeGetter(SVGAElement.prototype, "relList", relList);
  definePrototypeGetter(
    SVGAElement.prototype,
    "href",
    createSVGAttributeGetter("SVGAElement", "href", "string"),
  );
  const interestForElement = function () {
    requireInstance(this, SVGAElement);
    return null;
  };
  registerNativeGetter(interestForElement, "interestForElement");
  definePrototypeGetter(
    SVGAElement.prototype,
    "interestForElement",
    interestForElement,
  );
  do {
    definePrototypeAccessor(
      SVGAElement.prototype,
      ("download"),
      elementGetter(SVGAElement, ("download"), ("download"), ""),
      elementSetter(SVGAElement, ("download")),
    );
  } while (false);
do {
    definePrototypeAccessor(
      SVGAElement.prototype,
      ("ping"),
      elementGetter(SVGAElement, ("ping"), ("ping"), ""),
      elementSetter(SVGAElement, ("ping")),
    );
  } while (false);
do {
    definePrototypeAccessor(
      SVGAElement.prototype,
      ("hreflang"),
      elementGetter(SVGAElement, ("hreflang"), ("hreflang"), ""),
      elementSetter(SVGAElement, ("hreflang")),
    );
  } while (false);
do {
    definePrototypeAccessor(
      SVGAElement.prototype,
      ("type"),
      elementGetter(SVGAElement, ("type"), ("type"), ""),
      elementSetter(SVGAElement, ("type")),
    );
  } while (false);
do {
    definePrototypeAccessor(
      SVGAElement.prototype,
      ("referrerPolicy"),
      elementGetter(SVGAElement, ("referrerPolicy"), ("referrerPolicy"), ""),
      elementSetter(SVGAElement, ("referrerPolicy")),
    );
  } while (false);
  closePrototype(SVGAElement);
}

function installStyleMembers() {
  reopenPrototype(SVGStyleElement);
  do {
    definePrototypeAccessor(
      SVGStyleElement.prototype,
      ("type"),
      elementGetter(SVGStyleElement, ("type"), ("type"), ""),
      elementSetter(SVGStyleElement, ("type")),
    );
  } while (false);
do {
    definePrototypeAccessor(
      SVGStyleElement.prototype,
      ("media"),
      elementGetter(SVGStyleElement, ("media"), ("media"), ""),
      elementSetter(SVGStyleElement, ("media")),
    );
  } while (false);
do {
    definePrototypeAccessor(
      SVGStyleElement.prototype,
      ("title"),
      elementGetter(SVGStyleElement, ("title"), ("title"), ""),
      elementSetter(SVGStyleElement, ("title")),
    );
  } while (false);
  const sheet = function () {
    requireInstance(this, SVGStyleElement);
    return styleElementSheet(this);
  };
  registerNativeGetter(sheet, "sheet");
  definePrototypeGetter(SVGStyleElement.prototype, "sheet", sheet);
  const disabledElements = new WeakSet();
  const disabled = function () {
    requireInstance(this, SVGStyleElement);
    return disabledElements.has(this);
  };
  registerNativeGetter(disabled, "disabled");
  definePrototypeAccessor(
    SVGStyleElement.prototype,
    "disabled",
    disabled,
    function (value) {
      requireInstance(this, SVGStyleElement);
      if (Boolean(value)) disabledElements.add(this);
      else disabledElements.delete(this);
    },
  );
  closePrototype(SVGStyleElement);
}

function reflectedGetter(name, fallback) {
  const getter = function () {
    requireScript(this);
    const value = getAttributeValue(this, name);
    if (name === "async") return value !== null;
    return value ?? fallback;
  };
  registerNativeGetter(getter, name);
  return getter;
}

function reflectedSetter(name) {
  return function (value) {
    requireScript(this);
    if (name === "async" && !Boolean(value)) {
      removeAttributeValue(this, name);
      return;
    }
    setAttributeValue(this, name, name === "async" ? "" : `${value}`);
  };
}

function requireScript(value) {
  if (!(value instanceof SVGScriptElement)) throw new TypeError("Illegal invocation");
  return value;
}

function elementGetter(constructor, name, attributeName, fallback) {
  const getter = function () {
    requireInstance(this, constructor);
    return getAttributeValue(this, attributeName) ?? fallback;
  };
  registerNativeGetter(getter, name);
  return getter;
}

function elementSetter(constructor, attributeName) {
  return function (value) {
    requireInstance(this, constructor);
    setAttributeValue(this, attributeName, `${value}`);
  };
}

function requireInstance(value, constructor) {
  if (!(value instanceof constructor)) throw new TypeError("Illegal invocation");
  return value;
}

function reopenPrototype(constructor) {
  delete constructor.prototype.constructor;
  delete constructor.prototype[Symbol.toStringTag];
}

function closePrototype(constructor) {
  defineConstructorBacklink(constructor.prototype, constructor);
  defineToStringTag(constructor.prototype, constructor.name);
}

function installConstants(constructor) {
  const constants = {
    SVGGradientElement: [
      "SVG_SPREADMETHOD_UNKNOWN",
      "SVG_SPREADMETHOD_PAD",
      "SVG_SPREADMETHOD_REFLECT",
      "SVG_SPREADMETHOD_REPEAT",
    ],
    SVGFEMorphologyElement: [
      "SVG_MORPHOLOGY_OPERATOR_UNKNOWN",
      "SVG_MORPHOLOGY_OPERATOR_ERODE",
      "SVG_MORPHOLOGY_OPERATOR_DILATE",
    ],
    SVGFEColorMatrixElement: [
      "SVG_FECOLORMATRIX_TYPE_UNKNOWN",
      "SVG_FECOLORMATRIX_TYPE_MATRIX",
      "SVG_FECOLORMATRIX_TYPE_SATURATE",
      "SVG_FECOLORMATRIX_TYPE_HUEROTATE",
      "SVG_FECOLORMATRIX_TYPE_LUMINANCETOALPHA",
    ],
    SVGComponentTransferFunctionElement: [
      "SVG_FECOMPONENTTRANSFER_TYPE_UNKNOWN",
      "SVG_FECOMPONENTTRANSFER_TYPE_IDENTITY",
      "SVG_FECOMPONENTTRANSFER_TYPE_TABLE",
      "SVG_FECOMPONENTTRANSFER_TYPE_DISCRETE",
      "SVG_FECOMPONENTTRANSFER_TYPE_LINEAR",
      "SVG_FECOMPONENTTRANSFER_TYPE_GAMMA",
    ],
    SVGFEDisplacementMapElement: [
      "SVG_CHANNEL_UNKNOWN",
      "SVG_CHANNEL_R",
      "SVG_CHANNEL_G",
      "SVG_CHANNEL_B",
      "SVG_CHANNEL_A",
    ],
    SVGFETurbulenceElement: [
      "SVG_TURBULENCE_TYPE_UNKNOWN",
      "SVG_TURBULENCE_TYPE_FRACTALNOISE",
      "SVG_TURBULENCE_TYPE_TURBULENCE",
      "SVG_STITCHTYPE_UNKNOWN",
      "SVG_STITCHTYPE_STITCH",
      "SVG_STITCHTYPE_NOSTITCH",
    ],
    SVGFEConvolveMatrixElement: [
      "SVG_EDGEMODE_UNKNOWN",
      "SVG_EDGEMODE_DUPLICATE",
      "SVG_EDGEMODE_WRAP",
      "SVG_EDGEMODE_NONE",
    ],
    SVGFECompositeElement: [
      "SVG_FECOMPOSITE_OPERATOR_UNKNOWN",
      "SVG_FECOMPOSITE_OPERATOR_OVER",
      "SVG_FECOMPOSITE_OPERATOR_IN",
      "SVG_FECOMPOSITE_OPERATOR_OUT",
      "SVG_FECOMPOSITE_OPERATOR_ATOP",
      "SVG_FECOMPOSITE_OPERATOR_XOR",
      "SVG_FECOMPOSITE_OPERATOR_ARITHMETIC",
    ],
    SVGFEBlendElement: [
      "SVG_FEBLEND_MODE_UNKNOWN",
      "SVG_FEBLEND_MODE_NORMAL",
      "SVG_FEBLEND_MODE_MULTIPLY",
      "SVG_FEBLEND_MODE_SCREEN",
      "SVG_FEBLEND_MODE_DARKEN",
      "SVG_FEBLEND_MODE_LIGHTEN",
      "SVG_FEBLEND_MODE_OVERLAY",
      "SVG_FEBLEND_MODE_COLOR_DODGE",
      "SVG_FEBLEND_MODE_COLOR_BURN",
      "SVG_FEBLEND_MODE_HARD_LIGHT",
      "SVG_FEBLEND_MODE_SOFT_LIGHT",
      "SVG_FEBLEND_MODE_DIFFERENCE",
      "SVG_FEBLEND_MODE_EXCLUSION",
      "SVG_FEBLEND_MODE_HUE",
      "SVG_FEBLEND_MODE_SATURATION",
      "SVG_FEBLEND_MODE_COLOR",
      "SVG_FEBLEND_MODE_LUMINOSITY",
    ],
    SVGMarkerElement: [
      "SVG_MARKERUNITS_UNKNOWN",
      "SVG_MARKERUNITS_USERSPACEONUSE",
      "SVG_MARKERUNITS_STROKEWIDTH",
      "SVG_MARKER_ORIENT_UNKNOWN",
      "SVG_MARKER_ORIENT_AUTO",
      "SVG_MARKER_ORIENT_ANGLE",
    ],
    SVGViewElement: [
      "SVG_ZOOMANDPAN_UNKNOWN",
      "SVG_ZOOMANDPAN_DISABLE",
      "SVG_ZOOMANDPAN_MAGNIFY",
    ],
    SVGTextPathElement: [
      "TEXTPATH_METHODTYPE_UNKNOWN",
      "TEXTPATH_METHODTYPE_ALIGN",
      "TEXTPATH_METHODTYPE_STRETCH",
      "TEXTPATH_SPACINGTYPE_UNKNOWN",
      "TEXTPATH_SPACINGTYPE_AUTO",
      "TEXTPATH_SPACINGTYPE_EXACT",
    ],
    SVGTextContentElement: [
      "LENGTHADJUST_UNKNOWN",
      "LENGTHADJUST_SPACING",
      "LENGTHADJUST_SPACINGANDGLYPHS",
    ],
  }[constructor.name] ?? [];
  constants.forEach((name, index) => {
    Object.defineProperty(constructor, name, {
      value: index,
      enumerable: true,
      configurable: false,
      writable: false,
    });
    Object.defineProperty(constructor.prototype, name, {
      value: index,
      enumerable: true,
      configurable: false,
      writable: false,
    });
  });
}

function installSpecialMethods(constructor) {
  if (constructor === SVGImageElement) {
    definePrototypeMethod(
      constructor.prototype,
      "decode",
      nativeMethod("decode", 0, function () {
        if (!(this instanceof SVGImageElement)) throw new TypeError("Illegal invocation");
        return Promise.resolve();
      }),
    );
    return;
  }
  if (constructor === SVGAnimationElement) {
    const methods = [
      ["beginElement", 0, () => true],
      ["beginElementAt", 1, () => true],
      ["endElement", 0, () => true],
      ["endElementAt", 1, () => true],
      ["getCurrentTime", 0, () => 0],
      ["getSimpleDuration", 0, () => 0],
      ["getStartTime", 0, () => 0],
    ];
    do {
      definePrototypeMethod(
        constructor.prototype,
        ("beginElement"),
        nativeMethod(("beginElement"), (0), function (...args) {
          if (!(this instanceof SVGAnimationElement)) {
            throw new TypeError("Illegal invocation");
          }
          return (((((methods)[0]))[2]))(...args);
        }),
      );
    } while (false);
do {
      definePrototypeMethod(
        constructor.prototype,
        ("beginElementAt"),
        nativeMethod(("beginElementAt"), (1), function (...args) {
          if (!(this instanceof SVGAnimationElement)) {
            throw new TypeError("Illegal invocation");
          }
          return (((((methods)[1]))[2]))(...args);
        }),
      );
    } while (false);
do {
      definePrototypeMethod(
        constructor.prototype,
        ("endElement"),
        nativeMethod(("endElement"), (0), function (...args) {
          if (!(this instanceof SVGAnimationElement)) {
            throw new TypeError("Illegal invocation");
          }
          return (((((methods)[2]))[2]))(...args);
        }),
      );
    } while (false);
do {
      definePrototypeMethod(
        constructor.prototype,
        ("endElementAt"),
        nativeMethod(("endElementAt"), (1), function (...args) {
          if (!(this instanceof SVGAnimationElement)) {
            throw new TypeError("Illegal invocation");
          }
          return (((((methods)[3]))[2]))(...args);
        }),
      );
    } while (false);
do {
      definePrototypeMethod(
        constructor.prototype,
        ("getCurrentTime"),
        nativeMethod(("getCurrentTime"), (0), function (...args) {
          if (!(this instanceof SVGAnimationElement)) {
            throw new TypeError("Illegal invocation");
          }
          return (((((methods)[4]))[2]))(...args);
        }),
      );
    } while (false);
do {
      definePrototypeMethod(
        constructor.prototype,
        ("getSimpleDuration"),
        nativeMethod(("getSimpleDuration"), (0), function (...args) {
          if (!(this instanceof SVGAnimationElement)) {
            throw new TypeError("Illegal invocation");
          }
          return (((((methods)[5]))[2]))(...args);
        }),
      );
    } while (false);
do {
      definePrototypeMethod(
        constructor.prototype,
        ("getStartTime"),
        nativeMethod(("getStartTime"), (0), function (...args) {
          if (!(this instanceof SVGAnimationElement)) {
            throw new TypeError("Illegal invocation");
          }
          return (((((methods)[6]))[2]))(...args);
        }),
      );
    } while (false);
    return;
  }
  if (constructor === SVGTextContentElement) {
    installTextContentMethods(constructor);
    return;
  }
  if (constructor === SVGMarkerElement) {
    definePrototypeMethod(
      constructor.prototype,
      "setOrientToAngle",
      nativeMethod("setOrientToAngle", 1, function (angle) {
        if (!(this instanceof SVGMarkerElement)) throw new TypeError("Illegal invocation");
        const value = Number(angle?.value ?? angle);
        setAttributeValue(this, "orient", Number.isFinite(value) ? `${value}` : "0");
      }),
    );
    definePrototypeMethod(
      constructor.prototype,
      "setOrientToAuto",
      nativeMethod("setOrientToAuto", 0, function () {
        if (!(this instanceof SVGMarkerElement)) throw new TypeError("Illegal invocation");
        setAttributeValue(this, "orient", "auto");
      }),
    );
    return;
  }
  if (![SVGFEGaussianBlurElement, SVGFEDropShadowElement].includes(constructor)) {
    return;
  }
  const setStdDeviation = function setStdDeviation(x, y) {
    if (!(this instanceof constructor)) throw new TypeError("Illegal invocation");
    const first = Number.isFinite(Number(x)) ? Number(x) : 0;
    const second = Number.isFinite(Number(y)) ? Number(y) : first;
    setAttributeValue(this, "stdDeviation", `${first} ${second}`);
  };
  Object.defineProperty(setStdDeviation, "length", { value: 2, configurable: true });
  registerNativeFunction(setStdDeviation, "setStdDeviation");
  definePrototypeMethod(
    constructor.prototype,
    "setStdDeviation",
    setStdDeviation,
  );
}

function installTextContentMethods(constructor) {
  const text = value => `${value.textContent ?? ""}`;
  const index = value => Math.max(0, Math.trunc(Number(value) || 0));
  const methods = [
    ["getCharNumAtPosition", 0, function (point = { x: 0 }) {
      const location = Math.floor(Number(point.x) || 0);
      return location >= 0 && location < text(this).length ? location : -1;
    }],
    ["getComputedTextLength", 0, function () {
      return text(this).length;
    }],
    ["getEndPositionOfChar", 1, function (offset) {
      return createDOMPoint(index(offset) + 1, 0);
    }],
    ["getExtentOfChar", 1, function (offset) {
      return createDOMRect(index(offset), 0, 1, 1);
    }],
    ["getNumberOfChars", 0, function () {
      return text(this).length;
    }],
    ["getRotationOfChar", 1, function () {
      return 0;
    }],
    ["getStartPositionOfChar", 1, function (offset) {
      return createDOMPoint(index(offset), 0);
    }],
    ["getSubStringLength", 2, function (offset, count) {
      return text(this).slice(index(offset), index(offset) + index(count)).length;
    }],
    ["selectSubString", 2, function () {
      return undefined;
    }],
  ];
  do {
    definePrototypeMethod(
      constructor.prototype,
      ("getCharNumAtPosition"),
      nativeMethod(("getCharNumAtPosition"), (0), function (...args) {
        if (!(this instanceof SVGTextContentElement)) {
          throw new TypeError("Illegal invocation");
        }
        return (((((methods)[0]))[2])).apply(this, args);
      }),
    );
  } while (false);
do {
    definePrototypeMethod(
      constructor.prototype,
      ("getComputedTextLength"),
      nativeMethod(("getComputedTextLength"), (0), function (...args) {
        if (!(this instanceof SVGTextContentElement)) {
          throw new TypeError("Illegal invocation");
        }
        return (((((methods)[1]))[2])).apply(this, args);
      }),
    );
  } while (false);
do {
    definePrototypeMethod(
      constructor.prototype,
      ("getEndPositionOfChar"),
      nativeMethod(("getEndPositionOfChar"), (1), function (...args) {
        if (!(this instanceof SVGTextContentElement)) {
          throw new TypeError("Illegal invocation");
        }
        return (((((methods)[2]))[2])).apply(this, args);
      }),
    );
  } while (false);
do {
    definePrototypeMethod(
      constructor.prototype,
      ("getExtentOfChar"),
      nativeMethod(("getExtentOfChar"), (1), function (...args) {
        if (!(this instanceof SVGTextContentElement)) {
          throw new TypeError("Illegal invocation");
        }
        return (((((methods)[3]))[2])).apply(this, args);
      }),
    );
  } while (false);
do {
    definePrototypeMethod(
      constructor.prototype,
      ("getNumberOfChars"),
      nativeMethod(("getNumberOfChars"), (0), function (...args) {
        if (!(this instanceof SVGTextContentElement)) {
          throw new TypeError("Illegal invocation");
        }
        return (((((methods)[4]))[2])).apply(this, args);
      }),
    );
  } while (false);
do {
    definePrototypeMethod(
      constructor.prototype,
      ("getRotationOfChar"),
      nativeMethod(("getRotationOfChar"), (1), function (...args) {
        if (!(this instanceof SVGTextContentElement)) {
          throw new TypeError("Illegal invocation");
        }
        return (((((methods)[5]))[2])).apply(this, args);
      }),
    );
  } while (false);
do {
    definePrototypeMethod(
      constructor.prototype,
      ("getStartPositionOfChar"),
      nativeMethod(("getStartPositionOfChar"), (1), function (...args) {
        if (!(this instanceof SVGTextContentElement)) {
          throw new TypeError("Illegal invocation");
        }
        return (((((methods)[6]))[2])).apply(this, args);
      }),
    );
  } while (false);
do {
    definePrototypeMethod(
      constructor.prototype,
      ("getSubStringLength"),
      nativeMethod(("getSubStringLength"), (2), function (...args) {
        if (!(this instanceof SVGTextContentElement)) {
          throw new TypeError("Illegal invocation");
        }
        return (((((methods)[7]))[2])).apply(this, args);
      }),
    );
  } while (false);
do {
    definePrototypeMethod(
      constructor.prototype,
      ("selectSubString"),
      nativeMethod(("selectSubString"), (2), function (...args) {
        if (!(this instanceof SVGTextContentElement)) {
          throw new TypeError("Illegal invocation");
        }
        return (((((methods)[8]))[2])).apply(this, args);
      }),
    );
  } while (false);
}

function nativeMethod(name, length, callback) {
  Object.defineProperty(callback, "name", { value: name, configurable: true });
  Object.defineProperty(callback, "length", { value: length, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}

function filterPrimitiveProperties(hasInput) {
  const properties = [];
  if (hasInput) properties.push(["in1", "string", "in"]);
  properties.push(
    ["x", "length"],
    ["y", "length"],
    ["width", "length"],
    ["height", "length"],
    ["result", "string"],
  );
  return properties;
}
import { SVGAElement } from "../api/dom/svgaelement-factory-constructor.js";
