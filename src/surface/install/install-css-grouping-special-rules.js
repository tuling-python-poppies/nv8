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
  
  defineConstructorBacklink((CSSStartingStyleRule).prototype, (CSSStartingStyleRule));
  defineToStringTag((CSSStartingStyleRule).prototype, (CSSStartingStyleRule).name);
}
  {
  do {
    definePrototypeGetter((CSSScopeRule).prototype, ("start"), ((((([["start", scopeStart], ["end", scopeEnd]])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSScopeRule).prototype, ("end"), ((((([["start", scopeStart], ["end", scopeEnd]])[1]))[1])));
  } while (false);
  defineConstructorBacklink((CSSScopeRule).prototype, (CSSScopeRule));
  defineToStringTag((CSSScopeRule).prototype, (CSSScopeRule).name);
}
  {
  do {
    definePrototypeGetter((CSSPageRule).prototype, ("selectorText"), ((((([["selectorText", pageSelectorText], ["style", pageStyle]])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSPageRule).prototype, ("style"), ((((([["selectorText", pageSelectorText], ["style", pageStyle]])[1]))[1])));
  } while (false);
  defineConstructorBacklink((CSSPageRule).prototype, (CSSPageRule));
  defineToStringTag((CSSPageRule).prototype, (CSSPageRule).name);
}
  {
  do {
    definePrototypeGetter((CSSLayerStatementRule).prototype, ("nameList"), ((((([["nameList", layerNameList]])[0]))[1])));
  } while (false);
  defineConstructorBacklink((CSSLayerStatementRule).prototype, (CSSLayerStatementRule));
  defineToStringTag((CSSLayerStatementRule).prototype, (CSSLayerStatementRule).name);
}
  {
  do {
    definePrototypeGetter((CSSLayerBlockRule).prototype, ("name"), ((((([["name", layerBlockName]])[0]))[1])));
  } while (false);
  defineConstructorBacklink((CSSLayerBlockRule).prototype, (CSSLayerBlockRule));
  defineToStringTag((CSSLayerBlockRule).prototype, (CSSLayerBlockRule).name);
}
  {
  do {
    definePrototypeGetter((CSSContainerRule).prototype, ("containerName"), ((((([
    ["containerName", containerName],
    ["containerQuery", containerQuery],
    ["conditions", containerConditions],
  ])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSContainerRule).prototype, ("containerQuery"), ((((([
    ["containerName", containerName],
    ["containerQuery", containerQuery],
    ["conditions", containerConditions],
  ])[1]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSContainerRule).prototype, ("conditions"), ((((([
    ["containerName", containerName],
    ["containerQuery", containerQuery],
    ["conditions", containerConditions],
  ])[2]))[1])));
  } while (false);
  defineConstructorBacklink((CSSContainerRule).prototype, (CSSContainerRule));
  defineToStringTag((CSSContainerRule).prototype, (CSSContainerRule).name);
}
}


