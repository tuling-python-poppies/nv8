import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  SVGAngle,
  SVGLength,
  SVGMatrix,
  SVGNumber,
  SVGPoint,
  SVGRect,
  SVGTransform,
  SVGPreserveAspectRatio,
  installSVGValueConstructors,
} from "../api/svg/svg-value-constructors.js";
import {
  angleConvert,
  angleNewValue,
  angleUnitType,
  angleValue,
  angleValueAsString,
  angleValueInSpecifiedUnits,
  lengthConvert,
  lengthNewValue,
  lengthUnitType,
  lengthValue,
  lengthValueAsString,
  lengthValueInSpecifiedUnits,
  matrixFlipX,
  matrixFlipY,
  matrixGetters,
  matrixInverse,
  matrixMultiply,
  matrixRotate,
  matrixRotateFromVector,
  matrixScale,
  matrixScaleNonUniform,
  matrixSkewX,
  matrixSkewY,
  matrixTranslate,
  numberValue,
  pointMatrixTransform,
  pointX,
  pointY,
  rectHeight,
  rectWidth,
  rectX,
  rectY,
  transformAngle,
  transformMatrix,
  transformSetMatrix,
  transformSetRotate,
  transformSetScale,
  transformSetSkewX,
  transformSetSkewY,
  transformSetTranslate,
  transformType,
  preserveAspectRatioAlign,
  preserveAspectRatioMeetOrSlice,
} from "../api/svg/svg-value-members.js";

const lengthConstants = [
  ["SVG_LENGTHTYPE_UNKNOWN", 0],
  ["SVG_LENGTHTYPE_NUMBER", 1],
  ["SVG_LENGTHTYPE_PERCENTAGE", 2],
  ["SVG_LENGTHTYPE_EMS", 3],
  ["SVG_LENGTHTYPE_EXS", 4],
  ["SVG_LENGTHTYPE_PX", 5],
  ["SVG_LENGTHTYPE_CM", 6],
  ["SVG_LENGTHTYPE_MM", 7],
  ["SVG_LENGTHTYPE_IN", 8],
  ["SVG_LENGTHTYPE_PT", 9],
  ["SVG_LENGTHTYPE_PC", 10],
];
const angleConstants = [
  ["SVG_ANGLETYPE_UNKNOWN", 0],
  ["SVG_ANGLETYPE_UNSPECIFIED", 1],
  ["SVG_ANGLETYPE_DEG", 2],
  ["SVG_ANGLETYPE_RAD", 3],
  ["SVG_ANGLETYPE_GRAD", 4],
];
const transformConstants = [
  ["SVG_TRANSFORM_UNKNOWN", 0],
  ["SVG_TRANSFORM_MATRIX", 1],
  ["SVG_TRANSFORM_TRANSLATE", 2],
  ["SVG_TRANSFORM_SCALE", 3],
  ["SVG_TRANSFORM_ROTATE", 4],
  ["SVG_TRANSFORM_SKEWX", 5],
  ["SVG_TRANSFORM_SKEWY", 6],
];
const preserveAspectRatioConstants = [
  ["SVG_PRESERVEASPECTRATIO_UNKNOWN", 0],
  ["SVG_PRESERVEASPECTRATIO_NONE", 1],
  ["SVG_PRESERVEASPECTRATIO_XMINYMIN", 2],
  ["SVG_PRESERVEASPECTRATIO_XMIDYMIN", 3],
  ["SVG_PRESERVEASPECTRATIO_XMAXYMIN", 4],
  ["SVG_PRESERVEASPECTRATIO_XMINYMID", 5],
  ["SVG_PRESERVEASPECTRATIO_XMIDYMID", 6],
  ["SVG_PRESERVEASPECTRATIO_XMAXYMID", 7],
  ["SVG_PRESERVEASPECTRATIO_XMINYMAX", 8],
  ["SVG_PRESERVEASPECTRATIO_XMIDYMAX", 9],
  ["SVG_PRESERVEASPECTRATIO_XMAXYMAX", 10],
  ["SVG_MEETORSLICE_UNKNOWN", 0],
  ["SVG_MEETORSLICE_MEET", 1],
  ["SVG_MEETORSLICE_SLICE", 2],
];

