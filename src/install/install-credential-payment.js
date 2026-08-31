import * as install_authenticator_assertion_response from "../api/credential-payment/members/authenticator-assertion-response.js";
import * as install_authenticator_attestation_response from "../api/credential-payment/members/authenticator-attestation-response.js";
import * as install_authenticator_response from "../api/credential-payment/members/authenticator-response.js";
import * as install_credential from "../api/credential-payment/members/credential.js";
import * as install_credentials_container from "../api/credential-payment/members/credentials-container.js";
import * as install_digital_credential from "../api/credential-payment/members/digital-credential.js";
import * as install_federated_credential from "../api/credential-payment/members/federated-credential.js";
import * as install_identity_credential_error from "../api/credential-payment/members/identity-credential-error.js";
import * as install_identity_credential from "../api/credential-payment/members/identity-credential.js";
import * as install_otp_credential from "../api/credential-payment/members/otp-credential.js";
import * as install_password_credential from "../api/credential-payment/members/password-credential.js";
import * as install_payment_address from "../api/credential-payment/members/payment-address.js";
import * as install_payment_manager from "../api/credential-payment/members/payment-manager.js";
import { install as install_payment_method_change_event_method_details_property } from "../api/credential-payment/members/payment-method-change-event-method-details-property.js";
import { install as install_payment_method_change_event_method_name_property } from "../api/credential-payment/members/payment-method-change-event-method-name-property.js";
import * as install_payment_method_change_event from "../api/credential-payment/members/payment-method-change-event.js";
import { install as install_payment_request_update_event_update_with } from "../api/credential-payment/members/payment-request-update-event-update-with.js";
import * as install_payment_request_update_event from "../api/credential-payment/members/payment-request-update-event.js";
import * as install_payment_request from "../api/credential-payment/members/payment-request.js";
import * as install_payment_response from "../api/credential-payment/members/payment-response.js";
import * as install_public_key_credential from "../api/credential-payment/members/public-key-credential.js";
import * as credentialRuntime from "../api/credential-payment/credential-payment-runtime.js";
import {
  installDispatchedStaticMethod,
} from "../webidl/dispatched-surface-install.js";

