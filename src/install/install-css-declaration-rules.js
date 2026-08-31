import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../webidl/descriptor.js";
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
  do {
    definePrototypeGetter((CSSViewTransitionRule).prototype, ("navigation"), ((((([["navigation", viewTransitionNavigation], ["types", viewTransitionTypes]])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSViewTransitionRule).prototype, ("types"), ((((([["navigation", viewTransitionNavigation], ["types", viewTransitionTypes]])[1]))[1])));
  } while (false);
  defineConstructorBacklink((CSSViewTransitionRule).prototype, (CSSViewTransitionRule));
  defineToStringTag((CSSViewTransitionRule).prototype, (CSSViewTransitionRule).name);
}
  {
  do {
    definePrototypeGetter((CSSPositionTryRule).prototype, ("name"), ((((([["name", positionTryName], ["style", positionTryStyle]])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSPositionTryRule).prototype, ("style"), ((((([["name", positionTryName], ["style", positionTryStyle]])[1]))[1])));
  } while (false);
  defineConstructorBacklink((CSSPositionTryRule).prototype, (CSSPositionTryRule));
  defineToStringTag((CSSPositionTryRule).prototype, (CSSPositionTryRule).name);
}
  {
  do {
    definePrototypeGetter((CSSNestedDeclarations).prototype, ("style"), ((((([["style", nestedStyle]])[0]))[1])));
  } while (false);
  defineConstructorBacklink((CSSNestedDeclarations).prototype, (CSSNestedDeclarations));
  defineToStringTag((CSSNestedDeclarations).prototype, (CSSNestedDeclarations).name);
}
  {
  do {
    definePrototypeGetter((CSSNamespaceRule).prototype, ("namespaceURI"), ((((([["namespaceURI", namespaceURI], ["prefix", namespacePrefix]])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSNamespaceRule).prototype, ("prefix"), ((((([["namespaceURI", namespaceURI], ["prefix", namespacePrefix]])[1]))[1])));
  } while (false);
  defineConstructorBacklink((CSSNamespaceRule).prototype, (CSSNamespaceRule));
  defineToStringTag((CSSNamespaceRule).prototype, (CSSNamespaceRule).name);
}
  {
  do {
    definePrototypeGetter((CSSMarginRule).prototype, ("name"), ((((([["name", marginName], ["style", marginStyle]])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSMarginRule).prototype, ("style"), ((((([["name", marginName], ["style", marginStyle]])[1]))[1])));
  } while (false);
  defineConstructorBacklink((CSSMarginRule).prototype, (CSSMarginRule));
  defineToStringTag((CSSMarginRule).prototype, (CSSMarginRule).name);
}
  {
  do {
    definePrototypeGetter((CSSFontFaceRule).prototype, ("style"), ((((([["style", fontFaceStyle]])[0]))[1])));
  } while (false);
  defineConstructorBacklink((CSSFontFaceRule).prototype, (CSSFontFaceRule));
  defineToStringTag((CSSFontFaceRule).prototype, (CSSFontFaceRule).name);
}
  {
  
  defineConstructorBacklink((CSSImageValue).prototype, (CSSImageValue));
  defineToStringTag((CSSImageValue).prototype, (CSSImageValue).name);
}
}


