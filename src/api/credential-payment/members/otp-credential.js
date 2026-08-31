import * as runtime from "../credential-payment-runtime.js";
import { OTPCredential } from "../credential-payment-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(OTPCredential);
}

export function installRelation() {
  installDispatchedRelation(
    OTPCredential,
    "Credential",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    OTPCredential,
    "code",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(OTPCredential);
}

export function installTag() {
  installDispatchedTag(OTPCredential);
}
