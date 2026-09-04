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

  {
  do {
    definePrototypeGetter((CSSTranslate).prototype, ("x"), ((((([["x", x("CSSTranslate")], ["y", y("CSSTranslate")], ["z", z("CSSTranslate")]])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSTranslate).prototype, ("y"), ((((([["x", x("CSSTranslate")], ["y", y("CSSTranslate")], ["z", z("CSSTranslate")]])[1]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSTranslate).prototype, ("z"), ((((([["x", x("CSSTranslate")], ["y", y("CSSTranslate")], ["z", z("CSSTranslate")]])[2]))[1])));
  } while (false);
  finish((CSSTranslate), (CSSTranslate).name);
}
  {
  do {
    definePrototypeGetter((CSSSkewY).prototype, ("ay"), ((((([["ay", ay("CSSSkewY")]])[0]))[1])));
  } while (false);
  finish((CSSSkewY), (CSSSkewY).name);
}
  {
  do {
    definePrototypeGetter((CSSSkewX).prototype, ("ax"), ((((([["ax", ax("CSSSkewX")]])[0]))[1])));
  } while (false);
  finish((CSSSkewX), (CSSSkewX).name);
}
  {
  do {
    definePrototypeGetter((CSSSkew).prototype, ("ax"), ((((([["ax", ax("CSSSkew")], ["ay", ay("CSSSkew")]])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSSkew).prototype, ("ay"), ((((([["ax", ax("CSSSkew")], ["ay", ay("CSSSkew")]])[1]))[1])));
  } while (false);
  finish((CSSSkew), (CSSSkew).name);
}
  {
  do {
    definePrototypeGetter((CSSScale).prototype, ("x"), ((((([["x", x("CSSScale")], ["y", y("CSSScale")], ["z", z("CSSScale")]])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSScale).prototype, ("y"), ((((([["x", x("CSSScale")], ["y", y("CSSScale")], ["z", z("CSSScale")]])[1]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSScale).prototype, ("z"), ((((([["x", x("CSSScale")], ["y", y("CSSScale")], ["z", z("CSSScale")]])[2]))[1])));
  } while (false);
  finish((CSSScale), (CSSScale).name);
}
  {
  do {
    definePrototypeGetter((CSSRotate).prototype, ("angle"), ((((([["angle", angle], ["x", x("CSSRotate")], ["y", y("CSSRotate")], ["z", z("CSSRotate")]])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSRotate).prototype, ("x"), ((((([["angle", angle], ["x", x("CSSRotate")], ["y", y("CSSRotate")], ["z", z("CSSRotate")]])[1]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSRotate).prototype, ("y"), ((((([["angle", angle], ["x", x("CSSRotate")], ["y", y("CSSRotate")], ["z", z("CSSRotate")]])[2]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSRotate).prototype, ("z"), ((((([["angle", angle], ["x", x("CSSRotate")], ["y", y("CSSRotate")], ["z", z("CSSRotate")]])[3]))[1])));
  } while (false);
  finish((CSSRotate), (CSSRotate).name);
}
  {
  do {
    definePrototypeGetter((CSSPerspective).prototype, ("length"), ((((([["length", perspectiveLength]])[0]))[1])));
  } while (false);
  finish((CSSPerspective), (CSSPerspective).name);
}
  {
  do {
    definePrototypeGetter((CSSMatrixComponent).prototype, ("matrix"), ((((([["matrix", matrix]])[0]))[1])));
  } while (false);
  finish((CSSMatrixComponent), (CSSMatrixComponent).name);
}
  {
  do {
    definePrototypeGetter((CSSPositionValue).prototype, ("x"), ((((([["x", positionX], ["y", positionY]])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSPositionValue).prototype, ("y"), ((((([["x", positionX], ["y", positionY]])[1]))[1])));
  } while (false);
  finish((CSSPositionValue), (CSSPositionValue).name);
}

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
