/**
 * Plugin Resolver
 * 
 * Resolves plugin dependencies and creates a lock plan.
 */

import semver from 'semver';
import { createDependencyError, createDiagnosticError, ErrorCode } from '../diagnostics/errors.js';

export class PluginResolver {
  constructor(platformInfo) {
    this._platformInfo = platformInfo;
  }
  
  /**
   * Resolve plugin dependencies and create a lock plan
   */
  resolve(manifests, profile, realmType, backend) {
    // 1. Filter plugins by realm and backend support
    const availablePlugins = this._filterBySupport(manifests, realmType, backend);
    
    // 2. Check for conflicts
    this._checkConflicts(availablePlugins);
    
    // 3. Build capability map
    const capabilityMap = this._buildCapabilityMap(availablePlugins);
    
    // 4. Resolve dependencies and create execution order
    const orderedPlugins = this._resolveDependencies(
      availablePlugins,
      capabilityMap,
      profile
    );
    
    // 5. Build lock plan
    const lockPlan = this._buildLockPlan(orderedPlugins, capabilityMap, profile);
    
    return lockPlan;
  }
  
  /**
   * Filter plugins by realm and backend support
   */
  _filterBySupport(manifests, realmType, backend) {
    return manifests.filter(manifest => {
      // Check realm support
      if (!manifest.supportedRealms.includes(realmType)) {
        return false;
      }
      
      // Check backend support
      if (manifest.supportedBackends && !manifest.supportedBackends.includes(backend)) {
        return false;
      }
      
      return true;
    });
  }
  
  /**
   * Check for conflicts between plugins
   */
  _checkConflicts(manifests) {
    for (const manifest of manifests) {
      if (manifest.conflicts) {
        for (const conflictId of manifest.conflicts) {
          const conflicting = manifests.find(m => m.id === conflictId);
          if (conflicting) {
            throw createDependencyError(
              ErrorCode.DEPENDENCY_CONFLICT,
              `Plugin '${manifest.id}' conflicts with '${conflictId}'`,
              {
                pluginId: manifest.id,
                conflictsWith: conflictId,
              }
            );
          }
        }
      }
    }
  }
  
  /**
   * Build capability map
   */
  _buildCapabilityMap(manifests) {
    const capabilityMap = new Map();
    
    for (const manifest of manifests) {
      for (const capability of manifest.provides || []) {
        if (!capabilityMap.has(capability.id)) {
          capabilityMap.set(capability.id, []);
        }
        
        capabilityMap.get(capability.id).push({
          provider: manifest.id,
          version: capability.version,
          capability,
        });
      }
    }
    
    return capabilityMap;
  }
  
  /**
   * Resolve dependencies and determine execution order
   */
  _resolveDependencies(manifests, capabilityMap, profile) {
    // Create dependency graph
    const graph = new Map();
    const inDegree = new Map();
    
    for (const manifest of manifests) {
      graph.set(manifest.id, []);
      inDegree.set(manifest.id, 0);
    }
    
    // Build edges based on capability dependencies
    for (const manifest of manifests) {
      for (const requirement of manifest.requires || []) {
        const providers = capabilityMap.get(requirement.capability) || [];
        
        // Filter providers by version constraint
        const compatibleProviders = providers.filter(p => {
          if (requirement.version) {
            return semver.satisfies(p.version, requirement.version);
          }
          return true;
        });
        
        if (compatibleProviders.length === 0) {
          throw createDependencyError(
            ErrorCode.DEPENDENCY_MISSING,
            `Plugin '${manifest.id}' requires capability '${requirement.capability}' with version '${requirement.version || 'any'}', but no compatible provider found`,
            {
              pluginId: manifest.id,
              capability: requirement.capability,
              versionConstraint: requirement.version,
            }
          );
        }
        
        // Select provider (prefer pinned, then first)
        let selectedProvider;
        
        if (profile.pins && profile.pins[requirement.capability]) {
          const pinnedId = profile.pins[requirement.capability];
          selectedProvider = compatibleProviders.find(p => p.provider === pinnedId);
          
          if (!selectedProvider) {
            throw createDependencyError(
              ErrorCode.CAPABILITY_PROVIDER_AMBIGUOUS,
              `Profile pins '${requirement.capability}' to '${pinnedId}', but it's not available`,
              {
                capability: requirement.capability,
                pinnedProvider: pinnedId,
              }
            );
          }
        } else {
          if (compatibleProviders.length > 1) {
            throw createDependencyError(
              ErrorCode.CAPABILITY_PROVIDER_AMBIGUOUS,
              `Multiple providers for capability '${requirement.capability}': ${compatibleProviders.map(p => p.provider).join(', ')}. Use Profile pins to select one.`,
              {
                capability: requirement.capability,
                providers: compatibleProviders.map(p => p.provider),
              }
            );
          }
          
          selectedProvider = compatibleProviders[0];
        }
        
        // Add edge: provider -> consumer
        graph.get(selectedProvider.provider).push(manifest.id);
        inDegree.set(manifest.id, inDegree.get(manifest.id) + 1);
      }
    }
    
    // Topological sort (Kahn's algorithm)
    const queue = [];
    const result = [];
    
    // Find all nodes with in-degree 0
    for (const [pluginId, degree] of inDegree) {
      if (degree === 0) {
        queue.push(pluginId);
      }
    }
    
    while (queue.length > 0) {
      const current = queue.shift();
      result.push(current);
      
      // Process neighbors
      for (const neighbor of graph.get(current)) {
        const newDegree = inDegree.get(neighbor) - 1;
        inDegree.set(neighbor, newDegree);
        
        if (newDegree === 0) {
          queue.push(neighbor);
        }
      }
    }
    
    // Check for cycles
    if (result.length !== manifests.length) {
      const remaining = manifests
        .map(m => m.id)
        .filter(id => !result.includes(id));
      
      throw createDependencyError(
        ErrorCode.DEPENDENCY_CYCLE,
        `Circular dependency detected involving: ${remaining.join(', ')}`,
        {
          cycle: remaining,
        }
      );
    }
    
    // Return manifests in execution order
    return result.map(id => manifests.find(m => m.id === id));
  }
  
  /**
   * Build lock plan
   */
  _buildLockPlan(orderedManifests, capabilityMap, profile) {
    const plugins = orderedManifests.map(m => ({
      id: m.id,
      version: m.version,
    }));
    
    const capabilities = {};
    for (const [capabilityId, providers] of capabilityMap) {
      // Find which provider is actually used
      const usedProvider = providers.find(p => 
        orderedManifests.some(m => m.id === p.provider)
      );
      
      if (usedProvider) {
        capabilities[capabilityId] = {
          provider: usedProvider.provider,
          version: usedProvider.version,
        };
      }
    }
    
    const surfaces = {};
    for (const manifest of orderedManifests) {
      for (const surface of manifest.surfaces || []) {
        const key = `${surface.target}.${surface.property}`;
        surfaces[key] = {
          owner: manifest.id,
          target: surface.target,
          property: surface.property,
        };
      }
    }
    
    // Compute digest
    const digest = this._computeDigest(plugins, capabilities, surfaces);
    
    return {
      version: '1.0.0',
      digest,
      plugins,
      capabilities,
      surfaces,
      profile: {
        id: profile.id,
        version: profile.version,
      },
    };
  }
  
  /**
   * Compute lock plan digest
   */
  _computeDigest(plugins, capabilities, surfaces) {
    const data = JSON.stringify({ plugins, capabilities, surfaces });
    
    // Simple hash (for now - could use crypto in production)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(36);
  }
}
