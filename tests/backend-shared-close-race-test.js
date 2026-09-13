/**
 * IKF39I：SharedWorker 创建期 close 竞态。
 *
 * createSharedWorkerConnection 过去把未 resolve 的 Promise 存进 sharedWorkers，
 * destroyChildRealms 遍历 shared.connections 时 TypeError，中断 childRealms
 * 清理；close 一旦置 closed 又不可重试。
 *
 * 这里直接对 RuntimePool 的清理/登记方法做单元测试（不启动 Realm）：
 * - 创建中的占位与旧的裸对象都不能让清理抛错；
 * - 单项 close 失败不阻断其余资源回收；
 * - 创建期间 close 后，晚到的创建结果被 generation 守卫丢弃并释放连接额度。
 */

import assert from "node:assert/strict";
import test from "node:test";
import { RuntimePool } from "../src/backend/child/runtime-pool.js";

function barePool() {
  const pool = Object.create(RuntimePool.prototype);
  Object.assign(pool, {
    sharedWorkers: new Map(),
    childRealms: new Set(),
    idlePrewarmedHandles: [],
    workerRealms: new Set(),
    workletRealms: new Set(),
    workletStates: new Set(),
    workletRealmsByOwner: new WeakMap(),
    closed: false,
    generation: 0,
    options: { limits: {} },
  });
  return pool;
}

test("destroyChildRealms survives pending placeholders and throwing connections", () => {
  const pool = barePool();
  const destroyed = [];
  pool.destroyChildRealm = realm => destroyed.push(realm);

  const throwingConnection = {
    close() {
      throw new Error("connection close failed");
    },
  };
  const healthyConnection = {
    close() {
      destroyed.push("healthy-connection");
    },
  };
  pool.sharedWorkers.set("pending", {
    realm: null,
    connections: new Set(),
    connectionReleases: new Set(),
  });
  // 旧形态的裸对象（没有 connections 字段）也必须被容忍。
  pool.sharedWorkers.set("legacy", { realm: null });
  pool.sharedWorkers.set("active", {
    realm: { destroyed: false },
    connections: new Set([throwingConnection, healthyConnection]),
    connectionReleases: new Set([() => destroyed.push("release")]),
  });

  const childA = { destroyed: false, bootstrap: { markWindowClosed() {} } };
  const childB = { destroyed: false, bootstrap: { markWindowClosed() {} } };
  pool.childRealms.add(childA);
  pool.childRealms.add(childB);
  pool.idlePrewarmedHandles.push({ realm: childA });

  assert.doesNotThrow(() => pool.destroyChildRealms());
  assert.equal(pool.sharedWorkers.size, 0);
  assert.equal(pool.childRealms.size, 0);
  assert.equal(pool.idlePrewarmedHandles.length, 0);
  assert.ok(destroyed.includes("healthy-connection"));
  assert.ok(destroyed.includes("release"));
  assert.ok(destroyed.includes(childA));
  assert.ok(destroyed.includes(childB));
  // 清理是幂等的，重复调用不会抛错。
  assert.doesNotThrow(() => pool.destroyChildRealms());
});

test("destroyChildRealms continues when one child realm teardown throws", () => {
  const pool = barePool();
  const destroyed = [];
  const broken = {
    destroyed: false,
    bootstrap: {
      markWindowClosed() {
        throw new Error("realm teardown failed");
      },
    },
  };
  const healthy = {
    destroyed: false,
    bootstrap: {
      markWindowClosed() {},
      clearScheduledTasks() {},
    },
  };
  pool.destroyChildRealm = RuntimePool.prototype.destroyChildRealm.bind(pool);
  pool.childRealms.add(broken);
  pool.childRealms.add(healthy);

  assert.doesNotThrow(() => pool.destroyChildRealms());
  assert.equal(pool.childRealms.size, 0);
});

test("taking a prewarmed realm skips broken entries instead of leaking them", () => {
  const pool = barePool();
  pool.page = { url: "https://prewarm.test/" };
  pool.destroyChildRealm = realm => {
    pool.childRealms.delete(realm);
  };
  const failing = {
    realm: {
      destroyed: false,
      bootstrap: {
        reparentRealm() {
          throw new Error("reparent failed");
        },
      },
    },
    window: {},
  };
  const destroyed = { realm: { destroyed: true }, window: {} };
  const healthy = {
    realm: { destroyed: false, bootstrap: { reparentRealm() {} } },
    window: { id: "healthy" },
  };
  pool.idlePrewarmedHandles.push(healthy, destroyed, failing);

  const taken = pool.takePrewarmedRealm({
    blankDocument: true,
    sameOrigin: true,
    pageUrl: "https://prewarm.test/frame",
    origin: "https://prewarm.test",
  });
  assert.equal(taken, healthy);
  assert.equal(pool.idlePrewarmedHandles.length, 0);
  assert.equal(
    pool.takePrewarmedRealm({
      blankDocument: true,
      sameOrigin: true,
      pageUrl: "https://prewarm.test/frame",
      origin: "https://prewarm.test",
    }),
    null,
  );
});

test("closing while a SharedWorker creation is in flight releases capacity", async () => {
  const pool = barePool();
  let releaseConnectionCalls = 0;
  pool.reserveWorkerConnection = () => () => {
    releaseConnectionCalls += 1;
  };
  let completeCreation = null;
  pool.createSharedWorkerRealm = (key, options, shared) => (
    new Promise(resolve => {
      completeCreation = () => {
        shared.realm = {
          destroyed: false,
          bootstrap: {
            connectSharedWorkerConnection: () => ({
              deliverOwnerMessage() {},
              close() {},
            }),
          },
        };
        resolve(shared);
      };
    })
  );

  const creating = pool.createSharedWorkerConnection({
    creatorOrigin: "https://shared.test",
    url: "https://shared.test/worker.js",
    name: "close-race",
    type: "classic",
    workerDepth: 1,
    onMessage() {},
  });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(pool.sharedWorkers.size, 1);
  // 模拟 close(): 置 closed 并推进 generation。
  pool.closed = true;
  pool.generation += 1;

  assert.doesNotThrow(() => pool.destroyChildRealms());
  assert.equal(pool.sharedWorkers.size, 0);

  completeCreation();
  await assert.rejects(
    creating,
    error => error.code === "ERR_NV8_REALM_LIFECYCLE",
  );
  assert.equal(releaseConnectionCalls, 1);
});
