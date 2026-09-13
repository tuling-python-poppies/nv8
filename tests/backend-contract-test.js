import assert from "node:assert/strict";
import test from "node:test";
import { EdgeSandbox } from "../src/public/edge-sandbox.js";

const ALL_BACKENDS = ["child-process", "worker-thread"];
const requestedBackend = process.env.NV8_BACKEND;
if (requestedBackend !== undefined && !ALL_BACKENDS.includes(requestedBackend)) {
  throw new RangeError(`NV8_BACKEND must be ${ALL_BACKENDS.join(" or ")}`);
}
const BACKENDS = requestedBackend === undefined
  ? ALL_BACKENDS
  : [requestedBackend];

const replay = [
  {
    method: "GET",
    url: "https://backend-contract.test/worker.js",
    repeat: "unlimited",
    body: "self.onmessage = event => self.postMessage({ channel: 'worker', value: event.data });",
  },
  {
    method: "GET",
    url: "https://backend-contract.test/shared.js",
    repeat: "unlimited",
    body: "self.onconnect = event => { const port = event.ports[0]; port.onmessage = message => port.postMessage({ channel: 'shared', value: message.data }); port.start(); };",
  },
];

async function captureBackend(backend) {
  const sandbox = await EdgeSandbox.create({
    execution: { backend },
    page: {
      url: "https://backend-contract.test/",
      html: "<!doctype html><html><body><main id=app>contract</main></body></html>",
    },
    replay,
    limits: { timeoutMs: 10_000, maxRealms: 16 },
  });
  try {
    const values = [
      await sandbox.evaluate("1 + 1"),
      await sandbox.evaluate("document.getElementById('app').textContent"),
      await sandbox.evaluate("location.origin"),
    ];

    await sandbox.evaluateModule(
      "export const marker = 'module'; globalThis.__backendModuleMarker = marker;",
      "https://backend-contract.test/entry.js",
    );
    values.push(await sandbox.evaluate("globalThis.__backendModuleMarker"));

    const error = await captureError(
      () => sandbox.evaluate("throw new TypeError('backend contract error')"),
    );

    const workerMessage = await sandbox.evaluate(`new Promise(resolve => {
      const worker = new Worker('/worker.js');
      worker.onmessage = event => resolve(JSON.stringify(event.data));
      worker.postMessage('dedicated');
    })`);
    const sharedMessage = await sandbox.evaluate(`new Promise(resolve => {
      const worker = new SharedWorker('/shared.js', { name: 'contract' });
      worker.port.onmessage = event => resolve(JSON.stringify(event.data));
      worker.port.start();
      worker.port.postMessage('shared');
    })`);
    const frameLoad = await sandbox.evaluate(`new Promise(resolve => {
      const frame = document.createElement('iframe');
      frame.srcdoc = '<!doctype html><html><body>frame</body></html>';
      frame.addEventListener('load', () => resolve(frame.contentDocument.body.textContent));
      document.body.appendChild(frame);
    })`);

    const resourcesBeforeReset = await sandbox.resources();
    await sandbox.setPage({
      url: "https://backend-contract.test/reset/",
      html: "<!doctype html><html><body><main id=app>reset</main></body></html>",
    });
    const resourcesAfterReset = await sandbox.resources();

    return {
      values,
      error,
      workerMessage,
      sharedMessage,
      frameLoad,
      resourcesBeforeReset: comparableResources(resourcesBeforeReset),
      resourcesAfterReset: comparableResources(resourcesAfterReset),
    };
  } finally {
    await sandbox.close();
  }
}

async function captureError(operation) {
  try {
    await operation();
    return null;
  } catch (error) {
    return {
      name: `${error?.name ?? "Error"}`,
      code: error?.code ?? null,
      message: `${error?.message ?? error}`,
    };
  }
}

function comparableResources(resources) {
  return {
    pendingRealmCreations: resources.pendingRealmCreations,
    childRealms: resources.childRealms,
    idlePrewarmedRealms: resources.idlePrewarmedRealms,
    workerRealms: resources.workerRealms,
    sharedWorkerGraphs: resources.sharedWorkerGraphs,
    workerConnections: resources.workerConnections,
    pendingWorkerCreations: resources.pendingWorkerCreations,
    root: { ...resources.root },
    graphFingerprints: resources.graphFingerprints,
  };
}

const snapshotReady = Promise.all(
  BACKENDS.map(async backend => [backend, await captureBackend(backend)]),
).then(entries => new Map(entries));

for (const backend of BACKENDS) {
  test(`backend contract is deterministic on ${backend}`, async () => {
    const snapshot = (await snapshotReady).get(backend);

    assert.deepEqual(snapshot.values.map(entry => entry.value), [
      2,
      "contract",
      "https://backend-contract.test",
      "module",
    ]);
    assert.deepEqual(snapshot.error, {
      name: "TypeError",
      code: "ERR_EDGE_EVALUATION",
      message: "backend contract error",
    });
    assert.deepEqual(JSON.parse(snapshot.workerMessage.value), {
      channel: "worker",
      value: "dedicated",
    });
    assert.deepEqual(JSON.parse(snapshot.sharedMessage.value), {
      channel: "shared",
      value: "shared",
    });
    assert.equal(snapshot.frameLoad.value, "frame");
    assert.equal(snapshot.resourcesBeforeReset.workerRealms, 2);
    assert.equal(snapshot.resourcesBeforeReset.sharedWorkerGraphs, 1);
    assert.equal(snapshot.resourcesBeforeReset.root.workers, 1);
    assert.equal(snapshot.resourcesBeforeReset.root.sharedWorkers, 1);
    assert.equal(snapshot.resourcesAfterReset.childRealms, 0);
    assert.equal(snapshot.resourcesAfterReset.workerRealms, 0);
    assert.equal(snapshot.resourcesAfterReset.sharedWorkerGraphs, 0);
    assert.equal(snapshot.resourcesAfterReset.workerConnections, 0);
    assert.deepEqual(snapshot.resourcesAfterReset.root, {
      workers: 0,
      sharedWorkers: 0,
      serviceWorkers: 0,
    });
  });
}

if (BACKENDS.length === ALL_BACKENDS.length) {
  test("child-process and worker-thread expose the same public contract", async () => {
    const snapshots = await snapshotReady;
    assert.deepEqual(
      snapshots.get("child-process"),
      snapshots.get("worker-thread"),
    );
  });
}
