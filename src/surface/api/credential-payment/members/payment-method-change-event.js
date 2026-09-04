import * as runtime from "../credential-payment-runtime.js";
import { PaymentMethodChangeEvent } from "../credential-payment-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PaymentMethodChangeEvent);
}

export function installRelation() {
  installDispatchedRelation(
    PaymentMethodChangeEvent,
    "PaymentRequestUpdateEvent",
    null,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PaymentMethodChangeEvent);
}

export function installTag() {
  installDispatchedTag(PaymentMethodChangeEvent);
}
