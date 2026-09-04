import * as runtime from "../credential-payment-runtime.js";
import { PaymentResponse } from "../credential-payment-runtime.js";
import { EventTarget as __ExplicitParent } from "../../event/event-target-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PaymentResponse);
}

export function installRelation() {
  installDispatchedRelation(
    PaymentResponse,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PaymentResponse,
    "requestId",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    PaymentResponse,
    "methodName",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    PaymentResponse,
    "details",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    PaymentResponse,
    "shippingAddress",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    PaymentResponse,
    "shippingOption",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    PaymentResponse,
    "payerName",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    PaymentResponse,
    "payerEmail",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    PaymentResponse,
    "payerPhone",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember8() {
  installDispatchedAccessor(
    PaymentResponse,
    "onpayerdetailchange",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    true,
  );
}

export function installOwnedMember9() {
  installDispatchedMethod(
    PaymentResponse,
    "complete",
    0,
    runtime.credentialPaymentOperation,
  );
}

export function installOwnedMember10() {
  installDispatchedMethod(
    PaymentResponse,
    "retry",
    0,
    runtime.credentialPaymentOperation,
  );
}

export function installOwnedMember11() {
  installDispatchedMethod(
    PaymentResponse,
    "toJSON",
    0,
    runtime.credentialPaymentOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PaymentResponse);
}

export function installTag() {
  installDispatchedTag(PaymentResponse);
}
