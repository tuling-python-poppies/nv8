import assert from "node:assert/strict";
import test from "node:test";
import { EdgeSandbox } from "../src/public/edge-sandbox.js";

const replay = [
  {
    method: "GET",
    url: "https://example.test/shared.js",
    repeat: "unlimited",
    body: "self.onconnect = event => event.ports[0].start();",
  },
  {
    method: "GET",
    url: "https://example.test/paint.js",
    repeat: "unlimited",
    body: "registerPaint('probe', class {});",
  },
];

for (const backend of ["child-process", "worker-thread"]) {
  test(`resources expose stable SharedWorker and Worklet graph fingerprints on ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      page: { url: "https://example.test/" },
      replay,
      limits: { timeoutMs: 10_000, maxRealms: 16 },
    });
    try {
      const worker = await sandbox.evaluate(`new Promise(resolve => {
        const worker = new SharedWorker('/shared.js', { name: 'fingerprint' });
        worker.port.start();
        resolve('ready');
      })`);
      assert.equal(worker.value, "ready");
      const worklet = await sandbox.evaluate(
        `CSS.paintWorklet.addModule('/paint.js').then(() => 'ready')`,
      );
      assert.equal(worklet.value, "ready");

      const first = await sandbox.resources();
      const second = await sandbox.resources();
      assert.equal(first.graphFingerprints.length, 2);
      assert.deepEqual(first.graphFingerprints, second.graphFingerprints);

      const shared = first.graphFingerprints.find(
        (entry) => entry.kind === "shared-worker",
      );
      const paint = first.graphFingerprints.find(
        (entry) => entry.kind === "paint-worklet",
      );
      assert.ok(shared);
      assert.ok(paint);
      assert.match(shared.fingerprint.digest, /^[0-9a-f]{64}$/);
      assert.match(paint.fingerprint.digest, /^[0-9a-f]{64}$/);
      assert.equal(paint.fingerprint.cache.moduleCount, 1);
      assert.deepEqual(paint.fingerprint.cache.modules, [
        "https://example.test/paint.js",
      ]);
    } finally {
      await sandbox.close();
    }
  });

  test(`Worklet static imports are loaded from the same-origin replay graph on ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      page: { url: "https://example.test/" },
      replay: [
        {
          method: "GET",
          url: "https://example.test/worklet-dep.js",
          repeat: "unlimited",
          body: "export const paintName = 'imported-probe';",
        },
        {
          method: "GET",
          url: "https://example.test/worklet-entry.js",
          repeat: "unlimited",
          body: "import { paintName } from './worklet-dep.js'; registerPaint(paintName, class {});",
        },
      ],
    });
    try {
      const result = await sandbox.evaluate(
        `CSS.paintWorklet.addModule('/worklet-entry.js').then(() => 'ready')`,
      );
      assert.equal(result.value, "ready");
    } finally {
      await sandbox.close();
    }
  });
}
