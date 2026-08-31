/**
 * Capability Registry
 * 
 * Manages capability providers and requirements.
 */

import { createDiagnosticError, ErrorCode } from '../diagnostics/errors.js';

export class CapabilityRegistry {
  constructor() {
    // Map: capabilityId -> { provider, version, description }
    this._capabilities = new Map();
  }
  
  /**
   * Register a capability
   */
  register(capability, provider) {
    if (this._capabilities.has(capability.id)) {
      const existing = this._capabilities.get(capability.id);
      throw createDiagnosticError(
        ErrorCode.CAPABILITY_PROVIDER_AMBIGUOUS,
        `Capability '${capability.id}' is already registered by '${existing.provider}'`,
        {
          phase: 'register',
          context: {
            capability: capability.id,
            existingProvider: existing.provider,
            newProvider: provider,
          },
        }
      );
    }
    
    this._capabilities.set(capability.id, {
      id: capability.id,
      version: capability.version,
      description: capability.description,
      provider,
    });
  }
  
  /**
   * Check if a capability is available
   */
  has(capabilityId) {
    return this._capabilities.has(capabilityId);
  }
  
  /**
   * Require a capability (throws if missing)
   */
  require(capabilityId) {
    if (!this.has(capabilityId)) {
      throw createDiagnosticError(
        ErrorCode.CAPABILITY_MISSING,
        `Required capability '${capabilityId}' is not available`,
        {
          phase: 'runtime',
          context: { capability: capabilityId },
          suggestions: [
            'Ensure the plugin providing this capability is registered',
            'Check that the capability is declared in plugin manifest',
          ],
        }
      );
    }
  }
  
  /**
   * Describe a capability
   */
  describe(capabilityId) {
    return this._capabilities.get(capabilityId);
  }
  
  /**
   * Get all capabilities
   */
  getAll() {
    return Array.from(this._capabilities.values());
  }
  
  /**
   * Clear all capabilities
   */
  clear() {
    this._capabilities.clear();
  }
}
