import vm from 'node:vm';
import { Buffer } from 'node:buffer';
import { createDynamicImporter } from '../realm/dynamic-import.js';
import { normalizeScriptPolicy, scriptPolicyAllows } from './script-policy.js';

/**
 * 判定 vm 的超时错误。
 *
 * vm.runInContext 超过 timeout 时抛 `ERR_SCRIPT_EXECUTION_TIMEOUT`。
 * 各 Node 版本的 message 不完全一致，因此以 code 为主、message 兜底。
 *
 * @param {unknown} error
 * @returns {boolean}
 */
function isTimeoutError(error) {
  return error?.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT'
    || /Script execution timed out/.test(`${error?.message ?? ''}`);
}

/**
 * 给脚本错误补充结构化字段，供 error 事件与上层错误边界消费（IKF39T）。
 *
 * 不覆盖已有的 code/cause：安装器抛出的策略错误（
 * ERR_NV8_SCRIPT_POLICY_REJECTED 等）必须原样透传。
 *
 * @param {unknown} error
 * @returns {Error}
 */
function normalizeScriptError(error) {
  // 不能用 `instanceof Error`：vm 的超时错误来自另一个 realm
  // （宿主 Error.prototype 与它不是同一条链），会被误判成普通值而丢失
  // code/cause（IKF39T 实测）。按 Error-like 形状判定即可。
  if (error !== null && typeof error === 'object' && 'message' in error) {
    return error;
  }
  const wrapped = new Error(`${error}`);
  wrapped.code = 'ERR_NV8_SCRIPT_ERROR';
  return wrapped;
}

export function createParserScriptExecutor({ context, pageUrl, replay, lifecycleModule, executedScripts, scriptPolicy, timeoutMs = 5000 }) {
  const normalizedPolicy = normalizeScriptPolicy(scriptPolicy);
  // timeout 是**致命**错误：内联脚本死循环意味着这个 Realm 已不可用。
  // 普通脚本异常仍按浏览器语义派发 error 事件后继续解析（见
  // tests/page-script-inline-error-test.js），只有超时向上抛（IKF39K）。
  const failures = [];
  const executor = script => {
    if (executedScripts?.has(script) || script.__nv8ParserExecuted === true) return;
    const type = `${script.getAttribute?.('type') ?? ''}`.trim().toLowerCase();
    const sourceUrl = script.getAttribute?.('src');
    const isInline = sourceUrl === null || sourceUrl === undefined || sourceUrl === '';

    // module 始终延后（defer 语义），包括 inline module
    if (type === 'module') return;

    // `defer` 与 `async` 只对**外部**脚本生效。inline 脚本带这两个属性时
    // 浏览器会忽略它们，按普通 parser-blocking 脚本立即执行。
    //
    // 迁移前这里无条件跳过 defer/async，而 executePageScripts 对 inline 非
    // module 脚本直接 `continue`——两头都不管，inline `<script defer>`
    // 永远不执行。
    if (!isInline && (script.defer === true || script.async === true)) return;

    try {
      const scriptUrl = isInline
        ? pageUrl
        : new URL(`${sourceUrl}`, pageUrl).href;
      const permission = scriptPolicyAllows(normalizedPolicy, {
        url: scriptUrl,
        inline: isInline,
        module: false,
        pageUrl,
      });
      if (!permission.allowed) throw scriptPolicyError(scriptUrl, permission.reason);
      const source = isInline
        ? `${script.textContent ?? ''}`
        : resolveReplaySource(scriptUrl, replay);
      lifecycleModule?.namespace?.setCurrentScriptElement?.(script);
      vm.runInContext(source, context, { filename: scriptUrl, timeout: timeoutMs });
      lifecycleModule?.namespace?.clearCurrentScript?.();
      dispatchScriptEvent(context, script, 'load');
      executedScripts?.add(script);
      script.__nv8ParserExecuted = true;
    } catch (error) {
      lifecycleModule?.namespace?.clearCurrentScript?.();
      const scriptError = normalizeScriptError(error);
      dispatchScriptEvent(context, script, 'error', scriptError);
      executedScripts?.add(script);
      script.__nv8ParserExecuted = true;
      if (isTimeoutError(scriptError)) {
        failures.push({ url: isInline ? pageUrl : `${sourceUrl}`, error: scriptError });
      }
    }
  };
  executor.getFailures = () => [...failures];
  return executor;
}

