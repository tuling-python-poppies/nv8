import {
  CSSCounterStyleRule,
  CSSFontFeatureValuesRule,
  CSSFontPaletteValuesRule,
  CSSPropertyRule,
} from "./css-descriptor-rule-constructors.js";
import {
  createCSSStyleDeclaration,
  parseCSSDeclarations,
} from "./css-style-declaration-state.js";
import { initializeCSSRule, requireCSSRule } from "./css-rule-state.js";
import { replaceDeclarationText } from "./css-declaration-style-map.js";

const state = new WeakMap();

export function createCSSPropertyRule(name, body, parentStyleSheet, parentRule) {
  return createDescriptorRule(
    CSSPropertyRule,
    "@property",
    name,
    body,
    parentStyleSheet,
    parentRule,
    "property",
  );
}

export function createCSSFontPaletteValuesRule(name, body, parentStyleSheet, parentRule) {
  return createDescriptorRule(
    CSSFontPaletteValuesRule,
    "@font-palette-values",
    name,
    body,
    parentStyleSheet,
    parentRule,
    "palette",
  );
}

export function createCSSCounterStyleRule(name, body, parentStyleSheet, parentRule) {
  return createDescriptorRule(
    CSSCounterStyleRule,
    "@counter-style",
    name,
    body,
    parentStyleSheet,
    parentRule,
    "counter",
  );
}

export function createCSSFontFeatureValuesRule(
  fontFamily,
  body,
  parentStyleSheet,
  parentRule,
) {
  const rule = Object.create(CSSFontFeatureValuesRule.prototype);
  const maps = parseFeatureMaps(body);
  const record = {
    kind: "feature",
    keyword: "@font-feature-values",
    name: `${fontFamily}`.trim(),
    body: `${body}`.trim(),
    maps,
  };
  state.set(rule, record);
  initializeCSSRule(rule, 14, "", parentStyleSheet, parentRule, {
    serialize: () => serializeDescriptorRule(rule),
    setCssText: text => replaceDescriptorRuleText(rule, text),
  });
  return rule;
}

export function requireCSSDescriptorRule(value) {
  requireCSSRule(value);
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function createDescriptorRule(
  constructor,
  keyword,
  name,
  body,
  parentStyleSheet,
  parentRule,
  kind,
) {
  const rule = Object.create(constructor.prototype);
  const style = createCSSStyleDeclaration(null, body, rule);
  state.set(rule, {
    kind,
    keyword,
    name: `${name}`.trim(),
    style,
  });
  initializeCSSRule(rule, kind === "counter" ? 11 : 0, "", parentStyleSheet, parentRule, {
    serialize: () => serializeDescriptorRule(rule),
    setCssText: text => replaceDescriptorRuleText(rule, text),
  });
  return rule;
}

function serializeDescriptorRule(rule) {
  const record = requireCSSDescriptorRule(rule);
  const body = record.kind === "feature" ? record.body : record.style.cssText;
  return `${record.keyword} ${record.name} {${body === "" ? "" : ` ${body}`} }`;
}

function replaceDescriptorRuleText(rule, text) {
  const source = `${text}`.trim();
  const open = source.indexOf("{");
  const close = source.lastIndexOf("}");
  if (open < 0 || close < open) {
    throw new DOMException("The rule could not be parsed.", "SyntaxError");
  }
  const record = requireCSSDescriptorRule(rule);
  const header = source.slice(0, open).trim();
  if (!header.toLowerCase().startsWith(record.keyword)) {
    throw new DOMException("The rule could not be parsed.", "SyntaxError");
  }
  record.name = header.slice(record.keyword.length).trim();
  const body = source.slice(open + 1, close);
  if (record.kind === "feature") {
    record.body = body.trim();
    record.maps = parseFeatureMaps(body);
  } else {
    replaceDeclarationText(record.style, body);
  }
}

function parseFeatureMaps(body) {
  const maps = {
    annotation: new Map(),
    ornaments: new Map(),
    stylistic: new Map(),
    swash: new Map(),
    characterVariant: new Map(),
    styleset: new Map(),
  };
  const pattern = /@(annotation|ornaments|stylistic|swash|character-variant|styleset)\s*\{([^}]*)\}/giu;
  let match;
  while ((match = pattern.exec(`${body}`)) !== null) {
    const key = match[1] === "character-variant" ? "characterVariant" : match[1];
    for (const [name, declaration] of parseCSSDeclarations(match[2])) {
      maps[key].set(name, declaration.value.split(/\s+/u).map(Number));
    }
  }
  return maps;
}
