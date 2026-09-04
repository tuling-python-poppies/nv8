import * as runtime from "../credential-payment-runtime.js";
import { PublicKeyCredential } from "../credential-payment-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PublicKeyCredential);
}

export function installRelation() {
  installDispatchedRelation(
    PublicKeyCredential,
    "Credential",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PublicKeyCredential,
    "rawId",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    PublicKeyCredential,
    "response",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    PublicKeyCredential,
    "authenticatorAttachment",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    PublicKeyCredential,
    "getClientExtensionResults",
    0,
    runtime.credentialPaymentOperation,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    PublicKeyCredential,
    "toJSON",
    0,
    runtime.credentialPaymentOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PublicKeyCredential);
}

export function installTag() {
  installDispatchedTag(PublicKeyCredential);
}
