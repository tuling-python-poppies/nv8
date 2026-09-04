/**
 * Protocol layer errors
 *
 * 协议层错误。协议层只做工件消费和请求变换，不拥有网络出口，
 * 因此所有错误都是本地的、确定性的。
 */

import { DiagnosticError } from '../../engine/core/diagnostics/errors.js';

export const ProtocolErrorCode = {
  // Artifact
  ARTIFACT_INVALID: 'ERR_NV8_ARTIFACT_INVALID',
  ARTIFACT_UNKNOWN_KIND: 'ERR_NV8_ARTIFACT_UNKNOWN_KIND',
  ARTIFACT_SCHEMA_UNSUPPORTED: 'ERR_NV8_ARTIFACT_SCHEMA_UNSUPPORTED',
  ARTIFACT_EXPIRED: 'ERR_NV8_ARTIFACT_EXPIRED',
  ARTIFACT_NOT_FOUND: 'ERR_NV8_ARTIFACT_NOT_FOUND',
  ARTIFACT_DUPLICATE_ID: 'ERR_NV8_ARTIFACT_DUPLICATE_ID',
  ARTIFACT_LIMIT_COUNT: 'ERR_NV8_ARTIFACT_LIMIT_COUNT',
  ARTIFACT_LIMIT_BYTES: 'ERR_NV8_ARTIFACT_LIMIT_BYTES',

  // Adapter definition
  PROTOCOL_INVALID_DEFINITION: 'ERR_NV8_PROTOCOL_INVALID_DEFINITION',
  PROTOCOL_DUPLICATE_ID: 'ERR_NV8_PROTOCOL_DUPLICATE_ID',
  PROTOCOL_NOT_FOUND: 'ERR_NV8_PROTOCOL_NOT_FOUND',
  PROTOCOL_SCHEMA_INCOMPATIBLE: 'ERR_NV8_PROTOCOL_SCHEMA_INCOMPATIBLE',
  PROTOCOL_APPLY_FAILED: 'ERR_NV8_PROTOCOL_APPLY_FAILED',

  // Request plan / transforms
  REQUEST_PLAN_INVALID: 'ERR_NV8_REQUEST_PLAN_INVALID',
  TRANSFORM_INVALID: 'ERR_NV8_TRANSFORM_INVALID',
  TRANSFORM_CONFLICT: 'ERR_NV8_TRANSFORM_CONFLICT',
  TRANSFORM_LIMIT_COUNT: 'ERR_NV8_TRANSFORM_LIMIT_COUNT',

  // Boundary
  PROTOCOL_NETWORK_FORBIDDEN: 'ERR_NV8_PROTOCOL_NETWORK_FORBIDDEN',
};

export class ProtocolError extends DiagnosticError {
  constructor(code, message, details = {}) {
    super(code, message, details);
    this.name = 'ProtocolError';
  }
}

export class ArtifactInvalidError extends ProtocolError {
  constructor(reason, details = {}) {
    super(ProtocolErrorCode.ARTIFACT_INVALID, `Invalid artifact: ${reason}`, details);
    this.name = 'ArtifactInvalidError';
  }
}

export class ArtifactExpiredError extends ProtocolError {
  constructor(id, expiresAt, now) {
    super(
      ProtocolErrorCode.ARTIFACT_EXPIRED,
      `Artifact "${id}" expired at ${expiresAt} (now ${now})`,
      { context: { id, expiresAt, now } }
    );
    this.name = 'ArtifactExpiredError';
  }
}

export class ProtocolDefinitionError extends ProtocolError {
  constructor(reason, details = {}) {
    super(
      ProtocolErrorCode.PROTOCOL_INVALID_DEFINITION,
      `Invalid protocol definition: ${reason}`,
      details
    );
    this.name = 'ProtocolDefinitionError';
  }
}

export class TransformError extends ProtocolError {
  constructor(code, reason, details = {}) {
    super(code, reason, details);
    this.name = 'TransformError';
  }
}
