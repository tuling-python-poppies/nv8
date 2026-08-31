# @nv8/core

Core architecture for the NV8 plugin system.

## Overview

`@nv8/core` provides the foundational plugin architecture that powers NV8. It manages plugin lifecycle, dependency resolution, capability registry, and sandboxed execution environments.

## Features

- **Plugin System**: Register and manage plugins with declarative manifests
- **Dependency Resolution**: Automatic plugin ordering based on capability dependencies
- **Capability Registry**: Discover and require capabilities from other plugins
- **Surface Registry**: Safe global surface attachment and collision detection
- **State Management**: Namespaced state storage per plugin
- **Lifecycle Management**: Install, activate, reset, serialize, restore, dispose hooks
- **Controlled Scheduling**: Sandboxed timer and microtask scheduling
- **Diagnostics**: Built-in tracing and error collection

## Installation

```bash
npm install @nv8/core
```

## Quick Start

```javascript
import { createApp } from '@nv8/core';

// Define a plugin
const myPlugin = {
  manifest: {
    id: 'my-plugin',
    version: '1.0.0',
    provides: [
      { id: 'my-capability', version: '1.0.0' }
    ],
    supportedRealms: ['window'],
  },
  plugin: {
    async install(context) {
      context.surface.attach('global', 'myAPI', {
        hello: () => 'Hello from plugin!'
      });
    }
  }
};

// Create app and register plugins
const app = createApp({
  profile: { id: 'my-profile', version: '1.0.0' }
});

app.use(myPlugin);

// Create sandbox
const sandbox = await app.createSandbox();

// Evaluate code
const result = await sandbox.evaluate('myAPI.hello()');
console.log(result.value); // "Hello from plugin!"

// Clean up
await sandbox.dispose();
await app.dispose();
```

## Architecture

### App

The `App` is the top-level container that manages plugin registration and sandbox creation.

```javascript
const app = createApp({
  id: 'my-app',
  profile: {
    id: 'my-profile',
    version: '1.0.0',
    plugins: ['plugin-a', 'plugin-b'],
    pluginConfig: {
      'plugin-a': { option: 'value' }
    }
  }
});
```

### Sandbox

A `Sandbox` is an isolated execution environment with installed plugins.

```javascript
const sandbox = await app.createSandbox({
  id: 'sandbox-1',
  realmType: 'window'
});

// Evaluate code
await sandbox.evaluate('console.log("Hello")');

// Reset state
await sandbox.reset();

// Snapshot state
const snapshot = await sandbox.snapshot();

// Restore state
await sandbox.restore(snapshot);

// Dispose
await sandbox.dispose();
```

### Plugin Manifest

Plugins are defined with a manifest that declares capabilities, dependencies, and compatibility:

```javascript
const manifest = {
  id: 'my-plugin',
  version: '1.0.0',
  description: 'My plugin',
  
  // Capabilities provided
  provides: [
    { id: 'my-capability', version: '1.0.0' }
  ],
  
  // Capabilities required
  requires: [
    { capability: 'other-capability', version: '^1.0.0' }
  ],
  
  // Realm compatibility
  supportedRealms: ['window', 'worker'],
  
  // Backend compatibility
  supportedBackends: ['child-process', 'worker-threads'],
  
  // Conflicts
  conflicts: ['incompatible-plugin'],
  
  // Surfaces to attach
  surfaces: [
    { target: 'global', property: 'myAPI' }
  ],
  
  // State namespaces
  stateNamespaces: ['my-state']
};
```

### Plugin Interface

Plugins implement lifecycle hooks:

```javascript
const plugin = {
  // Install: one-time setup
  async install(context) {
    context.surface.attach('global', 'myAPI', { ... });
  },
  
  // Activate: configure with user settings
  async activate(context, config) {
    context.state.set('my-state', 'setting', config.value);
  },
  
  // Reset: clear runtime state
  async reset(context) {
    // Reset counters, clear caches, etc.
  },
  
  // Serialize: return state for snapshot
  async serialize(context) {
    return {
      data: context.state.get('my-state', 'data')
    };
  },
  
  // Restore: restore from snapshot
  async restore(context, state) {
    context.state.set('my-state', 'data', state.data);
  },
  
  // Dispose: cleanup resources
  async dispose(context) {
    context.surface.detach('global', 'myAPI');
  }
};
```

