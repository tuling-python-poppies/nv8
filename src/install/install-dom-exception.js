import {
  installDOMExceptionCode,
} from "../api/event/dom-exception-code-getter.js";
import {
  installDOMExceptionConstructor,
  installDOMExceptionConstants,
  installDOMExceptionConstructorBacklink,
} from "../api/event/dom-exception-constructor.js";
import {
  installDOMExceptionMessage,
} from "../api/event/dom-exception-message-getter.js";
import {
  installDOMExceptionName,
} from "../api/event/dom-exception-name-getter.js";
export function installDOMException() {
  installDOMExceptionConstructor();
  installDOMExceptionCode();
  installDOMExceptionName();
  installDOMExceptionMessage();
  installDOMExceptionConstants();
  installDOMExceptionConstructorBacklink();
}
