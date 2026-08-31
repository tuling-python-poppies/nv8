import { registerNativeFunction } from "../../webidl/native-function.js";
import { CSSUnitValue } from "./css-typed-om-constructors.js";
import { createWorklet } from "../worklet/worklet-runtime.js";

export const escape = {
  escape(value) {
    const string = `${value}`;
    let result = "";
    for (let index = 0; index < string.length; index += 1) {
      const code = string.codePointAt(index);
      const character = String.fromCodePoint(code);
      if (code > 0xffff) index += 1;
      if (code === 0) result += "\uFFFD";
      else if (
        (code >= 0x0001 && code <= 0x001f)
        || code === 0x007f
        || (index === 0 && code >= 0x0030 && code <= 0x0039)
        || (index === 1 && code >= 0x0030 && code <= 0x0039 && string[0] === "-")
      ) result += `\\${code.toString(16)} `;
      else if (index === 0 && character === "-" && string.length === 1) result += "\\-";
      else if (
        code >= 0x0080
        || character === "-"
        || character === "_"
        || /[a-z0-9]/iu.test(character)
      ) result += character;
      else result += `\\${character}`;
    }
    return result;
  },
}.escape;
registerNativeFunction(escape, "escape");

export const supports = {
  supports(propertyOrCondition, value) {
    if (arguments.length > 1) {
      const property = `${propertyOrCondition}`.trim();
      const candidate = `${value}`.trim();
      return property !== "" && candidate !== "" && (
        property.startsWith("--")
        || /^-?[a-z][a-z0-9-]*$/iu.test(property)
      );
    }
    const condition = `${propertyOrCondition}`.trim();
    return /^\([^:()]+:\s*[^()]+\)$/u.test(condition)
      || /^not\s+\([^:()]+:\s*[^()]+\)$/iu.test(condition);
  },
}.supports;
Object.defineProperty(supports, "length", {
  value: 1,
  configurable: true,
});
registerNativeFunction(supports, "supports");

const unitNames = [
  ["number", "number"],
  ["percent", "percent"],
  ["px", "px"],
  ["cm", "cm"],
  ["mm", "mm"],
  ["Q", "q"],
  ["in", "in"],
  ["pc", "pc"],
  ["pt", "pt"],
  ["em", "em"],
  ["rem", "rem"],
  ["vw", "vw"],
  ["vh", "vh"],
  ["vmin", "vmin"],
  ["vmax", "vmax"],
  ["deg", "deg"],
  ["grad", "grad"],
  ["rad", "rad"],
  ["turn", "turn"],
  ["s", "s"],
  ["ms", "ms"],
  ["Hz", "hz"],
  ["kHz", "khz"],
  ["dpi", "dpi"],
  ["dpcm", "dpcm"],
  ["dppx", "dppx"],
  ["fr", "fr"],
];

export function installCSSNamespace() {
  const namespace = {};
  Object.defineProperty(namespace, Symbol.toStringTag, {
    value: "CSS",
    configurable: true,
  });
  defineMethod(namespace, "escape", escape);
  defineMethod(namespace, "supports", supports);
  Object.defineProperty(namespace, "paintWorklet", {
    value: createWorklet("paint"),
    writable: false,
    enumerable: true,
    configurable: true,
  });
  for (const [name, unit] of unitNames) {
    const callback = {
      [name](value) {
        return new CSSUnitValue(value, unit);
      },
    }[name];
    registerNativeFunction(callback, name);
    defineMethod(namespace, name, callback);
  }
  Object.defineProperty(globalThis, "CSS", {
    value: namespace,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

function defineMethod(target, name, callback) {
  Object.defineProperty(target, name, {
    value: callback,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}
