import * as runtime from "../api/trusted-types/trusted-types-runtime.js";
import {
  TRUSTED_TYPE_SURFACES,
} from "../api/trusted-types/trusted-types-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const constructors = Object.freeze(Object.fromEntries(
  runtime.trustedTypeConstructors.map(Constructor => [Constructor.name, Constructor]),
));

export function installTrustedTypes() {
  installTrustedEval();

    delete runtime.trustedTypeConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.trustedTypeConstructors[0].name, runtime.trustedTypeConstructors[0]);

    delete runtime.trustedTypeConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.trustedTypeConstructors[1].name, runtime.trustedTypeConstructors[1]);

    delete runtime.trustedTypeConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.trustedTypeConstructors[2].name, runtime.trustedTypeConstructors[2]);

    delete runtime.trustedTypeConstructors[3].prototype.constructor;
    defineGlobalConstructor(runtime.trustedTypeConstructors[3].name, runtime.trustedTypeConstructors[3]);

    delete runtime.trustedTypeConstructors[4].prototype.constructor;
    defineGlobalConstructor(runtime.trustedTypeConstructors[4].name, runtime.trustedTypeConstructors[4]);

    {

    installAccessor(constructors["TrustedTypePolicyFactory"], "emptyHTML");

    installAccessor(constructors["TrustedTypePolicyFactory"], "emptyScript");

    installAccessor(constructors["TrustedTypePolicyFactory"], "defaultPolicy");

    installMethod(constructors["TrustedTypePolicyFactory"], "createPolicy", 1);

    installMethod(constructors["TrustedTypePolicyFactory"], "getAttributeType", 2);

    installMethod(constructors["TrustedTypePolicyFactory"], "getPropertyType", 2);

    installMethod(constructors["TrustedTypePolicyFactory"], "getTypeMapping", 0);

    installMethod(constructors["TrustedTypePolicyFactory"], "isHTML", 1);

    installMethod(constructors["TrustedTypePolicyFactory"], "isScript", 1);

    installMethod(constructors["TrustedTypePolicyFactory"], "isScriptURL", 1);

    defineConstructorBacklink(constructors["TrustedTypePolicyFactory"].prototype, constructors["TrustedTypePolicyFactory"]);

    defineToStringTag(constructors["TrustedTypePolicyFactory"].prototype, constructors["TrustedTypePolicyFactory"].name);

}

    {

    installAccessor(constructors["TrustedTypePolicy"], "name");

    installMethod(constructors["TrustedTypePolicy"], "createHTML", 1);

    installMethod(constructors["TrustedTypePolicy"], "createScript", 1);

    installMethod(constructors["TrustedTypePolicy"], "createScriptURL", 1);

    defineConstructorBacklink(constructors["TrustedTypePolicy"].prototype, constructors["TrustedTypePolicy"]);

    defineToStringTag(constructors["TrustedTypePolicy"].prototype, constructors["TrustedTypePolicy"].name);

}

    {

    installMethod(constructors["TrustedHTML"], "toJSON", 0);

    installMethod(constructors["TrustedHTML"], "toString", 0);

    defineConstructorBacklink(constructors["TrustedHTML"].prototype, constructors["TrustedHTML"]);

    defineToStringTag(constructors["TrustedHTML"].prototype, constructors["TrustedHTML"].name);

}

    {

    installMethod(constructors["TrustedScript"], "toJSON", 0);

    installMethod(constructors["TrustedScript"], "toString", 0);

    defineConstructorBacklink(constructors["TrustedScript"].prototype, constructors["TrustedScript"]);

    defineToStringTag(constructors["TrustedScript"].prototype, constructors["TrustedScript"].name);

}

    {

    installMethod(constructors["TrustedScriptURL"], "toJSON", 0);

    installMethod(constructors["TrustedScriptURL"], "toString", 0);

    defineConstructorBacklink(constructors["TrustedScriptURL"].prototype, constructors["TrustedScriptURL"]);

    defineToStringTag(constructors["TrustedScriptURL"].prototype, constructors["TrustedScriptURL"].name);

}

  const descriptor = Object.getOwnPropertyDescriptor({
    get trustedTypes() {
      return runtime.createTrustedTypePolicyFactory();
    },
  }, "trustedTypes");
  registerNativeGetter(descriptor.get, "trustedTypes");
  Object.defineProperty(globalThis, "trustedTypes", {
    get: descriptor.get,
    enumerable: true,
    configurable: true,
  });
}

function installTrustedEval() {
  const realmEval = globalThis.eval;
  const trustedEval = { eval(source) {
    return realmEval(runtime.unwrapTrustedScript(source));
  } }.eval;
  Object.defineProperty(trustedEval, "length", { value: 1, configurable: true });
  registerNativeFunction(trustedEval, "eval");
  Object.defineProperty(globalThis, "eval", {
    value: trustedEval,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() { return runtime.trustedTypeProperty(this, name); },
  }, name);
  registerNativeGetter(descriptor.get, name);
  definePrototypeGetter(Constructor.prototype, name, descriptor.get);
}

function installMethod(Constructor, name, length) {
  const callback = { [name](...args) {
    return runtime.trustedTypeOperation(this, name, args);
  } }[name];
  Object.defineProperty(callback, "length", { value: length, configurable: true });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}
