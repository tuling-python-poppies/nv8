import test from "node:test";
import assert from "node:assert/strict";

import { createSandbox } from "../src/public/create-sandbox.js";
import { edge152Fingerprint } from "../src/infra/fingerprint/edge-152.js";

test("MediaList exposes the iterator without installing values as a named method", async () => {
  const sandbox = await createSandbox("https://media-list.test/", {
    page: {
      html: "<!doctype html><html><head><style media=\"screen and (min-width: 1px)\"></style></head><body></body></html>",
    },
    fingerprint: { ...edge152Fingerprint, browserMajorVersion: 152 },
    limits: { maxOutputBytes: 8 * 1024 * 1024, timeoutMs: 30_000 },
  });
  try {
    const result = JSON.parse(await sandbox.run(`JSON.stringify((() => {
      const media = document.styleSheets[0].media;
      return {
        names: Reflect.ownKeys(MediaList.prototype).filter((key) => typeof key === "string"),
        iterator: typeof MediaList.prototype[Symbol.iterator],
        values: [...media],
        namedValues: typeof MediaList.prototype.values,
      };
    })())`));
    assert.deepEqual(result.names, [
      "length",
      "mediaText",
      "appendMedium",
      "deleteMedium",
      "item",
      "toString",
      "constructor",
    ]);
    assert.equal(result.iterator, "function");
    assert.deepEqual(result.values, ["screen and (min-width: 1px)"]);
    assert.equal(result.namedValues, "undefined");
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
});
