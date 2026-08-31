/**
 * Core Type Definitions
 */

/**
 * Plugin manifest
 */
export interface PluginManifest {
  id: string;
  version: string;
  description?: string;
  author?: string;
  
  // Capabilities
  provides?: Capability[];
  requires?: CapabilityRequirement[];
  
  // Compatibility
  supportedRealms: RealmType[];
  supportedBackends?: BackendType[];
  
  // Conflicts
  conflicts?: string[];
  
  // Surfaces
  surfaces?: SurfaceDeclaration[];
  
  // State
  stateNamespaces?: string[];
}

/**
 * Capability declaration
 */
export interface Capability {
  id: string;
  version: string;
  description?: string;
}

/**
 * Capability requirement
 */
export interface CapabilityRequirement {
  capability: string;
  version?: string;
  optional?: boolean;
}

/**
 * Surface declaration
 */
export interface SurfaceDeclaration {
  target: string;
  property: string;
}

/**
 * Plugin interface
 */
export interface Plugin {
  /**
   * Install hook - called once during sandbox initialization
   */
  install?(context: PluginContext): Promise<void> | void;
  
  /**
   * Activate hook - called after install with configuration
   */
  activate?(context: PluginContext, config: any): Promise<void> | void;
  
  /**
   * Reset hook - called when sandbox is reset
   */
  reset?(context: PluginContext): Promise<void> | void;
  
  /**
   * Serialize hook - return serializable state
   */
  serialize?(context: PluginContext): Promise<any> | any;
  
  /**
   * Restore hook - restore from serialized state
   */
  restore?(context: PluginContext, state: any): Promise<void> | void;
  
  /**
   * Dispose hook - cleanup resources
   */
  dispose?(context: PluginContext): Promise<void> | void;
}

/**
 * Plugin context provided to plugin hooks
 */
export interface PluginContext {
  // Identity
  pluginId: string;
  
  // App information
  app: {
    id: string;
    profile: string;
    backend: string;
  };
  
  // Realm information
  realm: {
    id: string;
    type: RealmType;
    global: any;
    document?: Document;
    origin?: string;
  };
  
  // Capability system
  capability: {
    has(capabilityId: string): boolean;
    require(capabilityId: string): void;
    describe(capabilityId: string): CapabilityInfo | undefined;
  };
  
  // Surface system
  surface: {
    attach(target: string, property: string, value: any): void;
    detach(target: string, property: string): void;
    get(target: string, property: string): any;
  };
  
  // State system
  state: {
    get(namespace: string, key: string): any;
    set(namespace: string, key: string, value: any): void;
    delete(namespace: string, key: string): void;
    has(namespace: string, key: string): boolean;
    clear(namespace: string): void;
  };
  
  // Lifecycle system
  lifecycle: {
    onReset(handler: () => Promise<void> | void): void;
    onDispose(handler: () => Promise<void> | void): void;
  };
  
  // Scheduler
  scheduler: {
    setTimeout(handler: () => void, delay: number): number;
    clearTimeout(id: number): void;
    setInterval(handler: () => void, delay: number): number;
    clearInterval(id: number): void;
    queueMicrotask(task: () => void): void;
  };
  
  // Diagnostics
  trace: {
    event(data: any): void;
  };
  
  warn(message: string, context?: any): void;
  error(message: string, context?: any): void;
}

/**
 * Capability info
 */
export interface CapabilityInfo {
  id: string;
  version: string;
  description?: string;
  provider: string;
}

/**
 * Realm types
 */
export type RealmType = 'window' | 'worker' | 'worklet' | 'service-worker';

/**
 * Backend types
 */
export type BackendType = 'child-process' | 'worker-threads' | 'isolated-vm' | 'quickjs';

/**
 * Profile configuration
 */
export interface Profile {
  id: string;
  version: string;
  
  // Plugin selection
  plugins?: string[];
  
  // Plugin configuration
  pluginConfig?: Record<string, any>;
  
  // Capability requirements
  requiredCapabilities?: string[];
  optionalCapabilities?: string[];
  
  // Provider selection
  pins?: Record<string, string>;
  
  // Pre-resolved lock
  lock?: LockPlan;
}

/**
 * Lock plan
 */
export interface LockPlan {
  version: string;
  digest: string;
  
  plugins: Array<{
    id: string;
    version: string;
  }>;
  
  capabilities: Record<string, {
    provider: string;
    version: string;
  }>;
  
  surfaces: Record<string, {
    owner: string;
    target: string;
    property: string;
  }>;
  
  profile: {
    id: string;
    version: string;
  };
}

/**
 * App configuration
 */
export interface AppConfig {
  id?: string;
  backend?: {
    type: BackendType;
    options?: any;
  };
  profile?: Profile | string;
  limits?: {
    maxConcurrentRealms?: number;
    maxStateSize?: number;
  };
  experimental?: Record<string, any>;
}

/**
 * Sandbox configuration
 */
export interface SandboxConfig {
  id?: string;
  realmType?: RealmType;
}

/**
 * Plugin registration
 */
export interface PluginRegistration {
  manifest: PluginManifest;
  plugin: Plugin;
}

/**
 * Evaluation result
 */
export interface EvaluationResult {
  value?: any;
  error?: Error;
  duration: number;
  traceId: string;
  warnings: any[];
}

/**
 * Snapshot
 */
export interface Snapshot {
  sandboxId: string;
  profile: string;
  lockDigest: string;
  timestamp: string;
  state: Record<string, any>;
}
