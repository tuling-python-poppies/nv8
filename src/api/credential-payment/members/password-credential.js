import * as runtime from "../credential-payment-runtime.js";
import { PasswordCredential } from "../credential-payment-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PasswordCredential);
}

export function installRelation() {
  installDispatchedRelation(
    PasswordCredential,
    "Credential",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PasswordCredential,
    "password",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    PasswordCredential,
    "name",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    PasswordCredential,
    "iconURL",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PasswordCredential);
}

export function installTag() {
  installDispatchedTag(PasswordCredential);
}
