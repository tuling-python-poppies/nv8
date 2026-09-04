import * as runtime from "../credential-payment-runtime.js";
import { Credential } from "../credential-payment-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(Credential);
}

export function installRelation() {
  installDispatchedRelation(
    Credential,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    Credential,
    "id",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    Credential,
    "type",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(Credential);
}

export function installTag() {
  installDispatchedTag(Credential);
}
