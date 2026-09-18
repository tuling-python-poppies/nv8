/**
 * Generic resident signing server (stdio JSON-lines protocol).
 *
 * Startup:
 *   node examples/sign-server.mjs --script target.js --asset app.wasm=app.wasm
 *
 * Request actions:
 *   ping, init, sign, eval, reset, health, reload, session, close
 *
 * Every request is serialized before it touches a Realm. Sessions own their
 * Sandbox, so cookies, storage, globals and stateful SDKs do not cross paths.
 */

import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { EdgeSandbox } from "nv8";

const VM_FLAG = "--experimental-vm-modules";
const DEFAULT_SESSION = "default";
const RESOURCE_KINDS = new Set(["binary", "wasm", "text", "json"]);

function ensureVmFlagThenExit() {
  const hasFlag = process.execArgv.includes(VM_FLAG)
    || (process.env.NODE_OPTIONS ?? "").includes(VM_FLAG);
  if (hasFlag) return false;
  const child = spawn(
    process.execPath,
    [VM_FLAG, ...process.argv.slice(1)],
    { stdio: ["pipe", "pipe", "pipe"], env: process.env },
  );
  process.stdin.pipe(child.stdin);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  child.on("exit", code => process.exit(code ?? 1));
  return true;
}

function inferResourceKind(name) {
  const extension = path.extname(name).toLowerCase();
  if (extension === ".wasm") return "wasm";
  if (extension === ".json") return "json";
  if ([".txt", ".js", ".mjs", ".cjs", ".css", ".html"].includes(extension)) {
    return "text";
  }
  return "binary";
}

function parseNamedSpec(spec, label) {
  const separator = spec.indexOf("=");
  if (separator <= 0 || separator === spec.length - 1) {
    throw new Error(`${label} must be name=value, received: ${spec}`);
  }
  return {
    name: path.basename(spec.slice(0, separator)),
    value: spec.slice(separator + 1),
  };
}

function parseArgs(argv) {
  const options = {
    script: null,
    assets: [],
    assetKinds: new Map(),
    pageUrl: "https://example.test/",
    pageReferrer: "",
    backend: "child-process",
    signEntry: "__sign",
    initEntry: null,
    resetEntry: null,
    healthEntry: null,
    warmupTimeoutMs: 20_000,
    timeoutMs: 60_000,
    maxSourceBytes: 4 * 1024 * 1024,
    maxOutputBytes: 2 * 1024 * 1024,
    maxSessions: 8,
    mapNullToUndefined: false,
  };

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => argv[++index];
    if (arg === "--script") options.script = next();
    else if (arg === "--asset") options.assets.push(next());
    else if (arg === "--asset-kind") {
      const entry = parseNamedSpec(next(), "--asset-kind");
      if (!RESOURCE_KINDS.has(entry.value)) {
        throw new Error(`unknown resource kind: ${entry.value}`);
      }
      options.assetKinds.set(entry.name, entry.value);
    } else if (arg === "--page-url") options.pageUrl = next();
    else if (arg === "--page-referrer") options.pageReferrer = next();
    else if (arg === "--backend") options.backend = next();
    else if (arg === "--sign-entry") options.signEntry = next();
    else if (arg === "--no-sign-entry") options.signEntry = null;
    else if (arg === "--init-entry") options.initEntry = next();
    else if (arg === "--reset-entry") options.resetEntry = next();
    else if (arg === "--health-entry") options.healthEntry = next();
    else if (arg === "--warmup-timeout-ms") options.warmupTimeoutMs = Number(next());
    else if (arg === "--timeout-ms") options.timeoutMs = Number(next());
    else if (arg === "--max-sessions") options.maxSessions = Number(next());
    else if (arg === "--map-null-to-undefined") options.mapNullToUndefined = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  if (options.script === null) throw new Error("--script <path> is required");
  if (!Number.isInteger(options.maxSessions) || options.maxSessions < 1) {
    throw new Error("--max-sessions must be a positive integer");
  }

  options.assets = options.assets.map(spec => {
    const entry = parseNamedSpec(spec, "--asset");
    return {
      name: entry.name,
      filePath: path.resolve(entry.value),
      kind: options.assetKinds.get(entry.name) ?? inferResourceKind(entry.name),
    };
  });
  options.script = path.resolve(options.script);
  return options;
}

