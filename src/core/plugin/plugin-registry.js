/**
 * Plugin Registry
 * 
 * Manages registered plugins.
 */

import { createDiagnosticError, ErrorCode } from '../diagnostics/errors.js';

export class PluginRegistry {
  constructor() {
    // Map: pluginId -> { manifest, plugin }
    this._plugins = new Map();
  }
  
  /**
   * Register a plugin
   */
  register(registration) {
    const { manifest, plugin } = registration;
    
    // Validate manifest
    this._validateManifest(manifest);
    
    // Check for duplicates
    if (this._plugins.has(manifest.id)) {
      throw createDiagnosticError(
        ErrorCode.PLUGIN_DUPLICATE_ID,
        `Plugin '${manifest.id}' is already registered`,
        {
          phase: 'register',
          context: { pluginId: manifest.id },
        }
      );
    }
    
    this._plugins.set(manifest.id, { manifest, plugin });
  }
  
  /**
   * Get a plugin by ID
   */
  get(pluginId) {
    return this._plugins.get(pluginId);
  }
  
  /**
   * Check if a plugin is registered
   */
  has(pluginId) {
    return this._plugins.has(pluginId);
  }
  
  /**
   * Get all plugins
   */
  getAll() {
    return Array.from(this._plugins.values());
  }
  
  /**
   * Get all manifests
   */
  getAllManifests() {
    return Array.from(this._plugins.values()).map(p => p.manifest);
  }
  
  /**
   * Validate plugin manifest
   */
  _validateManifest(manifest) {
    if (!manifest.id) {
      throw createDiagnosticError(
        ErrorCode.PLUGIN_INVALID_MANIFEST,
        'Plugin manifest missing required field: id',
        {
          phase: 'validate',
          context: { manifest },
        }
      );
    }
    
    if (!manifest.version) {
      throw createDiagnosticError(
        ErrorCode.PLUGIN_INVALID_MANIFEST,
        `Plugin '${manifest.id}' manifest missing required field: version`,
        {
          phase: 'validate',
          context: { pluginId: manifest.id, manifest },
        }
      );
    }
    
    if (!manifest.supportedRealms || manifest.supportedRealms.length === 0) {
      throw createDiagnosticError(
        ErrorCode.PLUGIN_INVALID_MANIFEST,
        `Plugin '${manifest.id}' manifest missing required field: supportedRealms`,
        {
          phase: 'validate',
          context: { pluginId: manifest.id, manifest },
        }
      );
    }
    
    // Validate provides
    if (manifest.provides) {
      for (const capability of manifest.provides) {
        if (!capability.id || !capability.version) {
          throw createDiagnosticError(
            ErrorCode.PLUGIN_INVALID_MANIFEST,
            `Plugin '${manifest.id}' has invalid capability declaration`,
            {
              phase: 'validate',
              context: { pluginId: manifest.id, capability },
            }
          );
        }
      }
    }
    
    // Validate requires
    if (manifest.requires) {
      for (const requirement of manifest.requires) {
        if (!requirement.capability) {
          throw createDiagnosticError(
            ErrorCode.PLUGIN_INVALID_MANIFEST,
            `Plugin '${manifest.id}' has invalid capability requirement`,
            {
              phase: 'validate',
              context: { pluginId: manifest.id, requirement },
            }
          );
        }
      }
    }
    
    // Validate surfaces
    if (manifest.surfaces) {
      for (const surface of manifest.surfaces) {
        if (!surface.target || !surface.property) {
          throw createDiagnosticError(
            ErrorCode.PLUGIN_INVALID_MANIFEST,
            `Plugin '${manifest.id}' has invalid surface declaration`,
            {
              phase: 'validate',
              context: { pluginId: manifest.id, surface },
            }
          );
        }
      }
    }
  }
}
