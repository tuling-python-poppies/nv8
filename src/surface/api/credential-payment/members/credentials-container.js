import * as runtime from "../credential-payment-runtime.js";
import { CredentialsContainer } from "../credential-payment-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(CredentialsContainer);
}

export function installRelation() {
  installDispatchedRelation(
    CredentialsContainer,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedMethod(
    CredentialsContainer,
    "create",
    0,
    runtime.credentialPaymentOperation,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    CredentialsContainer,
    "get",
    0,
    runtime.credentialPaymentOperation,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    CredentialsContainer,
    "preventSilentAccess",
    0,
    runtime.credentialPaymentOperation,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    CredentialsContainer,
    "store",
    1,
    runtime.credentialPaymentOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(CredentialsContainer);
}

export function installTag() {
  installDispatchedTag(CredentialsContainer);
}
