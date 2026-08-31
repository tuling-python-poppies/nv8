import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, domPreset } from '../src/index.js';
import { streamsPlugin } from '../src/plugins/streams/index.js';
import { fetchPlugin } from '../src/plugins/fetch/index.js';
import { navigatorPlugin } from '../src/plugins/navigator/index.js';
import { messagingPlugin } from '../src/plugins/messaging/index.js';
import { windowPlugin } from '../src/plugins/window/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };
const plugins = [
  ...domPreset,
  streamsPlugin,
  fetchPlugin,
  navigatorPlugin,
  messagingPlugin,
  windowPlugin,
];

 test('page scripts execute with ordering, currentScript, events, and static module imports', async () => {
  const nv8 = await createNv8({
    plugins,
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile',      url: 'https://example.test/',
      pageHtml: `<!doctype html><html><head>
        <script>
          globalThis.order = ['inline'];
          globalThis.scriptEvents = [];
          document.addEventListener('DOMContentLoaded', () => order.push('dom'));
          window.addEventListener('load', () => order.push('load'));
          for (const script of document.getElementsByTagName('script')) {
            script.addEventListener('load', () => scriptEvents.push('load:' + (script.src || 'inline')));
            script.addEventListener('error', () => scriptEvents.push('error:' + (script.src || 'inline')));
          }
        </script>
        <script src="/blocking.js"></script>
        <script defer src="/defer.js"></script>
        <script async src="/async.js"></script>
        <script type="module" src="/module.js"></script>
        <script src="/error.js"></script>
      </head><body></body></html>`,
    },
    replay: [
      {
        method: 'GET',
        url: 'https://example.test/blocking.js',
        body: "order.push('blocking'); blockingCurrentScript = document.currentScript?.getAttribute('src') === '/blocking.js';",
      },
      {
        method: 'GET',
        url: 'https://example.test/defer.js',
        body: "order.push('defer');",
      },
      {
        method: 'GET',
        url: 'https://example.test/async.js',
        body: "order.push('async:' + document.readyState);",
      },
      {
        method: 'GET',
        url: 'https://example.test/module.js',
        body: "import { value } from './module-helper.js'; order.push('module:' + value);",
      },
      {
        method: 'GET',
        url: 'https://example.test/module-helper.js',
        body: 'export const value = "helper";',
      },
      {
        method: 'GET',
        url: 'https://example.test/error.js',
        body: 'throw new Error("script failed");',
      },
    ],
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root', pageUrl: 'https://example.test/' });
    const result = realm.evaluate(`JSON.stringify({
      order,
      blockingCurrentScript,
      events: scriptEvents,
      currentScript: document.currentScript,
    })`);
    const parsed = JSON.parse(result);
    assert.deepEqual(parsed.order, [
      'inline',
      'blocking',
      'defer',
      'module:helper',
      'dom',
      'async:interactive',
      'load',
    ]);
    assert.equal(parsed.blockingCurrentScript, true, JSON.stringify(parsed));
    assert.equal(parsed.currentScript, null);
    assert.ok(Array.isArray(parsed.events));
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
