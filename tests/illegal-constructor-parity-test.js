import test from "node:test";
import assert from "node:assert/strict";

import { createSandbox } from "../src/public/create-sandbox.js";
import { edge152Fingerprint } from "../src/infra/fingerprint/edge-152.js";

const REPRESENTATIVE_CONSTRUCTORS = [
  "InteractionContentfulPaint",
  "GPU",
  "XRSystem",
  "IDBFactory",
];

test("illegal constructors distinguish bare calls from construct calls", async () => {
  const sandbox = await createSandbox("https://constructor-errors.test/", {
    page: { html: "<!doctype html><html><head></head><body></body></html>" },
    fingerprint: { ...edge152Fingerprint, browserMajorVersion: 152 },
    limits: { timeoutMs: 30_000 },
  });
  try {
    const observed = JSON.parse(await sandbox.run(`JSON.stringify((() => {
      const result = {};
      for (const name of ${JSON.stringify(REPRESENTATIVE_CONSTRUCTORS)}) {
        const Constructor = globalThis[name];
        result[name] = {};
        try { Constructor(); } catch (error) {
          result[name].bare = [error.name, error.message];
        }
        try { new Constructor(); } catch (error) {
          result[name].construct = [error.name, error.message];
        }
      }
      return result;
    })())`));

    for (const name of REPRESENTATIVE_CONSTRUCTORS) {
      assert.deepEqual(observed[name], {
        bare: ["TypeError", "Illegal constructor"],
        construct: ["TypeError", `Failed to construct '${name}': Illegal constructor`],
      }, name);
    }
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
});
