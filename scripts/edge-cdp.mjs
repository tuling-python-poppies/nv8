/**
 * 一次性数据采集用的最小 Edge CDP 客户端。
 *
 * `--dump-dom` 会在 ServiceWorker 注册/激活完成前冻结虚拟时间，不能采异步
 * 生命周期。这里用远程调试协议等待真实 Promise，不把 Puppeteer 引进运行时。
 */

import http from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import path from 'node:path';
import { edgeTempDir } from './edge-temp-dir.mjs';

function toWinPath(filePath) {
  if (!filePath.startsWith('/mnt/')) return filePath;
  const [, , drive, ...rest] = filePath.split('/');
  return `${drive.toUpperCase()}:\\${rest.join('\\')}`;
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, response => {
      let body = '';
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => {
        if (response.statusCode !== 200) {
          reject(new Error(`CDP HTTP ${response.statusCode}`));
          return;
        }
        resolve(JSON.parse(body));
      });
    });
    request.on('error', reject);
    request.setTimeout(1000, () => {
      request.destroy(new Error('CDP HTTP timeout'));
    });
  });
}

function connectWebSocket(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    const timer = setTimeout(() => {
      socket.close();
      reject(new Error('CDP WebSocket timeout'));
    }, timeoutMs);
    socket.addEventListener('open', () => {
      clearTimeout(timer);
      resolve(socket);
    }, { once: true });
    socket.addEventListener('error', () => {
      clearTimeout(timer);
      reject(new Error('CDP WebSocket error'));
    }, { once: true });
  });
}

/**
 * @param {string} edgePath
 * @param {{ debuggingPort?: number, timeoutMs?: number }} [options]
 */
export async function launchEdgeCdp(edgePath, options = {}) {
  const timeoutMs = options.timeoutMs ?? 20_000;
  const profileDir = mkdtempSync(path.join(edgeTempDir(edgePath), 'nv8-cdp-'));
  const port = options.debuggingPort ?? (9200 + Math.floor(Math.random() * 700));
  const child = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--no-first-run',
    '--disable-default-apps',
    '--disable-sync',
    '--remote-debugging-address=127.0.0.1',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${toWinPath(profileDir)}`,
    'about:blank',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  let version;
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      version = await getJson(`http://127.0.0.1:${port}/json/version`);
      break;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  if (version === undefined) {
    child.kill();
    throw new Error(`Edge CDP did not come up on port ${port}`);
  }

  const socket = await connectWebSocket(version.webSocketDebuggerUrl, timeoutMs);
  let nextId = 1;
  const pending = new Map();
  const events = [];
  socket.addEventListener('message', event => {
    const message = JSON.parse(String(event.data));
    if (message.id !== undefined) {
      pending.get(message.id)?.(message);
      return;
    }
    events.push(message);
  });

  function call(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
      const id = nextId;
      nextId += 1;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`CDP timeout ${method}`));
      }, timeoutMs);
      pending.set(id, message => {
        clearTimeout(timer);
        pending.delete(id);
        if (message.error !== undefined) {
          reject(new Error(`${method}: ${JSON.stringify(message.error)}`));
          return;
        }
        resolve(message.result);
      });
      socket.send(JSON.stringify({
        id,
        method,
        params,
        ...(sessionId === undefined ? {} : { sessionId }),
      }));
    });
  }

  function waitEvent(method, sessionId) {
    const started = Date.now();
    return new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        const found = events.find(entry => (
          entry.method === method && entry.sessionId === sessionId
        ));
        if (found !== undefined) {
          clearInterval(timer);
          resolve(found);
          return;
        }
        if (Date.now() - started > timeoutMs) {
          clearInterval(timer);
          reject(new Error(`CDP event timeout ${method}`));
        }
      }, 15);
    });
  }

  async function evaluate(sessionId, expression) {
    const result = await call('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    }, sessionId);
    if (result.exceptionDetails !== undefined) {
      throw new Error(result.exceptionDetails.exception?.description
        ?? result.exceptionDetails.text
        ?? 'Runtime.evaluate failed');
    }
    return result.result?.value;
  }

  async function openPage(url) {
    const created = await call('Target.createTarget', { url: 'about:blank' });
    const attached = await call('Target.attachToTarget', {
      targetId: created.targetId,
      flatten: true,
    });
    const sessionId = attached.sessionId;
    await call('Page.enable', {}, sessionId);
    await call('Runtime.enable', {}, sessionId);
    const loaded = waitEvent('Page.loadEventFired', sessionId);
    await call('Page.navigate', { url }, sessionId);
    await loaded;
    return sessionId;
  }

  async function close() {
    try {
      await call('Browser.close');
    } catch {
      child.kill();
    }
    try {
      socket.close();
    } catch {
      // already closed
    }
    await new Promise(resolve => setTimeout(resolve, 200));
    try {
      rmSync(profileDir, { recursive: true, force: true });
    } catch {
      // Windows 可能短暂锁住 user-data-dir
    }
  }

  return {
    browser: version.Browser,
    userAgent: version['User-Agent'],
    evaluate,
    openPage,
    close,
  };
}
