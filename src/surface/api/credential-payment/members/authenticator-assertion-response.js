import * as runtime from "../credential-payment-runtime.js";
import { AuthenticatorAssertionResponse } from "../credential-payment-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AuthenticatorAssertionResponse);
}

export function installRelation() {
  installDispatchedRelation(
    AuthenticatorAssertionResponse,
    "AuthenticatorResponse",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    AuthenticatorAssertionResponse,
    "authenticatorData",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    AuthenticatorAssertionResponse,
    "signature",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    AuthenticatorAssertionResponse,
    "userHandle",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AuthenticatorAssertionResponse);
}

export function installTag() {
  installDispatchedTag(AuthenticatorAssertionResponse);
}
