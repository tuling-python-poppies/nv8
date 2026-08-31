import { traceCall } from "../../trace/trace-function.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireCSSDescriptorRule } from "./css-descriptor-rule-state.js";

export const propertyName = getter("CSSPropertyRule", "name", record => record.name);
export const propertySyntax = getter(
  "CSSPropertyRule",
  "syntax",
  record => read(record, "syntax"),
);
export const propertyInherits = getter(
  "CSSPropertyRule",
  "inherits",
  record => read(record, "inherits").toLowerCase() === "true",
);
export const propertyInitialValue = getter(
  "CSSPropertyRule",
  "initialValue",
  record => read(record, "initial-value"),
);
export const paletteName = getter(
  "CSSFontPaletteValuesRule",
  "name",
  record => record.name,
);
export const paletteFontFamily = getter(
  "CSSFontPaletteValuesRule",
  "fontFamily",
  record => read(record, "font-family"),
);
export const paletteBasePalette = getter(
  "CSSFontPaletteValuesRule",
  "basePalette",
  record => read(record, "base-palette"),
);
export const paletteOverrideColors = getter(
  "CSSFontPaletteValuesRule",
  "overrideColors",
  record => read(record, "override-colors"),
);

export const counterName = getter("CSSCounterStyleRule", "name", record => record.name);
export const counterSystem = counterGetter("system");
export const counterSymbols = counterGetter("symbols");
export const counterAdditiveSymbols = counterGetter("additiveSymbols", "additive-symbols");
export const counterNegative = counterGetter("negative");
export const counterPrefix = counterGetter("prefix");
export const counterSuffix = counterGetter("suffix");
export const counterRange = counterGetter("range");
export const counterPad = counterGetter("pad");
export const counterSpeakAs = counterGetter("speakAs", "speak-as");
export const counterFallback = counterGetter("fallback");

export const featureFontFamily = getter(
  "CSSFontFeatureValuesRule",
  "fontFamily",
  record => record.name,
);
export const featureAnnotation = featureGetter("annotation");
export const featureOrnaments = featureGetter("ornaments");
export const featureStylistic = featureGetter("stylistic");
export const featureSwash = featureGetter("swash");
export const featureCharacterVariant = featureGetter("characterVariant");
export const featureStyleset = featureGetter("styleset");

function counterGetter(name, property = name) {
  return getter("CSSCounterStyleRule", name, record => read(record, property));
}

function featureGetter(name) {
  return getter("CSSFontFeatureValuesRule", name, record => record.maps[name]);
}

function read(record, property) {
  return record.style.getPropertyValue(property);
}

function getter(interfaceName, name, readValue) {
  const callback = function () {
    const result = readValue(requireCSSDescriptorRule(this));
    traceCall(`window.${interfaceName}.prototype.${name}`, interfaceName, [], result);
    return result;
  };
  registerNativeGetter(callback, name);
  return callback;
}
