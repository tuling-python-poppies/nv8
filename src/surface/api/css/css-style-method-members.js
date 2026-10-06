// css 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { cssStyleMethod } from "./css-style-declaration-method.js";
import {
  normalizeCSSPropertyName,
  readCSSDeclarations,
} from "./css-style-declaration-state.js";

export const getPropertyPriority = cssStyleMethod(
  "getPropertyPriority",
  1,
  (declaration, args) =>
    readCSSDeclarations(declaration).get(normalizeCSSPropertyName(args[0]))?.priority ?? "",
);
export const getPropertyValue = cssStyleMethod(
  "getPropertyValue",
  1,
  (declaration, args) =>
    readCSSDeclarations(declaration).get(normalizeCSSPropertyName(args[0]))?.value ?? "",
);
