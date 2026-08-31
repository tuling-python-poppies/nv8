/**
 * Plugin System Type Definitions
 * 
 * Defines the core contracts for the NV8 plugin architecture.
 */

export type RealmType = 'window' | 'iframe' | 'worker' | 'service-worker' | 'worklet';
export type BackendType = 'child-process' | 'worker-thread';

/**
 * Semantic version constraint for capability dependencies
 */
export interface VersionConstraint {
  range: string; // SemVer range, e.g., "^1.2.0", ">=2.0.0 <3.0.0"
}

/**
 * Capability declaration - what a plugin provides or requires
 */
export interface Capability {
  id: string;
  version: string; // SemVer
  description?: string;
}

/**
 * Plugin dependency specification
 */
export interface Dependency {
  capability: string;
  version: VersionConstraint;
  optional?: boolean;
}

/**
 * Plugin conflict declaration
 */
export interface Conflict {
  pluginId: string;
  reason: string;
}

/**
 * Host requirement specification
 */
export interface HostRequirement {
  node?: VersionConstraint;
  backend?: BackendType[];
  features?: string[]; // e.g., ['worker_threads', 'crypto']
}

/**
 * Global surface declaration - what global properties a plugin will modify
 */
export interface SurfaceDeclaration {
  target: 'globalThis' | 'Window' | 'prototype';
  property: string;
  kind: 'value' | 'accessor' | 'method' | 'constructor';
  overridable?: boolean;
}

/**
 * State namespace declaration
 */
export interface StateNamespace {
  name: string;
  scope: 'realm' | 'sandbox' | 'app';
  resetPolicy: 'clear' | 'snapshot' | 'preserve';
  serializable?: boolean;
}

/**
 * Immutable Plugin Manifest
 * 
 * Frozen at registration time, defines plugin metadata and contracts.
 */
export interface PluginManifest {
  id: string;
  version: string; // SemVer
  apiVersion: string; // Plugin SDK version
  
  name: string;
  description?: string;
  author?: string;
  license?: string;
  
  provides: Capability[];
  requires: Dependency[];
  conflicts?: Conflict[];
  
  supportedRealms: RealmType[];
  hostRequirements?: HostRequirement;
  
  surfaces?: SurfaceDeclaration[];
  stateNamespaces?: StateNamespace[];
  
  metadata?: Record<string, unknown>;
}

/**
 * Plugin Context
 * 
 * Passed to plugin lifecycle hooks, provides controlled access to Core services.
 */
export interface PluginContext {
  // Application metadata (read-only)
  readonly app: {
    readonly id: string;
    readonly profile: string;
    readonly backend: BackendType;
  };
  
  // Realm information (read-only)
  readonly realm: {
    readonly id: string;
    readonly type: RealmType;
    readonly global: object;
    readonly document?: object;
    readonly origin?: string;
  };
  
  // Capability access
  readonly capabilities: {
    has(id: string): boolean;
    require(id: string): void;
    describe(id: string): Capability | undefined;
  };
  
  // Global surface management
  readonly surfaces: {
    define(target: object, property: string, descriptor: PropertyDescriptor, options?: { force?: boolean }): void;
    defineAccessor(target: object, property: string, getter?: Function, setter?: Function, options?: { force?: boolean }): void;
    reserve(targetKind: string, property: string): void;
    removeOwn(target: object, property: string): void;
    listOwned(): Array<{ target: string; property: string }>;
  };
  
  // State management
  readonly state: {
    namespace(name: string): StateNamespace;
    get(namespace: string, key: string): unknown;
    set(namespace: string, key: string, value: unknown): void;
    update(namespace: string, key: string, updater: (prev: unknown) => unknown): void;
    delete(namespace: string, key: string): void;
    snapshot(namespace: string): unknown;
    restore(namespace: string, snapshot: unknown): void;
  };
  
  // Lifecycle management
  readonly lifecycle: {
    onReset(handler: () => void | Promise<void>): void;
    onDispose(handler: () => void | Promise<void>): void;
    registerResource(resource: { dispose: () => void | Promise<void> }): void;
  };
  
  // Scheduler (Core-controlled)
  readonly scheduler: {
    setTimeout(handler: Function, delay: number): number;
    clearTimeout(id: number): void;
    setInterval(handler: Function, delay: number): number;
    clearInterval(id: number): void;
    queueMicrotask(task: () => void): void;
  };
  
  // Trace and diagnostics
  readonly trace: {
    event(name: string, data?: Record<string, unknown>): void;
    span<T>(name: string, fn: () => T): T;
  };
  
  readonly diagnostics: {
    warn(code: string, message: string, details?: Record<string, unknown>): void;
    error(code: string, message: string, details?: Record<string, unknown>): void;
  };
}

/**
 * Plugin Implementation
 * 
 * The actual plugin code that implements lifecycle hooks.
 */
export interface Plugin {
  /**
   * Install phase: register constructors, descriptors, and state namespaces
   * Called once per Realm creation, before user code runs
   */
  install?(context: PluginContext): void | Promise<void>;
  
  /**
   * Activate phase: apply Profile configuration and connect to Realm state
   * Called after all plugins are installed
   */
  activate?(context: PluginContext, config: unknown): void | Promise<void>;
  
  /**
   * Reset phase: clear or restore state according to reset policy
   * Called when Realm is reset for reuse
   */
  reset?(context: PluginContext): void | Promise<void>;
  
  /**
   * Serialize phase: export persistent state to structured data
   * Called when taking a snapshot
   */
  serialize?(context: PluginContext): unknown;
  
  /**
   * Restore phase: import previously serialized state
   * Called when restoring from a snapshot
   */
  restore?(context: PluginContext, state: unknown): void | Promise<void>;
  
  /**
   * Dispose phase: release resources and clean up
   * Called once when Realm is destroyed
   */
  dispose?(context: PluginContext): void | Promise<void>;
}

/**
 * Plugin Registration
 * 
 * Combines manifest and implementation.
 */
export interface PluginRegistration {
  manifest: PluginManifest;
  plugin: Plugin;
}

/**
 * Plugin Lock Plan
 * 
 * Immutable resolution result from dependency planning.
 */
export interface PluginLockPlan {
  plugins: Array<{
    id: string;
    version: string;
    index: number; // Installation order
  }>;
  capabilities: Record<string, { provider: string; version: string }>;
  surfaces: Record<string, { owner: string; target: string; property: string }>;
  digest: string; // Hash of the plan
  generatedAt: string;
  runtime: {
    node: string;
    backend: BackendType;
    realmType: RealmType;
  };
}

/**
 * Plugin Installation Error
 */
export interface PluginInstallError extends Error {
  code: string;
  phase: 'register' | 'plan' | 'install' | 'activate' | 'reset' | 'restore' | 'dispose';
  pluginId?: string;
  capabilityId?: string;
  originalError?: Error;
  completedPlugins?: string[];
  cleanupResults?: Array<{ pluginId: string; success: boolean; error?: Error }>;
}
