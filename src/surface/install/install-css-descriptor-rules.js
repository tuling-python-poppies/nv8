import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  CSSCounterStyleRule,
  CSSFontFeatureValuesRule,
  CSSFontPaletteValuesRule,
  CSSPropertyRule,
  installCSSDescriptorRuleConstructors,
} from "../api/css/css-descriptor-rule-constructors.js";
import {
  counterAdditiveSymbols,
  counterFallback,
  counterName,
  counterNegative,
  counterPad,
  counterPrefix,
  counterRange,
  counterSpeakAs,
  counterSuffix,
  counterSymbols,
  counterSystem,
  featureAnnotation,
  featureCharacterVariant,
  featureFontFamily,
  featureOrnaments,
  featureStyleset,
  featureStylistic,
  featureSwash,
  paletteBasePalette,
  paletteFontFamily,
  paletteName,
  paletteOverrideColors,
  propertyInherits,
  propertyInitialValue,
  propertyName,
  propertySyntax,
} from "../api/css/css-descriptor-rule-members.js";

export function installCSSDescriptorRules() {
  installCSSDescriptorRuleConstructors();
  {

    definePrototypeGetter(CSSPropertyRule.prototype, "name", ((((["name", propertyName]))[1])));

    definePrototypeGetter(CSSPropertyRule.prototype, "syntax", ((((["syntax", propertySyntax]))[1])));

    definePrototypeGetter(CSSPropertyRule.prototype, "inherits", ((((["inherits", propertyInherits]))[1])));

    definePrototypeGetter(CSSPropertyRule.prototype, "initialValue", ((((["initialValue", propertyInitialValue]))[1])));

  defineConstructorBacklink(CSSPropertyRule.prototype, CSSPropertyRule);
  defineToStringTag(CSSPropertyRule.prototype, CSSPropertyRule.name);
}
  {

    definePrototypeGetter(CSSFontPaletteValuesRule.prototype, "name", ((((["name", paletteName]))[1])));

    definePrototypeGetter(CSSFontPaletteValuesRule.prototype, "fontFamily", ((((["fontFamily", paletteFontFamily]))[1])));

    definePrototypeGetter(CSSFontPaletteValuesRule.prototype, "basePalette", ((((["basePalette", paletteBasePalette]))[1])));

    definePrototypeGetter(CSSFontPaletteValuesRule.prototype, "overrideColors", ((((["overrideColors", paletteOverrideColors]))[1])));

  defineConstructorBacklink(CSSFontPaletteValuesRule.prototype, CSSFontPaletteValuesRule);
  defineToStringTag(CSSFontPaletteValuesRule.prototype, CSSFontPaletteValuesRule.name);
}
  {

    definePrototypeGetter(CSSCounterStyleRule.prototype, "name", ((((["name", counterName]))[1])));

    definePrototypeGetter(CSSCounterStyleRule.prototype, "system", ((((["system", counterSystem]))[1])));

    definePrototypeGetter(CSSCounterStyleRule.prototype, "symbols", ((((["symbols", counterSymbols]))[1])));

    definePrototypeGetter(CSSCounterStyleRule.prototype, "additiveSymbols", ((((["additiveSymbols", counterAdditiveSymbols]))[1])));

    definePrototypeGetter(CSSCounterStyleRule.prototype, "negative", ((((["negative", counterNegative]))[1])));

    definePrototypeGetter(CSSCounterStyleRule.prototype, "prefix", ((((["prefix", counterPrefix]))[1])));

    definePrototypeGetter(CSSCounterStyleRule.prototype, "suffix", ((((["suffix", counterSuffix]))[1])));

    definePrototypeGetter(CSSCounterStyleRule.prototype, "range", ((((["range", counterRange]))[1])));

    definePrototypeGetter(CSSCounterStyleRule.prototype, "pad", ((((["pad", counterPad]))[1])));

    definePrototypeGetter(CSSCounterStyleRule.prototype, "speakAs", ((((["speakAs", counterSpeakAs]))[1])));

    definePrototypeGetter(CSSCounterStyleRule.prototype, "fallback", ((((["fallback", counterFallback]))[1])));

  defineConstructorBacklink(CSSCounterStyleRule.prototype, CSSCounterStyleRule);
  defineToStringTag(CSSCounterStyleRule.prototype, CSSCounterStyleRule.name);
}
  {

    definePrototypeGetter(CSSFontFeatureValuesRule.prototype, "fontFamily", ((((["fontFamily", featureFontFamily]))[1])));

    definePrototypeGetter(CSSFontFeatureValuesRule.prototype, "annotation", ((((["annotation", featureAnnotation]))[1])));

    definePrototypeGetter(CSSFontFeatureValuesRule.prototype, "ornaments", ((((["ornaments", featureOrnaments]))[1])));

    definePrototypeGetter(CSSFontFeatureValuesRule.prototype, "stylistic", ((((["stylistic", featureStylistic]))[1])));

    definePrototypeGetter(CSSFontFeatureValuesRule.prototype, "swash", ((((["swash", featureSwash]))[1])));

    definePrototypeGetter(CSSFontFeatureValuesRule.prototype, "characterVariant", ((((["characterVariant", featureCharacterVariant]))[1])));

    definePrototypeGetter(CSSFontFeatureValuesRule.prototype, "styleset", ((((["styleset", featureStyleset]))[1])));

  defineConstructorBacklink(CSSFontFeatureValuesRule.prototype, CSSFontFeatureValuesRule);
  defineToStringTag(CSSFontFeatureValuesRule.prototype, CSSFontFeatureValuesRule.name);
}
}
