import * as runtime from "../credential-payment-runtime.js";
import { PaymentRequestUpdateEvent } from "../credential-payment-runtime.js";
import {
  installDispatchedMethod,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedMethod(
    PaymentRequestUpdateEvent,
    "updateWith",
    1,
    runtime.credentialPaymentOperation,
  );
}
