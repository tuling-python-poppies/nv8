import { createInterface } from "node:readline";
import { readFileSync } from "node:fs";
import { createAgentSession } from "../src/public/agent-session.js";

const session = await createAgentSession({
  agent: {
    agentId: process.env.NV8_AGENT_ID ?? "stdio",
    agentVersion: process.env.NV8_AGENT_VERSION ?? "unknown",
    agentCapabilities: (process.env.NV8_AGENT_CAPABILITIES ?? "")
      .split(",")
      .map(value => value.trim())
      .filter(Boolean),
  },
  sandbox: parseOptions(),
});

const input = createInterface({ input: process.stdin, crlfDelay: Infinity });
let chain = Promise.resolve();

input.on("line", line => {
  chain = chain.then(() => handleLine(line)).catch(error => writeError(null, error));
});
input.on("close", () => {
  chain = chain.then(() => session.close()).catch(() => {});
});

async function handleLine(line) {
  if (line.trim() === "") return;
  let request;
  try {
    request = JSON.parse(line);
  } catch (error) {
    writeError(null, new Error(`invalid JSON: ${error.message}`));
    return;
  }
  const id = request?.id ?? null;
  try {
    const value = await dispatch(request?.method, request?.params ?? {});
    write({ jsonrpc: "2.0", id, result: value });
  } catch (error) {
    writeError(id, error);
  }
}

async function dispatch(method, params) {
  switch (method) {
    case "session.describe":
      return session.snapshot;
    case "session.evaluate":
      return session.evaluate(params.source);
    case "session.observe":
      return session.observe();
    case "session.applyEnvironmentPatch":
      return session.applyEnvironmentPatch(params.patch);
    case "session.rollback":
      return session.rollback(params.targetVersion, params.reason);
    case "session.enableTrace":
      return session.enableTrace();
    case "session.disableTrace":
      return session.disableTrace();
    case "session.clearTrace":
      return session.clearTrace();
    case "session.watchApis":
      return session.watchApis(params.list);
    case "session.openInspector":
      return session.openInspector(params.options);
    case "session.close":
      await session.close();
      input.close();
      return { closed: true };
    default: {
      const error = new Error(`unknown method: ${method}`);
      error.code = "ERR_NV8_AGENT_METHOD_NOT_FOUND";
      throw error;
    }
  }
}

function parseOptions() {
  // 大 replay/evidence 配置会撞 Windows 32KB 环境变量上限，所以优先支持
  // 文件形式；NV8_SANDBOX_OPTIONS 只留给小配置（page 等）。
  const file = process.env.NV8_SANDBOX_OPTIONS_FILE;
  if (file !== undefined && file !== "") {
    let raw;
    try {
      raw = readFileSync(file, "utf8");
    } catch (error) {
      throw new TypeError(`cannot read NV8_SANDBOX_OPTIONS_FILE: ${error.message}`);
    }
    return parseJsonObject(raw, `NV8_SANDBOX_OPTIONS_FILE (${file})`);
  }
  const value = process.env.NV8_SANDBOX_OPTIONS;
  if (value === undefined) return {};
  return parseJsonObject(value, "NV8_SANDBOX_OPTIONS");
}

function parseJsonObject(raw, source) {
  try {
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new TypeError(`${source} must be a JSON object`);
    }
    return parsed;
  } catch (error) {
    throw new TypeError(`invalid ${source}: ${error.message}`);
  }
}

function writeError(id, error) {
  write({
    jsonrpc: "2.0",
    id,
    error: {
      code: error?.code ?? "ERR_NV8_AGENT_REQUEST",
      message: `${error?.message ?? error}`,
    },
  });
}

function write(value) {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}

// reader 关掉 stdout（如上游只读一行）时，EPIPE 应干净退出，不能抛未捕获错误。
process.stdout.on("error", error => {
  if (error?.code === "EPIPE") {
    session.close().finally(() => process.exit(0));
    return;
  }
  throw error;
});

process.once("SIGINT", () => session.close().finally(() => process.exit(0)));
process.once("SIGTERM", () => session.close().finally(() => process.exit(0)));
