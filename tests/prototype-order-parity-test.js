import test from "node:test";
import vm from "node:vm";
import assert from "node:assert/strict";

import { readFile } from "node:fs/promises";

import { createSandbox } from "../src/public/create-sandbox.js";
import { edge152Fingerprint } from "../src/infra/fingerprint/edge-152.js";
import { expectedMissingForNode, expectedMissingMemberForNode } from "../src/infra/baseline/known-differences.js";

const realMembers = JSON.parse(await readFile(
  new URL("../fixtures/fingerprint/edge-members.json", import.meta.url),
));
const fixtureNames = Object.keys(realMembers.prototypes);
const hostIntrinsicMembers = JSON.parse(vm.runInNewContext(`JSON.stringify(Object.fromEntries(
  ${JSON.stringify(fixtureNames)}.map((name) => [
    name,
    typeof globalThis[name] === "function" && globalThis[name].prototype
      ? Reflect.ownKeys(globalThis[name].prototype).filter((key) => typeof key === "string")
      : [],
  ]),
))`, {}));

test("Edge 152 prototype member order matches the measured order", async () => {
  const sandbox = await createSandbox("https://prototype-order.test/", {
    page: { html: "<!doctype html><html><head></head><body></body></html>" },
    fingerprint: { ...edge152Fingerprint, browserMajorVersion: 152 },
    limits: { maxOutputBytes: 8 * 1024 * 1024, timeoutMs: 30_000 },
  });
  try {
    const names = fixtureNames;
    const available = JSON.parse(await sandbox.run(`JSON.stringify(
      ${JSON.stringify(names)}.filter((name) => (
        typeof globalThis[name] === "function" && globalThis[name].prototype
      )),
    )`));
    for (const name of names) {
      if (!available.includes(name)) {
        assert.ok(expectedMissingForNode(name), `${name} is missing without a Node-version registration`);
      }
    }
    const observed = JSON.parse(await sandbox.run(`JSON.stringify(Object.fromEntries(
      ${JSON.stringify(available)}.map((name) => [
        name,
        Reflect.ownKeys(globalThis[name].prototype)
          .filter((key) => typeof key === "string"),
      ]),
    ))`));
    for (const name of available) {
      const expected = realMembers.prototypes[name].members
        .map(({ name: member }) => member)
        .filter((member) => (
          !hostIntrinsicMembers[name].includes(member)
          && !expectedMissingMemberForNode(name, member)
        ));
      const expectedSet = new Set(expected);
      const actual = observed[name].filter((member) => expectedSet.has(member));
      assert.deepEqual(actual, expected, name);
    }
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
});
