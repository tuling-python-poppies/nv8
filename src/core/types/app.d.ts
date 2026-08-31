/**
 * App and Sandbox Type Definitions
 * 
 * Defines the public API for creating and managing NV8 applications and sandboxes.
 */

import type { BackendType, RealmType, PluginRegistration, PluginLockPlan } from './plugin.js';

/**
 * Backend configuration
 */
export interface BackendConfig {
  type: BackendType;
  options?: {
    // child-process specific
    execArgv?: string[];
    env?: Record<string, string>;
    
    // worker-thread specific
    resourceLimits?: {
      maxOldGenerationSizeMb?: number;
      maxYoungGenerationSizeMb?: number;
      codeRangeSizeMb?: number;
      stackSizeMb?: number;
    };
  };
}

/**
 * Resource limits for Sandbox/Realm
 */
export interface ResourceLimits {
  maxHeapBytes?: number;
  maxOutputBytes?: number;
  maxFrameQueueBytes?: number;
  timeoutMs?: number;
  maxConcurrentRealms?: number;
}

/**
 * Profile configuration
 * 
 * Defines which plugins to load and how to configure them.
 */
export interface ProfileConfig {
  id: string;
  version: string;
  description?: string;
  
  plugins: string[]; // Plugin IDs to load
  pluginConfig?: Record<string, unknown>; // Per-plugin configuration
  
  requiredCapabilities?: string[];
  optionalCapabilities?: string[];
  
  pins?: Record<string, string>; // Explicit version pins: pluginId -> version
  
  supportedRealms?: RealmType[];
  supportedBackends?: BackendType[];
  
  // Lock file for reproducible plugin resolution
  lock?: PluginLockPlan;
}

/**
 * Application configuration
 */
export interface AppConfig {
  id?: string;
  profile?: ProfileConfig | string; // Profile object or profile ID
  backend?: BackendConfig;
  limits?: ResourceLimits;
  
  // Experimental flags
  experimental?: {
    cachePluginPlans?: boolean;
    preWarmRealms?: boolean;
    strictDiagnostics?: boolean;
  };
  maxLifecycleEntries?: number;
  maxDiagnosticEntries?: number;
}

/**
 * Sandbox configuration
 */
export interface SandboxConfig {
  id?: string;
  realmType?: RealmType;
  limits?: ResourceLimits;
  origin?: string;
  
  // Runtime fixtures
  evidence?: {
    bundle?: string; // Path to Evidence Bundle
    manifest?: unknown;
  };
}

/**
 * Evaluation options
 */
export interface EvaluateOptions {
  filename?: string;
  timeout?: number;
  context?: Record<string, unknown>;
  returnRaw?: boolean; // Skip result normalization
}

/**
 * Evaluation result
 */
export interface EvaluateResult<T = unknown> {
  value: T;
  error?: Error;
  
  // Diagnostics
  duration?: number;
  traceId?: string;
  warnings?: Array<{
    code: string;
    message: string;
    pluginId?: string;
  }>;
}

/**
 * Sandbox diagnostic information
 */
export interface SandboxDiagnostics {
  id: string;
  realmType: RealmType;
  backend: BackendType;
  
  profile: {
    id: string;
    lockDigest?: string;
  };
  
  plugins: Array<{
    id: string;
    version: string;
    phase: string;
    state: 'installed' | 'activated' | 'failed';
    error?: string;
  }>;
  
  capabilities: Record<string, {
    provider: string;
    state: 'available' | 'degraded' | 'missing';
  }>;
  
  surfaces: Array<{
    owner: string;
    target: string;
    property: string;
  }>;
  
  state: {
    namespaces: string[];
    heapUsed?: number;
  };
  
  resources: {
    activeTimers: number;
    activeWorkers: number;
    activeChannels: number;
  };
  
  lifecycle: {
    createdAt: string;
    resetCount: number;
    lastResetAt?: string;
    disposed: boolean;
  };
}

/**
 * Sandbox Interface
 * 
 * Represents an isolated execution environment with its own Realm.
 */
export interface Sandbox {
  readonly id: string;
  readonly realmType: RealmType;
  
  /**
   * Evaluate code in the sandbox
   */
  evaluate<T = unknown>(code: string, options?: EvaluateOptions): Promise<EvaluateResult<T>>;
  
  /**
   * Reset the sandbox state
   */
  reset(): Promise<void>;
  
  /**
   * Take a snapshot of serializable state
   */
  snapshot(): Promise<unknown>;
  
  /**
   * Restore from a previous snapshot
   */
  restore(snapshot: unknown): Promise<void>;
  
  /**
   * Get diagnostic information
   */
  diagnose(): SandboxDiagnostics;
  
  /**
   * Dispose and release all resources
   */
  dispose(): Promise<void>;
}

/**
 * Application Interface
 * 
 * The main entry point for creating sandboxes with a specific plugin configuration.
 */
export interface App {
  readonly id: string;
  readonly profile: ProfileConfig;
  readonly backend: BackendType;
  
  /**
   * Register a plugin (must be called before first sandbox creation)
   */
  use(registration: PluginRegistration): App;
  
  /**
   * Create a new sandbox
   */
  createSandbox(config?: SandboxConfig): Promise<Sandbox>;
  
  /**
   * Get the resolved plugin lock plan
   */
  getLockPlan(): PluginLockPlan;

  /**
   * Get bounded app lifecycle and diagnostic records
   */
  getDiagnostics(): Array<Record<string, unknown>>;
  
  /**
   * Get app-level diagnostics
   */
  diagnose(): {
    id: string;
    profile: ProfileConfig;
    backend: BackendType;
    
    plugins: Array<{
      id: string;
      version: string;
      provides: string[];
      requires: string[];
    }>;
    
    lockPlan?: PluginLockPlan;
    locked: boolean;
    
    activeSandboxes: number;
    totalSandboxes: number;
    lifecycle?: Array<Record<string, unknown>>;
    diagnostics?: Array<Record<string, unknown>>;
  };
  
  /**
   * Dispose all sandboxes and release resources
   */
  dispose(): Promise<void>;
}

/**
 * Create a new App instance
 */
export function createApp(config?: AppConfig): App;
