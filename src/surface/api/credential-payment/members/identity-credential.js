import * as runtime from "../credential-payment-runtime.js";
import { IdentityCredential } from "../credential-payment-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(IdentityCredential);
}

export function installRelation() {
  installDispatchedRelation(
    IdentityCredential,
    "Credential",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    IdentityCredential,
    "token",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    IdentityCredential,
    "isAutoSelected",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(IdentityCredential);
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    IdentityCredential,
    "configURL",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installTag() {
  installDispatchedTag(IdentityCredential);
}
