import * as runtime from "../credential-payment-runtime.js";
import { FederatedCredential } from "../credential-payment-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(FederatedCredential);
}

export function installRelation() {
  installDispatchedRelation(
    FederatedCredential,
    "Credential",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    FederatedCredential,
    "provider",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    FederatedCredential,
    "protocol",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    FederatedCredential,
    "name",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    FederatedCredential,
    "iconURL",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(FederatedCredential);
}

export function installTag() {
  installDispatchedTag(FederatedCredential);
}
