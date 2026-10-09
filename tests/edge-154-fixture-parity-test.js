import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createNv8 } from "../src/index.js";
import { createSandbox } from "../src/public/create-sandbox.js";
import { edge152Fingerprint } from "../src/infra/fingerprint/edge-152.js";
import { edge154Fingerprint } from "../src/infra/fingerprint/edge-154.js";
import { captureFullSurface } from "../src/infra/baseline/full-surface.js";
import {
  expectedMissingForNode,
  expectedMissingMemberForNode,
  expectedMissingSymbolCountForNode,
} from "../src/infra/baseline/known-differences.js";
import { edge154MemberProbe } from "./helpers/edge-154-member-probe.js";

const fixture = name => readFile(
  new URL(`../fixtures/fingerprint/${name}`, import.meta.url), "utf8",
).then(JSON.parse);
const members = (await fixture("edge-154-members.json")).prototypes;
const lengths = (await fixture("edge-154-lengths.json")).interfaces;
const behavior = await fixture("edge-154-behavior.json");
const asyncBehavior = await fixture("edge-154-async-behavior.json");
const memberBehavior = await fixture("edge-154-new-member-behavior.json");
const css = await fixture("edge-154-css-properties.json");
const uaDefaults = await fixture("edge-154-ua-defaults.json");
const globals = new Set((await fixture("edge-154-globals.json")).globals);
const legacyCss = Object.freeze((await fixture("edge-154-css-properties.json")).names
  .filter(name => !["frameSizing", "scrollAxisLock", "windowDrag"].includes(name)));

const replay = [
  { method: "GET", url: "https://example.test/worker-message.js", repeat: "unlimited", body: 'postMessage("ready");' },
  { method: "GET", url: "https://example.test/worker-late.js", repeat: "unlimited", body: 'setTimeout(() => postMessage("late"), 0);' },
  { method: "GET", url: "https://example.test/worker-sentinel.js", repeat: "unlimited", body: 'postMessage("sentinel");' },
  { method: "GET", url: "https://example.test/sw.js", repeat: "unlimited", body: `self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('message', event => { if (event.data && event.data.kind === 'roundtrip') event.source.postMessage({ kind: 'reply', value: event.data.value }); });` },
];

async function withSandbox(callback, options = {}) {
  const sandbox = await createSandbox("https://example.test/app/page", {
    fingerprint: edge154Fingerprint, replay,
    limits: { maxOutputBytes: 16 * 1024 * 1024, timeoutMs: 30_000 },
    ...options,
  });
  try { return await callback(sandbox); }
  finally { await sandbox.close(); createSandbox.drain(); }
}

let surfacePromise;
function capture() {
  return surfacePromise ??= withSandbox(sandbox => captureFullSurface(source => sandbox.run(source)));
}

for (const major of [152, 154]) {
  test(`Edge ${major} profile plugin surfaces stay gated and Realm-local`, async () => {
    const errors = [];
    const hostCapture = Object.getOwnPropertyDescriptor(globalThis, "HTMLCameraElement");
    const nv8 = await createNv8({
      profile: `browser-profile-edge-v${major}`,
      limits: { timeoutMs: 30_000 },
      logger: { info() {}, warn() {}, error(...args) { errors.push(args.map(String).join(" ")); } },
    });
    try {
      const realm = await nv8.sandbox.createRealm({ type: "root" });
      const observed = JSON.parse(await realm.evaluate(`(async () => JSON.stringify({
        userAgent: navigator.userAgent,
        full: (await navigator.userAgentData.getHighEntropyValues(["uaFullVersion"])).uaFullVersion,
        iterator: typeof globalThis.Iterator?.prototype?.join,
        autocorrect: Object.hasOwn(HTMLElement.prototype, "autocorrect"),
        camera: typeof HTMLCameraElement,
        microphone: typeof HTMLMicrophoneElement,
        imageStorage: "sharedStorageWritable" in HTMLImageElement.prototype,
        iframeStorage: "sharedStorageWritable" in HTMLIFrameElement.prototype,
        documentStorage: "requestStorageAccessFor" in Document.prototype,
        frameSizing: "frameSizing" in document.createElement("div").style,
      }))()`));
      const fingerprint = major === 154 ? edge154Fingerprint : edge152Fingerprint;
      assert.deepEqual(observed, {
        userAgent: fingerprint.navigator.userAgent,
        full: fingerprint.navigator.userAgentData.uaFullVersion,
        iterator: major === 154 && expectedMissingForNode("Iterator") === null ? "function" : "undefined",
        autocorrect: major === 154,
        camera: major === 154 ? "function" : "undefined",
        microphone: major === 154 ? "function" : "undefined",
        imageStorage: major < 154, iframeStorage: major < 154, documentStorage: major < 154,
        frameSizing: major === 154,
      });
      realm.evaluate("localStorage.setItem('reset-probe', 'value'); performance.mark('reset-probe')");
      await realm.reset();
      assert.equal(realm.evaluate("localStorage.getItem('reset-probe')"), null);
      assert.equal(realm.evaluate("performance.getEntriesByName('reset-probe').length"), 0);
    } finally { await nv8.destroy(); }
    assert.deepEqual(errors, []);
    assert.deepEqual(Object.getOwnPropertyDescriptor(globalThis, "HTMLCameraElement"), hostCapture);
  });
}

