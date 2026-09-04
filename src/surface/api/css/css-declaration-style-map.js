import {
  parseCSSDeclarations,
  readCSSDeclarations,
  writeCSSDeclarations,
} from "./css-style-declaration-state.js";
import { createCSSStyleValue, requireCSSStyleValue } from "./css-style-value-state.js";
import { createStylePropertyMap } from "./style-property-map-state.js";

export function createStyleMapForDeclaration(declaration) {
  return createStylePropertyMap(
    () => new Map([...readCSSDeclarations(declaration)].map(([name, value]) => [
      name,
      [createCSSStyleValue(value.value)],
    ])),
    map => {
      const current = readCSSDeclarations(declaration);
      const declarations = new Map();
      for (const [name, values] of map) {
        const value = values.map(requireCSSStyleValue).join(", ");
        if (value !== "") {
          declarations.set(name, {
            value,
            priority: current.get(name)?.priority ?? "",
          });
        }
      }
      writeCSSDeclarations(declaration, declarations);
    },
  );
}

export function replaceDeclarationText(declaration, text) {
  writeCSSDeclarations(declaration, parseCSSDeclarations(text));
}