export async function executePageScripts({ context, document, pageUrl, replay, lifecycleModule, executedScripts = new WeakSet(), scriptPolicy, timeoutMs = 5000 }) {
  const normalizedPolicy = normalizeScriptPolicy(scriptPolicy);
  lifecycleModule?.namespace?.ensureDocumentEventTargetForPage?.();
  const scripts = [...(document?.getElementsByTagName?.('script') ?? [])];
  const knownScripts = new WeakSet(scripts);
  const blocking = [];
  // defer 与 module 共用一个队列。规范上两者都在 DOMContentLoaded 前按
  // **文档顺序**执行；分成两个队列依次跑会让
  // `<script type="module">` 在 `<script defer src>` 前面时顺序颠倒。
  const deferredOrModules = [];
  const asyncScripts = [];
  const pageModuleImporter = createDynamicImporter({
    context,
    timeoutMs,
    cache: new Map(),
    defaultReferrer: pageUrl,
    allowUrl: url => scriptPolicyAllows(normalizedPolicy, {
      url,
      inline: false,
      module: true,
      pageUrl,
    }).allowed,
    resolveSource: url => {
      try {
        return resolveReplay(url);
      } catch {
        return null;
      }
    },
    availableUrls: () => replay
      .filter(entry => `${entry.method ?? 'GET'}`.toUpperCase() === 'GET')
      .map(entry => `${entry.url}`),
  });

  for (const script of scripts) {
    if (executedScripts.has(script) || script.__nv8ParserExecuted === true) continue;
    const type = `${script.getAttribute?.('type') ?? ''}`.trim().toLowerCase();
    const isModule = type === 'module';
    const src = script.getAttribute?.('src');
    const isInline = src === null || src === undefined || src === '';

    if (isInline) {
      // inline module 有 defer 语义，仍需延后
      if (isModule) {
        deferredOrModules.push({
          script,
          isModule: true,
          source: script.textContent ?? '',
          url: pageUrl,
        });
      }
      // inline 非 module 脚本由 parser 执行器处理（包括带 defer/async 属性的，
      // 浏览器对 inline 脚本忽略这两个属性）
      continue;
    }

    const entry = {
      script,
      isModule,
      url: new URL(`${src}`, pageUrl).href,
    };
    if (script.async === true) asyncScripts.push(entry);
    else if (isModule || script.defer === true) deferredOrModules.push(entry);
    else blocking.push(entry);
  }

  const asyncComplete = Promise.all(asyncScripts.map(entry => runLater(() => (
    entry.isModule ? runModule(entry) : runClassic(entry)
  ))));
  // 在 Realm 创建流程挂上 await 之前先接一个空 handler：否则 async 脚本的
  // 超时拒绝可能在 completePageLifecycle 等待前触发 unhandledRejection。
  asyncComplete.catch(() => {});
  for (const entry of blocking) await runClassic(entry);
  for (const entry of deferredOrModules) {
    if (entry.isModule) await runModule(entry);
    else await runClassic(entry);
  }
  const observer = observeDynamicScripts();
  return {
    asyncComplete,
    observer,
    dispose: () => pageModuleImporter.dispose(),
  };

  async function runClassic(entry) {
    if (executedScripts.has(entry.script) || entry.script.__nv8ParserExecuted === true) return;
    try {
      const permission = scriptPolicyAllows(normalizedPolicy, {
        url: entry.url,
        inline: entry.source !== undefined,
        module: false,
        pageUrl,
      });
      if (!permission.allowed) throw scriptPolicyError(entry.url, permission.reason);
      const source = entry.source ?? resolveReplay(entry.url);
      lifecycleModule?.namespace?.setCurrentScriptElement?.(entry.script);
      vm.runInContext(source, context, { filename: entry.url, timeout: timeoutMs });
      lifecycleModule?.namespace?.clearCurrentScript?.();
      dispatchScriptEvent(context, entry.script, 'load');
      executedScripts.add(entry.script);
      entry.script.__nv8ParserExecuted = true;
    } catch (error) {
      lifecycleModule?.namespace?.clearCurrentScript?.();
      const scriptError = normalizeScriptError(error);
      dispatchScriptEvent(context, entry.script, 'error', scriptError);
      executedScripts.add(entry.script);
      entry.script.__nv8ParserExecuted = true;
      // 超时不可继续：脚本已把 Realm 拖死，结构化上报（IKF39K）
      if (isTimeoutError(scriptError)) throw scriptError;
    }
  }

  async function runModule(entry) {
    if (executedScripts.has(entry.script) || entry.script.__nv8ParserExecuted === true) return;
    try {
      const permission = scriptPolicyAllows(normalizedPolicy, {
        url: entry.url,
        inline: entry.source !== undefined,
        module: true,
        pageUrl,
      });
      if (!permission.allowed) throw scriptPolicyError(entry.url, permission.reason);
      const source = entry.source ?? resolveReplay(entry.url);
      await pageModuleImporter.evaluateEntryModule(source, entry.url, {
        timeoutMs,
      });
      dispatchScriptEvent(context, entry.script, 'load');
      executedScripts.add(entry.script);
      entry.script.__nv8ParserExecuted = true;
    } catch (error) {
      const scriptError = normalizeScriptError(error);
      dispatchScriptEvent(context, entry.script, 'error', scriptError);
      executedScripts.add(entry.script);
      entry.script.__nv8ParserExecuted = true;
      if (isTimeoutError(scriptError)) throw scriptError;
    }
  }


  function resolveReplay(url) {
    if (url.startsWith('data:')) return decodeData(url);
    const record = replay.find(entry => (
      `${entry.method ?? 'GET'}`.toUpperCase() === 'GET'
      && entry.url === url
    ));
    if (!record) throw new Error(`No offline replay entry for page script: ${url}`);
    return `${record.body ?? ''}`;
  }

  function observeDynamicScripts() {
    const MutationObserverConstructor = vm.runInContext(
      'typeof MutationObserver === "function" ? MutationObserver : null',
      context,
    );
    if (MutationObserverConstructor === null) {
      return null;
    }
    const observer = new MutationObserverConstructor(records => {
      for (const record of records) {
        for (const node of record.addedNodes ?? []) {
          const candidates = node?.localName === 'script'
            ? [node]
            : [...(node?.getElementsByTagName?.('script') ?? [])];
          for (const script of candidates) {
            if (knownScripts.has(script)) continue;
            knownScripts.add(script);
            const entry = createEntry(script);
            if (entry === null) continue;
            void runLater(() => entry.isModule ? runModule(entry) : runClassic(entry));
          }
        }
      }
    });
    observer.observe(document, { childList: true, subtree: true });
    return observer;
  }

  function createEntry(script) {
    const sourceUrl = script.getAttribute?.('src');
    const type = `${script.getAttribute?.('type') ?? ''}`.trim().toLowerCase();
    const isModule = type === 'module';
    if (sourceUrl === null || sourceUrl === '') {
      return { script, isModule, source: script.textContent ?? '', url: pageUrl };
    }
    try {
      return {
        script,
        isModule,
        url: new URL(`${sourceUrl}`, pageUrl).href,
      };
    } catch (error) {
      dispatchScriptEvent(context, script, 'error', error);
      return null;
    }
  }
}