function json(value) {
  return JSON.stringify(value);
}

function buildSetupSource(resources, sessionId, sessionState) {
  const descriptors = resources.map(({ name, kind }) => ({ name, kind }));
  return `
globalThis.__logs = [];
(function () {
  var originalLog = console.log.bind(console);
  console.log = function () {
    try {
      var text = Array.prototype.map.call(arguments, function (value) {
        if (typeof value === "string") return value;
        if (value instanceof Error) return value.stack || String(value);
        try { return JSON.stringify(value); } catch (e) { return String(value); }
      }).join(" ");
      globalThis.__logs.push(text);
    } catch (e) {}
    return originalLog.apply(console, arguments);
  };
})();
if (typeof globalThis.global === "undefined") {
  try { globalThis.global = globalThis; } catch (e) {}
}
if (typeof globalThis.A === "undefined") {
  try { globalThis.A = globalThis; } catch (e) {}
}
globalThis.__nv8SessionId = ${json(sessionId)};
globalThis.__nv8Session = ${json(sessionState ?? {})};
globalThis.__nv8Resources = Object.create(null);
globalThis.__nv8Assets = Object.create(null);
(function (payload) {
  var descriptors = ${json(descriptors)};
  for (var i = 0; i < descriptors.length; i++) {
    var descriptor = descriptors[i];
    if (!Object.prototype.hasOwnProperty.call(payload, descriptor.name)) {
      throw new Error("missing payload resource " + descriptor.name);
    }
    var bytes = new Uint8Array(payload[descriptor.name]);
    var resource = Object.freeze({
      name: descriptor.name,
      kind: descriptor.kind,
      bytes: bytes,
    });
    globalThis.__nv8Resources[descriptor.name] = resource;
    globalThis.__nv8Assets[descriptor.name] = bytes;
  }
})(globalThis.__nv8Payload || {});
(function () {
  function setCookie(name, value) {
    document.cookie = String(name) + "=" + String(value) + "; path=/";
  }
  var state = globalThis.__nv8Session || {};
  if (typeof state.cookies === "string") document.cookie = state.cookies;
  else if (state.cookies && typeof state.cookies === "object") {
    if (Array.isArray(state.cookies)) {
      state.cookies.forEach(function (entry) { setCookie(entry.name, entry.value); });
    } else {
      Object.keys(state.cookies).forEach(function (name) { setCookie(name, state.cookies[name]); });
    }
  }
  function seedStorage(storage, values) {
    if (!values || typeof values !== "object") return;
    Object.keys(values).forEach(function (key) { storage.setItem(key, String(values[key])); });
  }
  if (state.localStorage) seedStorage(localStorage, state.localStorage);
  if (state.sessionStorage) seedStorage(sessionStorage, state.sessionStorage);
})();
globalThis.require = function (name) {
  if (name !== "fs" && name !== "node:fs") {
    throw new Error("Cannot find module '" + name + "'");
  }
  return {
    readFileSync: function (filePath, options) {
      var raw = String(filePath);
      var base = raw.split(/[\\\\/]/).pop();
      var resource = globalThis.__nv8Resources[raw] || globalThis.__nv8Resources[base];
      if (!resource) throw new Error("no resource registered for " + raw);
      var encoding = typeof options === "string"
        ? options
        : options && typeof options.encoding === "string" ? options.encoding : null;
      if (encoding === "utf8" || encoding === "utf-8") {
        return new TextDecoder("utf-8").decode(resource.bytes);
      }
      return resource.bytes;
    },
  };
};
JSON.stringify({
  sessionId: globalThis.__nv8SessionId,
  resources: Object.keys(globalThis.__nv8Resources),
});
`;
}