export function installSVGValues() {
  installSVGValueConstructors();
  {

    definePrototypeGetter(SVGNumber.prototype, "value", ((((([["value", numberValue]])[0]))[1])));

  defineConstructorBacklink(SVGNumber.prototype, SVGNumber);
  defineToStringTag(SVGNumber.prototype, SVGNumber.name);
}
  {

    definePrototypeGetter(SVGPoint.prototype, "x", ((((["x", pointX]))[1])));

    definePrototypeGetter(SVGPoint.prototype, "y", ((((["y", pointY]))[1])));

    definePrototypeMethod(SVGPoint.prototype, "matrixTransform", ((((([
    ["matrixTransform", pointMatrixTransform],
  ])[0]))[1])));

  defineConstructorBacklink(SVGPoint.prototype, SVGPoint);
  defineToStringTag(SVGPoint.prototype, SVGPoint.name);
}
  {

    definePrototypeGetter(SVGRect.prototype, "x", ((((["x", rectX]))[1])));

    definePrototypeGetter(SVGRect.prototype, "y", ((((["y", rectY]))[1])));

    definePrototypeGetter(SVGRect.prototype, "width", ((((["width", rectWidth]))[1])));

    definePrototypeGetter(SVGRect.prototype, "height", ((((["height", rectHeight]))[1])));

  defineConstructorBacklink(SVGRect.prototype, SVGRect);
  defineToStringTag(SVGRect.prototype, SVGRect.name);
}
  {

    definePrototypeGetter(SVGLength.prototype, "unitType", ((((["unitType", lengthUnitType]))[1])));

    definePrototypeGetter(SVGLength.prototype, "value", ((((["value", lengthValue]))[1])));

    definePrototypeGetter(SVGLength.prototype, "valueInSpecifiedUnits", ((((["valueInSpecifiedUnits", lengthValueInSpecifiedUnits]))[1])));

    definePrototypeGetter(SVGLength.prototype, "valueAsString", ((((["valueAsString", lengthValueAsString]))[1])));

  defineConstant(SVGLength.prototype, "SVG_LENGTHTYPE_UNKNOWN", 0);
defineConstant(SVGLength.prototype, "SVG_LENGTHTYPE_NUMBER", 1);
defineConstant(SVGLength.prototype, "SVG_LENGTHTYPE_PERCENTAGE", 2);
defineConstant(SVGLength.prototype, "SVG_LENGTHTYPE_EMS", 3);
defineConstant(SVGLength.prototype, "SVG_LENGTHTYPE_EXS", 4);
defineConstant(SVGLength.prototype, "SVG_LENGTHTYPE_PX", 5);
defineConstant(SVGLength.prototype, "SVG_LENGTHTYPE_CM", 6);
defineConstant(SVGLength.prototype, "SVG_LENGTHTYPE_MM", 7);
defineConstant(SVGLength.prototype, "SVG_LENGTHTYPE_IN", 8);
defineConstant(SVGLength.prototype, "SVG_LENGTHTYPE_PT", 9);
defineConstant(SVGLength.prototype, "SVG_LENGTHTYPE_PC", 10);

    definePrototypeMethod(SVGLength.prototype, "convertToSpecifiedUnits", ((((["convertToSpecifiedUnits", lengthConvert]))[1])));

    definePrototypeMethod(SVGLength.prototype, "newValueSpecifiedUnits", ((((["newValueSpecifiedUnits", lengthNewValue]))[1])));

  defineConstructorBacklink(SVGLength.prototype, SVGLength);
  defineToStringTag(SVGLength.prototype, SVGLength.name);
  defineConstant(SVGLength, "SVG_LENGTHTYPE_UNKNOWN", 0);
defineConstant(SVGLength, "SVG_LENGTHTYPE_NUMBER", 1);
defineConstant(SVGLength, "SVG_LENGTHTYPE_PERCENTAGE", 2);
defineConstant(SVGLength, "SVG_LENGTHTYPE_EMS", 3);
defineConstant(SVGLength, "SVG_LENGTHTYPE_EXS", 4);
defineConstant(SVGLength, "SVG_LENGTHTYPE_PX", 5);
defineConstant(SVGLength, "SVG_LENGTHTYPE_CM", 6);
defineConstant(SVGLength, "SVG_LENGTHTYPE_MM", 7);
defineConstant(SVGLength, "SVG_LENGTHTYPE_IN", 8);
defineConstant(SVGLength, "SVG_LENGTHTYPE_PT", 9);
defineConstant(SVGLength, "SVG_LENGTHTYPE_PC", 10);
}
  {

    definePrototypeGetter(SVGAngle.prototype, "unitType", ((((["unitType", angleUnitType]))[1])));

    definePrototypeGetter(SVGAngle.prototype, "value", ((((["value", angleValue]))[1])));

    definePrototypeGetter(SVGAngle.prototype, "valueInSpecifiedUnits", ((((["valueInSpecifiedUnits", angleValueInSpecifiedUnits]))[1])));

    definePrototypeGetter(SVGAngle.prototype, "valueAsString", ((((["valueAsString", angleValueAsString]))[1])));

  defineConstant(SVGAngle.prototype, "SVG_ANGLETYPE_UNKNOWN", 0);
defineConstant(SVGAngle.prototype, "SVG_ANGLETYPE_UNSPECIFIED", 1);
defineConstant(SVGAngle.prototype, "SVG_ANGLETYPE_DEG", 2);
defineConstant(SVGAngle.prototype, "SVG_ANGLETYPE_RAD", 3);
defineConstant(SVGAngle.prototype, "SVG_ANGLETYPE_GRAD", 4);

    definePrototypeMethod(SVGAngle.prototype, "convertToSpecifiedUnits", ((((["convertToSpecifiedUnits", angleConvert]))[1])));

    definePrototypeMethod(SVGAngle.prototype, "newValueSpecifiedUnits", ((((["newValueSpecifiedUnits", angleNewValue]))[1])));

  defineConstructorBacklink(SVGAngle.prototype, SVGAngle);
  defineToStringTag(SVGAngle.prototype, SVGAngle.name);
  defineConstant(SVGAngle, "SVG_ANGLETYPE_UNKNOWN", 0);
defineConstant(SVGAngle, "SVG_ANGLETYPE_UNSPECIFIED", 1);
defineConstant(SVGAngle, "SVG_ANGLETYPE_DEG", 2);
defineConstant(SVGAngle, "SVG_ANGLETYPE_RAD", 3);
defineConstant(SVGAngle, "SVG_ANGLETYPE_GRAD", 4);
}
  {

    definePrototypeGetter(SVGMatrix.prototype, "a", matrixGetters[0][1]);

    definePrototypeGetter(SVGMatrix.prototype, "b", matrixGetters[1][1]);

    definePrototypeGetter(SVGMatrix.prototype, "c", matrixGetters[2][1]);

    definePrototypeGetter(SVGMatrix.prototype, "d", matrixGetters[3][1]);

    definePrototypeGetter(SVGMatrix.prototype, "e", matrixGetters[4][1]);

    definePrototypeGetter(SVGMatrix.prototype, "f", matrixGetters[5][1]);

    definePrototypeMethod(SVGMatrix.prototype, "flipX", ((((["flipX", matrixFlipX]))[1])));

    definePrototypeMethod(SVGMatrix.prototype, "flipY", ((((["flipY", matrixFlipY]))[1])));

    definePrototypeMethod(SVGMatrix.prototype, "inverse", ((((["inverse", matrixInverse]))[1])));

    definePrototypeMethod(SVGMatrix.prototype, "multiply", ((((["multiply", matrixMultiply]))[1])));

    definePrototypeMethod(SVGMatrix.prototype, "rotate", ((((["rotate", matrixRotate]))[1])));

    definePrototypeMethod(SVGMatrix.prototype, "rotateFromVector", ((((["rotateFromVector", matrixRotateFromVector]))[1])));

    definePrototypeMethod(SVGMatrix.prototype, "scale", ((((["scale", matrixScale]))[1])));

    definePrototypeMethod(SVGMatrix.prototype, "scaleNonUniform", ((((["scaleNonUniform", matrixScaleNonUniform]))[1])));

    definePrototypeMethod(SVGMatrix.prototype, "skewX", ((((["skewX", matrixSkewX]))[1])));

    definePrototypeMethod(SVGMatrix.prototype, "skewY", ((((["skewY", matrixSkewY]))[1])));

    definePrototypeMethod(SVGMatrix.prototype, "translate", ((((["translate", matrixTranslate]))[1])));

  defineConstructorBacklink(SVGMatrix.prototype, SVGMatrix);
  defineToStringTag(SVGMatrix.prototype, SVGMatrix.name);
}
  {

    definePrototypeGetter(SVGTransform.prototype, "type", ((((["type", transformType]))[1])));

    definePrototypeGetter(SVGTransform.prototype, "matrix", ((((["matrix", transformMatrix]))[1])));

    definePrototypeGetter(SVGTransform.prototype, "angle", ((((["angle", transformAngle]))[1])));

  defineConstant(SVGTransform.prototype, "SVG_TRANSFORM_UNKNOWN", 0);
defineConstant(SVGTransform.prototype, "SVG_TRANSFORM_MATRIX", 1);
defineConstant(SVGTransform.prototype, "SVG_TRANSFORM_TRANSLATE", 2);
defineConstant(SVGTransform.prototype, "SVG_TRANSFORM_SCALE", 3);
defineConstant(SVGTransform.prototype, "SVG_TRANSFORM_ROTATE", 4);
defineConstant(SVGTransform.prototype, "SVG_TRANSFORM_SKEWX", 5);
defineConstant(SVGTransform.prototype, "SVG_TRANSFORM_SKEWY", 6);

    definePrototypeMethod(SVGTransform.prototype, "setMatrix", ((((["setMatrix", transformSetMatrix]))[1])));

    definePrototypeMethod(SVGTransform.prototype, "setRotate", ((((["setRotate", transformSetRotate]))[1])));

    definePrototypeMethod(SVGTransform.prototype, "setScale", ((((["setScale", transformSetScale]))[1])));

    definePrototypeMethod(SVGTransform.prototype, "setSkewX", ((((["setSkewX", transformSetSkewX]))[1])));

    definePrototypeMethod(SVGTransform.prototype, "setSkewY", ((((["setSkewY", transformSetSkewY]))[1])));

    definePrototypeMethod(SVGTransform.prototype, "setTranslate", ((((["setTranslate", transformSetTranslate]))[1])));

  defineConstructorBacklink(SVGTransform.prototype, SVGTransform);
  defineToStringTag(SVGTransform.prototype, SVGTransform.name);
  defineConstant(SVGTransform, "SVG_TRANSFORM_UNKNOWN", 0);
defineConstant(SVGTransform, "SVG_TRANSFORM_MATRIX", 1);
defineConstant(SVGTransform, "SVG_TRANSFORM_TRANSLATE", 2);
defineConstant(SVGTransform, "SVG_TRANSFORM_SCALE", 3);
defineConstant(SVGTransform, "SVG_TRANSFORM_ROTATE", 4);
defineConstant(SVGTransform, "SVG_TRANSFORM_SKEWX", 5);
defineConstant(SVGTransform, "SVG_TRANSFORM_SKEWY", 6);
}
  {

    definePrototypeGetter(SVGPreserveAspectRatio.prototype, "align", ((((["align", preserveAspectRatioAlign]))[1])));

    definePrototypeGetter(SVGPreserveAspectRatio.prototype, "meetOrSlice", ((((["meetOrSlice", preserveAspectRatioMeetOrSlice]))[1])));

  defineConstant(SVGPreserveAspectRatio.prototype, "SVG_PRESERVEASPECTRATIO_UNKNOWN", 0);
defineConstant(SVGPreserveAspectRatio.prototype, "SVG_PRESERVEASPECTRATIO_NONE", 1);
defineConstant(SVGPreserveAspectRatio.prototype, "SVG_PRESERVEASPECTRATIO_XMINYMIN", 2);
defineConstant(SVGPreserveAspectRatio.prototype, "SVG_PRESERVEASPECTRATIO_XMIDYMIN", 3);
defineConstant(SVGPreserveAspectRatio.prototype, "SVG_PRESERVEASPECTRATIO_XMAXYMIN", 4);
defineConstant(SVGPreserveAspectRatio.prototype, "SVG_PRESERVEASPECTRATIO_XMINYMID", 5);
defineConstant(SVGPreserveAspectRatio.prototype, "SVG_PRESERVEASPECTRATIO_XMIDYMID", 6);
defineConstant(SVGPreserveAspectRatio.prototype, "SVG_PRESERVEASPECTRATIO_XMAXYMID", 7);
defineConstant(SVGPreserveAspectRatio.prototype, "SVG_PRESERVEASPECTRATIO_XMINYMAX", 8);
defineConstant(SVGPreserveAspectRatio.prototype, "SVG_PRESERVEASPECTRATIO_XMIDYMAX", 9);
defineConstant(SVGPreserveAspectRatio.prototype, "SVG_PRESERVEASPECTRATIO_XMAXYMAX", 10);
defineConstant(SVGPreserveAspectRatio.prototype, "SVG_MEETORSLICE_UNKNOWN", 0);
defineConstant(SVGPreserveAspectRatio.prototype, "SVG_MEETORSLICE_MEET", 1);
defineConstant(SVGPreserveAspectRatio.prototype, "SVG_MEETORSLICE_SLICE", 2);

  defineConstructorBacklink(SVGPreserveAspectRatio.prototype, SVGPreserveAspectRatio);
  defineToStringTag(SVGPreserveAspectRatio.prototype, SVGPreserveAspectRatio.name);
  defineConstant(SVGPreserveAspectRatio, "SVG_PRESERVEASPECTRATIO_UNKNOWN", 0);
defineConstant(SVGPreserveAspectRatio, "SVG_PRESERVEASPECTRATIO_NONE", 1);
defineConstant(SVGPreserveAspectRatio, "SVG_PRESERVEASPECTRATIO_XMINYMIN", 2);
defineConstant(SVGPreserveAspectRatio, "SVG_PRESERVEASPECTRATIO_XMIDYMIN", 3);
defineConstant(SVGPreserveAspectRatio, "SVG_PRESERVEASPECTRATIO_XMAXYMIN", 4);
defineConstant(SVGPreserveAspectRatio, "SVG_PRESERVEASPECTRATIO_XMINYMID", 5);
defineConstant(SVGPreserveAspectRatio, "SVG_PRESERVEASPECTRATIO_XMIDYMID", 6);
defineConstant(SVGPreserveAspectRatio, "SVG_PRESERVEASPECTRATIO_XMAXYMID", 7);
defineConstant(SVGPreserveAspectRatio, "SVG_PRESERVEASPECTRATIO_XMINYMAX", 8);
defineConstant(SVGPreserveAspectRatio, "SVG_PRESERVEASPECTRATIO_XMIDYMAX", 9);
defineConstant(SVGPreserveAspectRatio, "SVG_PRESERVEASPECTRATIO_XMAXYMAX", 10);
defineConstant(SVGPreserveAspectRatio, "SVG_MEETORSLICE_UNKNOWN", 0);
defineConstant(SVGPreserveAspectRatio, "SVG_MEETORSLICE_MEET", 1);
defineConstant(SVGPreserveAspectRatio, "SVG_MEETORSLICE_SLICE", 2);
}
}

function defineConstant(target, name, value) {
  Object.defineProperty(target, name, {
    value,
    writable: false,
    enumerable: true,
    configurable: false,
  });
}
