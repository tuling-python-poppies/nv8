import vm from 'node:vm';
import { Buffer } from 'node:buffer';
import { createDynamicImporter } from '../realm/dynamic-import.js';

export function createParserScriptExecutor({ context, pageUrl, replay, lifecycleModule, executedScripts }) {
  return script => {
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
      const source = isInline
        ? `${script.textContent ?? ''}`
        : resolveReplaySource(scriptUrl, replay);
      lifecycleModule?.namespace?.setCurrentScriptElement?.(script);
      vm.runInContext(source, context, { filename: scriptUrl });
      lifecycleModule?.namespace?.clearCurrentScript?.();
      dispatchScriptEvent(context, script, 'load');
      executedScripts?.add(script);
      script.__nv8ParserExecuted = true;
    } catch (error) {
      lifecycleModule?.namespace?.clearCurrentScript?.();
      dispatchScriptEvent(context, script, 'error', error);
      executedScripts?.add(script);
      script.__nv8ParserExecuted = true;
    }
  };
}

export async function executePageScripts({ context, document, pageUrl, replay, lifecycleModule, executedScripts = new WeakSet() }) {
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
    cache: new Map(),
    defaultReferrer: pageUrl,
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
      const source = entry.source ?? resolveReplay(entry.url);
      lifecycleModule?.namespace?.setCurrentScriptElement?.(entry.script);
      vm.runInContext(source, context, { filename: entry.url });
      lifecycleModule?.namespace?.clearCurrentScript?.();
      dispatchScriptEvent(context, entry.script, 'load');
      executedScripts.add(entry.script);
      entry.script.__nv8ParserExecuted = true;
    } catch (error) {
      lifecycleModule?.namespace?.clearCurrentScript?.();
      dispatchScriptEvent(context, entry.script, 'error', error);
      executedScripts.add(entry.script);
      entry.script.__nv8ParserExecuted = true;
    }
  }

  async function runModule(entry) {
    if (executedScripts.has(entry.script) || entry.script.__nv8ParserExecuted === true) return;
    try {
      const source = entry.source ?? resolveReplay(entry.url);
      await pageModuleImporter.evaluateEntryModule(source, entry.url);
      dispatchScriptEvent(context, entry.script, 'load');
      executedScripts.add(entry.script);
      entry.script.__nv8ParserExecuted = true;
    } catch (error) {
      dispatchScriptEvent(context, entry.script, 'error', error);
      executedScripts.add(entry.script);
      entry.script.__nv8ParserExecuted = true;
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
  return new Promise(resolve => {
    setTimeout(() => {
      Promise.resolve(callback()).then(resolve, resolve);
    }, 0);
  });
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
