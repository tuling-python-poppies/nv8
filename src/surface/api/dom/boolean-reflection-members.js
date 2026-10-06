// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { booleanReflection } from "./html-reflection.js";

const BOOLEAN_REFLECTION_TABLE_ROWS = [
  ["noHref", "HTMLAreaElement", "noHref", "nohref"],
  ["disabled", "HTMLButtonElement", "disabled", "disabled"],
  ["formNoValidate", "HTMLButtonElement", "formNoValidate", "formnovalidate"],
  ["compact", "HTMLDListElement", "compact", "compact"],
  ["open", "HTMLDetailsElement", "open", "open"],
  ["compact", "HTMLDirectoryElement", "compact", "compact"],
  ["disabled", "HTMLFieldSetElement", "disabled", "disabled"],
  ["noValidate", "HTMLFormElement", "noValidate", "novalidate"],
  ["noShade", "HTMLHRElement", "noShade", "noshade"],
  ["browsingTopics", "HTMLImageElement", "browsingTopics", "browsingtopics"],
  ["isMap", "HTMLImageElement", "isMap", "ismap"],
  ["sharedStorageWritable", "HTMLImageElement", "sharedStorageWritable", "sharedstoragewritable"],
  ["disabled", "HTMLInputElement", "disabled", "disabled"],
  ["formNoValidate", "HTMLInputElement", "formNoValidate", "formnovalidate"],
  ["incremental", "HTMLInputElement", "incremental", "incremental"],
  ["multiple", "HTMLInputElement", "multiple", "multiple"],
  ["readOnly", "HTMLInputElement", "readOnly", "readonly"],
  ["required", "HTMLInputElement", "required", "required"],
  ["webkitdirectory", "HTMLInputElement", "webkitdirectory", "webkitdirectory"],
  ["disabled", "HTMLLinkElement", "disabled", "disabled"],
  ["trueSpeed", "HTMLMarqueeElement", "trueSpeed", "truespeed"],
  ["compact", "HTMLMenuElement", "compact", "compact"],
  ["compact", "HTMLOListElement", "compact", "compact"],
  ["reversed", "HTMLOListElement", "reversed", "reversed"],
  ["declare", "HTMLObjectElement", "declare", "declare"],
  ["disabled", "HTMLOptGroupElement", "disabled", "disabled"],
  ["defaultSelected", "HTMLOptionElement", "defaultSelected", "selected"],
  ["disabled", "HTMLOptionElement", "disabled", "disabled"],
  ["defer", "HTMLScriptElement", "defer", "defer"],
  ["noModule", "HTMLScriptElement", "noModule", "nomodule"],
  ["disabled", "HTMLSelectElement", "disabled", "disabled"],
  ["multiple", "HTMLSelectElement", "multiple", "multiple"],
  ["required", "HTMLSelectElement", "required", "required"],
  ["noWrap", "HTMLTableCellElement", "noWrap", "nowrap"],
  ["disabled", "HTMLTextAreaElement", "disabled", "disabled"],
  ["readOnly", "HTMLTextAreaElement", "readOnly", "readonly"],
  ["required", "HTMLTextAreaElement", "required", "required"],
  ["compact", "HTMLUListElement", "compact", "compact"],
];

export const booleanReflectionTable = BOOLEAN_REFLECTION_TABLE_ROWS.map(
  ([name, ...args]) => [name, booleanReflection(...args)],
);

