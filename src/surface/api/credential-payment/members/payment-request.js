import * as runtime from "../credential-payment-runtime.js";
import { PaymentRequest } from "../credential-payment-runtime.js";
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
  installDispatchedGlobal(PaymentRequest);
}

export function installRelation() {
  installDispatchedRelation(
    PaymentRequest,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PaymentRequest,
    "id",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    PaymentRequest,
    "shippingAddress",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    PaymentRequest,
    "shippingOption",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    PaymentRequest,
    "shippingType",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    PaymentRequest,
    "onshippingaddresschange",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    true,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    PaymentRequest,
    "onshippingoptionchange",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    true,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    PaymentRequest,
    "abort",
    0,
    runtime.credentialPaymentOperation,
  );
}

export function installOwnedMember7() {
  installDispatchedMethod(
    PaymentRequest,
    "canMakePayment",
    0,
    runtime.credentialPaymentOperation,
  );
}

export function installOwnedMember8() {
  installDispatchedMethod(
    PaymentRequest,
    "hasEnrolledInstrument",
    0,
    runtime.credentialPaymentOperation,
  );
}

export function installOwnedMember9() {
  installDispatchedMethod(
    PaymentRequest,
    "show",
    0,
    runtime.credentialPaymentOperation,
  );
}

export function installOwnedMember10() {
  installDispatchedAccessor(
    PaymentRequest,
    "onpaymentmethodchange",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    true,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PaymentRequest);
}

export function installTag() {
  installDispatchedTag(PaymentRequest);
}
