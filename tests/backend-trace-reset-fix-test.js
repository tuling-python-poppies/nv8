/**
 * IKF DAD：enableProxyTrace 之后 setPage（RESET_REALM）必须保留 trace 配置。
 *
 * 父侧 payload 一直带着 proxyTrace.enabled，但子侧 resetRealm 重建 RuntimePool
 * 时忽略了它，于是 trace 被静默关闭。这里用真实后端验证 trace 前后都有记录。
 */

import assert from "node:assert/strict";
import test from "node:test";
import { EdgeSandbox } from "../src/public/edge-sandbox.js";

for (const backend of ["child-process", "worker-thread"]) {
  test(`proxy trace survives setPage on ${backend}`, async () => {
    const sandbox = await EdgeSandbox.create({
      execution: { backend },
      page: {
        url: "https://trace-reset.test/",
        html: "<!doctype html><html><body><main id=app>trace</main></body></html>",
      },
      limits: { timeoutMs: 10_000, maxRealms: 8 },
    });
    try {
      await sandbox.enableProxyTrace();
      await sandbox.evaluate("navigator.userAgent");
      const before = await sandbox.proxyTrace();
      assert.ok(before.length > 0, "trace records before setPage");

      await sandbox.setPage({
        url: "https://trace-reset.test/after/",
        html: "<!doctype html><html><body><main id=app>after</main></body></html>",
      });
      await sandbox.evaluate("navigator.userAgent");
      const after = await sandbox.proxyTrace();
      assert.ok(after.length > 0, "trace records after setPage");
    } finally {
      await sandbox.close();
    }
  });
}
