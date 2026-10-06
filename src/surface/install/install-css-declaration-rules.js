import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  CSSFontFaceRule,
  CSSImageValue,
  CSSMarginRule,
  CSSNamespaceRule,
  CSSNestedDeclarations,
  CSSPositionTryRule,
  CSSViewTransitionRule,
  installCSSDeclarationRuleConstructors,
} from "../api/css/css-declaration-rule-constructors.js";
import {
  fontFaceStyle,
  marginName,
  marginStyle,
  namespacePrefix,
  namespaceURI,
  nestedStyle,
  positionTryName,
  positionTryStyle,
  viewTransitionNavigation,
  viewTransitionTypes,
} from "../api/css/css-declaration-rule-members.js";

export function installCSSDeclarationRules() {
  installCSSDeclarationRuleConstructors();
  {

    definePrototypeGetter(CSSViewTransitionRule.prototype, "navigation", ((((["navigation", viewTransitionNavigation]))[1])));

    definePrototypeGetter(CSSViewTransitionRule.prototype, "types", ((((["types", viewTransitionTypes]))[1])));

  defineConstructorBacklink(CSSViewTransitionRule.prototype, CSSViewTransitionRule);
  defineToStringTag(CSSViewTransitionRule.prototype, CSSViewTransitionRule.name);
}
  {

    definePrototypeGetter(CSSPositionTryRule.prototype, "name", ((((["name", positionTryName]))[1])));

    definePrototypeGetter(CSSPositionTryRule.prototype, "style", ((((["style", positionTryStyle]))[1])));

  defineConstructorBacklink(CSSPositionTryRule.prototype, CSSPositionTryRule);
  defineToStringTag(CSSPositionTryRule.prototype, CSSPositionTryRule.name);
}
  {

    definePrototypeGetter(CSSNestedDeclarations.prototype, "style", ((((([["style", nestedStyle]])[0]))[1])));

  defineConstructorBacklink(CSSNestedDeclarations.prototype, CSSNestedDeclarations);
  defineToStringTag(CSSNestedDeclarations.prototype, CSSNestedDeclarations.name);
}
  {

    definePrototypeGetter(CSSNamespaceRule.prototype, "namespaceURI", ((((["namespaceURI", namespaceURI]))[1])));

    definePrototypeGetter(CSSNamespaceRule.prototype, "prefix", ((((["prefix", namespacePrefix]))[1])));

  defineConstructorBacklink(CSSNamespaceRule.prototype, CSSNamespaceRule);
  defineToStringTag(CSSNamespaceRule.prototype, CSSNamespaceRule.name);
}
  {

    definePrototypeGetter(CSSMarginRule.prototype, "name", ((((["name", marginName]))[1])));

    definePrototypeGetter(CSSMarginRule.prototype, "style", ((((["style", marginStyle]))[1])));

  defineConstructorBacklink(CSSMarginRule.prototype, CSSMarginRule);
  defineToStringTag(CSSMarginRule.prototype, CSSMarginRule.name);
}
  {

    definePrototypeGetter(CSSFontFaceRule.prototype, "style", ((((([["style", fontFaceStyle]])[0]))[1])));

  defineConstructorBacklink(CSSFontFaceRule.prototype, CSSFontFaceRule);
  defineToStringTag(CSSFontFaceRule.prototype, CSSFontFaceRule.name);
}
  {

  defineConstructorBacklink(CSSImageValue.prototype, CSSImageValue);
  defineToStringTag(CSSImageValue.prototype, CSSImageValue.name);
}
}
