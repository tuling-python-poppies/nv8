import { cssStyleAccessorDescriptor } from "./css-style-declaration-property.js";
import { readCSSDeclarations, writeCSSDeclarations } from "./css-style-declaration-state.js";

const descriptor = cssStyleAccessorDescriptor(
  "cssFloat",
  declaration => readCSSDeclarations(declaration).get("float")?.value ?? "",
  (declaration, value) => {
    const declarations = readCSSDeclarations(declaration);
    const text = `${value}`.trim();
    if (text === "") declarations.delete("float");
    else declarations.set("float", { value: text, priority: "" });
    writeCSSDeclarations(declaration, declarations);
  },
);
export const cssFloat = descriptor;
