import assert from "node:assert/strict";
import test from "node:test";
import { EdgeSandbox } from "../src/index.js";
import { waitUntil } from "./helpers/async-wait.js";

test("legacy parser executes replay-backed blocking external scripts", async () => {
  const sandbox = await EdgeSandbox.create({
    page: {
      url: "https://example.test/",
      html: `<!doctype html><html><head>
        <script>
          globalThis.events = [];
          globalThis.events.push(document.currentScript?.getAttribute("src") ?? "inline");
        </script>
        <script src="/blocking.js"></script>
        <script>globalThis.afterExternal = globalThis.externalValue;</script>
      </head><body></body></html>`,
    },
    replay: [{
      method: "GET",
      url: "https://example.test/blocking.js",
      body: `globalThis.externalValue = "ran";
        globalThis.parserContext = [document.readyState, document.body === null];
        globalThis.events.push(document.currentScript?.getAttribute("src"));`,
    }],
  });
  try {
    const result = await sandbox.evaluate(`JSON.stringify({ events, afterExternal })`);
    assert.deepEqual(JSON.parse(result.value), {
      events: ["inline", "/blocking.js"],
      afterExternal: "ran",
    });
    assert.deepEqual(JSON.parse((await sandbox.evaluate('JSON.stringify(parserContext)')).value), ['loading', true]);
    assert.equal((await sandbox.evaluate('document.currentScript')).value, null);
    assert.equal((await sandbox.evaluate('document.readyState')).value, 'complete');
    const requests = await sandbox.networkRequests();
    assert.deepEqual(requests.map(({ api, outcome }) => [api, outcome]), [['script', 'replayed']]);
  } finally {
    await sandbox.close();
  }
});

test("legacy script failures respect replay limits and allow parsing to continue", async () => {
  const sandbox = await EdgeSandbox.create({
    page: {
      url: "https://example.test/page",
      html: `<!doctype html><html><head>
        <script>globalThis.events = []; globalThis.runs = 0;</script>
        <script src="https://example.test/assets/once.js" onload="events.push('loaded')"></script>
        <script src="https://example.test/assets/once.js" onerror="events.push('exhausted')"></script>
        <script src="https://example.test/assets/missing.js" onerror="events.push('missing')"></script>
        <script src="https://example.test/assets/failed.js" onerror="events.push('status')"></script>
        <script src="" onerror="events.push('empty')">runs += 100;</script>
        <script type="application/json" src="data.js">runs += 100;</script>
        <script>events.push('after');</script>
      </head><body></body></html>`,
    },
    replay: [
      { url: "https://example.test/assets/once.js", body: "runs += 1;", repeat: "once" },
      { url: "https://example.test/assets/failed.js", status: 404, body: "runs += 100;" },
    ],
  });
  try {
    const result = await sandbox.evaluate('JSON.stringify({ events, runs, ready: document.readyState, current: document.currentScript })');
    assert.deepEqual(JSON.parse(result.value), {
      events: ['loaded', 'exhausted', 'missing', 'status', 'empty', 'after'],
      runs: 1,
      ready: 'complete',
      current: null,
    });
    assert.deepEqual((await sandbox.networkRequests()).map(({ outcome }) => outcome), [
      'replayed', 'replay-miss:exhausted', 'replay-miss:missing', 'replayed',
    ]);
  } finally {
    await sandbox.close();
  }
});

test("replayed Set-Cookie reaches later same-origin XHR requests", async () => {
  const sandbox = await EdgeSandbox.create({
    page: {
      url: "https://example.test/",
      html: `<!doctype html><html><head><script>
        globalThis.seenCookie = '';
        fetch('/seed').then(() => fetch('/next')).then(() => {
          globalThis.seenCookie = 'done';
        });
      </script></head><body></body></html>`,
    },
    replay: [
      {
        method: "GET",
        url: "https://example.test/seed",
        headers: { "set-cookie": "SHGTSESSIONID=round-1; Path=/; HttpOnly" },
        body: "{}",
      },
      { method: "GET", url: "https://example.test/next", body: "{}" },
    ],
  });
  try {
    await waitUntil(
      async () => (await sandbox.evaluate("seenCookie")).value === "done",
      { label: "replayed cookie request chain" },
    );
    assert.equal((await sandbox.evaluate("seenCookie")).value, "done");
    const next = (await sandbox.networkRequests()).find(request => request.url.endsWith("/next"));
    assert.equal(next.headers.find(([name]) => name === "cookie")?.[1], "SHGTSESSIONID=round-1");
    assert.equal((await sandbox.evaluate("document.cookie")).value, "");
  } finally {
    await sandbox.close();
  }
});
