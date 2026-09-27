import assert from 'node:assert/strict';
import test from 'node:test';
import { createNv8, domPreset } from '../src/index.js';
import { windowPlugin } from '../src/plugins/window/index.js';
import { messagingPlugin } from '../src/plugins/messaging/index.js';
import { workerPlugin } from '../src/plugins/worker/index.js';

const logger = { info() {}, warn() {}, error() {}, trace() {} };

const commonProfile = {
  id: "test-profile",
  version: '1.0.0',
  name: 'Test Profile',
  url: 'https://example.test/',
  pageHtml: '<!doctype html><html><body></body></html>',
};

const commonReplay = [
  {
    method: 'GET',
    url: 'https://example.test/child.html',
    repeat: 'unlimited',
    body: '<!doctype html><html><body>child</body></html>',
  },
  {
    method: 'GET',
    url: 'https://example.test/echo-worker.js',
    repeat: 'unlimited',
    body: `
      self.onmessage = event => {
        const port = event.ports[0];
        const dataPort = event.data?.port;
        const isSame = dataPort === port;
        const isPortInstance = port instanceof MessagePort;
        port.onmessage = msg => {
          port.postMessage({
            echo: msg.data,
            workerSame: isSame,
            workerInstance: isPortInstance,
          });
        };
        port.start();
        port.postMessage({
          ready: true,
          workerSame: isSame,
          workerInstance: isPortInstance,
        });
      };
    `,
  },
];

test('1-4. MessagePort transfer security validations', async () => {
  const nv8 = await createNv8({
    plugins: [...domPreset, messagingPlugin, windowPlugin],
    profile: commonProfile,
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });

    // 1. 验证品牌防伪造：伪造 brand 的对象在 transfer 列表中必须抛 DataCloneError
    const fakeBrandError = await realm.evaluate(`(() => {
      try {
        const fake = { [Symbol.toStringTag]: "MessagePort" };
        window.postMessage("test", "*", [fake]);
        return null;
      } catch (e) {
        return { name: e.name, message: e.message };
      }
    })()`);
    assert.equal(fakeBrandError?.name, 'DataCloneError');

    // 2. 验证重复 transfer：同一个 port 传递两次必须抛 DataCloneError
    const duplicateTransferError = await realm.evaluate(`(() => {
      try {
        const channel = new MessageChannel();
        window.postMessage("test", "*", [channel.port1, channel.port1]);
        return null;
      } catch (e) {
        return { name: e.name, message: e.message };
      }
    })()`);
    assert.equal(duplicateTransferError?.name, 'DataCloneError');

    // 3. 验证未列入 transfer list：MessagePort 在 payload 中但未在 transfer 列表时必须抛 DataCloneError
    const unlistedTransferError = await realm.evaluate(`(() => {
      try {
        const channel = new MessageChannel();
        window.postMessage({ myPort: channel.port1 }, "*");
        return null;
      } catch (e) {
        return { name: e.name, message: e.message };
      }
    })()`);
    assert.equal(unlistedTransferError?.name, 'DataCloneError');

    // 4. 验证 detach 状态：被 transfer 后的 port 调用 postMessage 必须抛 InvalidStateError
    const detachPostError = await realm.evaluate(`(() => {
      try {
        const channel = new MessageChannel();
        window.postMessage("transfer", "*", [channel.port1]);
        channel.port1.postMessage("after-detach");
        return null;
      } catch (e) {
        return { name: e.name, message: e.message };
      }
    })()`);
    assert.equal(detachPostError?.name, 'InvalidStateError');

    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('5. Window -> Iframe MessagePort transfer and two-way communication', async () => {
  const nv8 = await createNv8({
    plugins: [...domPreset, messagingPlugin, windowPlugin],
    profile: commonProfile,
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });

    const iframeTransferResult = await realm.evaluate(`new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      const frame = document.createElement('iframe');
      frame.addEventListener('load', () => {
        channel.port1.onmessage = e => {
          resolve(e.data);
        };
        channel.port1.start();

        frame.contentWindow.addEventListener('message', e => {
          const receivedPort = e.ports[0];
          const isInstance = receivedPort instanceof frame.contentWindow.MessagePort;
          receivedPort.onmessage = msg => {
            receivedPort.postMessage({
              echo: msg.data,
              childInstance: isInstance,
            });
          };
          receivedPort.start();
          receivedPort.postMessage('iframe-ready');
        }, { once: true });

        frame.contentWindow.postMessage('init', '*', [channel.port2]);
      }, { once: true });
      frame.srcdoc = '<!doctype html><html><body>child</body></html>';
      document.body.appendChild(frame);
    })`);
    assert.equal(iframeTransferResult, 'iframe-ready');

    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('6. Window -> Worker MessagePort transfer and payload nested recovery', async () => {
  const nv8 = await createNv8({
    plugins: [...domPreset, messagingPlugin, windowPlugin, workerPlugin],
    profile: commonProfile,
    replay: commonReplay,
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });

    const workerTransferResult = await realm.evaluate(`new Promise(resolve => {
      const worker = new Worker('/echo-worker.js');
      const channel = new MessageChannel();

      channel.port1.onmessage = e => {
        if (e.data?.ready) {
          channel.port1.postMessage('ping-worker');
        } else if (e.data?.echo) {
          resolve(JSON.stringify(e.data));
        }
      };
      channel.port1.start();

      worker.postMessage({ port: channel.port2 }, [channel.port2]);
    })`);
    assert.deepEqual(JSON.parse(workerTransferResult), {
      echo: 'ping-worker',
      workerSame: true,
      workerInstance: true,
    });

    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test('7. Root -> Iframe -> Worker multi-hop port transfer', async () => {
  const nv8 = await createNv8({
    plugins: [...domPreset, messagingPlugin, windowPlugin, workerPlugin],
    profile: commonProfile,
    replay: commonReplay,
    logger,
  });
  try {
    const realm = await nv8.sandbox.createRealm({ type: 'root' });

    const multiHopResult = await realm.evaluate(`new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      const frame = document.createElement('iframe');
      frame.addEventListener('load', () => {
        // Iframe 收到来自 Root 的 port2 后，转手传递给 Worker
        frame.contentWindow.addEventListener('message', e => {
          try {
            const portFromRoot = e.ports[0];
            const childWorker = new frame.contentWindow.Worker('/echo-worker.js');
            childWorker.onerror = err => reject(new Error('childWorker error: ' + (err.message || err)));
            childWorker.postMessage({ port: portFromRoot }, [portFromRoot]);
          } catch (err) {
            reject(new Error('iframe postMessage error: ' + err.message));
          }
        }, { once: true });

        // Root 监听来自 Worker 经由 port1 传回的消息
        channel.port1.onmessage = e => {
          resolve(JSON.stringify(e.data));
        };
        channel.port1.start();

        frame.contentWindow.postMessage('init', '*', [channel.port2]);
      }, { once: true });
      frame.src = 'https://example.test/child.html';
      document.body.appendChild(frame);
    })`);
    assert.deepEqual(JSON.parse(multiHopResult), {
      ready: true,
      workerSame: true,
      workerInstance: true,
    });

    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
