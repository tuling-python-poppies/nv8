/**
 * Basic Core Test
 * 
 * Tests the fundamental App and Sandbox flow.
 */

import { test } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../app.js';

test('Core: basic app and sandbox creation', async () => {
  // Define a simple plugin
  const consolePlugin = {
    manifest: {
      id: 'console-plugin',
      version: '1.0.0',
      description: 'Provides console capability',
      provides: [
        { id: 'console', version: '1.0.0' }
      ],
      supportedRealms: ['window'],
      surfaces: [
        { target: 'global', property: 'testConsole' }
      ],
      stateNamespaces: ['console-state']
    },
    plugin: {
      async install(context) {
        // Attach a test console to global
        context.surface.attach('global', 'testConsole', {
          log: (...args) => {
            context.state.set('console-state', 'lastLog', args.join(' '));
            return args.join(' ');
          }
        });
      },
      
      async activate(context, config) {
        context.state.set('console-state', 'config', config);
      },
      
      async serialize(context) {
        return {
          lastLog: context.state.get('console-state', 'lastLog')
        };
      },
      
      async restore(context, state) {
        context.state.set('console-state', 'lastLog', state.lastLog);
      },
      
      async dispose(context) {
        context.surface.detach('global', 'testConsole');
      }
    }
  };
  
  // Create app
  const app = createApp({
    id: 'test-app',
    profile: {
      id: 'test-profile',
      version: '1.0.0',
      pluginConfig: {
        'console-plugin': { enabled: true }
      }
    }
  });
  
  // Register plugin
  app.registerPlugin(consolePlugin);
  
  // Create sandbox
  const sandbox = await app.createSandbox({ id: 'test-sandbox' });
  
  // Test evaluation
  const result = await sandbox.evaluate('testConsole.log("Hello", "World")');
  
  assert.strictEqual(result.value, 'Hello World');
  assert.ok(!result.error);
  
  // Test state
  const snapshot = await sandbox.snapshot();
  assert.strictEqual(snapshot.state['console-plugin'].lastLog, 'Hello World');
  
  // Test reset
  await sandbox.reset();
  
  // Test restore
  await sandbox.restore(snapshot);
  
  // Test diagnostics
  const diag = sandbox.diagnose();
  assert.strictEqual(diag.id, 'test-sandbox');
  assert.strictEqual(diag.plugins.length, 1);
  assert.strictEqual(diag.plugins[0].id, 'console-plugin');
  
  // Cleanup
  await sandbox.dispose();
  await app.dispose();
});

test('Core: dependency resolution', async () => {
  // Plugin A provides capability
  const pluginA = {
    manifest: {
      id: 'plugin-a',
      version: '1.0.0',
      provides: [{ id: 'capability-a', version: '1.0.0' }],
      supportedRealms: ['window'],
    },
    plugin: {
      async install(context) {
        globalThis.__pluginA_installed = true;
      }
    }
  };
  
  // Plugin B requires capability from A
  const pluginB = {
    manifest: {
      id: 'plugin-b',
      version: '1.0.0',
      requires: [{ capability: 'capability-a', version: '^1.0.0' }],
      supportedRealms: ['window'],
    },
    plugin: {
      async install(context) {
        context.capability.require('capability-a');
        globalThis.__pluginB_installed = true;
      }
    }
  };
  
  const app = createApp({ profile: { id: 'test', version: '1.0.0' } });
  
  // Register in reverse order (B before A)
  app.registerPlugin(pluginB);
  app.registerPlugin(pluginA);
  
  const sandbox = await app.createSandbox();
  
  // Both should be installed (A before B)
  assert.strictEqual(globalThis.__pluginA_installed, true);
  assert.strictEqual(globalThis.__pluginB_installed, true);
  
  // Check lock plan
  const lockPlan = app.getLockPlan();
  const pluginOrder = lockPlan.plugins.map(p => p.id);
  
  // A should come before B
  assert.ok(pluginOrder.indexOf('plugin-a') < pluginOrder.indexOf('plugin-b'));
  
  // Cleanup
  delete globalThis.__pluginA_installed;
  delete globalThis.__pluginB_installed;
  await sandbox.dispose();
  await app.dispose();
});

test('Core: surface collision detection', async () => {
  const pluginA = {
    manifest: {
      id: 'plugin-a',
      version: '1.0.0',
      supportedRealms: ['window'],
      surfaces: [{ target: 'global', property: 'shared' }]
    },
    plugin: {
      async install(context) {
        context.surface.attach('global', 'shared', 'A');
      }
    }
  };
  
  const pluginB = {
    manifest: {
      id: 'plugin-b',
      version: '1.0.0',
      supportedRealms: ['window'],
      surfaces: [{ target: 'global', property: 'shared' }]
    },
    plugin: {
      async install(context) {
        context.surface.attach('global', 'shared', 'B');
      }
    }
  };
  
  const app = createApp({ profile: { id: 'test', version: '1.0.0' } });
  app.registerPlugin(pluginA);
  app.registerPlugin(pluginB);
  
  // Should throw surface collision error
  await assert.rejects(
    async () => await app.createSandbox(),
    (error) => {
      return error.code === 'SURFACE_COLLISION' && 
             error.message.includes('shared');
    }
  );
  
  await app.dispose();
});

test('Core: missing dependency detection', async () => {
  const pluginB = {
    manifest: {
      id: 'plugin-b',
      version: '1.0.0',
      requires: [{ capability: 'missing-capability', version: '^1.0.0' }],
      supportedRealms: ['window'],
    },
    plugin: {}
  };
  
  const app = createApp({ profile: { id: 'test', version: '1.0.0' } });
  app.registerPlugin(pluginB);
  
  // Should throw missing dependency error
  await assert.rejects(
    async () => await app.createSandbox(),
    (error) => {
      return error.code === 'DEPENDENCY_MISSING' && 
             error.message.includes('missing-capability');
    }
  );
  
  await app.dispose();
});
