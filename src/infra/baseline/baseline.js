import { createHash } from 'node:crypto';

const SURFACE_EXPRESSION = `(() => {
  const names = [
    'window', 'document', 'navigator', 'location', 'history', 'localStorage',
    'sessionStorage', 'fetch', 'XMLHttpRequest', 'Worker', 'ServiceWorker',
    'MutationObserver', 'URL', 'crypto', 'performance',
  ];
  const descriptor = (target, name) => {
    const value = Object.getOwnPropertyDescriptor(target, name);
    if (!value) return null;
    return {
      configurable: Boolean(value.configurable),
      enumerable: Boolean(value.enumerable),
      writable: 'writable' in value ? Boolean(value.writable) : null,
      getter: typeof value.get === 'function',
      setter: typeof value.set === 'function',
      valueType: 'value' in value ? typeof value.value : null,
    };
  };
  return {
    globals: Object.fromEntries(names.map(name => [name, typeof globalThis[name]])),
    descriptors: Object.fromEntries(names.map(name => [name, descriptor(globalThis, name)])),
    document: typeof document === 'object' && document !== null
      ? {
          readyState: document.readyState,
          url: document.URL,
          title: document.title,
          body: Boolean(document.body),
        }
      : null,
    navigator: typeof navigator === 'object' && navigator !== null
      ? {
          userAgent: navigator.userAgent,
          language: navigator.language,
          languages: [...navigator.languages],
        }
      : null,
  };
})()`;

const SCENARIO = Object.freeze({
  url: 'https://example.test/',
  html: '<!doctype html><html><head><title>Baseline</title></head><body><main id="app">baseline</main></body></html>',
  replay: Object.freeze([{
    method: 'GET',
    url: 'https://api.example.test/baseline',
    status: 200,
    headers: { 'content-type': 'application/json' },
    body: '{"ok":true,"source":"replay"}',
    repeat: 'unlimited',
  }, {
    method: 'GET',
    url: 'https://example.test/baseline-worker.js',
    status: 200,
    body: 'self.onmessage = event => self.postMessage(event.data + "-worker");',
    repeat: 'unlimited',
  }]),
});

export function baselineScenario() {
  return {
    url: SCENARIO.url,
    html: SCENARIO.html,
    replay: SCENARIO.replay.map(entry => ({ ...entry, headers: { ...entry.headers } })),
  };
}

export async function capturePublicGate0Baseline(sandbox, options = {}) {
  const scenario = { ...SCENARIO, ...options };
  const surface = JSON.parse(await sandbox.run(`JSON.stringify(${SURFACE_EXPRESSION})`));
  const evaluation = JSON.parse(await sandbox.run(`(async () => JSON.stringify({
    title: document.title,
    text: document.querySelector('#app')?.textContent ?? null,
    replay: await fetch('https://api.example.test/baseline').then(response => response.json()),
    storageBefore: localStorage.getItem('baseline'),
    mutation: (() => {
      const node = document.createElement('span');
      node.id = 'baseline-dynamic';
      node.textContent = 'dynamic';
      document.body.appendChild(node);
      return document.querySelector('#baseline-dynamic')?.textContent ?? null;
    })(),
  }))()`));
  const iframe = JSON.parse(await sandbox.run(`new Promise(resolve => {
    const frame = document.createElement('iframe');
    frame.addEventListener('load', () => resolve(JSON.stringify({
      sameOrigin: frame.contentDocument !== null,
      url: frame.contentDocument?.URL ?? null,
      text: frame.contentDocument?.querySelector('#child')?.textContent ?? null,
      defaultView: frame.contentDocument?.defaultView === frame.contentWindow,
    })), { once: true });
    frame.srcdoc = '<!doctype html><html><body><main id="child">iframe</main></body></html>';
    document.body.appendChild(frame);
  })`));
  const worker = await sandbox.run(`new Promise((resolve, reject) => {
    const worker = new Worker('/baseline-worker.js');
    worker.onmessage = event => { worker.terminate(); resolve(event.data); };
    worker.onerror = event => reject(event.error || new Error('worker failed'));
    worker.postMessage('baseline');
  })`);
  const trace = typeof sandbox.trace === 'function' ? await sandbox.trace() : [];
  const requests = typeof sandbox.requests === 'function' ? await sandbox.requests() : [];
  return normalizeBaseline({
    mode: 'legacy',
    scenario,
    surface,
    evaluation: { ...evaluation, iframe, worker },
    trace,
    requests,
    inspect: null,
    reset: await capturePublicReset(sandbox, scenario),
  });
}

