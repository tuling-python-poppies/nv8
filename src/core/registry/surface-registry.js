/**
 * Global Surface Registry
 * 
 * Manages surface reservations and attachments.
 */

import { createSurfaceCollisionError } from '../diagnostics/errors.js';

export class GlobalSurfaceRegistry {
  constructor() {
    // Map: "target.property" -> { owner: pluginId, value: any }
    this._surfaces = new Map();
  }
  
  /**
   * Reserve a surface (during plugin installation)
   */
  reserve(pluginId, target, property) {
    const key = `${target}.${property}`;
    
    if (this._surfaces.has(key)) {
      const existing = this._surfaces.get(key);
      throw createSurfaceCollisionError(
        target,
        property,
        existing.owner,
        pluginId
      );
    }
    
    this._surfaces.set(key, {
      owner: pluginId,
      target,
      property,
      value: undefined,
      attached: false,
    });
  }
  
  /**
   * Attach a value to a surface
   */
  attach(pluginId, target, property, value) {
    const key = `${target}.${property}`;
    let surface = this._surfaces.get(key);
    
    // Auto-reserve if not already reserved (for plugins that don't declare surfaces in manifest)
    if (!surface) {
      this._surfaces.set(key, {
        owner: pluginId,
        target,
        property,
        value: undefined,
        attached: false,
      });
      surface = this._surfaces.get(key);
    }
    
    if (surface.owner !== pluginId) {
      throw createSurfaceCollisionError(
        target,
        property,
        surface.owner,
        pluginId
      );
    }
    
    // Attach to actual target
    const targetObj = this._resolveTarget(target);
    if (targetObj) {
      targetObj[property] = value;
    }
    
    surface.value = value;
    surface.attached = true;
  }
  
  /**
   * Detach a surface
   */
  detach(pluginId, target, property) {
    const key = `${target}.${property}`;
    const surface = this._surfaces.get(key);
    
    if (!surface || surface.owner !== pluginId) {
      return;
    }
    
    // Remove from target
    const targetObj = this._resolveTarget(target);
    if (targetObj && surface.attached) {
      delete targetObj[property];
    }
    
    surface.value = undefined;
    surface.attached = false;
  }
  
  /**
   * Get surface value
   */
  get(target, property) {
    const key = `${target}.${property}`;
    const surface = this._surfaces.get(key);
    
    if (!surface || !surface.attached) {
      return undefined;
    }
    
    return surface.value;
  }
  
  /**
   * Check if surface exists
   */
  has(target, property) {
    const key = `${target}.${property}`;
    return this._surfaces.has(key);
  }
  
  /**
   * Clear surfaces owned by a plugin
   */
  clearOwned(pluginId) {
    for (const [key, surface] of this._surfaces) {
      if (surface.owner === pluginId) {
        this.detach(pluginId, surface.target, surface.property);
        this._surfaces.delete(key);
      }
    }
  }
  
  /**
   * Get all surfaces
   */
  getAll() {
    return Array.from(this._surfaces.values()).map(s => ({
      owner: s.owner,
      target: s.target,
      property: s.property,
      attached: s.attached,
    }));
  }
  
  /**
   * Resolve target string to object
   */
  _resolveTarget(target) {
    if (target === 'global') {
      return globalThis;
    }
    
    if (target === 'globalThis') {
      return globalThis;
    }
    
    if (target === 'window') {
      return typeof window !== 'undefined' ? window : undefined;
    }
    
    // Could support other targets like 'document', etc.
    return undefined;
  }
}
