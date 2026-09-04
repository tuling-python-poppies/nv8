import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
export const lookupNamespaceURI = {
  lookupNamespaceURI(prefix) {
    const value = `${prefix}`;
    if (value === "html" || value === "xhtml") return "http://www.w3.org/1999/xhtml";
    if (value === "svg") return "http://www.w3.org/2000/svg";
    if (value === "math" || value === "mathml") return "http://www.w3.org/1998/Math/MathML";
    if (value === "xml") return "http://www.w3.org/XML/1998/namespace";
    return null;
  },
}.lookupNamespaceURI;
registerNativeFunction(lookupNamespaceURI, "lookupNamespaceURI");