export function installCredentialPayment() {
  install_credential.installGlobal();
  install_credentials_container.installGlobal();
  install_federated_credential.installGlobal();
  install_password_credential.installGlobal();
  install_authenticator_assertion_response.installGlobal();
  install_authenticator_attestation_response.installGlobal();
  install_authenticator_response.installGlobal();
  install_public_key_credential.installGlobal();
  install_digital_credential.installGlobal();
  install_identity_credential.installGlobal();
  install_identity_credential_error.installGlobal();
  install_otp_credential.installGlobal();
  install_payment_address.installGlobal();
  install_payment_request.installGlobal();
  install_payment_request_update_event.installGlobal();
  install_payment_response.installGlobal();
  install_payment_manager.installGlobal();
  install_payment_method_change_event.installGlobal();
  install_credential.installRelation();
  install_credentials_container.installRelation();
  install_federated_credential.installRelation();
  install_password_credential.installRelation();
  install_authenticator_assertion_response.installRelation();
  install_authenticator_attestation_response.installRelation();
  install_authenticator_response.installRelation();
  install_public_key_credential.installRelation();
  install_digital_credential.installRelation();
  install_identity_credential.installRelation();
  install_identity_credential_error.installRelation();
  install_otp_credential.installRelation();
  install_payment_address.installRelation();
  install_payment_request.installRelation();
  install_payment_request_update_event.installRelation();
  install_payment_response.installRelation();
  install_payment_manager.installRelation();
  install_payment_method_change_event.installRelation();
  install_credential.installOwnedMember0();
  install_credential.installOwnedMember1();
  install_credential.installConstructorBacklink();
  install_credential.installTag();
  install_credentials_container.installOwnedMember0();
  install_credentials_container.installOwnedMember1();
  install_credentials_container.installOwnedMember2();
  install_credentials_container.installOwnedMember3();
  install_credentials_container.installConstructorBacklink();
  install_credentials_container.installTag();
  install_federated_credential.installOwnedMember0();
  install_federated_credential.installOwnedMember1();
  install_federated_credential.installOwnedMember2();
  install_federated_credential.installOwnedMember3();
  install_federated_credential.installConstructorBacklink();
  install_federated_credential.installTag();
  install_password_credential.installOwnedMember0();
  install_password_credential.installOwnedMember1();
  install_password_credential.installOwnedMember2();
  install_password_credential.installConstructorBacklink();
  install_password_credential.installTag();
  install_authenticator_assertion_response.installOwnedMember0();
  install_authenticator_assertion_response.installOwnedMember1();
  install_authenticator_assertion_response.installOwnedMember2();
  install_authenticator_assertion_response.installConstructorBacklink();
  install_authenticator_assertion_response.installTag();
  install_authenticator_attestation_response.installOwnedMember0();
  install_authenticator_attestation_response.installOwnedMember1();
  install_authenticator_attestation_response.installOwnedMember2();
  install_authenticator_attestation_response.installOwnedMember3();
  install_authenticator_attestation_response.installOwnedMember4();
  install_authenticator_attestation_response.installConstructorBacklink();
  install_authenticator_attestation_response.installTag();
  install_authenticator_response.installOwnedMember0();
  install_authenticator_response.installConstructorBacklink();
  install_authenticator_response.installTag();
  install_public_key_credential.installOwnedMember0();
  install_public_key_credential.installOwnedMember1();
  install_public_key_credential.installOwnedMember2();
  install_public_key_credential.installOwnedMember3();
  install_public_key_credential.installOwnedMember4();
  install_public_key_credential.installConstructorBacklink();
  install_public_key_credential.installTag();
  install_digital_credential.installOwnedMember0();
  install_digital_credential.installOwnedMember1();
  install_digital_credential.installOwnedMember2();
  install_digital_credential.installConstructorBacklink();
  install_digital_credential.installTag();
  install_identity_credential.installOwnedMember0();
  install_identity_credential.installOwnedMember1();
  install_identity_credential.installConstructorBacklink();
  install_identity_credential.installOwnedMember2();
  install_identity_credential.installTag();
  install_identity_credential_error.installOwnedMember0();
  install_identity_credential_error.installOwnedMember1();
  install_identity_credential_error.installOwnedMember2();
  install_identity_credential_error.installConstructorBacklink();
  install_identity_credential_error.installTag();
  install_otp_credential.installOwnedMember0();
  install_otp_credential.installConstructorBacklink();
  install_otp_credential.installTag();
  install_payment_address.installOwnedMember0();
  install_payment_address.installOwnedMember1();
  install_payment_address.installOwnedMember2();
  install_payment_address.installOwnedMember3();
  install_payment_address.installOwnedMember4();
  install_payment_address.installOwnedMember5();
  install_payment_address.installOwnedMember6();
  install_payment_address.installOwnedMember7();
  install_payment_address.installOwnedMember8();
  install_payment_address.installOwnedMember9();
  install_payment_address.installOwnedMember10();
  install_payment_address.installConstructorBacklink();
  install_payment_address.installTag();
  install_payment_request.installOwnedMember0();
  install_payment_request.installOwnedMember1();
  install_payment_request.installOwnedMember2();
  install_payment_request.installOwnedMember3();
  install_payment_request.installOwnedMember4();
  install_payment_request.installOwnedMember5();
  install_payment_request.installOwnedMember6();
  install_payment_request.installOwnedMember7();
  install_payment_request.installOwnedMember8();
  install_payment_request.installOwnedMember9();
  install_payment_request.installOwnedMember10();
  install_payment_request.installConstructorBacklink();
  install_payment_request.installTag();
  install_payment_request_update_event_update_with();
  install_payment_request_update_event.installConstructorBacklink();
  install_payment_request_update_event.installTag();
  install_payment_response.installOwnedMember0();
  install_payment_response.installOwnedMember1();
  install_payment_response.installOwnedMember2();
  install_payment_response.installOwnedMember3();
  install_payment_response.installOwnedMember4();
  install_payment_response.installOwnedMember5();
  install_payment_response.installOwnedMember6();
  install_payment_response.installOwnedMember7();
  install_payment_response.installOwnedMember8();
  install_payment_response.installOwnedMember9();
  install_payment_response.installOwnedMember10();
  install_payment_response.installOwnedMember11();
  install_payment_response.installConstructorBacklink();
  install_payment_response.installTag();
  install_payment_manager.installOwnedMember0();
  install_payment_manager.installOwnedMember1();
  install_payment_manager.installConstructorBacklink();
  install_payment_manager.installTag();
  install_payment_method_change_event_method_name_property();
  install_payment_method_change_event_method_details_property();
  install_payment_method_change_event.installConstructorBacklink();
  install_payment_method_change_event.installTag();
  installDispatchedStaticMethod(
    credentialRuntime.PublicKeyCredential,
    "isUserVerifyingPlatformAuthenticatorAvailable",
    credentialRuntime.publicKeyAvailability,
    0,
  );
  installDispatchedStaticMethod(
    credentialRuntime.PublicKeyCredential,
    "isConditionalMediationAvailable",
    credentialRuntime.publicKeyAvailability,
    0,
  );
  installDispatchedStaticMethod(
    credentialRuntime.PublicKeyCredential,
    "parseCreationOptionsFromJSON",
    credentialRuntime.parsePublicKeyOptions,
    1,
  );
  installDispatchedStaticMethod(
    credentialRuntime.PublicKeyCredential,
    "parseRequestOptionsFromJSON",
    credentialRuntime.parsePublicKeyOptions,
    1,
  );
}
