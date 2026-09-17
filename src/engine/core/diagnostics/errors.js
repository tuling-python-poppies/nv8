/**
 * Error codes for diagnostics
 */
export const ErrorCode = {
  // Plugin errors
  PLUGIN_INVALID_MANIFEST: 'PLUGIN_INVALID_MANIFEST',
  PLUGIN_DUPLICATE_ID: 'PLUGIN_DUPLICATE_ID',
  PLUGIN_NOT_FOUND: 'PLUGIN_NOT_FOUND',
  PLUGIN_INSTALL_FAILED: 'PLUGIN_INSTALL_FAILED',
  PLUGIN_ACTIVATE_FAILED: 'PLUGIN_ACTIVATE_FAILED',
  PLUGIN_STATE_INVALID: 'PLUGIN_STATE_INVALID',
  
  // Capability errors
  CAPABILITY_MISSING: 'CAPABILITY_MISSING',
  CAPABILITY_PROVIDER_AMBIGUOUS: 'CAPABILITY_PROVIDER_AMBIGUOUS',
  CAPABILITY_VERSION_MISMATCH: 'CAPABILITY_VERSION_MISMATCH',
  
  // Dependency errors
  DEPENDENCY_CYCLE: 'DEPENDENCY_CYCLE',
  DEPENDENCY_MISSING: 'DEPENDENCY_MISSING',
  DEPENDENCY_CONFLICT: 'DEPENDENCY_CONFLICT',
  
  // Surface errors
  SURFACE_COLLISION: 'SURFACE_COLLISION',
  SURFACE_NOT_FOUND: 'SURFACE_NOT_FOUND',
  
  // State errors
  STATE_NAMESPACE_NOT_FOUND: 'STATE_NAMESPACE_NOT_FOUND',
  STATE_NAMESPACE_COLLISION: 'STATE_NAMESPACE_COLLISION',
  
  // App/Sandbox errors
  APP_LOCKED: 'APP_LOCKED',
  APP_DISPOSED: 'APP_DISPOSED',
  SANDBOX_DISPOSED: 'SANDBOX_DISPOSED',
  
  // Limits
  LIMIT_REALM_CAPACITY: 'LIMIT_REALM_CAPACITY',
  LIMIT_STATE_SIZE: 'LIMIT_STATE_SIZE',
  LIMIT_OUTPUT_BYTES: 'LIMIT_OUTPUT_BYTES',
  LIMIT_PAYLOAD_BYTES: 'LIMIT_PAYLOAD_BYTES',
  HOST_REQUIREMENT_UNAVAILABLE: 'HOST_REQUIREMENT_UNAVAILABLE',
};

/**
 * Base diagnostic error class
 */
export class DiagnosticError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'DiagnosticError';
    this.code = code;
    this.phase = details.phase;
    this.context = details.context;
    this.suggestions = details.suggestions || [];
    this.limit = details.limit;
    this.actual = details.actual;
    this.required = details.required;
    this.timestamp = Date.now();
    this.details = Object.freeze({
      phase: this.phase,
      context: this.context,
      suggestions: this.suggestions,
      limit: this.limit,
      actual: this.actual,
      required: this.required,
    });
  }
}

/**
 * Create a diagnostic error
 */
export function createDiagnosticError(code, message, details) {
  return new DiagnosticError(code, message, details);
}
