// Generated from captured Edge 150 evidence.
export const CREDENTIAL_PAYMENT_SURFACES = Object.freeze({
  "Credential": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "id"
      ],
      [
        "accessor",
        "type"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "CredentialsContainer": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "method",
        "create",
        0
      ],
      [
        "method",
        "get",
        0
      ],
      [
        "method",
        "preventSilentAccess",
        0
      ],
      [
        "method",
        "store",
        1
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "FederatedCredential": {
    "constructorParent": "Credential",
    "prototypeParent": "Credential",
    "members": [
      [
        "accessor",
        "provider"
      ],
      [
        "accessor",
        "protocol"
      ],
      [
        "accessor",
        "name"
      ],
      [
        "accessor",
        "iconURL"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "PasswordCredential": {
    "constructorParent": "Credential",
    "prototypeParent": "Credential",
    "members": [
      [
        "accessor",
        "password"
      ],
      [
        "accessor",
        "name"
      ],
      [
        "accessor",
        "iconURL"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "AuthenticatorAssertionResponse": {
    "constructorParent": "AuthenticatorResponse",
    "prototypeParent": "AuthenticatorResponse",
    "members": [
      [
        "accessor",
        "authenticatorData"
      ],
      [
        "accessor",
        "signature"
      ],
      [
        "accessor",
        "userHandle"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "AuthenticatorAttestationResponse": {
    "constructorParent": "AuthenticatorResponse",
    "prototypeParent": "AuthenticatorResponse",
    "members": [
      [
        "accessor",
        "attestationObject"
      ],
      [
        "method",
        "getAuthenticatorData",
        0
      ],
      [
        "method",
        "getPublicKey",
        0
      ],
      [
        "method",
        "getPublicKeyAlgorithm",
        0
      ],
      [
        "method",
        "getTransports",
        0
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "AuthenticatorResponse": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "clientDataJSON"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "PublicKeyCredential": {
    "constructorParent": "Credential",
    "prototypeParent": "Credential",
    "members": [
      [
        "accessor",
        "rawId"
      ],
      [
        "accessor",
        "response"
      ],
      [
        "accessor",
        "authenticatorAttachment"
      ],
      [
        "method",
        "getClientExtensionResults",
        0
      ],
      [
        "method",
        "toJSON",
        0
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "DigitalCredential": {
    "constructorParent": "Credential",
    "prototypeParent": "Credential",
    "members": [
      [
        "accessor",
        "protocol"
      ],
      [
        "accessor",
        "data"
      ],
      [
        "method",
        "toJSON",
        0
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "IdentityCredential": {
    "constructorParent": "Credential",
    "prototypeParent": "Credential",
    "members": [
      [
        "accessor",
        "token"
      ],
      [
        "accessor",
        "isAutoSelected"
      ],
      [
        "constructor"
      ],
      [
        "accessor",
        "configURL"
      ],
      [
        "tag"
      ]
    ]
  },
  "IdentityCredentialError": {
    "constructorParent": "DOMException",
    "prototypeParent": "DOMException",
    "members": [
      [
        "accessor",
        "code"
      ],
      [
        "accessor",
        "url"
      ],
      [
        "accessor",
        "error"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "OTPCredential": {
    "constructorParent": "Credential",
    "prototypeParent": "Credential",
    "members": [
      [
        "accessor",
        "code"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "PaymentAddress": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "city"
      ],
      [
        "accessor",
        "country"
      ],
      [
        "accessor",
        "dependentLocality"
      ],
      [
        "accessor",
        "organization"
      ],
      [
        "accessor",
        "phone"
      ],
      [
        "accessor",
        "postalCode"
      ],
      [
        "accessor",
        "recipient"
      ],
      [
        "accessor",
        "region"
      ],
      [
        "accessor",
        "sortingCode"
      ],
      [
        "accessor",
        "addressLine"
      ],
      [
        "method",
        "toJSON",
        0
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "PaymentRequest": {
    "constructorParent": "EventTarget",
    "prototypeParent": "EventTarget",
    "members": [
      [
        "accessor",
        "id"
      ],
      [
        "accessor",
        "shippingAddress"
      ],
      [
        "accessor",
        "shippingOption"
      ],
      [
        "accessor",
        "shippingType"
      ],
      [
        "accessor",
        "onshippingaddresschange"
      ],
      [
        "accessor",
        "onshippingoptionchange"
      ],
      [
        "method",
        "abort",
        0
      ],
      [
        "method",
        "canMakePayment",
        0
      ],
      [
        "method",
        "hasEnrolledInstrument",
        0
      ],
      [
        "method",
        "show",
        0
      ],
      [
        "accessor",
        "onpaymentmethodchange"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "PaymentRequestUpdateEvent": {
    "constructorParent": "Event",
    "prototypeParent": "Event",
    "members": [
      [
        "method",
        "updateWith",
        1
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "PaymentResponse": {
    "constructorParent": "EventTarget",
    "prototypeParent": "EventTarget",
    "members": [
      [
        "accessor",
        "requestId"
      ],
      [
        "accessor",
        "methodName"
      ],
      [
        "accessor",
        "details"
      ],
      [
        "accessor",
        "shippingAddress"
      ],
      [
        "accessor",
        "shippingOption"
      ],
      [
        "accessor",
        "payerName"
      ],
      [
        "accessor",
        "payerEmail"
      ],
      [
        "accessor",
        "payerPhone"
      ],
      [
        "accessor",
        "onpayerdetailchange"
      ],
      [
        "method",
        "complete",
        0
      ],
      [
        "method",
        "retry",
        0
      ],
      [
        "method",
        "toJSON",
        0
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "PaymentManager": {
    "constructorParent": "",
    "prototypeParent": "Object",
    "members": [
      [
        "accessor",
        "userHint"
      ],
      [
        "method",
        "enableDelegations",
        1
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  },
  "PaymentMethodChangeEvent": {
    "constructorParent": "PaymentRequestUpdateEvent",
    "prototypeParent": "PaymentRequestUpdateEvent",
    "members": [
      [
        "accessor",
        "methodName"
      ],
      [
        "accessor",
        "methodDetails"
      ],
      [
        "constructor"
      ],
      [
        "tag"
      ]
    ]
  }
});
