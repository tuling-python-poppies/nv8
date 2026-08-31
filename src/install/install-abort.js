import { installAbortControllerAbort } from "../api/abort/abort-controller-abort.js";
import {
  installAbortControllerConstructor,
  installAbortControllerConstructorBacklink,
} from "../api/abort/abort-controller-constructor.js";
import { installAbortControllerSignal } from "../api/abort/abort-controller-signal-getter.js";
import { installAbortSignalAbortStatic } from "../api/abort/abort-signal-abort-static.js";
import { installAbortSignalAborted } from "../api/abort/abort-signal-aborted-getter.js";
import { installAbortSignalAnyStatic } from "../api/abort/abort-signal-any-static.js";
import {
  installAbortSignalConstructor,
  installAbortSignalConstructorBacklink,
} from "../api/abort/abort-signal-constructor.js";
import { installAbortSignalOnabort } from "../api/abort/abort-signal-onabort-property.js";
import { installAbortSignalReason } from "../api/abort/abort-signal-reason-getter.js";
import { installAbortSignalThrowIfAborted } from "../api/abort/abort-signal-throw-if-aborted.js";
import { installAbortSignalTimeoutStatic } from "../api/abort/abort-signal-timeout-static.js";

export function installAbort() {
  installAbortSignalConstructor();
  installAbortSignalAborted();
  installAbortSignalReason();
  installAbortSignalOnabort();
  installAbortSignalThrowIfAborted();
  installAbortSignalConstructorBacklink();
  installAbortSignalAbortStatic();
  installAbortSignalAnyStatic();
  installAbortSignalTimeoutStatic();
  installAbortControllerConstructor();
  installAbortControllerSignal();
  installAbortControllerAbort();
  installAbortControllerConstructorBacklink();
}
