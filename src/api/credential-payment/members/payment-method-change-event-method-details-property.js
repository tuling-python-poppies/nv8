import * as runtime from "../credential-payment-runtime.js";
import { PaymentMethodChangeEvent } from "../credential-payment-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    PaymentMethodChangeEvent,
    "methodDetails",
    runtime.credentialPaymentProperty,
    runtime.setCredentialPaymentProperty,
    false,
  );
}
