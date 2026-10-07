// css 的成员表：名字就能描述实现，不再一个成员一个文件。

import { cssStyleMethod } from "./css-style-declaration-method.js";
import {
  normalizeCSSPropertyName,
  readCSSDeclarations,
} from "./css-style-declaration-state.js";

const CSS_STYLE_METHOD_TABLE_ROWS = [
  ["getPropertyPriority", "getPropertyPriority", 1, (declaration, args) =>
    readCSSDeclarations(declaration).get(normalizeCSSPropertyName(args[0]))?.priority ?? ""],
  ["getPropertyValue", "getPropertyValue", 1, (declaration, args) =>
    readCSSDeclarations(declaration).get(normalizeCSSPropertyName(args[0]))?.value ?? ""],
];

export const cssStyleMethodTable = CSS_STYLE_METHOD_TABLE_ROWS.map(
  ([name, ...args]) => [name, cssStyleMethod(...args)],
);
