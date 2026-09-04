import * as runtime from "../credential-payment-runtime.js";
import { IdentityCredentialError } from "../credential-payment-runtime.js";
import { DOMException as __ExplicitParent } from "../../event/dom-exception-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(IdentityCredentialError);
}

export function installRelation() {
  installDispatchedRelation(
    IdentityCredentialError,
    "DOMException",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    IdentityCredentialError,
    "code",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    IdentityCredentialError,
    "url",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    IdentityCredentialError,
    "error",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(IdentityCredentialError);
}

export function installTag() {
  installDispatchedTag(IdentityCredentialError);
}