### Plugin Context

The plugin context provides sandboxed access to capabilities and services:

```javascript
async install(context) {
  // Identity
  console.log(context.pluginId);
  
  // Capabilities
  if (context.capability.has('console')) {
    context.capability.require('console');
  }
  
  // Surfaces
  context.surface.attach('global', 'myAPI', { ... });
  
  // State
  context.state.set('my-state', 'key', 'value');
  const value = context.state.get('my-state', 'key');
  
  // Lifecycle
  context.lifecycle.onReset(() => {
    // Reset handler
  });
  
  // Scheduler
  const id = context.scheduler.setTimeout(() => {
    console.log('Timeout!');
  }, 1000);
  
  // Diagnostics
  context.trace.event({ name: 'my-event', data: 123 });
  context.warn('Warning message');
}
```

## Dependency Resolution

The resolver automatically orders plugins based on capability dependencies:

```javascript
// Plugin A provides 'console'
const pluginA = {
  manifest: {
    id: 'console-plugin',
    provides: [{ id: 'console', version: '1.0.0' }],
    supportedRealms: ['window']
  }
};

// Plugin B requires 'console'
const pluginB = {
  manifest: {
    id: 'logger-plugin',
    requires: [{ capability: 'console', version: '^1.0.0' }],
    supportedRealms: ['window']
  }
};

app.use(pluginA).use(pluginB);

// Resolver ensures pluginA installs before pluginB
const sandbox = await app.createSandbox();
```

### Pins

When multiple plugins provide the same capability, use pins to select one:

```javascript
const app = createApp({
  profile: {
    id: 'my-profile',
    pins: {
      'console': 'console-plugin-v2'
    }
  }
});
```

## Lock Plans

Lock plans freeze plugin resolution for reproducible builds:

```javascript
const lockPlan = app.getLockPlan();

console.log(lockPlan);
// {
//   version: '1.0.0',
//   digest: 'abc123',
//   plugins: [
//     { id: 'plugin-a', version: '1.0.0' },
//     { id: 'plugin-b', version: '1.2.3' }
//   ],
//   capabilities: {
//     'console': { provider: 'plugin-a', version: '1.0.0' }
//   },
//   surfaces: { ... }
// }

// Reuse lock plan
const app2 = createApp({
  profile: {
    id: 'my-profile',
    lock: lockPlan
  }
});
```

## Diagnostics

Get detailed diagnostic information:

```javascript
// App diagnostics
const appDiag = app.diagnose();
console.log(appDiag);

// Sandbox diagnostics
const sandboxDiag = sandbox.diagnose();
console.log(sandboxDiag);
// {
//   id: 'sandbox-1',
//   plugins: [...],
//   capabilities: [...],
//   surfaces: [...],
//   resources: {
//     activeTimers: 2,
//     activeWorkers: 0
//   },
//   lifecycle: {
//     createdAt: '2024-01-01T00:00:00.000Z',
//     resetCount: 3
//   }
// }
```

## Error Handling

Core uses structured diagnostic errors:

```javascript
import { createDiagnosticError, ErrorCode } from '@nv8/core';

try {
  await sandbox.evaluate('throw new Error("oops")');
} catch (error) {
  if (error.code === ErrorCode.PLUGIN_INSTALL_FAILED) {
    console.log(error.phase);      // 'install'
    console.log(error.context);    // { pluginId: '...' }
    console.log(error.suggestions); // ['Check plugin install() hook', ...]
  }
}
```

## TypeScript

Full TypeScript definitions included:

```typescript
import type {
  Plugin,
  PluginManifest,
  PluginContext,
  Profile,
  LockPlan,
  AppConfig
} from '@nv8/core';

const manifest: PluginManifest = {
  id: 'my-plugin',
  version: '1.0.0',
  provides: [{ id: 'my-capability', version: '1.0.0' }],
  supportedRealms: ['window']
};

const plugin: Plugin = {
  async install(context: PluginContext) {
    // ...
  }
};
```

## License

MIT
