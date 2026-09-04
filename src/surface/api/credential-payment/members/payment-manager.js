import * as runtime from "../credential-payment-runtime.js";
import { PaymentManager } from "../credential-payment-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PaymentManager);
}

export function installRelation() {
  installDispatchedRelation(
    PaymentManager,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PaymentManager,
    "userHint",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    PaymentManager,
    "enableDelegations",
    1,
    runtime.credentialPaymentOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PaymentManager);
}

export function installTag() {
  installDispatchedTag(PaymentManager);
}
