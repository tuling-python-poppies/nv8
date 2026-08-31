import * as runtime from "../credential-payment-runtime.js";
import { AuthenticatorResponse } from "../credential-payment-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AuthenticatorResponse);
}

export function installRelation() {
  installDispatchedRelation(
    AuthenticatorResponse,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    AuthenticatorResponse,
    "clientDataJSON",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AuthenticatorResponse);
}

export function installTag() {
  installDispatchedTag(AuthenticatorResponse);
}
