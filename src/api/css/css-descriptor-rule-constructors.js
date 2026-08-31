import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { CSSRule } from "./css-rule-constructor.js";

export function CSSPropertyRule() { throw new TypeError("Illegal constructor"); }
export function CSSFontPaletteValuesRule() { throw new TypeError("Illegal constructor"); }
export function CSSCounterStyleRule() { throw new TypeError("Illegal constructor"); }
export function CSSFontFeatureValuesRule() { throw new TypeError("Illegal constructor"); }

for (const constructor of [
  CSSPropertyRule,
  CSSFontPaletteValuesRule,
  CSSCounterStyleRule,
  CSSFontFeatureValuesRule,
]) {
  registerNativeFunction(constructor, constructor.name);
}

export function installCSSDescriptorRuleConstructors() {
  for (const constructor of [
    CSSPropertyRule,
    CSSFontPaletteValuesRule,
    CSSCounterStyleRule,
    CSSFontFeatureValuesRule,
  ]) {
    Object.setPrototypeOf(constructor.prototype, CSSRule.prototype);
    Object.setPrototypeOf(constructor, CSSRule);
    delete constructor.prototype.constructor;
    defineGlobalConstructor(constructor.name, constructor);
  }
}
