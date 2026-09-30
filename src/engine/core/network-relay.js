import { Buffer } from "node:buffer";
import { spawn } from "node:child_process";

/**
 * 外部传输中继（opt-in，`networkRelay` 选项）：把 Realm 发出的 fetch/XHR
 * 交给自己启动的 helper 子进程真发网络请求，响应按原样回喂页面。
 *
 * 定位：离线 replay 的在线补充——页面 JS（风控逻辑、payload 构造、Worker
 * PoW）仍在本引擎里跑，网络层换成真实出口。默认不启用，启用时只接管
 * `origins` 前缀匹配的请求，其余请求返回 `null` 交回 replay 路径。
 *
 * 协议：JSON Lines over stdin/stdout（与 helper 的实现语言解耦）。
 *   宿主 → helper: { id, method, url, headers: [[name, value]], body: base64|null }
 *   helper → 宿主: { id, status, statusText, headers: [[name, value]], body: base64, url }
 *                  { id, error: string }
 *
 * 任何失败（启动失败 / 进程退出 / 超时 / 协议错误）都让该请求回退 replay，
 * 不把基础设施故障变成页面可见的网络异常。
 */
export function createNetworkRelay(config) {
  let child = null;
  let dead = false;
  let nextId = 1;
  let stdoutBuffer = "";
  let stderrTail = "";
  const pending = new Map();
  // helper 是外部进程（信任边界）：协议行最大 16MB，超出即判协议溢出，
  // 防止一个坏 helper 用无换行输出把子进程内存撑爆。
  const MAX_STDOUT_BUFFER_BYTES = 16 * 1024 * 1024;

  function matches(url) {
    return config.origins.some(prefix => url.startsWith(prefix));
  }

  function failPending(reason) {
    if (!dead) {
      dead = true;
      // 子进程的 stderr 会被父侧协议层收进故障诊断，这里只报一次原因。
      console.error(`[network-relay] ${reason}${stderrTail === "" ? "" : ` | helper stderr: ${stderrTail.slice(-400)}`}`);
    }
    for (const entry of pending.values()) {
      clearTimeout(entry.timer);
      entry.resolve(null);
    }
    pending.clear();
  }

  function start() {
    try {
      child = spawn(config.command[0], config.command.slice(1), {
        stdio: ["pipe", "pipe", "pipe"],
        windowsHide: true,
      });
    } catch (error) {
      failPending(`helper failed to spawn: ${error?.message ?? error}`);
      return;
    }
    child.on("error", error => failPending(`helper failed to spawn: ${error?.message ?? error}`));
    child.on("exit", code => failPending(`helper exited (code=${code})`));
    child.stdin?.on("error", error => failPending(`helper stdin failed: ${error?.message ?? error}`));
    child.stderr?.on("data", chunk => {
      stderrTail = `${stderrTail}${chunk}`.slice(-2000);
    });
    child.stdout?.on("data", chunk => {
      stdoutBuffer += chunk;
      if (stdoutBuffer.length > MAX_STDOUT_BUFFER_BYTES) {
        stdoutBuffer = "";
        failPending("helper protocol overflow (no newline within 16MB)");
        return;
      }
      let newline = stdoutBuffer.indexOf("\n");
      while (newline !== -1) {
        const line = stdoutBuffer.slice(0, newline);
        stdoutBuffer = stdoutBuffer.slice(newline + 1);
        if (line.trim() !== "") handleLine(line);
        newline = stdoutBuffer.indexOf("\n");
      }
    });
  }

  function handleLine(line) {
    let message;
    try {
      message = JSON.parse(line);
    } catch {
      return;
    }
    const entry = pending.get(message?.id);
    if (entry === undefined) return;
    pending.delete(message.id);
    clearTimeout(entry.timer);
    if (message.error !== undefined || message.status === undefined) {
      entry.resolve(null);
      return;
    }
    entry.resolve({
      status: Number(message.status),
      statusText: `${message.statusText ?? ""}`,
      headers: normalizeHeaderPairs(message.headers),
      body: message.body
        ? new Uint8Array(Buffer.from(message.body, "base64"))
        : new Uint8Array(0),
      url: message.url,
      redirected: false,
      type: "basic",
    });
  }

  async function fetch(request) {
    if (dead || !matches(`${request.url}`)) return null;
    if (child === null) start();
    if (dead) return null;
    const id = nextId;
    nextId += 1;
    const payload = `${JSON.stringify({
      id,
      method: request.method,
      url: request.url,
      headers: Object.entries(request.headers ?? {}).map(([name, value]) => [`${name}`, `${value}`]),
      body: request.body === null || request.body === undefined
        ? null
        : Buffer.from(request.body).toString("base64"),
    })}\n`;
    return await new Promise(resolve => {
      const timer = setTimeout(() => {
        pending.delete(id);
        resolve(null);
      }, config.timeoutMs);
      pending.set(id, { resolve, timer });
      child.stdin.write(payload, error => {
        if (error === null || error === undefined) return;
        const entry = pending.get(id);
        if (entry === undefined) return;
        pending.delete(id);
        clearTimeout(entry.timer);
        entry.resolve(null);
      });
    });
  }

  function dispose() {
    const current = child;
    child = null;
    for (const entry of pending.values()) {
      clearTimeout(entry.timer);
      entry.resolve(null);
    }
    pending.clear();
    dead = true;
    if (current !== null) {
      current.stdin?.end();
      current.kill();
    }
  }

  // 立即预热 helper（Python + curl_cffi 冷启动 1–2s），把启动开销移出首个命中
  // 请求的关键路径；未命中 origin 的请求仍然直接回退 replay，不做中继。
  start();

  return { fetch, dispose };
}

function normalizeHeaderPairs(headers) {
  if (Array.isArray(headers)) {
    return headers
      .filter(pair => Array.isArray(pair) && pair.length >= 2)
      .map(pair => [`${pair[0]}`, `${pair[1]}`]);
  }
  return Object.entries(headers ?? {}).map(([name, value]) => [`${name}`, `${value}`]);
}