function resolveReplaySource(url, replay) {
  if (url.startsWith('data:')) return decodeData(url);
  const record = replay.find(entry => (
    `${entry.method ?? 'GET'}`.toUpperCase() === 'GET'
    && entry.url === url
  ));
  if (!record) throw new Error(`No offline replay entry for page script: ${url}`);
  return `${record.body ?? ''}`;
}

function runLater(callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 不再 `then(resolve, resolve)` 吞掉错误：致命的超时错误必须让
      // asyncComplete 拒绝，普通脚本错误已在 runClassic/runModule 内转为
      // error 事件（IKF39K）。
      Promise.resolve(callback()).then(resolve, reject);
    }, 0);
  });
}

function scriptPolicyError(url, reason) {
  const error = new Error(`Refused to execute script ${url}: ${reason}`);
  error.code = 'ERR_NV8_SCRIPT_POLICY_REJECTED';
  error.reason = reason;
  return error;
}

function dispatchScriptEvent(context, script, type, error = null) {
  if (!script?.dispatchEvent) return;
  const EventConstructor = vm.runInContext('Event', context);
  const event = new EventConstructor(type);
  if (error !== null) {
    Object.defineProperty(event, 'error', { value: error, enumerable: true });
    Object.defineProperty(event, 'message', {
      value: `${error.message ?? error}`,
      enumerable: true,
    });
    // code 结构化透传：错误边界与测试都依赖它区分超时/策略拒绝等（IKF39T）
    if (error.code !== undefined) {
      Object.defineProperty(event, 'code', {
        value: error.code,
        enumerable: true,
      });
    }
  }
  script.dispatchEvent(event);
}

function decodeData(url) {
  const comma = url.indexOf(',');
  if (comma < 0) throw new TypeError('Invalid data script URL');
  const metadata = url.slice(5, comma);
  const payload = url.slice(comma + 1);
  if (!metadata.toLowerCase().endsWith(';base64')) return decodeURIComponent(payload);
  return Buffer.from(payload, 'base64').toString('utf8');
}
