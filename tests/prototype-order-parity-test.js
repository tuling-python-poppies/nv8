import test from "node:test";
import assert from "node:assert/strict";

import { createSandbox } from "../src/public/create-sandbox.js";
import { edge152Fingerprint } from "../src/infra/fingerprint/edge-152.js";
import { EDGE_152_PROTOTYPE_ORDER } from "../src/surface/install/prototype-surface-order.js";

test("Edge 152 prototype member order matches the measured order", async () => {
  const sandbox = await createSandbox("https://prototype-order.test/", {
    page: { html: "<!doctype html><html><head></head><body></body></html>" },
    fingerprint: { ...edge152Fingerprint, browserMajorVersion: 152 },
    limits: { maxOutputBytes: 8 * 1024 * 1024, timeoutMs: 30_000 },
  });
  try {
    const names = Object.keys(EDGE_152_PROTOTYPE_ORDER);
    const observed = JSON.parse(await sandbox.run(`JSON.stringify(Object.fromEntries(
      ${JSON.stringify(names)}.map((name) => [
        name,
        Reflect.ownKeys(globalThis[name].prototype)
          .filter((key) => typeof key === "string"),
      ]),
    ))`));
    for (const [name, expected] of Object.entries(EDGE_152_PROTOTYPE_ORDER)) {
      assert.deepEqual(observed[name], expected, name);
    }
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
});
