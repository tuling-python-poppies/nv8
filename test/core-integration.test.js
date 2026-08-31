/**
 * Simple integration test for core architecture
 */

import { test } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../src/core/app.js';

// Test plugin implementation
const testPlugin = {
  manifest: {
    id: 'test-plugin',
    version: '1.0.0',
    supportedRealms: ['window', 'worker'],
    provides: [
      {
        id: 'test.capability',
        version: '1.0.0',
        description: 'Test capability',
      },
    ],
    surfaces: [
      {
        target: 'window',
        property: 'testFunction',
        description: 'Test function exposed on window',
      },
    ],
    stateNamespaces: ['test'],
  },
  
  plugin: {
    async install(context) {
      // Install logic
      context.trace.event({
        pluginId: 'test-plugin',
        type: 'install',
        message: 'Plugin installed',
      });
      
      // Register surface
      context.surface.set('window', 'testFunction', () => {
        return 'Hello from test plugin!';
      });
      
      // Set initial state
      context.state.set('test', 'initialized', true);
    },
    
    async activate(context, config) {
      context.trace.event({
        pluginId: 'test-plugin',
        type: 'activate',
        message: 'Plugin activated',
        config,
      });
    },
    
    async reset(context) {
      context.state.set('test', 'resetCount', 
        (context.state.get('test', 'resetCount') || 0) + 1
      );
    },
    
    async serialize(context) {
      return {
        initialized: context.state.get('test', 'initialized'),
        resetCount: context.state.get('test', 'resetCount') || 0,
      };
    },
    
    async restore(context, state) {
      context.state.set('test', 'initialized', state.initialized);
      context.state.set('test', 'resetCount', state.resetCount);
    },
    
    async dispose(context) {
      context.trace.event({
        pluginId: 'test-plugin',
        type: 'dispose',
        message: 'Plugin disposed',
      });
    },
  },
};

test('Core architecture integration', async (t) => {
  await t.test('should create app and register plugin', () => {
    const app = createApp({
      profile: 'test',
    });
    
    app.registerPlugin(testPlugin);
    
    const diagnose = app.diagnose();
    assert.strictEqual(diagnose.plugins.registered.length, 1);
    assert.strictEqual(diagnose.plugins.registered[0].id, 'test-plugin');
  });
  
  await t.test('should create sandbox and install plugin', async () => {
    const app = createApp({
      profile: 'test',
    });
    
    app.registerPlugin(testPlugin);
    
    const sandbox = await app.createSandbox();
    
    const diagnose = sandbox.diagnose();
    assert.strictEqual(diagnose.plugins.length, 1);
    assert.strictEqual(diagnose.plugins[0].id, 'test-plugin');
    assert.strictEqual(diagnose.capabilities.length, 1);
    assert.strictEqual(diagnose.surfaces.length, 1);
    
    await sandbox.dispose();
  });
  
  await t.test('should execute plugin lifecycle', async () => {
    const app = createApp({
      profile: {
        id: 'test',
        version: '1.0.0',
        pluginConfig: {
          'test-plugin': { enabled: true },
        },
      },
    });
    
    app.registerPlugin(testPlugin);
    
    const sandbox = await app.createSandbox();
    
    // Check trace events
    const diagnose = sandbox.diagnose();
    assert.strictEqual(diagnose.trace.events, 2); // install + activate
    
    await sandbox.dispose();
  });
  
  await t.test('should reset sandbox state', async () => {
    const app = createApp({
      profile: 'test',
    });
    
    app.registerPlugin(testPlugin);
    
    const sandbox = await app.createSandbox();
    
    // Reset
    await sandbox.reset();
    
    const diagnose = sandbox.diagnose();
    assert.strictEqual(diagnose.lifecycle.resetCount, 1);
    
    await sandbox.dispose();
  });
  
  await t.test('should snapshot and restore state', async () => {
    const app = createApp({
      profile: 'test',
    });
    
    app.registerPlugin(testPlugin);
    
    const sandbox = await app.createSandbox();
    
    // Reset to increment counter
    await sandbox.reset();
    await sandbox.reset();
    
    // Take snapshot
    const snapshot = await sandbox.snapshot();
    assert.ok(snapshot.state['test-plugin']);
    assert.strictEqual(snapshot.state['test-plugin'].resetCount, 2);
    
    // Reset again
    await sandbox.reset();
    
    // Restore
    await sandbox.restore(snapshot);
    
    // Should be back to 2
    const newSnapshot = await sandbox.snapshot();
    assert.strictEqual(newSnapshot.state['test-plugin'].resetCount, 2);
    
    await sandbox.dispose();
  });
  
  await t.test('should prevent operations on disposed sandbox', async () => {
    const app = createApp({
      profile: 'test',
    });
    
    app.registerPlugin(testPlugin);
    
    const sandbox = await app.createSandbox();
    await sandbox.dispose();
    
    assert.strictEqual(sandbox.isDisposed(), true);
    
    await assert.rejects(
      async () => await sandbox.evaluate('1 + 1'),
      /disposed/
    );
  });
  
  await t.test('should prevent plugin registration after lock', async () => {
    const app = createApp({
      profile: 'test',
    });
    
    app.registerPlugin(testPlugin);
    
    // Create sandbox to lock
    const sandbox = await app.createSandbox();
    
    // Try to register another plugin
    assert.throws(
      () => app.registerPlugin({
        manifest: { id: 'another', version: '1.0.0', supportedRealms: ['window'] },
        plugin: {},
      }),
      /locked/
    );
    
    await sandbox.dispose();
  });
  
  await t.test('should dispose app and all sandboxes', async () => {
    const app = createApp({
      profile: 'test',
    });
    
    app.registerPlugin(testPlugin);
    
    const sandbox1 = await app.createSandbox();
    const sandbox2 = await app.createSandbox();
    
    await app.dispose();
    
    assert.strictEqual(app.isDisposed(), true);
    assert.strictEqual(sandbox1.isDisposed(), true);
    assert.strictEqual(sandbox2.isDisposed(), true);
  });
});

test('Plugin resolver', async (t) => {
  await t.test('should resolve plugin dependencies', async () => {
    const app = createApp({
      profile: 'test',
    });
    
    // Provider plugin
    app.registerPlugin({
      manifest: {
        id: 'provider',
        version: '1.0.0',
        supportedRealms: ['window'],
        provides: [
          {
            id: 'test.service',
            version: '1.0.0',
            description: 'Test service',
          },
        ],
      },
      plugin: {
        async install(context) {
          context.surface.set('window', 'service', { foo: 'bar' });
        },
      },
    });
    
    // Consumer plugin
    app.registerPlugin({
      manifest: {
        id: 'consumer',
        version: '1.0.0',
        supportedRealms: ['window'],
        requires: [
          {
            capability: 'test.service',
            version: '^1.0.0',
          },
        ],
      },
      plugin: {
        async install(context) {
          // Will validate that test.service is available
          context.capabilities.require('test.service');
        },
      },
    });
    
    const sandbox = await app.createSandbox();
    
    const diagnose = sandbox.diagnose();
    assert.strictEqual(diagnose.plugins.length, 2);
    assert.strictEqual(diagnose.capabilities.length, 1);
    
    await sandbox.dispose();
  });
});

console.log('Running Core integration tests...');
