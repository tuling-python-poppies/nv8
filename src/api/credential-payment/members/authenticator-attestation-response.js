import * as runtime from "../credential-payment-runtime.js";
import { AuthenticatorAttestationResponse } from "../credential-payment-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AuthenticatorAttestationResponse);
}

export function installRelation() {
  installDispatchedRelation(
    AuthenticatorAttestationResponse,
    "AuthenticatorResponse",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    AuthenticatorAttestationResponse,
    "attestationObject",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    AuthenticatorAttestationResponse,
    "getAuthenticatorData",
    0,
    runtime.credentialPaymentOperation,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    AuthenticatorAttestationResponse,
    "getPublicKey",
    0,
    runtime.credentialPaymentOperation,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    AuthenticatorAttestationResponse,
    "getPublicKeyAlgorithm",
    0,
    runtime.credentialPaymentOperation,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    AuthenticatorAttestationResponse,
    "getTransports",
    0,
    runtime.credentialPaymentOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AuthenticatorAttestationResponse);
}

export function installTag() {
  installDispatchedTag(AuthenticatorAttestationResponse);
}
