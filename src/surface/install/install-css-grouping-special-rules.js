import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  CSSContainerRule,
  CSSLayerBlockRule,
  CSSLayerStatementRule,
  CSSPageRule,
  CSSScopeRule,
  CSSStartingStyleRule,
  installCSSGroupingSpecialConstructors,
} from "../api/css/css-grouping-special-constructors.js";
import {
  containerConditions,
  containerName,
  containerQuery,
  layerBlockName,
  layerNameList,
  pageSelectorText,
  pageStyle,
  scopeEnd,
  scopeStart,
} from "../api/css/css-grouping-special-members.js";

export function installCSSGroupingSpecialRules() {
  installCSSGroupingSpecialConstructors();
  {

  defineConstructorBacklink(CSSStartingStyleRule.prototype, CSSStartingStyleRule);
  defineToStringTag(CSSStartingStyleRule.prototype, CSSStartingStyleRule.name);
}
  {

    definePrototypeGetter(CSSScopeRule.prototype, "start", ((((["start", scopeStart]))[1])));

    definePrototypeGetter(CSSScopeRule.prototype, "end", ((((["end", scopeEnd]))[1])));

  defineConstructorBacklink(CSSScopeRule.prototype, CSSScopeRule);
  defineToStringTag(CSSScopeRule.prototype, CSSScopeRule.name);
}
  {

    definePrototypeGetter(CSSPageRule.prototype, "selectorText", ((((["selectorText", pageSelectorText]))[1])));

    definePrototypeGetter(CSSPageRule.prototype, "style", ((((["style", pageStyle]))[1])));

  defineConstructorBacklink(CSSPageRule.prototype, CSSPageRule);
  defineToStringTag(CSSPageRule.prototype, CSSPageRule.name);
}
  {

    definePrototypeGetter(CSSLayerStatementRule.prototype, "nameList", ((((([["nameList", layerNameList]])[0]))[1])));

  defineConstructorBacklink(CSSLayerStatementRule.prototype, CSSLayerStatementRule);
  defineToStringTag(CSSLayerStatementRule.prototype, CSSLayerStatementRule.name);
}
  {

    definePrototypeGetter(CSSLayerBlockRule.prototype, "name", ((((([["name", layerBlockName]])[0]))[1])));

  defineConstructorBacklink(CSSLayerBlockRule.prototype, CSSLayerBlockRule);
  defineToStringTag(CSSLayerBlockRule.prototype, CSSLayerBlockRule.name);
}
  {

    definePrototypeGetter(CSSContainerRule.prototype, "containerName", ((((["containerName", containerName]))[1])));

    definePrototypeGetter(CSSContainerRule.prototype, "containerQuery", ((((["containerQuery", containerQuery]))[1])));

    definePrototypeGetter(CSSContainerRule.prototype, "conditions", ((((["conditions", containerConditions]))[1])));

  defineConstructorBacklink(CSSContainerRule.prototype, CSSContainerRule);
  defineToStringTag(CSSContainerRule.prototype, CSSContainerRule.name);
}
}
