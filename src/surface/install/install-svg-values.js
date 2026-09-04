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
  do {
    definePrototypeGetter((SVGNumber).prototype, ("value"), ((((([["value", numberValue]])[0]))[1])));
  } while (false);
  
  defineConstructorBacklink((SVGNumber).prototype, (SVGNumber));
  defineToStringTag((SVGNumber).prototype, (SVGNumber).name);
}
  {
  do {
    definePrototypeGetter((SVGPoint).prototype, ("x"), ((((([["x", pointX], ["y", pointY]])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((SVGPoint).prototype, ("y"), ((((([["x", pointX], ["y", pointY]])[1]))[1])));
  } while (false);
  do {
    definePrototypeMethod((SVGPoint).prototype, ("matrixTransform"), ((((([
    ["matrixTransform", pointMatrixTransform],
  ])[0]))[1])));
  } while (false);
  defineConstructorBacklink((SVGPoint).prototype, (SVGPoint));
  defineToStringTag((SVGPoint).prototype, (SVGPoint).name);
}
  {
  do {
    definePrototypeGetter((SVGRect).prototype, ("x"), ((((([
    ["x", rectX], ["y", rectY], ["width", rectWidth], ["height", rectHeight],
  ])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((SVGRect).prototype, ("y"), ((((([
    ["x", rectX], ["y", rectY], ["width", rectWidth], ["height", rectHeight],
  ])[1]))[1])));
  } while (false);
do {
    definePrototypeGetter((SVGRect).prototype, ("width"), ((((([
    ["x", rectX], ["y", rectY], ["width", rectWidth], ["height", rectHeight],
  ])[2]))[1])));
  } while (false);
do {
    definePrototypeGetter((SVGRect).prototype, ("height"), ((((([
    ["x", rectX], ["y", rectY], ["width", rectWidth], ["height", rectHeight],
  ])[3]))[1])));
  } while (false);
  
  defineConstructorBacklink((SVGRect).prototype, (SVGRect));
  defineToStringTag((SVGRect).prototype, (SVGRect).name);
}
  {
  do {
    definePrototypeGetter((SVGLength).prototype, ("unitType"), ((((([
    ["unitType", lengthUnitType],
    ["value", lengthValue],
    ["valueInSpecifiedUnits", lengthValueInSpecifiedUnits],
    ["valueAsString", lengthValueAsString],
  ])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((SVGLength).prototype, ("value"), ((((([
    ["unitType", lengthUnitType],
    ["value", lengthValue],
    ["valueInSpecifiedUnits", lengthValueInSpecifiedUnits],
    ["valueAsString", lengthValueAsString],
  ])[1]))[1])));
  } while (false);
do {
    definePrototypeGetter((SVGLength).prototype, ("valueInSpecifiedUnits"), ((((([
    ["unitType", lengthUnitType],
    ["value", lengthValue],
    ["valueInSpecifiedUnits", lengthValueInSpecifiedUnits],
    ["valueAsString", lengthValueAsString],
  ])[2]))[1])));
  } while (false);
do {
    definePrototypeGetter((SVGLength).prototype, ("valueAsString"), ((((([
    ["unitType", lengthUnitType],
    ["value", lengthValue],
    ["valueInSpecifiedUnits", lengthValueInSpecifiedUnits],
    ["valueAsString", lengthValueAsString],
  ])[3]))[1])));
  } while (false);
  do {defineConstant((SVGLength).prototype, ("SVG_LENGTHTYPE_UNKNOWN"), (0));} while (false);
do {defineConstant((SVGLength).prototype, ("SVG_LENGTHTYPE_NUMBER"), (1));} while (false);
do {defineConstant((SVGLength).prototype, ("SVG_LENGTHTYPE_PERCENTAGE"), (2));} while (false);
do {defineConstant((SVGLength).prototype, ("SVG_LENGTHTYPE_EMS"), (3));} while (false);
do {defineConstant((SVGLength).prototype, ("SVG_LENGTHTYPE_EXS"), (4));} while (false);
do {defineConstant((SVGLength).prototype, ("SVG_LENGTHTYPE_PX"), (5));} while (false);
do {defineConstant((SVGLength).prototype, ("SVG_LENGTHTYPE_CM"), (6));} while (false);
do {defineConstant((SVGLength).prototype, ("SVG_LENGTHTYPE_MM"), (7));} while (false);
do {defineConstant((SVGLength).prototype, ("SVG_LENGTHTYPE_IN"), (8));} while (false);
do {defineConstant((SVGLength).prototype, ("SVG_LENGTHTYPE_PT"), (9));} while (false);
do {defineConstant((SVGLength).prototype, ("SVG_LENGTHTYPE_PC"), (10));} while (false);
  do {
    definePrototypeMethod((SVGLength).prototype, ("convertToSpecifiedUnits"), ((((([
    ["convertToSpecifiedUnits", lengthConvert],
    ["newValueSpecifiedUnits", lengthNewValue],
  ])[0]))[1])));
  } while (false);
do {
    definePrototypeMethod((SVGLength).prototype, ("newValueSpecifiedUnits"), ((((([
    ["convertToSpecifiedUnits", lengthConvert],
    ["newValueSpecifiedUnits", lengthNewValue],
  ])[1]))[1])));
  } while (false);
  defineConstructorBacklink((SVGLength).prototype, (SVGLength));
  defineToStringTag((SVGLength).prototype, (SVGLength).name);
  do {defineConstant((SVGLength), ("SVG_LENGTHTYPE_UNKNOWN"), (0));} while (false);
do {defineConstant((SVGLength), ("SVG_LENGTHTYPE_NUMBER"), (1));} while (false);
do {defineConstant((SVGLength), ("SVG_LENGTHTYPE_PERCENTAGE"), (2));} while (false);
do {defineConstant((SVGLength), ("SVG_LENGTHTYPE_EMS"), (3));} while (false);
do {defineConstant((SVGLength), ("SVG_LENGTHTYPE_EXS"), (4));} while (false);
do {defineConstant((SVGLength), ("SVG_LENGTHTYPE_PX"), (5));} while (false);
do {defineConstant((SVGLength), ("SVG_LENGTHTYPE_CM"), (6));} while (false);
do {defineConstant((SVGLength), ("SVG_LENGTHTYPE_MM"), (7));} while (false);
do {defineConstant((SVGLength), ("SVG_LENGTHTYPE_IN"), (8));} while (false);
do {defineConstant((SVGLength), ("SVG_LENGTHTYPE_PT"), (9));} while (false);
do {defineConstant((SVGLength), ("SVG_LENGTHTYPE_PC"), (10));} while (false);
}
  {
  do {
    definePrototypeGetter((SVGAngle).prototype, ("unitType"), ((((([
    ["unitType", angleUnitType],
    ["value", angleValue],
    ["valueInSpecifiedUnits", angleValueInSpecifiedUnits],
    ["valueAsString", angleValueAsString],
  ])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((SVGAngle).prototype, ("value"), ((((([
    ["unitType", angleUnitType],
    ["value", angleValue],
    ["valueInSpecifiedUnits", angleValueInSpecifiedUnits],
    ["valueAsString", angleValueAsString],
  ])[1]))[1])));
  } while (false);
do {
    definePrototypeGetter((SVGAngle).prototype, ("valueInSpecifiedUnits"), ((((([
    ["unitType", angleUnitType],
    ["value", angleValue],
    ["valueInSpecifiedUnits", angleValueInSpecifiedUnits],
    ["valueAsString", angleValueAsString],
  ])[2]))[1])));
  } while (false);
do {
    definePrototypeGetter((SVGAngle).prototype, ("valueAsString"), ((((([
    ["unitType", angleUnitType],
    ["value", angleValue],
    ["valueInSpecifiedUnits", angleValueInSpecifiedUnits],
    ["valueAsString", angleValueAsString],
  ])[3]))[1])));
  } while (false);
  do {defineConstant((SVGAngle).prototype, ("SVG_ANGLETYPE_UNKNOWN"), (0));} while (false);
do {defineConstant((SVGAngle).prototype, ("SVG_ANGLETYPE_UNSPECIFIED"), (1));} while (false);
do {defineConstant((SVGAngle).prototype, ("SVG_ANGLETYPE_DEG"), (2));} while (false);
do {defineConstant((SVGAngle).prototype, ("SVG_ANGLETYPE_RAD"), (3));} while (false);
do {defineConstant((SVGAngle).prototype, ("SVG_ANGLETYPE_GRAD"), (4));} while (false);
  do {
    definePrototypeMethod((SVGAngle).prototype, ("convertToSpecifiedUnits"), ((((([
    ["convertToSpecifiedUnits", angleConvert],
    ["newValueSpecifiedUnits", angleNewValue],
  ])[0]))[1])));
  } while (false);
do {
    definePrototypeMethod((SVGAngle).prototype, ("newValueSpecifiedUnits"), ((((([
    ["convertToSpecifiedUnits", angleConvert],
    ["newValueSpecifiedUnits", angleNewValue],
  ])[1]))[1])));
  } while (false);
  defineConstructorBacklink((SVGAngle).prototype, (SVGAngle));
  defineToStringTag((SVGAngle).prototype, (SVGAngle).name);
  do {defineConstant((SVGAngle), ("SVG_ANGLETYPE_UNKNOWN"), (0));} while (false);
do {defineConstant((SVGAngle), ("SVG_ANGLETYPE_UNSPECIFIED"), (1));} while (false);
do {defineConstant((SVGAngle), ("SVG_ANGLETYPE_DEG"), (2));} while (false);
do {defineConstant((SVGAngle), ("SVG_ANGLETYPE_RAD"), (3));} while (false);
do {defineConstant((SVGAngle), ("SVG_ANGLETYPE_GRAD"), (4));} while (false);
}
  {
  do {
    definePrototypeGetter((SVGMatrix).prototype, ("a"), (((((matrixGetters)[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((SVGMatrix).prototype, ("b"), (((((matrixGetters)[1]))[1])));
  } while (false);
do {
    definePrototypeGetter((SVGMatrix).prototype, ("c"), (((((matrixGetters)[2]))[1])));
  } while (false);
do {
    definePrototypeGetter((SVGMatrix).prototype, ("d"), (((((matrixGetters)[3]))[1])));
  } while (false);
do {
    definePrototypeGetter((SVGMatrix).prototype, ("e"), (((((matrixGetters)[4]))[1])));
  } while (false);
do {
    definePrototypeGetter((SVGMatrix).prototype, ("f"), (((((matrixGetters)[5]))[1])));
  } while (false);
  do {
    definePrototypeMethod((SVGMatrix).prototype, ("flipX"), ((((([
    ["flipX", matrixFlipX],
    ["flipY", matrixFlipY],
    ["inverse", matrixInverse],
    ["multiply", matrixMultiply],
    ["rotate", matrixRotate],
    ["rotateFromVector", matrixRotateFromVector],
    ["scale", matrixScale],
    ["scaleNonUniform", matrixScaleNonUniform],
    ["skewX", matrixSkewX],
    ["skewY", matrixSkewY],
    ["translate", matrixTranslate],
  ])[0]))[1])));
  } while (false);
do {
    definePrototypeMethod((SVGMatrix).prototype, ("flipY"), ((((([
    ["flipX", matrixFlipX],
    ["flipY", matrixFlipY],
    ["inverse", matrixInverse],
    ["multiply", matrixMultiply],
    ["rotate", matrixRotate],
    ["rotateFromVector", matrixRotateFromVector],
    ["scale", matrixScale],
    ["scaleNonUniform", matrixScaleNonUniform],
    ["skewX", matrixSkewX],
    ["skewY", matrixSkewY],
    ["translate", matrixTranslate],
  ])[1]))[1])));
  } while (false);
do {
    definePrototypeMethod((SVGMatrix).prototype, ("inverse"), ((((([
    ["flipX", matrixFlipX],
    ["flipY", matrixFlipY],
    ["inverse", matrixInverse],
    ["multiply", matrixMultiply],
    ["rotate", matrixRotate],
    ["rotateFromVector", matrixRotateFromVector],
    ["scale", matrixScale],
    ["scaleNonUniform", matrixScaleNonUniform],
    ["skewX", matrixSkewX],
    ["skewY", matrixSkewY],
    ["translate", matrixTranslate],
  ])[2]))[1])));
  } while (false);
do {
    definePrototypeMethod((SVGMatrix).prototype, ("multiply"), ((((([
    ["flipX", matrixFlipX],
    ["flipY", matrixFlipY],
    ["inverse", matrixInverse],
    ["multiply", matrixMultiply],
    ["rotate", matrixRotate],
    ["rotateFromVector", matrixRotateFromVector],
    ["scale", matrixScale],
    ["scaleNonUniform", matrixScaleNonUniform],
    ["skewX", matrixSkewX],
    ["skewY", matrixSkewY],
    ["translate", matrixTranslate],
  ])[3]))[1])));
  } while (false);
do {
    definePrototypeMethod((SVGMatrix).prototype, ("rotate"), ((((([
    ["flipX", matrixFlipX],
    ["flipY", matrixFlipY],
    ["inverse", matrixInverse],
    ["multiply", matrixMultiply],
    ["rotate", matrixRotate],
    ["rotateFromVector", matrixRotateFromVector],
    ["scale", matrixScale],
    ["scaleNonUniform", matrixScaleNonUniform],
    ["skewX", matrixSkewX],
    ["skewY", matrixSkewY],
    ["translate", matrixTranslate],
  ])[4]))[1])));
  } while (false);
do {
    definePrototypeMethod((SVGMatrix).prototype, ("rotateFromVector"), ((((([
    ["flipX", matrixFlipX],
    ["flipY", matrixFlipY],
    ["inverse", matrixInverse],
    ["multiply", matrixMultiply],
    ["rotate", matrixRotate],
    ["rotateFromVector", matrixRotateFromVector],
    ["scale", matrixScale],
    ["scaleNonUniform", matrixScaleNonUniform],
    ["skewX", matrixSkewX],
    ["skewY", matrixSkewY],
    ["translate", matrixTranslate],
  ])[5]))[1])));
  } while (false);
do {
    definePrototypeMethod((SVGMatrix).prototype, ("scale"), ((((([
    ["flipX", matrixFlipX],
    ["flipY", matrixFlipY],
    ["inverse", matrixInverse],
    ["multiply", matrixMultiply],
    ["rotate", matrixRotate],
    ["rotateFromVector", matrixRotateFromVector],
    ["scale", matrixScale],
    ["scaleNonUniform", matrixScaleNonUniform],
    ["skewX", matrixSkewX],
    ["skewY", matrixSkewY],
    ["translate", matrixTranslate],
  ])[6]))[1])));
  } while (false);
do {
    definePrototypeMethod((SVGMatrix).prototype, ("scaleNonUniform"), ((((([
    ["flipX", matrixFlipX],
    ["flipY", matrixFlipY],
    ["inverse", matrixInverse],
    ["multiply", matrixMultiply],
    ["rotate", matrixRotate],
    ["rotateFromVector", matrixRotateFromVector],
    ["scale", matrixScale],
    ["scaleNonUniform", matrixScaleNonUniform],
    ["skewX", matrixSkewX],
    ["skewY", matrixSkewY],
    ["translate", matrixTranslate],
  ])[7]))[1])));
  } while (false);
do {
    definePrototypeMethod((SVGMatrix).prototype, ("skewX"), ((((([
    ["flipX", matrixFlipX],
    ["flipY", matrixFlipY],
    ["inverse", matrixInverse],
    ["multiply", matrixMultiply],
    ["rotate", matrixRotate],
    ["rotateFromVector", matrixRotateFromVector],
    ["scale", matrixScale],
    ["scaleNonUniform", matrixScaleNonUniform],
    ["skewX", matrixSkewX],
    ["skewY", matrixSkewY],
    ["translate", matrixTranslate],
  ])[8]))[1])));
  } while (false);
do {
    definePrototypeMethod((SVGMatrix).prototype, ("skewY"), ((((([
    ["flipX", matrixFlipX],
    ["flipY", matrixFlipY],
    ["inverse", matrixInverse],
    ["multiply", matrixMultiply],
    ["rotate", matrixRotate],
    ["rotateFromVector", matrixRotateFromVector],
    ["scale", matrixScale],
    ["scaleNonUniform", matrixScaleNonUniform],
    ["skewX", matrixSkewX],
    ["skewY", matrixSkewY],
    ["translate", matrixTranslate],
  ])[9]))[1])));
  } while (false);
do {
    definePrototypeMethod((SVGMatrix).prototype, ("translate"), ((((([
    ["flipX", matrixFlipX],
    ["flipY", matrixFlipY],
    ["inverse", matrixInverse],
    ["multiply", matrixMultiply],
    ["rotate", matrixRotate],
    ["rotateFromVector", matrixRotateFromVector],
    ["scale", matrixScale],
    ["scaleNonUniform", matrixScaleNonUniform],
    ["skewX", matrixSkewX],
    ["skewY", matrixSkewY],
    ["translate", matrixTranslate],
  ])[10]))[1])));
  } while (false);
  defineConstructorBacklink((SVGMatrix).prototype, (SVGMatrix));
  defineToStringTag((SVGMatrix).prototype, (SVGMatrix).name);
}
  {
  do {
    definePrototypeGetter((SVGTransform).prototype, ("type"), ((((([
    ["type", transformType],
    ["matrix", transformMatrix],
    ["angle", transformAngle],
  ])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((SVGTransform).prototype, ("matrix"), ((((([
    ["type", transformType],
    ["matrix", transformMatrix],
    ["angle", transformAngle],
  ])[1]))[1])));
  } while (false);
do {
    definePrototypeGetter((SVGTransform).prototype, ("angle"), ((((([
    ["type", transformType],
    ["matrix", transformMatrix],
    ["angle", transformAngle],
  ])[2]))[1])));
  } while (false);
  do {defineConstant((SVGTransform).prototype, ("SVG_TRANSFORM_UNKNOWN"), (0));} while (false);
do {defineConstant((SVGTransform).prototype, ("SVG_TRANSFORM_MATRIX"), (1));} while (false);
do {defineConstant((SVGTransform).prototype, ("SVG_TRANSFORM_TRANSLATE"), (2));} while (false);
do {defineConstant((SVGTransform).prototype, ("SVG_TRANSFORM_SCALE"), (3));} while (false);
do {defineConstant((SVGTransform).prototype, ("SVG_TRANSFORM_ROTATE"), (4));} while (false);
do {defineConstant((SVGTransform).prototype, ("SVG_TRANSFORM_SKEWX"), (5));} while (false);
do {defineConstant((SVGTransform).prototype, ("SVG_TRANSFORM_SKEWY"), (6));} while (false);
  do {
    definePrototypeMethod((SVGTransform).prototype, ("setMatrix"), ((((([
    ["setMatrix", transformSetMatrix],
    ["setRotate", transformSetRotate],
    ["setScale", transformSetScale],
    ["setSkewX", transformSetSkewX],
    ["setSkewY", transformSetSkewY],
    ["setTranslate", transformSetTranslate],
  ])[0]))[1])));
  } while (false);
do {
    definePrototypeMethod((SVGTransform).prototype, ("setRotate"), ((((([
    ["setMatrix", transformSetMatrix],
    ["setRotate", transformSetRotate],
    ["setScale", transformSetScale],
    ["setSkewX", transformSetSkewX],
    ["setSkewY", transformSetSkewY],
    ["setTranslate", transformSetTranslate],
  ])[1]))[1])));
  } while (false);
do {
    definePrototypeMethod((SVGTransform).prototype, ("setScale"), ((((([
    ["setMatrix", transformSetMatrix],
    ["setRotate", transformSetRotate],
    ["setScale", transformSetScale],
    ["setSkewX", transformSetSkewX],
    ["setSkewY", transformSetSkewY],
    ["setTranslate", transformSetTranslate],
  ])[2]))[1])));
  } while (false);
do {
    definePrototypeMethod((SVGTransform).prototype, ("setSkewX"), ((((([
    ["setMatrix", transformSetMatrix],
    ["setRotate", transformSetRotate],
    ["setScale", transformSetScale],
    ["setSkewX", transformSetSkewX],
    ["setSkewY", transformSetSkewY],
    ["setTranslate", transformSetTranslate],
  ])[3]))[1])));
  } while (false);
do {
    definePrototypeMethod((SVGTransform).prototype, ("setSkewY"), ((((([
    ["setMatrix", transformSetMatrix],
    ["setRotate", transformSetRotate],
    ["setScale", transformSetScale],
    ["setSkewX", transformSetSkewX],
    ["setSkewY", transformSetSkewY],
    ["setTranslate", transformSetTranslate],
  ])[4]))[1])));
  } while (false);
do {
    definePrototypeMethod((SVGTransform).prototype, ("setTranslate"), ((((([
    ["setMatrix", transformSetMatrix],
    ["setRotate", transformSetRotate],
    ["setScale", transformSetScale],
    ["setSkewX", transformSetSkewX],
    ["setSkewY", transformSetSkewY],
    ["setTranslate", transformSetTranslate],
  ])[5]))[1])));
  } while (false);
  defineConstructorBacklink((SVGTransform).prototype, (SVGTransform));
  defineToStringTag((SVGTransform).prototype, (SVGTransform).name);
  do {defineConstant((SVGTransform), ("SVG_TRANSFORM_UNKNOWN"), (0));} while (false);
do {defineConstant((SVGTransform), ("SVG_TRANSFORM_MATRIX"), (1));} while (false);
do {defineConstant((SVGTransform), ("SVG_TRANSFORM_TRANSLATE"), (2));} while (false);
do {defineConstant((SVGTransform), ("SVG_TRANSFORM_SCALE"), (3));} while (false);
do {defineConstant((SVGTransform), ("SVG_TRANSFORM_ROTATE"), (4));} while (false);
do {defineConstant((SVGTransform), ("SVG_TRANSFORM_SKEWX"), (5));} while (false);
do {defineConstant((SVGTransform), ("SVG_TRANSFORM_SKEWY"), (6));} while (false);
}
  {
  do {
    definePrototypeGetter((SVGPreserveAspectRatio).prototype, ("align"), ((((([
    ["align", preserveAspectRatioAlign],
    ["meetOrSlice", preserveAspectRatioMeetOrSlice],
  ])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((SVGPreserveAspectRatio).prototype, ("meetOrSlice"), ((((([
    ["align", preserveAspectRatioAlign],
    ["meetOrSlice", preserveAspectRatioMeetOrSlice],
  ])[1]))[1])));
  } while (false);
  do {defineConstant((SVGPreserveAspectRatio).prototype, ("SVG_PRESERVEASPECTRATIO_UNKNOWN"), (0));} while (false);
do {defineConstant((SVGPreserveAspectRatio).prototype, ("SVG_PRESERVEASPECTRATIO_NONE"), (1));} while (false);
do {defineConstant((SVGPreserveAspectRatio).prototype, ("SVG_PRESERVEASPECTRATIO_XMINYMIN"), (2));} while (false);
do {defineConstant((SVGPreserveAspectRatio).prototype, ("SVG_PRESERVEASPECTRATIO_XMIDYMIN"), (3));} while (false);
do {defineConstant((SVGPreserveAspectRatio).prototype, ("SVG_PRESERVEASPECTRATIO_XMAXYMIN"), (4));} while (false);
do {defineConstant((SVGPreserveAspectRatio).prototype, ("SVG_PRESERVEASPECTRATIO_XMINYMID"), (5));} while (false);
do {defineConstant((SVGPreserveAspectRatio).prototype, ("SVG_PRESERVEASPECTRATIO_XMIDYMID"), (6));} while (false);
do {defineConstant((SVGPreserveAspectRatio).prototype, ("SVG_PRESERVEASPECTRATIO_XMAXYMID"), (7));} while (false);
do {defineConstant((SVGPreserveAspectRatio).prototype, ("SVG_PRESERVEASPECTRATIO_XMINYMAX"), (8));} while (false);
do {defineConstant((SVGPreserveAspectRatio).prototype, ("SVG_PRESERVEASPECTRATIO_XMIDYMAX"), (9));} while (false);
do {defineConstant((SVGPreserveAspectRatio).prototype, ("SVG_PRESERVEASPECTRATIO_XMAXYMAX"), (10));} while (false);
do {defineConstant((SVGPreserveAspectRatio).prototype, ("SVG_MEETORSLICE_UNKNOWN"), (0));} while (false);
do {defineConstant((SVGPreserveAspectRatio).prototype, ("SVG_MEETORSLICE_MEET"), (1));} while (false);
do {defineConstant((SVGPreserveAspectRatio).prototype, ("SVG_MEETORSLICE_SLICE"), (2));} while (false);
  
  defineConstructorBacklink((SVGPreserveAspectRatio).prototype, (SVGPreserveAspectRatio));
  defineToStringTag((SVGPreserveAspectRatio).prototype, (SVGPreserveAspectRatio).name);
  do {defineConstant((SVGPreserveAspectRatio), ("SVG_PRESERVEASPECTRATIO_UNKNOWN"), (0));} while (false);
do {defineConstant((SVGPreserveAspectRatio), ("SVG_PRESERVEASPECTRATIO_NONE"), (1));} while (false);
do {defineConstant((SVGPreserveAspectRatio), ("SVG_PRESERVEASPECTRATIO_XMINYMIN"), (2));} while (false);
do {defineConstant((SVGPreserveAspectRatio), ("SVG_PRESERVEASPECTRATIO_XMIDYMIN"), (3));} while (false);
do {defineConstant((SVGPreserveAspectRatio), ("SVG_PRESERVEASPECTRATIO_XMAXYMIN"), (4));} while (false);
do {defineConstant((SVGPreserveAspectRatio), ("SVG_PRESERVEASPECTRATIO_XMINYMID"), (5));} while (false);
do {defineConstant((SVGPreserveAspectRatio), ("SVG_PRESERVEASPECTRATIO_XMIDYMID"), (6));} while (false);
do {defineConstant((SVGPreserveAspectRatio), ("SVG_PRESERVEASPECTRATIO_XMAXYMID"), (7));} while (false);
do {defineConstant((SVGPreserveAspectRatio), ("SVG_PRESERVEASPECTRATIO_XMINYMAX"), (8));} while (false);
do {defineConstant((SVGPreserveAspectRatio), ("SVG_PRESERVEASPECTRATIO_XMIDYMAX"), (9));} while (false);
do {defineConstant((SVGPreserveAspectRatio), ("SVG_PRESERVEASPECTRATIO_XMAXYMAX"), (10));} while (false);
do {defineConstant((SVGPreserveAspectRatio), ("SVG_MEETORSLICE_UNKNOWN"), (0));} while (false);
do {defineConstant((SVGPreserveAspectRatio), ("SVG_MEETORSLICE_MEET"), (1));} while (false);
do {defineConstant((SVGPreserveAspectRatio), ("SVG_MEETORSLICE_SLICE"), (2));} while (false);
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
