import * as runtime from "../credential-payment-runtime.js";
import { PaymentRequestUpdateEvent } from "../credential-payment-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PaymentRequestUpdateEvent);
}

export function installRelation() {
  installDispatchedRelation(
    PaymentRequestUpdateEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PaymentRequestUpdateEvent);
}

export function installTag() {
  installDispatchedTag(PaymentRequestUpdateEvent);
}
