import { createInterface } from "node:readline";
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
  sandbox: parseOptions(process.env.NV8_SANDBOX_OPTIONS),
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

function parseOptions(value) {
  if (value === undefined) return {};
  try {
    const parsed = JSON.parse(value);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new TypeError("NV8_SANDBOX_OPTIONS must be a JSON object");
    }
    return parsed;
  } catch (error) {
    throw new TypeError(`invalid NV8_SANDBOX_OPTIONS: ${error.message}`);
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

process.once("SIGINT", () => session.close().finally(() => process.exit(0)));
process.once("SIGTERM", () => session.close().finally(() => process.exit(0)));