test("Edge 154 global fixture has only the documented pending API", async () => {
  const observed = Object.keys((await capture()).globals);
  const missing = [...globals].filter(name => !observed.includes(name))
    .filter(name => expectedMissingForNode(name) === null);
  assert.deepEqual(observed.filter(name => !globals.has(name)), []);
  assert.deepEqual(missing, ["requestResize"]);
});

test("Edge 154 independent members and descriptors match", async () => {
  const observed = (await capture()).globals;
  let compared = 0;
  for (const [name, entry] of Object.entries(members)) {
    const actualMembers = observed[name]?.prototypeMembers;
    if (actualMembers == null && expectedMissingForNode(name) !== null) continue;
    assert.ok(actualMembers, `${name} prototype missing`);
    const actual = new Map(actualMembers.map(member => [member.name, member.descriptor]));
    const expected = new Set(entry.members.map(member => member.name));
    assert.deepEqual([...actual.keys()].filter(member => !expected.has(member)), [], `${name} extras`);
    for (const member of entry.members) {
      if (!actual.has(member.name) && expectedMissingMemberForNode(name, member.name) !== null) continue;
      assert.ok(actual.has(member.name), `${name}.${member.name} missing`);
      if (member.descriptor == null || member.descriptor.unreadable) continue;
      assert.deepEqual(actual.get(member.name), member.descriptor, `${name}.${member.name} descriptor`);
      compared += 1;
    }
    assert.equal(
      observed[name].symbolMemberCount + expectedMissingSymbolCountForNode(name),
      entry.symbolCount,
      `${name} symbols`,
    );
  }
  assert.ok(compared >= 8500, `only ${compared} descriptors compared`);
});

test("Edge 154 independent method lengths match", async () => {
  const observed = await withSandbox(sandbox => sandbox.run(`JSON.stringify(Object.fromEntries(
    ${JSON.stringify(Object.keys(lengths))}.map(name => {
      const C = globalThis[name];
      if (typeof C !== "function" || !C.prototype) return [name, null];
      const methods = {};
      for (const key of Object.getOwnPropertyNames(C.prototype)) {
        const d = Object.getOwnPropertyDescriptor(C.prototype, key);
        if (typeof d?.value === "function") methods[key] = d.value.length;
      }
      return [name, { ctorLength: C.length, methods }];
    })
  ))`).then(JSON.parse));
  let compared = 0;
  for (const [name, entry] of Object.entries(lengths)) {
    if (observed[name] === null) {
      assert.ok(expectedMissingForNode(name), `${name} constructor missing`);
      continue;
    }
    // Same host Float16Array shim arity gap as edge-length-axis-test.js.
    const shim = name === "Float16Array" && typeof globalThis.Float16Array !== "function";
    if (!shim) assert.equal(observed[name].ctorLength, entry.ctorLength, `${name} constructor length`);
    for (const [method, length] of Object.entries(entry.methods)) {
      if (method === "constructor" && shim) continue;
      if (observed[name].methods[method] === undefined) {
        assert.ok(expectedMissingMemberForNode(name, method), `${name}.${method} missing`);
        continue;
      }
      assert.equal(observed[name].methods[method], length, `${name}.${method} length`);
      compared += 1;
    }
  }
  assert.ok(compared > 3300, `only ${compared} method lengths compared`);
});

