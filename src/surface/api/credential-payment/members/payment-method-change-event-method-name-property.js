import * as runtime from "../credential-payment-runtime.js";
import { PaymentMethodChangeEvent } from "../credential-payment-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    PaymentMethodChangeEvent,
    "methodName",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}
