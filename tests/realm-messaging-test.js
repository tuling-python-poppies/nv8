import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8 } from '../src/index.js';
import { domPreset } from '../src/presets/index.js';
import { streamsPlugin } from '../src/plugins/streams/index.js';
import { fetchPlugin } from '../src/plugins/fetch/index.js';
import { xhrPlugin } from '../src/plugins/xhr/index.js';
import { navigatorPlugin } from '../src/plugins/navigator/index.js';
import { messagingPlugin } from '../src/plugins/messaging/index.js';
import { workerPlugin } from '../src/plugins/worker/index.js';
import { workletPlugin } from '../src/plugins/worklet/index.js';
import { serviceWorkerPlugin } from '../src/plugins/service-worker/index.js';

test('Core activates messaging, Worker, and Worklet APIs in a Realm', async () => {
  const networkRecords = [];
  const nv8 = await createNv8({
    plugins: [
      ...domPreset,
      streamsPlugin,
      fetchPlugin,
      xhrPlugin,
      navigatorPlugin,
      messagingPlugin,
      workerPlugin,
      workletPlugin,
      serviceWorkerPlugin,
    ],
    profile: { id: "test-profile", version: '1.0.0', name: 'Test Profile',      url: 'https://example.test/',
      pageHtml: '<!doctype html><html><body></body></html>',
    },
    replay: [{
      method: 'GET',
      url: 'https://example.test/worker.js',
      body: 'const child = new Worker("/nested.js"); self.onmessage = event => { child.onmessage = message => self.postMessage(message.data); child.postMessage(event.data); };',
    }, {
      method: 'GET',
      url: 'https://example.test/nested.js',
      body: 'self.onmessage = event => self.postMessage(event.data + "!");',
    }, {
      method: 'GET',
      url: 'https://example.test/seq-a.js',
      sequence: 0,
      body: 'self.postMessage("a");',
    }, {
      method: 'GET',
      url: 'https://example.test/seq-b.js',
      sequence: 1,
      body: 'self.postMessage("b");',
    }, {
      method: 'GET',
      url: 'https://example.test/once.js',
      repeat: 'once',
      body: 'self.postMessage("ready");',
    }, {
      method: 'GET',
      url: 'https://example.test/shared.js',
      body: 'self.onconnect = event => { const port = event.ports[0]; port.onmessage = message => port.postMessage(message.data + "!"); port.start(); };',
    }, {
      method: 'GET',
      url: 'https://example.test/sw.js',
      repeat: 'unlimited',
      body: 'self.addEventListener("install", event => event.waitUntil(self.skipWaiting())); self.addEventListener("activate", event => event.waitUntil(self.clients.claim())); self.onfetch = event => { if (event.request.url.endsWith("/sw-data")) event.respondWith(new Response("sw-intercept")); if (event.request.url.endsWith("/navigated")) event.respondWith(new Response("<!doctype html><html><body><h1 id=title>service-navigation</h1></body></html>")); }; self.onmessage = async event => { const clients = await self.clients.matchAll(); self.postMessage("sw:" + event.data + ":" + clients.length); };',
    }, {
      method: 'GET',
      url: 'https://example.test/sw-app.js',
      repeat: 'unlimited',
      body: 'self.onfetch = event => { if (event.request.url.endsWith("/app/page")) event.respondWith(new Response("<!doctype html><html><body><h1 id=title>app</h1></body></html>")); };',
    }, {
      method: 'GET',
      url: 'https://example.test/sw-app2.js',
      repeat: 'unlimited',
      body: 'self.onfetch = event => { if (event.request.url.endsWith("/app2/page")) event.respondWith(new Response("<!doctype html><html><body><h1 id=title>app2</h1></body></html>")); };',
    }, {
      method: 'GET',
      url: 'https://example.test/module-duplicate-worker.js',
      body: 'import { suffix } from "./module-duplicate-helper.js"; import "./module-duplicate-helper.js"; self.onmessage = event => self.postMessage(event.data + suffix);',
    }, {
      method: 'GET',
      url: 'https://example.test/module-duplicate-helper.js',
      repeat: 'once',
      body: 'export const suffix = "-duplicate";',
    }, {
      method: 'GET',
      url: 'https://example.test/module-cycle-worker.js',
      body: 'import { helper } from "./module-cycle-helper.js"; export const root = "root"; self.onmessage = () => self.postMessage(helper);',
    }, {
      method: 'GET',
      url: 'https://example.test/module-cycle-helper.js',
      repeat: 'once',
      body: 'import { root } from "./module-cycle-worker.js"; export const helper = "cycle";',
    }, {
      method: 'GET',
      url: 'https://example.test/module-cross-worker.js',
      repeat: 'unlimited',
      body: 'import "https://other.example.test/helper.js"; self.onmessage = () => {};',
    }, {
      method: 'GET',
      url: 'https://example.test/module-missing-worker.js',
      repeat: 'unlimited',
      body: 'import "./module-missing-helper.js"; self.onmessage = () => {};',
    }, {
      method: 'GET',
      url: 'https://example.test/sw-module.js',
      repeat: 'unlimited',
      body: 'import "./sw-module-helper.js"; self.addEventListener("install", event => event.waitUntil(Promise.resolve())); self.addEventListener("activate", event => event.waitUntil(Promise.resolve()));',
    }, {
      method: 'GET',
      url: 'https://example.test/sw-module-helper.js',
      repeat: 'once',
      body: 'export const version = "v1";',
    }, {
      method: 'GET',
      url: 'https://example.test/sw-module-helper.js',
      repeat: 'once',
      body: 'export const version = "v2";',
    }, {
      method: 'GET',
      url: 'https://example.test/sw-noop.js',
      repeat: 'unlimited',
      body: 'self.addEventListener("install", event => event.waitUntil(Promise.resolve())); self.addEventListener("activate", event => event.waitUntil(Promise.resolve()));',
    }, {
      method: 'GET',
      url: 'https://example.test/sw-once.js',
      repeat: 'once',
      body: 'self.addEventListener("install", event => event.waitUntil(Promise.resolve())); self.addEventListener("activate", event => event.waitUntil(Promise.resolve()));',
    }, {
      method: 'GET',
      url: 'https://example.test/sw-wait.js',
      repeat: 'unlimited',
      body: 'self.addEventListener("install", event => event.waitUntil(Promise.resolve())); self.addEventListener("activate", event => event.waitUntil(Promise.resolve()));',
    }, {
      method: 'GET',
      url: 'https://example.test/fetch-worker.js',
      body: 'self.onmessage = async () => { const response = await fetch("/worker-data"); self.postMessage(await response.text()); };',
    }, {
      method: 'GET',
      url: 'https://example.test/xhr-worker.js',
      body: 'self.onmessage = () => { const request = new XMLHttpRequest(); request.onload = () => self.postMessage(request.responseText); request.open("GET", "/worker-data"); request.send(); };',
    }, {
      method: 'GET',
      url: 'https://example.test/fetch-miss-worker.js',
      body: 'self.onmessage = async () => { try { await fetch("/missing-data"); } catch (error) { self.postMessage([error.code, error.details.reason].join(":")); } };',
    }, {
      method: 'GET',
      url: 'https://example.test/module-worker.js',
      body: 'import { suffix } from "./worker-helper.js"; self.onmessage = event => self.postMessage(event.data + suffix);',
    }, {
      method: 'GET',
      url: 'https://example.test/worker-helper.js',
      body: 'export const suffix = "-module";',
    }, {
      method: 'GET',
      url: 'https://example.test/worker-data',
      repeat: 'unlimited',
      headers: { 'content-type': 'text/plain' },
      body: 'worker-response',
    }],
    runtime: {
      networkRequestRecorder: {
        record(entry) {
          networkRecords.push(entry);
        },
      },
    },
    logger: { info() {}, warn() {}, error() {}, trace() {} },
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });
    assert.equal(
      realm.evaluate('[typeof MessageChannel, typeof BroadcastChannel, typeof Worker, typeof Worklet].join(",")'),
      'function,function,function,function',
    );
    assert.equal(
      await realm.evaluate(`(() => {
        const channel = new MessageChannel();
        channel.port2.start();
        const received = new Promise(resolve => {
          channel.port2.onmessage = event => resolve(event.data.value);
        });
        channel.port1.postMessage({ value: 42 });
        return received;
      })()`),
      42,
    );
    assert.equal(
      await realm.evaluate(`(() => {
        const channel = new BroadcastChannel('realm-test');
        channel.close();
        return channel.name;
      })()`),
      'realm-test',
    );
    assert.equal(
      realm.evaluate('typeof Worker'),
      'function',
    );
    assert.equal(
      await realm.evaluate(`(async () => {
        const registration = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
        return JSON.stringify([
          registration.scope,
          registration.active.state,
          navigator.serviceWorker.controller !== null,
        ]);
      })()`),
      JSON.stringify(['https://example.test/', 'activated', true]),
    );
    assert.equal(
      await realm.evaluate(`new Promise(resolve => {
        navigator.serviceWorker.onmessage = event => resolve(JSON.stringify([
          event.data,
          event.source === navigator.serviceWorker.controller,
        ]));
        navigator.serviceWorker.controller.postMessage('ping');
      })`),
      JSON.stringify(['sw:ping:1', true]),
    );
    assert.equal(
      await realm.evaluate(`(async () => {
        const previous = (await navigator.serviceWorker.getRegistration()).active;
        const registration = await navigator.serviceWorker.getRegistration();
        await registration.update();
        return JSON.stringify([
          registration.waiting,
          registration.active !== previous,
          registration.active.state,
        ]);
      })()`),
      JSON.stringify([null, true, 'activated']),
    );
    assert.equal(
      await realm.evaluate(`(async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        const results = await Promise.all([
          registration.update(),
          registration.update(),
        ]);
        return JSON.stringify([results[0] === results[1], registration.active.state]);
      })()`),
      JSON.stringify([true, 'activated']),
    );
    assert.equal(
      await realm.evaluate(`(async () => {
        const registration = await navigator.serviceWorker.register('/sw-module.js', { scope: '/module/', type: 'module' });
        await registration.update();
        return JSON.stringify([registration.active.state, registration.waiting?.state]);
      })()`),
      JSON.stringify(['activated', 'installed']),
    );
    assert.equal(
      await realm.evaluate(`(async () => {
        const registration = await navigator.serviceWorker.register('/sw-noop.js', { scope: '/noop/' });
        const previous = registration.active;
        await registration.update();
        return JSON.stringify([registration.active === previous, registration.waiting]);
      })()`),
      JSON.stringify([true, null]),
    );
    assert.equal(
      await realm.evaluate(`(async () => {
        const registration = await navigator.serviceWorker.register('/sw-wait.js', { scope: '/wait/', updateViaCache: 'none' });
        await registration.update();
        return JSON.stringify([
          registration.waiting?.state,
          registration.active?.state,
        ]);
      })()`),
      JSON.stringify(['installed', 'activated']),
    );
    assert.equal(
      await realm.evaluate(`(async () => {
        const registration = await navigator.serviceWorker.register('/sw-once.js', { scope: '/once/' });
        const result = await registration.update().then(() => 'resolved', error => 'rejected');
        return JSON.stringify([result, registration.active?.state, registration.waiting]);
      })()`),
      JSON.stringify(['rejected', 'activated', null]),
    );
    assert.equal(
      await realm.evaluate(`fetch('https://example.test/sw-data').then(response => response.text())`),
      'sw-intercept',
    );
    assert.equal(
      await realm.evaluate(`new Promise(resolve => {
        const request = new XMLHttpRequest();
        request.onload = () => resolve(request.responseText);
        request.open('GET', 'https://example.test/sw-data');
        request.send();
      })`),
      'sw-intercept',
    );
    await realm.evaluate(`(async () => {
      await navigator.serviceWorker.register('/sw-app.js', { scope: '/app/' });
      await navigator.serviceWorker.register('/sw-app2.js', { scope: '/app2/' });
    })()`);
    assert.equal(
      await realm.evaluate(`(async () => {
        const registration = await navigator.serviceWorker.getRegistration('https://example.test/app2/page');
        return registration.scope;
      })()`),
      'https://example.test/app2/',
    );
    const navigatedRealm = await nv8.sandbox.createRealm({
      pageUrl: 'https://example.test/app2/page',
      navigation: true,
    });
    assert.equal(
      navigatedRealm.evaluate('document.querySelector("#title").textContent'),
      'app2',
    );
    assert.equal(
      await realm.evaluate(`new Promise(resolve => {
        const worker = new Worker('/worker.js');
        worker.onmessage = event => resolve(event.data);
        worker.postMessage('ok');
      })`),
      'ok!',
    );
    assert.equal(
      await realm.evaluate(`new Promise(resolve => {
        const worker = new SharedWorker('/shared.js', { name: 'shared-test' });
        worker.port.onmessage = event => resolve(event.data);
        worker.port.start();
        worker.port.postMessage('shared');
      })`),
      'shared!',
    );
    assert.equal(
      await realm.evaluate(`new Promise(resolve => {
        const worker = new Worker('/seq-b.js');
        worker.onerror = event => resolve([event.error.code, event.error.details.reason].join(':'));
      })`),
      'ERR_NV8_WORKER_REPLAY_MISS:sequence-mismatch',
    );
    assert.equal(
      await realm.evaluate(`new Promise(resolve => {
        const worker = new Worker('/seq-a.js');
        worker.onmessage = event => resolve(event.data);
      })`),
      'a',
    );
    assert.equal(
      await realm.evaluate(`new Promise(resolve => {
        const worker = new Worker('/seq-b.js');
        worker.onmessage = event => resolve(event.data);
      })`),
      'b',
    );
    assert.equal(
      await realm.evaluate(`new Promise(resolve => {
        const worker = new Worker('/once.js');
        worker.onmessage = event => resolve(event.data);
      })`),
      'ready',
    );
    assert.equal(
      await realm.evaluate(`new Promise(resolve => {
        const worker = new Worker('/once.js');
        worker.onerror = event => resolve([event.error.code, event.error.details.reason].join(':'));
      })`),
      'ERR_NV8_WORKER_REPLAY_MISS:exhausted',
    );
    assert.equal(
      await realm.evaluate(`new Promise(resolve => {
        const worker = new Worker('/fetch-worker.js');
        worker.onmessage = event => resolve(event.data);
        worker.postMessage('fetch');
      })`),
      'worker-response',
    );
    assert.equal(
      await realm.evaluate(`new Promise(resolve => {
        const worker = new Worker('/xhr-worker.js');
        worker.onmessage = event => resolve(event.data);
        worker.postMessage('xhr');
      })`),
      'worker-response',
    );
    assert.equal(
      await realm.evaluate(`new Promise(resolve => {
        const worker = new Worker('/module-worker.js', { type: 'module' });
        worker.onmessage = event => resolve(event.data);
        worker.postMessage('worker');
      })`),
      'worker-module',
    );
    assert.equal(
      await realm.evaluate(`new Promise(resolve => {
        const worker = new Worker('/module-duplicate-worker.js', { type: 'module' });
        worker.onmessage = event => resolve(event.data);
        worker.postMessage('worker');
      })`),
      'worker-duplicate',
    );
    assert.equal(
      await realm.evaluate(`new Promise(resolve => {
        const worker = new Worker('/module-cycle-worker.js', { type: 'module' });
        worker.onmessage = event => resolve(event.data);
        worker.postMessage('cycle');
      })`),
      'cycle',
    );
    assert.equal(
      await realm.evaluate(`new Promise(resolve => {
        const worker = new Worker('/fetch-miss-worker.js');
        worker.onmessage = event => resolve(event.data);
        worker.postMessage('miss');
      })`),
      'ERR_NV8_REPLAY_MISS:missing',
    );
    assert.equal(
      await realm.evaluate(`new Promise(resolve => {
        const worker = new Worker('/module-cross-worker.js', { type: 'module' });
        worker.onerror = event => resolve(event.error.code);
      })`),
      'ERR_NV8_WORKER_MODULE_ORIGIN',
    );
    assert.equal(
      await realm.evaluate(`new Promise(resolve => {
        const worker = new Worker('/module-missing-worker.js', { type: 'module' });
        worker.onerror = event => resolve([event.error.code, event.error.details.reason].join(':'));
      })`),
      'ERR_NV8_WORKER_REPLAY_MISS:missing',
    );
    assert.equal(
      await realm.evaluate(`new Promise(resolve => {
        const worker = new Worker('/missing.js');
        worker.onerror = event => resolve([event.error.code, event.error.details.reason].join(':'));
      })`),
      'ERR_NV8_WORKER_REPLAY_MISS:missing',
    );
    assert.equal(
      realm.evaluate('[typeof Worklet, typeof AudioWorklet].join(",")'),
      'function,function',
    );
    assert.deepEqual(
      networkRecords
        .filter(entry => entry.realm?.kind === 'worker')
        .map(entry => [entry.api, entry.url, entry.outcome]),
      [
        ['fetch', 'https://example.test/worker-data', 'replayed'],
        ['XMLHttpRequest', 'https://example.test/worker-data', 'replayed'],
        ['fetch', 'https://example.test/missing-data', 'replay-miss:missing'],
      ],
    );
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