function buildCallSource(entry, args, mapNullToUndefined, resultFormat = "json") {
  if (resultFormat !== "json" && resultFormat !== "entries") {
    throw new Error(`resultFormat must be json or entries, received: ${resultFormat}`);
  }
  const mappedArgs = `${json(Array.isArray(args) ? args : [])}.map(function (value) {
    return value === null && ${mapNullToUndefined ? "true" : "false"} ? undefined : value;
  })`;
  return `(async function () {
  var fn = globalThis[${json(entry)}];
  if (typeof fn !== "function") throw new Error("entry is not a function: " + ${json(entry)});
  var value = await fn.apply(null, ${mappedArgs});
  var kind = value === null ? "null" : typeof value;
  if (${json(resultFormat)} === "entries") value = Object.fromEntries(value);
  var output = { kind: kind };
  if (kind !== "undefined" && kind !== "function" && kind !== "symbol") output.result = value;
  return JSON.stringify(output);
})()`;
}

function decodeCallResult(raw) {
  const value = typeof raw === "string" ? JSON.parse(raw) : raw;
  if (value === null || typeof value !== "object" || typeof value.kind !== "string") {
    throw new Error("target entry returned an invalid transport value");
  }
  return value;
}

function formatError(error) {
  return error?.message ?? String(error);
}

function cloneState(state) {
  return state === undefined ? {} : JSON.parse(JSON.stringify(state));
}

class SignTarget {
  constructor(options) {
    this.options = options;
    this.sessions = new Map();
    this.scriptSource = null;
    this.resourcePayload = null;
    this.resourceDescriptors = null;
  }

  async loadSources() {
    if (this.scriptSource !== null) return;
    this.scriptSource = await readFile(this.options.script, "utf8");
    this.resourcePayload = {};
    for (const asset of this.options.assets) {
      this.resourcePayload[asset.name] = await readFile(asset.filePath);
    }
    this.resourceDescriptors = this.options.assets.map(({ name, kind }) => ({ name, kind }));
  }

  async createSession(sessionId = DEFAULT_SESSION, state = {}) {
    if (typeof sessionId !== "string" || sessionId.length === 0) {
      throw new Error("sessionId must be a non-empty string");
    }
    if (this.sessions.has(sessionId)) throw new Error(`session already exists: ${sessionId}`);
    if (this.sessions.size >= this.options.maxSessions) {
      throw new Error(`maximum sessions reached: ${this.options.maxSessions}`);
    }
    await this.loadSources();
    const sandbox = await EdgeSandbox.create({
      page: {
        url: this.options.pageUrl,
        html: "<!doctype html><html><head></head><body></body></html>",
        referrer: this.options.pageReferrer || undefined,
      },
      execution: { backend: this.options.backend, restart: "restart" },
      limits: {
        timeoutMs: this.options.timeoutMs,
        maxSourceBytes: this.options.maxSourceBytes,
        maxOutputBytes: this.options.maxOutputBytes,
      },
    });
    const initialState = cloneState(state);
    const setupSource = buildSetupSource(this.resourceDescriptors, sessionId, initialState);
    try {
      const setupResult = await sandbox.evaluateWithPayload(setupSource, this.resourcePayload);
      this.assertEvaluation(setupResult, "setup");
      const sourceResult = await sandbox.evaluate(this.scriptSource);
      this.assertEvaluation(sourceResult, "target script");
      await this.waitForEntry(sandbox, this.options.signEntry);
      const session = {
        id: sessionId,
        sandbox,
        state: initialState,
        initialState,
        initialized: false,
        warmupMs: 0,
      };
      this.sessions.set(sessionId, session);
      return session;
    } catch (error) {
      await sandbox.close().catch(() => {});
      throw error;
    }
  }

  async waitForEntry(sandbox, entry) {
    if (entry === null) return;
    const deadline = Date.now() + this.options.warmupTimeoutMs;
    const probe = `typeof globalThis[${json(entry)}]`;
    for (;;) {
      const result = await sandbox.evaluate(probe);
      this.assertEvaluation(result, "entry probe");
      if (result.value === "function") return;
      if (Date.now() > deadline) {
        throw new Error(`sign entry ${entry} not ready within ${this.options.warmupTimeoutMs}ms`);
      }
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  assertEvaluation(result, label) {
    if (result.error !== null && result.error !== undefined) {
      throw new Error(`${label} failed: ${formatError(result.error)}`);
    }
  }

  async session(sessionId = DEFAULT_SESSION) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`unknown session: ${sessionId}`);
    return session;
  }