export async function captureCoreGate0Baseline(nv8, options = {}) {
  const scenario = { ...SCENARIO, ...options };
  const realm = await nv8.sandbox.createRealm({
    type: 'root',
    pageUrl: scenario.url,
    pageHtml: scenario.html,
  });
  try {
    const surface = JSON.parse(realm.evaluate(`JSON.stringify(${SURFACE_EXPRESSION})`));
    const evaluation = JSON.parse(await realm.evaluate(`(async () => JSON.stringify({
      title: document.title,
      text: document.querySelector('#app')?.textContent ?? null,
      replay: await fetch('https://api.example.test/baseline').then(response => response.json()),
      storageBefore: localStorage.getItem('baseline'),
      mutation: (() => {
        const node = document.createElement('span');
        node.id = 'baseline-dynamic';
        node.textContent = 'dynamic';
        document.body.appendChild(node);
        return document.querySelector('#baseline-dynamic')?.textContent ?? null;
      })(),
    }))()`));
    const iframe = JSON.parse(await realm.evaluate(`new Promise(resolve => {
      const frame = document.createElement('iframe');
      frame.addEventListener('load', () => resolve(JSON.stringify({
        sameOrigin: frame.contentDocument !== null,
        url: frame.contentDocument?.URL ?? null,
        text: frame.contentDocument?.querySelector('#child')?.textContent ?? null,
        defaultView: frame.contentDocument?.defaultView === frame.contentWindow,
      })), { once: true });
      frame.srcdoc = '<!doctype html><html><body><main id="child">iframe</main></body></html>';
      document.body.appendChild(frame);
    })`));
    const worker = await realm.evaluate(`new Promise((resolve, reject) => {
      const worker = new Worker('/baseline-worker.js');
      worker.onmessage = event => { worker.terminate(); resolve(event.data); };
      worker.onerror = event => reject(event.error || new Error('worker failed'));
      worker.postMessage('baseline');
    })`);
    const inspect = nv8.sandbox.inspect();
    return normalizeBaseline({
      mode: 'plugin',
      scenario,
      surface,
      evaluation: { ...evaluation, iframe, worker },
      trace: [],
      requests: [],
      inspect,
      reset: await captureCoreReset(nv8, realm, scenario),
    });
  } finally {
    if (nv8.sandbox.getRealm(realm.id)) await nv8.sandbox.destroyRealm(realm.id);
  }
}

async function capturePublicReset(sandbox, scenario = SCENARIO) {
  await sandbox.run("localStorage.setItem('baseline', 'written')");
  await sandbox.navigate({ url: scenario.url, html: scenario.html });
  return JSON.parse(await sandbox.run("JSON.stringify([localStorage.getItem('baseline'), document.querySelector('#baseline-dynamic')])"));
}

async function captureCoreReset(nv8, realm, scenario) {
  realm.evaluate("localStorage.setItem('baseline', 'written')");
  await nv8.sandbox.destroyRealm(realm.id);
  const replacement = await nv8.sandbox.createRealm({
    type: 'root',
    pageUrl: scenario.url,
    pageHtml: scenario.html,
  });
  try {
    return JSON.parse(replacement.evaluate("JSON.stringify([localStorage.getItem('baseline'), document.querySelector('#baseline-dynamic')])"));
  } finally {
    await nv8.sandbox.destroyRealm(replacement.id);
  }
}

export function normalizeBaseline(input) {
  return deepNormalize({
    schema: 'nv8.baseline.baseline/v1',
    mode: input.mode,
    scenario: {
      url: input.scenario.url,
      htmlSha256: createHash('sha256').update(input.scenario.html).digest('hex'),
      replay: input.scenario.replay.map(entry => ({
        method: entry.method,
        url: entry.url,
        status: entry.status,
        body: entry.body,
      })),
    },
    surface: input.surface,
    evaluation: input.evaluation,
    trace: input.trace,
    requests: input.requests,
    inspect: normalizeInspect(input.inspect),
    reset: input.reset,
  });
}

export function compareGate0Baselines(left, right) {
  const differences = [];
  compareValue(left.surface, right.surface, 'surface', differences);
  compareValue(left.evaluation, right.evaluation, 'evaluation', differences);
  compareValue(left.reset, right.reset, 'reset', differences);
  return {
    equal: differences.length === 0,
    differences,
  };
}

function normalizeInspect(inspect) {
  if (inspect === null || inspect === undefined) return null;
  return {
    appId: inspect.appId ?? null,
    profile: inspect.profile ?? null,
    plugins: Array.isArray(inspect.plugins) ? [...inspect.plugins].sort() : [],
    capabilities: Array.isArray(inspect.capabilities)
      ? [...inspect.capabilities].sort()
      : [],
    realmCount: Array.isArray(inspect.realms) ? inspect.realms.length : 0,
  };
}

function compareValue(left, right, path, differences) {
  if (JSON.stringify(left) === JSON.stringify(right)) return;
  differences.push({ path, left, right });
}

function deepNormalize(value) {
  if (value === undefined) return null;
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'bigint') return `${value}n`;
  if (value instanceof Uint8Array) return Array.from(value);
  if (Array.isArray(value)) return value.map(deepNormalize);
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map(key => [key, deepNormalize(value[key])]),
    );
  }
  return `[${typeof value}]`;
}
