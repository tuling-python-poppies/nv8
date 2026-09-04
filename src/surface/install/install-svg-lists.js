import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  SVGLengthList,
  SVGNumberList,
  SVGPointList,
  SVGStringList,
  SVGTransformList,
  installSVGListConstructors,
} from "../api/svg/svg-list-constructors.js";
import { createSVGListMembers } from "../api/svg/svg-list-members.js";

export function installSVGLists() {
  installSVGListConstructors();
  for (const constructor of [
    SVGLengthList,
    SVGNumberList,
    SVGPointList,
    SVGStringList,
  ]) {
    install(constructor, createSVGListMembers(constructor.name));
  }
  install(SVGTransformList, createSVGListMembers("SVGTransformList", true), true);
}

function install(constructor, members, transform = false) {
  definePrototypeGetter(constructor.prototype, "length", members.length);
  definePrototypeGetter(
    constructor.prototype,
    "numberOfItems",
    members.numberOfItems,
  );
  definePrototypeMethod(constructor.prototype, "appendItem", members.appendItem);
  definePrototypeMethod(constructor.prototype, "clear", members.clear);
  if (transform) {
    definePrototypeMethod(constructor.prototype, "consolidate", members.consolidate);
    definePrototypeMethod(
      constructor.prototype,
      "createSVGTransformFromMatrix",
      members.createSVGTransformFromMatrix,
    );
  }
  definePrototypeMethod(constructor.prototype, "getItem", members.getItem);
  definePrototypeMethod(constructor.prototype, "initialize", members.initialize);
  definePrototypeMethod(
    constructor.prototype,
    "insertItemBefore",
    members.insertItemBefore,
  );
  definePrototypeMethod(constructor.prototype, "removeItem", members.removeItem);
  definePrototypeMethod(constructor.prototype, "replaceItem", members.replaceItem);
  defineConstructorBacklink(constructor.prototype, constructor);
  defineToStringTag(constructor.prototype, constructor.name);
  Object.defineProperty(constructor.prototype, Symbol.iterator, {
    value: members.values,
    writable: true,
    configurable: true,
  });
}