  async call(request, entry, sessionId = DEFAULT_SESSION) {
    const session = await this.session(sessionId);
    const mapNull = request.mapNullToUndefined === undefined
      ? this.options.mapNullToUndefined
      : request.mapNullToUndefined === true;
    const result = await session.sandbox.evaluate(
      buildCallSource(entry, request.args, mapNull, request.resultFormat),
    );
    this.assertEvaluation(result, `${entry} call`);
    return decodeCallResult(result.value);
  }

  isFatal(error) {
    const text = `${error?.code ?? ""} ${error?.message ?? ""}`;
    return /timed out|ERR_SCRIPT_EXECUTION_TIMEOUT|lifecycle|closed/i.test(text);
  }

  async sign(request) {
    const entry = request.signEntry ?? this.options.signEntry;
    if (entry === null) throw new Error("sign entry is disabled");
    try {
      return await this.call(request, entry, request.sessionId);
    } catch (error) {
      if (this.isFatal(error)) {
        const sessionId = request.sessionId ?? DEFAULT_SESSION;
        if (this.sessions.has(sessionId)) {
          await this.reloadSession(sessionId).catch(() => {});
        }
      }
      throw error;
    }
  }

  async init(request) {
    const entry = request.initEntry ?? this.options.initEntry;
    if (entry === null) throw new Error("init entry is not configured");
    const sessionId = request.sessionId ?? DEFAULT_SESSION;
    const session = await this.session(sessionId);
    const result = await this.call(request, entry, sessionId);
    session.initialized = true;
    return result;
  }

  async reset(request) {
    const sessionId = request.sessionId ?? DEFAULT_SESSION;
    const entry = request.resetEntry ?? this.options.resetEntry;
    if (entry !== null) return this.call(request, entry, sessionId);
    const session = await this.session(sessionId);
    await this.reloadSession(sessionId, request.state ?? session.initialState);
    return { kind: "object", result: { reloaded: true, sessionId } };
  }

  async health(request) {
    const sessionId = request.sessionId ?? DEFAULT_SESSION;
    const session = await this.session(sessionId);
    if (request.healthEntry ?? this.options.healthEntry) {
      return this.call(request, request.healthEntry ?? this.options.healthEntry, sessionId);
    }
    return {
      kind: "object",
      result: {
        healthy: true,
        sessionId,
        initialized: session.initialized,
        warmupMs: session.warmupMs,
      },
    };
  }

  async evalSource(request) {
    const session = await this.session(request.sessionId ?? DEFAULT_SESSION);
    const result = await session.sandbox.evaluate(String(request.source ?? ""));
    this.assertEvaluation(result, "eval");
    return { kind: result.type, result: result.value };
  }

  async exportSession(sessionId = DEFAULT_SESSION) {
    const session = await this.session(sessionId);
    const result = await session.sandbox.evaluate(`JSON.stringify({
      cookies: document.cookie,
      localStorage: Object.fromEntries(Object.keys(localStorage).map(function (key) {
        return [key, localStorage.getItem(key)];
      })),
      sessionStorage: Object.fromEntries(Object.keys(sessionStorage).map(function (key) {
        return [key, sessionStorage.getItem(key)];
      })),
    })`);
    this.assertEvaluation(result, "session export");
    const state = JSON.parse(result.value);
    session.state = state;
    return state;
  }

  async reloadSession(sessionId = DEFAULT_SESSION, state) {
    const current = this.sessions.get(sessionId);
    const nextState = state === undefined
      ? await this.exportSession(sessionId).catch(() => current?.state ?? {})
      : state;
    const initialState = current?.initialState ?? {};
    await this.closeSession(sessionId);
    const startedAt = Date.now();
    const session = await this.createSession(sessionId, nextState);
    session.initialState = initialState;
    session.warmupMs = Date.now() - startedAt;
    return session;
  }