test("Edge 154 independent behavior and async fixtures match", async () => {
  const { buildProbeExpression } = await import("../src/infra/baseline/behavior-probes.js");
  const observed = await withSandbox(sandbox => sandbox.run(buildProbeExpression()).then(JSON.parse));
  // Registered ICU/V8 and dynamic iframe differences in edge-behavior-parity-test.js.
  const known = new Set(["intl/displaynames", "intl/invalid-locale", "realm/identity-bundle", "realm/foreign-native-toString"]);
  assert.deepEqual(Object.keys(observed).sort(), Object.keys(behavior.results).sort());
  for (const [id, expected] of Object.entries(behavior.results)) {
    if (!known.has(id)) assert.deepEqual(observed[id], expected, id);
  }
  const { buildAsyncProbeExpression } = await import("../src/infra/baseline/async-behavior-probes.js");
  const asyncObserved = await withSandbox(sandbox => sandbox.run(buildAsyncProbeExpression()).then(JSON.parse));
  assert.equal(asyncBehavior.probeCount, Object.keys(asyncBehavior.results).length);
  assert.deepEqual(asyncObserved, asyncBehavior.results);
});

test("Edge 154 new member semantics match independently collected Edge", async () => {
  const observed = await withSandbox(sandbox => sandbox.run(
    `JSON.stringify((${edge154MemberProbe.toString()})())`,
  ).then(JSON.parse));
  const expected = { ...memberBehavior.results };
  if (expectedMissingForNode("Iterator") !== null) expected.iterator = null;
  assert.deepEqual(observed, expected);
});

test("Edge 154 SVG constants and audio quantum retain measured values", async () => {
  const observed = await withSandbox(sandbox => sandbox.run(`JSON.stringify({
    svg: [SVGTextPathElement.TEXTPATH_SIDETYPE_UNKNOWN, SVGTextPathElement.TEXTPATH_SIDETYPE_LEFT,
      SVGTextPathElement.TEXTPATH_SIDETYPE_RIGHT],
    descriptors: ["UNKNOWN", "LEFT", "RIGHT"].map(key => {
      const name = "TEXTPATH_SIDETYPE_" + key;
      return Object.getOwnPropertyDescriptor(SVGTextPathElement, name);
    }),
    quantum: new OfflineAudioContext({ numberOfChannels: 1, length: 1, sampleRate: 44100 }).renderQuantumSize,
  })`).then(JSON.parse));
  assert.deepEqual(observed.svg, [0, 1, 2]);
  assert.deepEqual(observed.descriptors, [0, 1, 2].map(value => ({
    value, writable: false, enumerable: true, configurable: false,
  })));
  assert.equal(observed.quantum, 128);
});

test("Edge 152 does not expose Edge 154-only members or CSS", async () => {
  const observed = await withSandbox(sandbox => sandbox.run(`JSON.stringify({
    iterator: typeof globalThis.Iterator?.prototype?.join,
    svg: Object.hasOwn(SVGTextPathElement, "TEXTPATH_SIDETYPE_UNKNOWN"),
    autocorrect: Object.hasOwn(HTMLElement.prototype, "autocorrect"),
    width: Object.hasOwn(FontFace.prototype, "width"),
    quantum: Object.hasOwn(BaseAudioContext.prototype, "renderQuantumSize"),
    css: Object.getOwnPropertyNames(document.createElement("div").style),
  })`).then(JSON.parse), { fingerprint: edge152Fingerprint });
  assert.deepEqual(observed, { iterator: "undefined", svg: false, autocorrect: false,
    width: false, quantum: false, css: legacyCss });
});

test("Edge 154 CSS and UA-default fixtures cover the runtime baseline", async () => {
  assert.equal(css.count, css.names.length);
  assert.equal(uaDefaults.properties.length, css.names.length - uaDefaults.layoutDependentExcluded.length);
  const observed = await withSandbox(sandbox => sandbox.run(`JSON.stringify({
    css: Object.getOwnPropertyNames(document.createElement("div").style),
    bodyFont: getComputedStyle(document.body).fontFamily,
    language: navigator.language,
  })`).then(JSON.parse));
  assert.deepEqual(observed.css, css.names);
  assert.equal(observed.language, edge154Fingerprint.locale);
  assert.equal(observed.bodyFont, '"Noto Sans SC"');
});
