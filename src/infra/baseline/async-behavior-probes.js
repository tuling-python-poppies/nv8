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
