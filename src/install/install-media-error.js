import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { code } from "../api/media/media-error-code-getter.js";
import {
  MediaError,
  installMediaErrorConstructor,
} from "../api/media/media-error-constructor.js";
import { message } from "../api/media/media-error-message-getter.js";
export function installMediaError() {
  installMediaErrorConstructor();
  definePrototypeGetter(MediaError.prototype, "code", code);
  definePrototypeGetter(MediaError.prototype, "message", message);
  constant(MediaError.prototype, "MEDIA_ERR_ABORTED", 1);
  constant(MediaError.prototype, "MEDIA_ERR_NETWORK", 2);
  constant(MediaError.prototype, "MEDIA_ERR_DECODE", 3);
  constant(MediaError.prototype, "MEDIA_ERR_SRC_NOT_SUPPORTED", 4);
  defineConstructorBacklink(MediaError.prototype, MediaError);
  defineToStringTag(MediaError.prototype, "MediaError");
  constant(MediaError, "MEDIA_ERR_ABORTED", 1);
  constant(MediaError, "MEDIA_ERR_NETWORK", 2);
  constant(MediaError, "MEDIA_ERR_DECODE", 3);
  constant(MediaError, "MEDIA_ERR_SRC_NOT_SUPPORTED", 4);
}
function constant(target, name, value) {
  Object.defineProperty(target, name, {
    value,
    writable: false,
    enumerable: true,
    configurable: false,
  });
}
