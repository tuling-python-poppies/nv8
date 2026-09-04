import * as runtime from "../credential-payment-runtime.js";
import { DigitalCredential } from "../credential-payment-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(DigitalCredential);
}

export function installRelation() {
  installDispatchedRelation(
    DigitalCredential,
    "Credential",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    DigitalCredential,
    "protocol",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    DigitalCredential,
    "data",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    DigitalCredential,
    "toJSON",
    0,
    runtime.credentialPaymentOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(DigitalCredential);
}

export function installTag() {
  installDispatchedTag(DigitalCredential);
}
