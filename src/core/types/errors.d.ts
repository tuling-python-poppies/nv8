/**
 * Error codes for NV8 Core
 * 
 * Stable error codes for plugin system and runtime errors.
 */

export enum ErrorCode {
  // Plugin registration errors
  PLUGIN_INVALID_MANIFEST = 'PLUGIN_INVALID_MANIFEST',
  PLUGIN_DUPLICATE_ID = 'PLUGIN_DUPLICATE_ID',
  
  // Capability and dependency errors
  CAPABILITY_MISSING = 'CAPABILITY_MISSING',
  CAPABILITY_VERSION_UNSATISFIED = 'CAPABILITY_VERSION_UNSATISFIED',
  CAPABILITY_PROVIDER_AMBIGUOUS = 'CAPABILITY_PROVIDER_AMBIGUOUS',
  
  // Plugin conflict errors
  PLUGIN_CONFLICT = 'PLUGIN_CONFLICT',
  PLUGIN_CIRCULAR_DEPENDENCY = 'PLUGIN_CIRCULAR_DEPENDENCY',
  
  // Realm and host errors
  REALM_UNSUPPORTED = 'REALM_UNSUPPORTED',
  HOST_REQUIREMENT_UNSATISFIED = 'HOST_REQUIREMENT_UNSATISFIED',
  
  // Surface ownership errors
  SURFACE_OWNERSHIP_CONFLICT = 'SURFACE_OWNERSHIP_CONFLICT',
  SURFACE_NOT_RESERVED = 'SURFACE_NOT_RESERVED',
  
  // Lifecycle errors
  PLUGIN_INSTALL_FAILED = 'PLUGIN_INSTALL_FAILED',
  PLUGIN_ACTIVATE_FAILED = 'PLUGIN_ACTIVATE_FAILED',
  PLUGIN_RESET_FAILED = 'PLUGIN_RESET_FAILED',
  PLUGIN_DISPOSE_FAILED = 'PLUGIN_DISPOSE_FAILED',
  
  // State errors
  PLUGIN_STATE_INVALID = 'PLUGIN_STATE_INVALID',
  STATE_NAMESPACE_NOT_FOUND = 'STATE_NAMESPACE_NOT_FOUND',
  STATE_SERIALIZATION_FAILED = 'STATE_SERIALIZATION_FAILED',
  
  // App lifecycle errors
  APP_LOCKED = 'ERR_APP_LOCKED',
  APP_DISPOSED = 'APP_DISPOSED',
  
  // Sandbox errors
  SANDBOX_DISPOSED = 'SANDBOX_DISPOSED',
  SANDBOX_TIMEOUT = 'SANDBOX_TIMEOUT',
  
  // Resource limit errors
  LIMIT_REALM_CAPACITY = 'LIMIT_REALM_CAPACITY',
  LIMIT_HEAP_EXCEEDED = 'LIMIT_HEAP_EXCEEDED',
  LIMIT_OUTPUT_EXCEEDED = 'LIMIT_OUTPUT_EXCEEDED',
  LIMIT_FRAME_QUEUE_EXCEEDED = 'LIMIT_FRAME_QUEUE_EXCEEDED',
  
  // Evidence errors
  EVIDENCE_BUNDLE_INVALID = 'EVIDENCE_BUNDLE_INVALID',
  EVIDENCE_HASH_MISMATCH = 'EVIDENCE_HASH_MISMATCH',
  EVIDENCE_PATH_ESCAPE = 'EVIDENCE_PATH_ESCAPE',
  
  // Backend errors
  BACKEND_FRAME_REJECTED = 'BACKEND_FRAME_REJECTED',
  BACKEND_COMMUNICATION_FAILED = 'BACKEND_COMMUNICATION_FAILED',
}

/**
 * Structured diagnostic error
 */
export interface DiagnosticError extends Error {
  code: ErrorCode | string;
  phase?: string;
  
  runtime?: {
    node?: string;
    backend?: string;
    realmType?: string;
  };
  
  context?: {
    profileId?: string;
    pluginId?: string;
    capabilityId?: string;
    dependencyPath?: string[];
  };
  
  suggestions?: string[];
  redactions?: string[];
  
  originalError?: Error;
}

/**
 * Create a diagnostic error
 */
export function createDiagnosticError(
  code: ErrorCode | string,
  message: string,
  options?: {
    phase?: string;
    runtime?: DiagnosticError['runtime'];
    context?: DiagnosticError['context'];
    suggestions?: string[];
    originalError?: Error;
  }
): DiagnosticError;
