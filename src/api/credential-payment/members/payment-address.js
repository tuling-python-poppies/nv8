import * as runtime from "../credential-payment-runtime.js";
import { PaymentAddress } from "../credential-payment-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PaymentAddress);
}

export function installRelation() {
  installDispatchedRelation(
    PaymentAddress,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PaymentAddress,
    "city",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    PaymentAddress,
    "country",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    PaymentAddress,
    "dependentLocality",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    PaymentAddress,
    "organization",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    PaymentAddress,
    "phone",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    PaymentAddress,
    "postalCode",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    PaymentAddress,
    "recipient",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    PaymentAddress,
    "region",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember8() {
  installDispatchedAccessor(
    PaymentAddress,
    "sortingCode",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember9() {
  installDispatchedAccessor(
    PaymentAddress,
    "addressLine",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember10() {
  installDispatchedMethod(
    PaymentAddress,
    "toJSON",
    0,
    runtime.credentialPaymentOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PaymentAddress);
}

export function installTag() {
  installDispatchedTag(PaymentAddress);
}
