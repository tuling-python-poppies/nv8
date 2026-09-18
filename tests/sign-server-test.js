import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import readline from "node:readline";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const server = path.join(root, "examples", "sign-server.mjs");

test("generic sign server serializes calls and isolates sessions", async () => {
  const temp = await mkdtemp(path.join(tmpdir(), "nv8-sign-server-"));
  const script = path.join(temp, "target.js");
  const resource = path.join(temp, "config.json");
  await writeFile(resource, JSON.stringify({ source: "named-resource" }), "utf8");
  await writeFile(script, `
globalThis.__init = async function (name) {
  document.cookie = "session=" + name + "; path=/";
  localStorage.setItem("session", name);
  return { initialized: name };
};
globalThis.__reset = function () {
  document.cookie = "reset=1; path=/";
  return "reset";
};
globalThis.__sign = async function (value) {
  await Promise.resolve();
  globalThis.__calls = (globalThis.__calls || 0) + 1;
  return {
    value: value,
    call: globalThis.__calls,
    cookie: document.cookie,
    config: require("fs").readFileSync("config.json", "utf8"),
  };
};
`, "utf8");

  const child = spawn(process.execPath, [
    server,
    "--script", script,
    "--asset", `config.json=${resource}`,
    "--init-entry", "__init",
    "--reset-entry", "__reset",
  ], { cwd: root, stdio: ["pipe", "pipe", "pipe"] });
  const stdout = readline.createInterface({ input: child.stdout });
  const stderr = readline.createInterface({ input: child.stderr });
  const lines = [];
  stderr.on("line", line => lines.push(line));
  const ready = new Promise((resolve, reject) => {
    const onLine = line => {
      if (line.startsWith("[sign-server] ready")) {
        stderr.off("line", onLine);
        resolve(line);
      }
    };
    stderr.on("line", onLine);
    child.once("error", reject);
  });
  const responses = [];
  const pending = new Map();
  child.on("error", error => {
    for (const { reject } of pending.values()) reject(error);
    pending.clear();
  });
  stdout.on("line", line => {
    const response = JSON.parse(line);
    pending.get(response.id)?.resolve(response);
    pending.delete(response.id);
  });
  const request = async (id, action, fields = {}) => {
    const responsePromise = new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
    });
    child.stdin.write(`${JSON.stringify({ id, action, ...fields })}\n`);
    const response = await responsePromise;
    responses.push(response);
    assert.equal(response.id, id);
    assert.equal(response.ok, true, JSON.stringify(response));
    return response.value;
  };

  try {
    await ready;
    const ping = await request(1, "ping");
    assert.deepEqual(ping.sessions, ["default"]);

    const [first, second] = await Promise.all([
      request(2, "sign", { args: [null] }),
      request(3, "sign", { args: ["second"] }),
    ]);
    assert.equal(first.kind, "object");
    assert.equal(first.result.value, null);
    assert.equal(first.result.call, 1);
    assert.equal(second.result.call, 2);
    assert.match(first.result.config, /named-resource/);

    const mapped = await request(4, "sign", {
      args: [null],
      mapNullToUndefined: true,
    });
    assert.equal(mapped.result.value, undefined);

    await request(5, "session", {
      op: "create",
      sessionId: "alpha",
      state: { cookies: { seed: "alpha" } },
      init: true,
      initArgs: ["alpha"],
    });
    const alpha = await request(6, "sign", {
      sessionId: "alpha",
      args: ["alpha"],
    });
    assert.match(alpha.result.cookie, /seed=alpha/);
    assert.match(alpha.result.cookie, /session=alpha/);
    assert.equal(alpha.result.call, 1);

    const health = await request(7, "health", { sessionId: "alpha" });
    assert.equal(health.result.healthy, true);
    const exported = await request(8, "session", {
      op: "export",
      sessionId: "alpha",
    });
    assert.match(exported.cookies, /session=alpha/);

    const reset = await request(9, "reset", { sessionId: "alpha" });
    assert.equal(reset.kind, "string");
    assert.equal(reset.result, "reset");
    const afterReset = await request(10, "sign", {
      sessionId: "alpha",
      args: ["after-reset"],
    });
    assert.match(afterReset.result.cookie, /reset=1/);

    const close = await request(11, "close");
    assert.deepEqual(close, { closed: true });
    await once(child, "exit");
  } finally {
    stdout.close();
    stderr.close();
    if (child.exitCode === null) child.kill();
    await rm(temp, { recursive: true, force: true });
  }
});
