import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  CSSMatrixComponent,
  CSSPerspective,
  CSSPositionValue,
  CSSRotate,
  CSSScale,
  CSSSkew,
  CSSSkewX,
  CSSSkewY,
  CSSTransformComponent,
  CSSTransformValue,
  CSSTranslate,
  installCSSTransformConstructors,
} from "../api/css/css-transform-constructors.js";
import {
  angle,
  ax,
  ay,
  componentIs2DGetter,
  componentToMatrix,
  componentToString,
  matrix,
  perspectiveLength,
  positionX,
  positionY,
  transformEntries,
  transformForEach,
  transformIs2D,
  transformKeys,
  transformLength,
  transformToMatrix,
  transformValues,
  x,
  y,
  z,
} from "../api/css/css-transform-members.js";

export function installCSSTransformValues() {
  installCSSTransformConstructors();
  definePrototypeGetter(CSSTransformComponent.prototype, "is2D", componentIs2DGetter);
  definePrototypeMethod(CSSTransformComponent.prototype, "toMatrix", componentToMatrix);
  definePrototypeMethod(CSSTransformComponent.prototype, "toString", componentToString);
  finish(CSSTransformComponent, "CSSTransformComponent");

  definePrototypeGetter(CSSTranslate.prototype, "x", x("CSSTranslate"));
  definePrototypeGetter(CSSTranslate.prototype, "y", y("CSSTranslate"));
  definePrototypeGetter(CSSTranslate.prototype, "z", z("CSSTranslate"));
  finish(CSSTranslate, CSSTranslate.name);

  definePrototypeGetter(CSSSkewY.prototype, "ay", ay("CSSSkewY"));
  finish(CSSSkewY, CSSSkewY.name);

  definePrototypeGetter(CSSSkewX.prototype, "ax", ax("CSSSkewX"));
  finish(CSSSkewX, CSSSkewX.name);

  definePrototypeGetter(CSSSkew.prototype, "ax", ax("CSSSkew"));
  definePrototypeGetter(CSSSkew.prototype, "ay", ay("CSSSkew"));
  finish(CSSSkew, CSSSkew.name);

  definePrototypeGetter(CSSScale.prototype, "x", x("CSSScale"));
  definePrototypeGetter(CSSScale.prototype, "y", y("CSSScale"));
  definePrototypeGetter(CSSScale.prototype, "z", z("CSSScale"));
  finish(CSSScale, CSSScale.name);

  definePrototypeGetter(CSSRotate.prototype, "angle", angle);
  definePrototypeGetter(CSSRotate.prototype, "x", x("CSSRotate"));
  definePrototypeGetter(CSSRotate.prototype, "y", y("CSSRotate"));
  definePrototypeGetter(CSSRotate.prototype, "z", z("CSSRotate"));
  finish(CSSRotate, CSSRotate.name);

  definePrototypeGetter(CSSPerspective.prototype, "length", perspectiveLength);
  finish(CSSPerspective, CSSPerspective.name);

  definePrototypeGetter(CSSMatrixComponent.prototype, "matrix", matrix);
  finish(CSSMatrixComponent, CSSMatrixComponent.name);

  definePrototypeGetter(CSSPositionValue.prototype, "x", positionX);
  definePrototypeGetter(CSSPositionValue.prototype, "y", positionY);
  finish(CSSPositionValue, CSSPositionValue.name);

  definePrototypeMethod(CSSTransformValue.prototype, "entries", transformEntries);
  definePrototypeMethod(CSSTransformValue.prototype, "keys", transformKeys);
  definePrototypeMethod(CSSTransformValue.prototype, "values", transformValues);
  definePrototypeMethod(CSSTransformValue.prototype, "forEach", transformForEach);
  definePrototypeGetter(CSSTransformValue.prototype, "length", transformLength);
  definePrototypeGetter(CSSTransformValue.prototype, "is2D", transformIs2D);
  definePrototypeMethod(CSSTransformValue.prototype, "toMatrix", transformToMatrix);
  finish(CSSTransformValue, "CSSTransformValue");
  Object.defineProperty(CSSTransformValue.prototype, Symbol.iterator, {
    value: transformValues,
    writable: true,
    configurable: true,
  });
}

function finish(constructor, tag) {
  defineConstructorBacklink(constructor.prototype, constructor);
  defineToStringTag(constructor.prototype, tag);
}
