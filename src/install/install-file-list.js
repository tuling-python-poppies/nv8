import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  FileList,
  installFileListConstructor,
} from "../api/file/file-list-constructor.js";
import { item } from "../api/file/file-list-item.js";
import { length } from "../api/file/file-list-length-getter.js";
import { values } from "../api/file/file-list-values.js";

export function installFileList() {
  installFileListConstructor();
  definePrototypeGetter(FileList.prototype, "length", length);
  definePrototypeMethod(FileList.prototype, "item", item);
  defineConstructorBacklink(FileList.prototype, FileList);
  defineToStringTag(FileList.prototype, "FileList");
  Object.defineProperty(FileList.prototype, Symbol.iterator, {
    value: values,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}
