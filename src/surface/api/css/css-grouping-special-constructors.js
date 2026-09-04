import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { CSSConditionRule } from "./css-condition-rule-constructor.js";
import { CSSGroupingRule } from "./css-grouping-rule-constructor.js";
import { CSSRule } from "./css-rule-constructor.js";

export function CSSStartingStyleRule() { throw new TypeError("Illegal constructor"); }
export function CSSLayerBlockRule() { throw new TypeError("Illegal constructor"); }
export function CSSLayerStatementRule() { throw new TypeError("Illegal constructor"); }
export function CSSScopeRule() { throw new TypeError("Illegal constructor"); }
export function CSSPageRule() { throw new TypeError("Illegal constructor"); }
export function CSSContainerRule() { throw new TypeError("Illegal constructor"); }

for (const constructor of [
  CSSStartingStyleRule,
  CSSLayerBlockRule,
  CSSLayerStatementRule,
  CSSScopeRule,
  CSSPageRule,
  CSSContainerRule,
]) {
  registerNativeFunction(constructor, constructor.name);
}

export function installCSSGroupingSpecialConstructors() {
  for (const constructor of [
    CSSStartingStyleRule,
    CSSLayerBlockRule,
    CSSScopeRule,
    CSSPageRule,
  ]) {
    inherit(constructor, CSSGroupingRule);
  }
  inherit(CSSLayerStatementRule, CSSRule);
  inherit(CSSContainerRule, CSSConditionRule);
  for (const constructor of [
    CSSStartingStyleRule,
    CSSLayerBlockRule,
    CSSLayerStatementRule,
    CSSScopeRule,
    CSSPageRule,
    CSSContainerRule,
  ]) {
    delete constructor.prototype.constructor;
    defineGlobalConstructor(constructor.name, constructor);
  }
}

function inherit(constructor, parent) {
  Object.setPrototypeOf(constructor.prototype, parent.prototype);
  Object.setPrototypeOf(constructor, parent);
}
