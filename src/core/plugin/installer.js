/**
 * Plugin Installer
 * 
 * Manages plugin installation and activation.
 */

import { createPluginInstallError } from '../diagnostics/errors.js';
import { PluginContextImpl } from './plugin-context.js';

export class PluginInstaller {
  constructor(config) {
    this._appInfo = config.appInfo;
    this._realmInfo = config.realmInfo;
    this._capabilities = config.capabilities;
    this._surfaceRegistry = config.surfaceRegistry;
    this._stateRegistry = config.stateRegistry;
    this._lifecycleManager = config.lifecycleManager;
    this._scheduler = config.scheduler;
    this._trace = config.trace;
    this._diagnostics = config.diagnostics;
  }
  
  /**
   * Install a plugin
   */
  async install(registration) {
    const { manifest, plugin } = registration;
    const pluginId = manifest.id;
    
    try {
      // 1. Register plugin with lifecycle manager
      this._lifecycleManager.registerPlugin(pluginId);
      
      // 2. Register state namespaces
      for (const namespace of manifest.stateNamespaces || []) {
        this._stateRegistry.registerNamespace(pluginId, namespace);
      }
      
      // 3. Reserve surfaces
      for (const surface of manifest.surfaces || []) {
        this._surfaceRegistry.reserve(pluginId, surface.target, surface.property);
      }
      
      // 4. Register capabilities
      for (const capability of manifest.provides || []) {
        this._capabilities.register(capability, pluginId);
      }
      
      // 5. Create plugin context
      const contextImpl = new PluginContextImpl({
        pluginId,
        appInfo: this._appInfo,
        realmInfo: this._realmInfo,
        capabilities: this._capabilities,
        surfaceRegistry: this._surfaceRegistry,
        stateRegistry: this._stateRegistry,
        lifecycleManager: this._lifecycleManager,
        scheduler: this._scheduler,
        trace: this._trace,
        diagnostics: this._diagnostics,
      });
      
      // 6. Call install hook
      if (plugin.install) {
        await plugin.install(contextImpl.context);
      }
      
      // 7. Store plugin instance for later
      return {
        pluginId,
        manifest,
        plugin,
        context: contextImpl.context,
      };
      
    } catch (error) {
      // Re-throw diagnostic errors that have specific semantic meaning
      // (surface collisions, capability errors, etc.)
      if (error.code && error.phase) {
        throw error;
      }
      
      throw createPluginInstallError(pluginId, 'install', error);
    }
  }
  
  /**
   * Activate a plugin with configuration
   */
  async activate(installedPlugin, config) {
    const { pluginId, plugin, context } = installedPlugin;
    
    try {
      if (plugin.activate) {
        await plugin.activate(context, config);
      }
    } catch (error) {
      throw createPluginInstallError(pluginId, 'activate', error);
    }
  }
  
  /**
   * Reset a plugin
   */
  async reset(installedPlugin) {
    const { pluginId, plugin, context } = installedPlugin;
    
    try {
      if (plugin.reset) {
        await plugin.reset(context);
      }
    } catch (error) {
      console.error(`Reset error for plugin '${pluginId}':`, error);
    }
  }
  
  /**
   * Serialize plugin state
   */
  async serialize(installedPlugin) {
    const { pluginId, plugin, context } = installedPlugin;
    
    try {
      if (plugin.serialize) {
        return await plugin.serialize(context);
      }
      return null;
    } catch (error) {
      console.error(`Serialize error for plugin '${pluginId}':`, error);
      return null;
    }
  }
  
  /**
   * Restore plugin state
   */
  async restore(installedPlugin, state) {
    const { pluginId, plugin, context } = installedPlugin;
    
    try {
      if (plugin.restore) {
        await plugin.restore(context, state);
      }
    } catch (error) {
      console.error(`Restore error for plugin '${pluginId}':`, error);
    }
  }
  
  /**
   * Dispose a plugin
   */
  async dispose(installedPlugin) {
    const { pluginId, plugin, context } = installedPlugin;
    
    try {
      if (plugin.dispose) {
        await plugin.dispose(context);
      }
    } catch (error) {
      console.error(`Dispose error for plugin '${pluginId}':`, error);
    }
  }
}
