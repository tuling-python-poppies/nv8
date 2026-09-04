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
  do {
    definePrototypeGetter((CSSPropertyRule).prototype, ("name"), ((((([
    ["name", propertyName],
    ["syntax", propertySyntax],
    ["inherits", propertyInherits],
    ["initialValue", propertyInitialValue],
  ])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSPropertyRule).prototype, ("syntax"), ((((([
    ["name", propertyName],
    ["syntax", propertySyntax],
    ["inherits", propertyInherits],
    ["initialValue", propertyInitialValue],
  ])[1]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSPropertyRule).prototype, ("inherits"), ((((([
    ["name", propertyName],
    ["syntax", propertySyntax],
    ["inherits", propertyInherits],
    ["initialValue", propertyInitialValue],
  ])[2]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSPropertyRule).prototype, ("initialValue"), ((((([
    ["name", propertyName],
    ["syntax", propertySyntax],
    ["inherits", propertyInherits],
    ["initialValue", propertyInitialValue],
  ])[3]))[1])));
  } while (false);
  defineConstructorBacklink((CSSPropertyRule).prototype, (CSSPropertyRule));
  defineToStringTag((CSSPropertyRule).prototype, (CSSPropertyRule).name);
}
  {
  do {
    definePrototypeGetter((CSSFontPaletteValuesRule).prototype, ("name"), ((((([
    ["name", paletteName],
    ["fontFamily", paletteFontFamily],
    ["basePalette", paletteBasePalette],
    ["overrideColors", paletteOverrideColors],
  ])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSFontPaletteValuesRule).prototype, ("fontFamily"), ((((([
    ["name", paletteName],
    ["fontFamily", paletteFontFamily],
    ["basePalette", paletteBasePalette],
    ["overrideColors", paletteOverrideColors],
  ])[1]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSFontPaletteValuesRule).prototype, ("basePalette"), ((((([
    ["name", paletteName],
    ["fontFamily", paletteFontFamily],
    ["basePalette", paletteBasePalette],
    ["overrideColors", paletteOverrideColors],
  ])[2]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSFontPaletteValuesRule).prototype, ("overrideColors"), ((((([
    ["name", paletteName],
    ["fontFamily", paletteFontFamily],
    ["basePalette", paletteBasePalette],
    ["overrideColors", paletteOverrideColors],
  ])[3]))[1])));
  } while (false);
  defineConstructorBacklink((CSSFontPaletteValuesRule).prototype, (CSSFontPaletteValuesRule));
  defineToStringTag((CSSFontPaletteValuesRule).prototype, (CSSFontPaletteValuesRule).name);
}
  {
  do {
    definePrototypeGetter((CSSCounterStyleRule).prototype, ("name"), ((((([
    ["name", counterName],
    ["system", counterSystem],
    ["symbols", counterSymbols],
    ["additiveSymbols", counterAdditiveSymbols],
    ["negative", counterNegative],
    ["prefix", counterPrefix],
    ["suffix", counterSuffix],
    ["range", counterRange],
    ["pad", counterPad],
    ["speakAs", counterSpeakAs],
    ["fallback", counterFallback],
  ])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSCounterStyleRule).prototype, ("system"), ((((([
    ["name", counterName],
    ["system", counterSystem],
    ["symbols", counterSymbols],
    ["additiveSymbols", counterAdditiveSymbols],
    ["negative", counterNegative],
    ["prefix", counterPrefix],
    ["suffix", counterSuffix],
    ["range", counterRange],
    ["pad", counterPad],
    ["speakAs", counterSpeakAs],
    ["fallback", counterFallback],
  ])[1]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSCounterStyleRule).prototype, ("symbols"), ((((([
    ["name", counterName],
    ["system", counterSystem],
    ["symbols", counterSymbols],
    ["additiveSymbols", counterAdditiveSymbols],
    ["negative", counterNegative],
    ["prefix", counterPrefix],
    ["suffix", counterSuffix],
    ["range", counterRange],
    ["pad", counterPad],
    ["speakAs", counterSpeakAs],
    ["fallback", counterFallback],
  ])[2]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSCounterStyleRule).prototype, ("additiveSymbols"), ((((([
    ["name", counterName],
    ["system", counterSystem],
    ["symbols", counterSymbols],
    ["additiveSymbols", counterAdditiveSymbols],
    ["negative", counterNegative],
    ["prefix", counterPrefix],
    ["suffix", counterSuffix],
    ["range", counterRange],
    ["pad", counterPad],
    ["speakAs", counterSpeakAs],
    ["fallback", counterFallback],
  ])[3]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSCounterStyleRule).prototype, ("negative"), ((((([
    ["name", counterName],
    ["system", counterSystem],
    ["symbols", counterSymbols],
    ["additiveSymbols", counterAdditiveSymbols],
    ["negative", counterNegative],
    ["prefix", counterPrefix],
    ["suffix", counterSuffix],
    ["range", counterRange],
    ["pad", counterPad],
    ["speakAs", counterSpeakAs],
    ["fallback", counterFallback],
  ])[4]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSCounterStyleRule).prototype, ("prefix"), ((((([
    ["name", counterName],
    ["system", counterSystem],
    ["symbols", counterSymbols],
    ["additiveSymbols", counterAdditiveSymbols],
    ["negative", counterNegative],
    ["prefix", counterPrefix],
    ["suffix", counterSuffix],
    ["range", counterRange],
    ["pad", counterPad],
    ["speakAs", counterSpeakAs],
    ["fallback", counterFallback],
  ])[5]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSCounterStyleRule).prototype, ("suffix"), ((((([
    ["name", counterName],
    ["system", counterSystem],
    ["symbols", counterSymbols],
    ["additiveSymbols", counterAdditiveSymbols],
    ["negative", counterNegative],
    ["prefix", counterPrefix],
    ["suffix", counterSuffix],
    ["range", counterRange],
    ["pad", counterPad],
    ["speakAs", counterSpeakAs],
    ["fallback", counterFallback],
  ])[6]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSCounterStyleRule).prototype, ("range"), ((((([
    ["name", counterName],
    ["system", counterSystem],
    ["symbols", counterSymbols],
    ["additiveSymbols", counterAdditiveSymbols],
    ["negative", counterNegative],
    ["prefix", counterPrefix],
    ["suffix", counterSuffix],
    ["range", counterRange],
    ["pad", counterPad],
    ["speakAs", counterSpeakAs],
    ["fallback", counterFallback],
  ])[7]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSCounterStyleRule).prototype, ("pad"), ((((([
    ["name", counterName],
    ["system", counterSystem],
    ["symbols", counterSymbols],
    ["additiveSymbols", counterAdditiveSymbols],
    ["negative", counterNegative],
    ["prefix", counterPrefix],
    ["suffix", counterSuffix],
    ["range", counterRange],
    ["pad", counterPad],
    ["speakAs", counterSpeakAs],
    ["fallback", counterFallback],
  ])[8]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSCounterStyleRule).prototype, ("speakAs"), ((((([
    ["name", counterName],
    ["system", counterSystem],
    ["symbols", counterSymbols],
    ["additiveSymbols", counterAdditiveSymbols],
    ["negative", counterNegative],
    ["prefix", counterPrefix],
    ["suffix", counterSuffix],
    ["range", counterRange],
    ["pad", counterPad],
    ["speakAs", counterSpeakAs],
    ["fallback", counterFallback],
  ])[9]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSCounterStyleRule).prototype, ("fallback"), ((((([
    ["name", counterName],
    ["system", counterSystem],
    ["symbols", counterSymbols],
    ["additiveSymbols", counterAdditiveSymbols],
    ["negative", counterNegative],
    ["prefix", counterPrefix],
    ["suffix", counterSuffix],
    ["range", counterRange],
    ["pad", counterPad],
    ["speakAs", counterSpeakAs],
    ["fallback", counterFallback],
  ])[10]))[1])));
  } while (false);
  defineConstructorBacklink((CSSCounterStyleRule).prototype, (CSSCounterStyleRule));
  defineToStringTag((CSSCounterStyleRule).prototype, (CSSCounterStyleRule).name);
}
  {
  do {
    definePrototypeGetter((CSSFontFeatureValuesRule).prototype, ("fontFamily"), ((((([
    ["fontFamily", featureFontFamily],
    ["annotation", featureAnnotation],
    ["ornaments", featureOrnaments],
    ["stylistic", featureStylistic],
    ["swash", featureSwash],
    ["characterVariant", featureCharacterVariant],
    ["styleset", featureStyleset],
  ])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSFontFeatureValuesRule).prototype, ("annotation"), ((((([
    ["fontFamily", featureFontFamily],
    ["annotation", featureAnnotation],
    ["ornaments", featureOrnaments],
    ["stylistic", featureStylistic],
    ["swash", featureSwash],
    ["characterVariant", featureCharacterVariant],
    ["styleset", featureStyleset],
  ])[1]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSFontFeatureValuesRule).prototype, ("ornaments"), ((((([
    ["fontFamily", featureFontFamily],
    ["annotation", featureAnnotation],
    ["ornaments", featureOrnaments],
    ["stylistic", featureStylistic],
    ["swash", featureSwash],
    ["characterVariant", featureCharacterVariant],
    ["styleset", featureStyleset],
  ])[2]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSFontFeatureValuesRule).prototype, ("stylistic"), ((((([
    ["fontFamily", featureFontFamily],
    ["annotation", featureAnnotation],
    ["ornaments", featureOrnaments],
    ["stylistic", featureStylistic],
    ["swash", featureSwash],
    ["characterVariant", featureCharacterVariant],
    ["styleset", featureStyleset],
  ])[3]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSFontFeatureValuesRule).prototype, ("swash"), ((((([
    ["fontFamily", featureFontFamily],
    ["annotation", featureAnnotation],
    ["ornaments", featureOrnaments],
    ["stylistic", featureStylistic],
    ["swash", featureSwash],
    ["characterVariant", featureCharacterVariant],
    ["styleset", featureStyleset],
  ])[4]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSFontFeatureValuesRule).prototype, ("characterVariant"), ((((([
    ["fontFamily", featureFontFamily],
    ["annotation", featureAnnotation],
    ["ornaments", featureOrnaments],
    ["stylistic", featureStylistic],
    ["swash", featureSwash],
    ["characterVariant", featureCharacterVariant],
    ["styleset", featureStyleset],
  ])[5]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSFontFeatureValuesRule).prototype, ("styleset"), ((((([
    ["fontFamily", featureFontFamily],
    ["annotation", featureAnnotation],
    ["ornaments", featureOrnaments],
    ["stylistic", featureStylistic],
    ["swash", featureSwash],
    ["characterVariant", featureCharacterVariant],
    ["styleset", featureStyleset],
  ])[6]))[1])));
  } while (false);
  defineConstructorBacklink((CSSFontFeatureValuesRule).prototype, (CSSFontFeatureValuesRule));
  defineToStringTag((CSSFontFeatureValuesRule).prototype, (CSSFontFeatureValuesRule).name);
}
}


