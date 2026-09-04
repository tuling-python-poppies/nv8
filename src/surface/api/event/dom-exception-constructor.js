import { traceConstruct } from "../../../infra/trace/trace-function.js";
import { toDOMString } from "../../../engine/webidl/conversions.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { initializeDOMException } from "./dom-exception-state.js";

export function DOMException(message = "", name = "Error") {
  if (new.target === undefined) {
    throw new TypeError("Failed to construct 'DOMException': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
  }
  const normalizedMessage = toDOMString(message);
  const normalizedName = toDOMString(name);
  initializeDOMException(this, normalizedMessage, normalizedName);
  traceConstruct(
    "window.DOMException",
    [normalizedMessage, normalizedName],
    "DOMException",
  );
}

Object.setPrototypeOf(DOMException.prototype, Error.prototype);
registerNativeFunction(DOMException, "DOMException");

const legacyCodes = Object.freeze({
  IndexSizeError: 1,
  DOMStringSizeError: 2,
  HierarchyRequestError: 3,
  WrongDocumentError: 4,
  InvalidCharacterError: 5,
  NoDataAllowedError: 6,
  NoModificationAllowedError: 7,
  NotFoundError: 8,
  NotSupportedError: 9,
  InUseAttributeError: 10,
  InvalidStateError: 11,
  SyntaxError: 12,
  InvalidModificationError: 13,
  NamespaceError: 14,
  InvalidAccessError: 15,
  ValidationError: 16,
  TypeMismatchError: 17,
  SecurityError: 18,
  NetworkError: 19,
  AbortError: 20,
  URLMismatchError: 21,
  QuotaExceededError: 22,
  TimeoutError: 23,
  InvalidNodeTypeError: 24,
  DataCloneError: 25,
});

export function domExceptionLegacyCode(name) {
  return legacyCodes[name] ?? 0;
}

export function installDOMExceptionConstructor() {
  delete DOMException.prototype.constructor;
  defineToStringTag(DOMException.prototype, "DOMException");
  defineGlobalConstructor("DOMException", DOMException);
}

export function installDOMExceptionConstants() {
  defineLegacyConstant("INDEX_SIZE_ERR", 1);
  defineLegacyConstant("DOMSTRING_SIZE_ERR", 2);
  defineLegacyConstant("HIERARCHY_REQUEST_ERR", 3);
  defineLegacyConstant("WRONG_DOCUMENT_ERR", 4);
  defineLegacyConstant("INVALID_CHARACTER_ERR", 5);
  defineLegacyConstant("NO_DATA_ALLOWED_ERR", 6);
  defineLegacyConstant("NO_MODIFICATION_ALLOWED_ERR", 7);
  defineLegacyConstant("NOT_FOUND_ERR", 8);
  defineLegacyConstant("NOT_SUPPORTED_ERR", 9);
  defineLegacyConstant("INUSE_ATTRIBUTE_ERR", 10);
  defineLegacyConstant("INVALID_STATE_ERR", 11);
  defineLegacyConstant("SYNTAX_ERR", 12);
  defineLegacyConstant("INVALID_MODIFICATION_ERR", 13);
  defineLegacyConstant("NAMESPACE_ERR", 14);
  defineLegacyConstant("INVALID_ACCESS_ERR", 15);
  defineLegacyConstant("VALIDATION_ERR", 16);
  defineLegacyConstant("TYPE_MISMATCH_ERR", 17);
  defineLegacyConstant("SECURITY_ERR", 18);
  defineLegacyConstant("NETWORK_ERR", 19);
  defineLegacyConstant("ABORT_ERR", 20);
  defineLegacyConstant("URL_MISMATCH_ERR", 21);
  defineLegacyConstant("QUOTA_EXCEEDED_ERR", 22);
  defineLegacyConstant("TIMEOUT_ERR", 23);
  defineLegacyConstant("INVALID_NODE_TYPE_ERR", 24);
  defineLegacyConstant("DATA_CLONE_ERR", 25);
}

export function installDOMExceptionConstructorBacklink() {
  defineConstructorBacklink(DOMException.prototype, DOMException);
}

function defineLegacyConstant(name, value) {
  Object.defineProperty(DOMException, name, {
    value,
    enumerable: true,
  });
  Object.defineProperty(DOMException.prototype, name, {
    value,
    enumerable: true,
  });
}