  async closeSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    this.sessions.delete(sessionId);
    await session.sandbox.close().catch(() => {});
  }

  async close() {
    const ids = [...this.sessions.keys()];
    for (const sessionId of ids) await this.closeSession(sessionId);
  }
}

async function main() {
  const options = parseArgs(process.argv);
  const target = new SignTarget(options);
  const startedAt = Date.now();
  const defaultSession = await target.createSession();
  defaultSession.warmupMs = Date.now() - startedAt;
  process.stderr.write(
    `[sign-server] ready in ${defaultSession.warmupMs}ms `
    + `(backend=${options.backend}, entry=${options.signEntry ?? "none"})\n`,
  );

  const respond = payload => process.stdout.write(`${JSON.stringify(payload)}\n`);
  let buffer = "";
  let closing = false;
  let queue = Promise.resolve();

  async function handleLine(line) {
    let request;
    try {
      request = JSON.parse(line);
    } catch (error) {
      respond({ id: null, ok: false, error: `invalid json: ${formatError(error)}` });
      return;
    }
    const id = request.id ?? null;
    const started = Date.now();
    try {
      let value;
      switch (request.action) {
        case "ping":
          value = {
            pong: true,
            sessions: [...target.sessions.keys()],
            maxSessions: options.maxSessions,
          };
          break;
        case "init":
          value = await target.init(request);
          break;
        case "sign": {
          const signed = await target.sign(request);
          value = { ...signed, elapsedMs: Date.now() - started };
          break;
        }
        case "eval":
          value = await target.evalSource(request);
          break;
        case "reset":
          value = await target.reset(request);
          break;
        case "health":
          value = await target.health(request);
          break;
        case "reload": {
          const session = await target.reloadSession(
            request.sessionId ?? DEFAULT_SESSION,
            request.state,
          );
          value = { reloaded: true, sessionId: session.id, warmupMs: session.warmupMs };
          break;
        }
        case "session": {
          const operation = request.op ?? "list";
          const sessionId = request.sessionId ?? DEFAULT_SESSION;
          if (operation === "list") {
            value = { sessions: [...target.sessions.keys()] };
          } else if (operation === "create") {
            const session = await target.createSession(sessionId, request.state ?? {});
            session.warmupMs = Date.now() - started;
            if (request.init === true || Array.isArray(request.initArgs)) {
              const initRequest = { ...request, args: request.initArgs ?? [] };
              await target.init(initRequest);
            }
            value = { sessionId, created: true, warmupMs: session.warmupMs };
          } else if (operation === "reset") {
            value = await target.reset(request);
          } else if (operation === "close") {
            await target.closeSession(sessionId);
            value = { sessionId, closed: true };
          } else if (operation === "export") {
            value = await target.exportSession(sessionId);
          } else {
            throw new Error(`unknown session operation: ${operation}`);
          }
          break;
        }
        case "close":
          await target.close();
          respond({ id, ok: true, value: { closed: true } });
          process.exit(0);
          return;
        default:
          throw new Error(`unknown action: ${request.action}`);
      }
      respond({ id, ok: true, value, elapsedMs: Date.now() - started });
    } catch (error) {
      respond({
        id,
        ok: false,
        error: formatError(error),
        code: error?.code ?? null,
        elapsedMs: Date.now() - started,
      });
    }
  }

  process.stdin.setEncoding("utf8");
  process.stdin.on("data", chunk => {
    buffer += chunk;
    for (;;) {
      const newline = buffer.indexOf("\n");
      if (newline === -1) break;
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (line === "") continue;
      queue = queue.catch(() => {}).then(() => handleLine(line));
    }
  });
  process.stdin.on("end", () => {
    closing = true;
    queue.finally(async () => {
      if (closing) await target.close();
    }).catch(() => {});
  });
}

if (ensureVmFlagThenExit()) {
  // The child process owns the actual server after the VM flag handoff.
} else {
  await main();
}
