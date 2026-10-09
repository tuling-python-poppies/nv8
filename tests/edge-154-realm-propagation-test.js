import assert from 'node:assert/strict';
import test from 'node:test';
import { createSandbox } from '../src/public/create-sandbox.js';
import { createNv8 } from '../src/index.js';
import { edge154Fingerprint } from '../src/infra/fingerprint/edge-154.js';

const replay = [
  {
    method: 'GET',
    url: 'https://example.test/worker.js',
    repeat: 'unlimited',
    body: `self.onmessage = async () => {
  const high = await self.navigator.userAgentData.getHighEntropyValues(['uaFullVersion']);
  self.postMessage({ ua: self.navigator.userAgent, full: high.uaFullVersion });
};`,
  },
  {
    method: 'GET',
    url: 'https://example.test/sw.js',
    repeat: 'unlimited',
    body: `self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('message', async event => {
  const high = await self.navigator.userAgentData.getHighEntropyValues(['uaFullVersion']);
  event.source.postMessage({ ua: self.navigator.userAgent, full: high.uaFullVersion });
});`,
  },
  {
    method: 'GET',
    url: 'https://example.test/paint.js',
    repeat: 'unlimited',
    body: "registerPaint('edge154-probe', class {});",
  },
];

const frameSource = `<script>(async () => {
  const high = await navigator.userAgentData.getHighEntropyValues(['uaFullVersion']);
  parent.postMessage('edge154:' + JSON.stringify({
    ua: navigator.userAgent,
    full: high.uaFullVersion,
    camera: typeof HTMLCameraElement,
    sharedStorage: typeof sharedStorage,
  }), '*');
})()<` + '/scr' + `ipt>`;

async function probe(backend) {
  const sandbox = await createSandbox('https://example.test/app/page', {
    execution: { backend },
    fingerprint: edge154Fingerprint,
    replay,
    limits: { timeoutMs: 30_000, maxRealms: 16 },
  });
  try {
    const root = JSON.parse(await sandbox.run(`(async () => {
      const high = await navigator.userAgentData.getHighEntropyValues(['uaFullVersion']);
      return JSON.stringify({
        ua: navigator.userAgent,
        full: high.uaFullVersion,
        camera: typeof HTMLCameraElement,
        sharedStorage: typeof sharedStorage,
      });
    })()`));

    const frame = JSON.parse(await sandbox.run(`new Promise(resolve => {
      const listener = event => {
        if (typeof event.data !== 'string' || !event.data.startsWith('edge154:')) return;
        removeEventListener('message', listener);
        resolve(event.data.slice('edge154:'.length));
      };
      addEventListener('message', listener);
      const iframe = document.createElement('iframe');
      iframe.srcdoc = ${JSON.stringify(frameSource)};
      document.body.appendChild(iframe);
    })`));

    const worker = JSON.parse(await sandbox.run(`new Promise((resolve, reject) => {
      const worker = new Worker('/worker.js');
      worker.onmessage = event => {
        worker.terminate();
        resolve(JSON.stringify(event.data));
      };
      worker.onerror = reject;
      worker.postMessage('probe');
    })`));

    const serviceWorker = JSON.parse(await sandbox.run(`(async () => {
      await navigator.serviceWorker.register('/sw.js', { scope: '/app/' });
      const controller = navigator.serviceWorker.controller ?? await new Promise(resolve => {
        navigator.serviceWorker.addEventListener(
          'controllerchange',
          () => resolve(navigator.serviceWorker.controller),
          { once: true },
        );
      });
      return await new Promise((resolve, reject) => {
        navigator.serviceWorker.onmessage = event => resolve(JSON.stringify(event.data));
        controller.postMessage('probe');
        setTimeout(() => reject(new Error('service worker probe timeout')), 8_000);
      });
    })()`));

    assert.match(root.ua, /Chrome\/154\./);
    assert.match(root.ua, /Edg\/154\./);
    assert.equal(root.full, '154.0.4258.53');
    assert.equal(root.camera, 'function');
    assert.equal(root.sharedStorage, 'undefined');
    assert.deepEqual(frame, root);
    assert.deepEqual(worker, { ua: root.ua, full: root.full });
    assert.deepEqual(serviceWorker, { ua: root.ua, full: root.full });

    assert.equal(
      await sandbox.run("CSS.paintWorklet.addModule('/paint.js').then(() => 'ready')"),
      'ready',
    );
    const resources = await sandbox.resources();
    const paint = resources.graphFingerprints.find(
      entry => entry.kind === 'paint-worklet',
    );
    assert.ok(paint);
    assert.equal(paint.fingerprint.graph.browserMajorVersion, 154);
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

for (const backend of ['child-process', 'worker-thread']) {
  test(`Edge 154 version identity propagates across ${backend} realms`, async () => {
    await probe(backend);
  });
}

test('Edge 154 built-in profile installs the version-gated capture surface', async () => {
  const instance = await createNv8({
    profile: 'browser-profile-edge-v154',
    logger: { info() {}, warn() {}, error() {} },
  });
  try {
    const result = JSON.parse(await instance.eval(`(async () => JSON.stringify({
      ua: navigator.userAgent,
      full: (await navigator.userAgentData.getHighEntropyValues(['uaFullVersion'])).uaFullVersion,
      camera: typeof HTMLCameraElement,
      microphone: typeof HTMLMicrophoneElement,
      sharedStorage: typeof sharedStorage,
    }))()`));
    assert.match(result.ua, /Chrome\/154\./);
    assert.match(result.ua, /Edg\/154\./);
    assert.equal(result.full, edge154Fingerprint.navigator.userAgentData.uaFullVersion);
    assert.equal(result.camera, 'function');
    assert.equal(result.microphone, 'function');
    assert.equal(result.sharedStorage, 'undefined');
  } finally {
    await instance.destroy();
  }
});
