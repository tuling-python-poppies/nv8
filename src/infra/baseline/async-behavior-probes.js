/**
 * Worker / ServiceWorker 异步行为探针。
 *
 * 这些探针与同步行为探针使用相同的规则：结果必须跨运行稳定、与机器无关、
 * 可序列化。等待异步结果时使用消息或 controllerchange 作为因果条件，不用时间猜测。
 */

export const ASYNC_BEHAVIOR_PROBES = Object.freeze([
  {
    id: "worker/message-roundtrip",
    category: "workerAsync",
    expression: `async () => {
      const worker = new Worker('/worker-message.js');
      const result = await new Promise((resolve, reject) => {
        worker.onmessage = event => resolve([
          event.data,
          event.origin,
          event.source === null,
        ].join('|'));
        worker.onerror = () => reject(new Error('worker message failed'));
      });
      worker.terminate();
      return result;
    }`,
  },
  {
    id: "worker/terminate-suppresses-message",
    category: "workerAsync",
    expression: `async () => {
      const worker = new Worker('/worker-late.js');
      let delivered = false;
      worker.onmessage = () => { delivered = true; };
      worker.terminate();
      const sentinel = new Worker('/worker-sentinel.js');
      await new Promise((resolve, reject) => {
        sentinel.onmessage = resolve;
        sentinel.onerror = () => reject(new Error('sentinel failed'));
      });
      sentinel.terminate();
      return String(delivered);
    }`,
  },
  {
    id: "service-worker/registration-metadata",
    category: "serviceWorkerAsync",
    expression: `async () => {
      const readyPromise = navigator.serviceWorker.ready;
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/app/',
        updateViaCache: 'none',
      });
      const ready = await readyPromise;
      return [
        new URL(registration.scope).pathname,
        registration.updateViaCache,
        new URL(ready.active.scriptURL).pathname,
        ready.active.state,
        String(ready === registration),
      ].join('|');
    }`,
  },
  {
    id: "service-worker/controller-claim",
    category: "serviceWorkerAsync",
    expression: `async () => {
      await navigator.serviceWorker.register('/sw.js', { scope: '/app/' });
      const controller = navigator.serviceWorker.controller ?? await new Promise((resolve, reject) => {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          resolve(navigator.serviceWorker.controller);
        }, { once: true });
        setTimeout(() => reject(new Error('controller claim failed')), 8000);
      });
      return [
        String(controller !== null),
        controller === null ? '' : new URL(controller.scriptURL).pathname,
        controller.state,
      ].join('|');
    }`,
  },
  {
    id: "service-worker/message-roundtrip",
    category: "serviceWorkerAsync",
    expression: `async () => {
      await navigator.serviceWorker.register('/sw.js', { scope: '/app/' });
      const controller = navigator.serviceWorker.controller ?? await new Promise((resolve, reject) => {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          resolve(navigator.serviceWorker.controller);
        }, { once: true });
        setTimeout(() => reject(new Error('controller claim failed')), 8000);
      });
      return await new Promise((resolve, reject) => {
        navigator.serviceWorker.onmessage = event => resolve([
          event.data.kind,
          event.data.value,
          String(event.source === controller),
          String(event.origin === location.origin),
        ].join('|'));
        controller.postMessage({ kind: 'roundtrip', value: 7 });
        setTimeout(() => reject(new Error('service worker message failed')), 8000);
      });
    }`,
  },
]);

/**
 * Generate an async expression that evaluates all probes and returns JSON.
 * @returns {string}
 */
export function buildAsyncProbeExpression(probes = ASYNC_BEHAVIOR_PROBES) {
  const entries = probes
    .map(entry => `  ${JSON.stringify(entry.id)}: await probe(${entry.expression}),`)
    .join("\n");
  return `(async () => {
  const probe = async fn => {
    try {
      const value = await fn();
      return { threw: false, value: typeof value === 'string' ? value : String(value) };
    } catch (error) {
      return {
        threw: true,
        name: String(error && error.name),
        message: String(error && error.message),
      };
    }
  };
  return JSON.stringify({
${entries}
  });
})()`;
}
