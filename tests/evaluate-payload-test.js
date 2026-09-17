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

const HEX_OF_WASM = [
  "Array.from(globalThis.__nv8Payload.wasm,",
  "b => b.toString(16).padStart(2, '0')).join('')",
].join(" ");
const HEX_OF_CONFIG_ASYNC = [
  "(async () => { await Promise.resolve(); return",
  "Array.from(globalThis.__nv8Payload.config,",
  "b => b.toString(16).padStart(2, '0')).join(''); })()",
].join(" ");

function sampleBytes(seed, length) {
  const bytes = new Uint8Array(length);
  for (let index = 0; index < length; index += 1) {
    bytes[index] = (index * 31 + seed) & 0xff;
  }
  return bytes;
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

async function captureBackend(backend) {
  const wasmBytes = sampleBytes(7, 4096);
  const configBytes = sampleBytes(13, 777);
  const sandbox = await EdgeSandbox.create({
    execution: { backend },
    page: {
      url: "https://evaluate-payload.test/",
      html: "<!doctype html><html><body></body></html>",
    },
    limits: { timeoutMs: 10_000 },
  });
  const oversizeSandbox = await EdgeSandbox.create({
    execution: { backend },
    page: { url: "https://evaluate-payload.test/oversize/" },
    limits: { timeoutMs: 10_000, maxBytesLength: 256 },
  });
  try {
    const visibleBefore = await sandbox.evaluate(
      "typeof globalThis.__nv8Payload",
    );
    const hex = await sandbox.evaluateWithPayload(HEX_OF_WASM, {
      wasm: wasmBytes,
    });
    const named = await sandbox.evaluateWithPayload(
      "`${globalThis.__nv8Payload.wasm.length}:${globalThis.__nv8Payload.config.length}`",
      { wasm: wasmBytes, config: configBytes },
    );
    const visibleAfter = await sandbox.evaluate(
      "typeof globalThis.__nv8Payload",
    );
    const asyncHex = await sandbox.evaluateWithPayload(HEX_OF_CONFIG_ASYNC, {
      config: configBytes,
    });
    const visibleAfterAsync = await sandbox.evaluate(
      "typeof globalThis.__nv8Payload",
    );
    const emptyDefault = await sandbox.evaluateWithPayload("1 + 1");
    const emptyRecord = await sandbox.evaluateWithPayload("1 + 1", {});
    const [first, second] = await Promise.all([
      sandbox.evaluateWithPayload(HEX_OF_WASM, { wasm: wasmBytes }),
      sandbox.evaluateWithPayload(HEX_OF_WASM, { wasm: configBytes }),
    ]);
    const invalidValue = await captureError(
      () => sandbox.evaluateWithPayload("1", { wasm: "not bytes" }),
    );
    const invalidShape = await captureError(
      () => sandbox.evaluateWithPayload("1", [wasmBytes]),
    );
    const oversize = await captureError(
      () => oversizeSandbox.evaluateWithPayload("1", {
        wasm: sampleBytes(3, 512),
      }),
    );
    const usableAfterRejection = await oversizeSandbox.evaluate("1 + 1");

    return {
      visibleBefore: visibleBefore.value,
      visibleAfter: visibleAfter.value,
      visibleAfterAsync: visibleAfterAsync.value,
      hex: hex.value,
      expectedWasmHex: Buffer.from(wasmBytes).toString("hex"),
      asyncHex: asyncHex.value,
      expectedConfigHex: Buffer.from(configBytes).toString("hex"),
      named: named.value,
      expectedNamed: `${wasmBytes.byteLength}:${configBytes.byteLength}`,
      emptyDefault: emptyDefault.value,
      emptyRecord: emptyRecord.value,
      first: first.value,
      second: second.value,
      invalidValue,
      invalidShape,
      oversizeCode: oversize?.code ?? null,
      usableAfterRejection: usableAfterRejection.value,
    };
  } finally {
    await sandbox.close();
    await oversizeSandbox.close();
  }
}

const snapshotReady = Promise.all(
  BACKENDS.map(async backend => [backend, await captureBackend(backend)]),
).then(entries => new Map(entries));

for (const backend of BACKENDS) {
  test(`evaluateWithPayload delivers named bytes on ${backend}`, async () => {
    const snapshot = (await snapshotReady).get(backend);

    assert.equal(snapshot.visibleBefore, "undefined");
    assert.equal(snapshot.visibleAfter, "undefined");
    assert.equal(snapshot.visibleAfterAsync, "undefined");
    assert.equal(snapshot.hex, snapshot.expectedWasmHex);
    assert.equal(snapshot.asyncHex, snapshot.expectedConfigHex);
    assert.equal(snapshot.named, snapshot.expectedNamed);
    assert.equal(snapshot.emptyDefault, 2);
    assert.equal(snapshot.emptyRecord, 2);
    // 并发调用必须各读各的载荷：载荷容器是全局固定名字，没有串行会互相覆盖。
    assert.equal(snapshot.first, snapshot.expectedWasmHex);
    assert.equal(snapshot.second, snapshot.expectedConfigHex);
    assert.deepEqual(snapshot.invalidValue, {
      name: "TypeError",
      code: null,
      message: "payload.wasm must be a Uint8Array",
    });
    assert.deepEqual(snapshot.invalidShape, {
      name: "TypeError",
      code: null,
      message: "payload must be a record of name → Uint8Array",
    });
    assert.equal(snapshot.oversizeCode, "LIMIT_BYTES");
    assert.equal(snapshot.usableAfterRejection, 2);
  });
}

if (BACKENDS.length === ALL_BACKENDS.length) {
  test("child-process and worker-thread deliver identical payload bytes", async () => {
    const snapshots = await snapshotReady;
    assert.deepEqual(
      snapshots.get("child-process"),
      snapshots.get("worker-thread"),
    );
  });
}
