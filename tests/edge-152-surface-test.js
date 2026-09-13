import test from "node:test";
import assert from "node:assert/strict";

import { createSandbox } from "../src/public/create-sandbox.js";
import { edge150Fingerprint } from "../src/infra/fingerprint/edge-150.js";
import { edge151Fingerprint } from "../src/infra/fingerprint/edge-151.js";
import { edge152Fingerprint } from "../src/infra/fingerprint/edge-152.js";

async function withSandbox(fingerprint, callback) {
  const sandbox = await createSandbox("https://edge-152.test/", {
    fingerprint,
    page: { html: "<!doctype html><html><body></body></html>" },
    // 本测试验证 profile 门控，不做性能断言；并行跑全套时启动会超过默认 5s。
    limits: { timeoutMs: 30_000 },
  });
  try {
    return await callback(sandbox);
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

test("Edge 150, 151 and 152 gates do not leak across profiles", async () => {
  const observe = sandbox => sandbox.run(`JSON.stringify({
    node: typeof NodeRange,
    opaque: typeof OpaqueRange,
    permissions: typeof PermissionsPolicy,
    interaction: typeof InteractionContentfulPaint,
    cpu: typeof navigator.cpuPerformance,
    inputRange: typeof document.createElement("input").createValueRange,
    rangeParent: Object.getPrototypeOf(Range.prototype).constructor.name,
  })`);
  const v150 = JSON.parse(await withSandbox(edge150Fingerprint, observe));
  const v151 = JSON.parse(await withSandbox(edge151Fingerprint, observe));
  const v152 = JSON.parse(await withSandbox(edge152Fingerprint, observe));

  assert.deepEqual(v150, {
    node: "undefined",
    opaque: "undefined",
    permissions: "undefined",
    interaction: "undefined",
    cpu: "undefined",
    inputRange: "undefined",
    rangeParent: "AbstractRange",
  });
  assert.deepEqual(v151, {
    node: "undefined",
    opaque: "undefined",
    permissions: "undefined",
    interaction: "function",
    cpu: "undefined",
    inputRange: "undefined",
    rangeParent: "AbstractRange",
  });
  assert.deepEqual(v152, {
    node: "function",
    opaque: "function",
    permissions: "function",
    interaction: "function",
    cpu: "number",
    inputRange: "function",
    rangeParent: "NodeRange",
  });
});

test("Edge 152-only globals and Range inheritance are gated", async () => {
  const old = await withSandbox(edge151Fingerprint, sandbox => sandbox.run(`JSON.stringify({
    node: typeof NodeRange,
    opaque: typeof OpaqueRange,
    permissions: typeof PermissionsPolicy,
    abstract: Object.getOwnPropertyNames(AbstractRange.prototype),
    rangeParent: Object.getPrototypeOf(Range.prototype).constructor.name,
  })`));
  assert.deepEqual(JSON.parse(old), {
    node: "undefined",
    opaque: "undefined",
    permissions: "undefined",
    abstract: ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed", "constructor"],
    rangeParent: "AbstractRange",
  });

  const current = await withSandbox(edge152Fingerprint, sandbox => sandbox.run(`JSON.stringify({
    node: typeof NodeRange,
    opaque: typeof OpaqueRange,
    permissions: typeof PermissionsPolicy,
    abstract: Object.getOwnPropertyNames(AbstractRange.prototype),
    nodeMembers: Object.getOwnPropertyNames(NodeRange.prototype),
    rangeParent: Object.getPrototypeOf(Range.prototype).constructor.name,
    staticParent: Object.getPrototypeOf(StaticRange.prototype).constructor.name,
    policyAlias: FeaturePolicy === PermissionsPolicy,
    policyTag: Object.prototype.toString.call(document.featurePolicy),
  })`));
  assert.deepEqual(JSON.parse(current), {
    node: "function",
    opaque: "function",
    permissions: "function",
    abstract: ["startOffset", "endOffset", "collapsed", "constructor"],
    nodeMembers: ["startContainer", "endContainer", "constructor"],
    rangeParent: "NodeRange",
    staticParent: "NodeRange",
    policyAlias: true,
    policyTag: "[object PermissionsPolicy]",
  });
});

test("OpaqueRange and createValueRange match the Edge 152 contract", async () => {
  const observed = await withSandbox(edge152Fingerprint, sandbox => sandbox.run(`JSON.stringify((() => {
    const input = document.createElement("input");
    input.value = "hello";
    const range = input.createValueRange(1, 4);
    const before = {
      tag: Object.prototype.toString.call(range),
      opaque: range instanceof OpaqueRange,
      abstract: range instanceof AbstractRange,
      nodeRange: range instanceof NodeRange,
      start: range.startOffset,
      end: range.endOffset,
      collapsed: range.collapsed,
      hasContainer: "startContainer" in range,
      rects: range.getClientRects().length,
    };
    range.disconnect();
    const after = { start: range.startOffset, end: range.endOffset, collapsed: range.collapsed };
    let bounds = null;
    try { input.createValueRange(0, 99); } catch (error) { bounds = [error.name, error.message]; }
    input.type = "checkbox";
    let typeError = null;
    try { input.createValueRange(0, 0); } catch (error) { typeError = [error.name, error.message]; }
    return { before, after, bounds, typeError };
  })())`));
  const value = JSON.parse(observed);
  assert.deepEqual(value.before, {
    tag: "[object OpaqueRange]",
    opaque: true,
    abstract: true,
    nodeRange: false,
    start: 1,
    end: 4,
    collapsed: false,
    hasContainer: false,
    rects: 0,
  });
  assert.deepEqual(value.after, { start: 0, end: 0, collapsed: true });
  assert.equal(value.bounds[0], "IndexSizeError");
  assert.equal(value.typeError[0], "NotSupportedError");
});

test("Edge 152 adds the measured members and user-media element", async () => {
  const observed = await withSandbox(edge152Fingerprint, sandbox => sandbox.run(`JSON.stringify((() => {
    const input = document.createElement("input");
    const textarea = document.createElement("textarea");
    const template = document.createElement("template");
    template.setAttribute("shadowrootreferencetarget", "foo");
    template.setAttribute("shadowrootslotassignment", "manual");
    const host = document.createElement("div");
    const shadow = host.attachShadow({ mode: "open" });
    const userMedia = document.createElement("usermedia");
    return {
      cpu: navigator.cpuPerformance,
      inputRangeLength: input.createValueRange.length,
      textareaRangeLength: textarea.createValueRange.length,
      template: [template.shadowRootReferenceTarget, template.shadowRootSlotAssignment],
      shadow: shadow.referenceTarget,
      userMedia: [Object.prototype.toString.call(userMedia), userMedia.error, userMedia.stream, userMedia.setConstraints.length],
    };
  })())`));
  assert.deepEqual(JSON.parse(observed), {
    cpu: 4,
    inputRangeLength: 2,
    textareaRangeLength: 2,
    template: ["foo", "manual"],
    shadow: null,
    userMedia: ["[object HTMLUserMediaElement]", null, null, 0],
  });
});
