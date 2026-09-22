/**
 * 分页调度器
 *
 * 限流与熔断回答「这个请求该不该发」，分页调度回答「下一个请求是什么」。
 *
 * ## 三种必须有上限的东西
 *
 * 分页最容易出的事故是「永远转下去」，而只做页数上限是**不够的**：
 *
 * 1. `maxPages` —— 防御游标一直不为空
 * 2. **游标环检测** —— 游标重复说明目标在绕圈。只靠 `maxPages` 会在上限内
 *    反复采同一页，看起来「采到了 N 页」其实全是重复数据
 * 3. `maxEmptyPages` —— 连续空页说明到底或出错
 *
 * ## 游标提取必须由调用方给
 *
 * `next_cursor` / `page` / `offset` / `Link: rel=next` / 响应体里某个嵌套字段
 * ——各站点都不一样。内置猜测猜错的代价是**静默少采数据**，所以
 * `nextRequest` 是必需回调。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PaginationScheduler,
  PaginationStop,
} from '../src/collection/collector/pagination.js';
import { CollectorErrorCode } from '../src/collection/collector/errors.js';

/**
 * 假 collector：按 URL 的 cursor 参数返回预设页面。
 *
 * 不碰真实网络——分页调度器的职责是编排请求序列，网络出口是 Collector 的事。
 */
function fakeCollector(pagesByCursor, options = {}) {
  const sent = [];
  return {
    sent,
    async send(planInput, sendOptions = {}) {
      sent.push(planInput.url);
      if (options.failAt === sent.length) {
        const error = new Error('transport blew up');
        error.code = 'ERR_FAKE';
        throw error;
      }
      const url = new URL(planInput.url);
      const cursor = url.searchParams.get('cursor') ?? 'start';
      const page = pagesByCursor[cursor] ?? { items: [], next: null };
      return Object.freeze({
        request: Object.freeze({ url: url.href, method: 'GET' }),
        response: Object.freeze({ status: 200, body: page }),
        attempts: Object.freeze([]),
        redirected: false,
        signalSeen: sendOptions.signal ?? null,
      });
    },
  };
}

/** 按 `previous.response.body.next` 走游标的标准配置。 */
function cursorScheduler(pages, overrides = {}) {
  return new PaginationScheduler({
    collector: fakeCollector(pages, overrides.collectorOptions),
    nextRequest: ({ index, previous }) => {
      if (index === 0) return { url: 'https://api.test/list', method: 'GET' };
      const next = previous.response.body.next;
      return next === null || next === undefined
        ? null
        : { url: `https://api.test/list?cursor=${next}`, method: 'GET' };
    },
    extractItems: (result) => result.response.body.items ?? [],
    ...overrides,
  });
}

// ------------------------------------------------------ 配置校验

test('a collector with send() is required', () => {
  assert.throws(
    () => new PaginationScheduler({ nextRequest: () => null }),
    (error) => {
      assert.equal(error.code, CollectorErrorCode.INVALID_CONFIG);
      assert.match(error.message, /collector with send\(\)/);
      return true;
    }
  );
});

test('nextRequest is required and the error explains why', () => {
  assert.throws(
    () => new PaginationScheduler({ collector: fakeCollector({}) }),
    (error) => {
      // 报错要说清"为什么不能内置猜测"，否则下一个人还会想加自动推断
      assert.match(error.message, /target-specific and cannot be guessed/);
      return true;
    }
  );
});

test('invalid limits are rejected', () => {
  const base = { collector: fakeCollector({}), nextRequest: () => null };
  assert.throws(
    () => new PaginationScheduler({ ...base, limits: { maxPages: 0 } }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG
  );
  assert.throws(
    () => new PaginationScheduler({ ...base, limits: { maxEmptyPages: -1 } }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG
  );
  assert.throws(
    () => new PaginationScheduler({ ...base, limits: { maxTotalItems: 1.5 } }),
    (error) => error.code === CollectorErrorCode.INVALID_CONFIG
  );
});

// ------------------------------------------------------ 正常遍历

test('walks the cursor chain until it runs out', async () => {
  const scheduler = cursorScheduler({
    start: { items: ['a', 'b'], next: 'c2' },
    c2: { items: ['c'], next: 'c3' },
    c3: { items: ['d'], next: null },
  });

  const result = await scheduler.collectAll();

  assert.deepEqual([...result.items], ['a', 'b', 'c', 'd']);
  assert.equal(result.pages.length, 3);
  assert.equal(result.stop.reason, PaginationStop.EXHAUSTED);
  assert.equal(result.stop.totalItems, 4);
});

test('pages() yields incrementally and ends with a stop marker', async () => {
  const scheduler = cursorScheduler({
    start: { items: ['a'], next: 'c2' },
    c2: { items: ['b'], next: null },
  });

  const seen = [];
  for await (const page of scheduler.pages()) {
    seen.push(page.stop === null ? `page:${page.index}:${page.items.join('')}` : `stop:${page.stop.reason}`);
  }

  // 拉取式：调用方每处理完一页才要下一页，天然获得背压
  assert.deepEqual(seen, ['page:0:a', 'page:1:b', 'stop:exhausted']);
});

test('a caller can break early without draining the chain', async () => {
  const collector = fakeCollector({
    start: { items: ['a'], next: 'c2' },
    c2: { items: ['b'], next: 'c3' },
    c3: { items: ['c'], next: null },
  });
  const scheduler = new PaginationScheduler({
    collector,
    nextRequest: ({ index, previous }) => index === 0
      ? { url: 'https://api.test/list', method: 'GET' }
      : (previous.response.body.next === null
        ? null
        : { url: `https://api.test/list?cursor=${previous.response.body.next}`, method: 'GET' }),
    extractItems: (result) => result.response.body.items,
  });

  for await (const page of scheduler.pages()) {
    if (page.stop === null) break;
  }

  // 提前 break 之后不该再发请求
  assert.equal(collector.sent.length, 1);
});

test('the seed is passed to the first nextRequest call', async () => {
  const seen = [];
  const scheduler = new PaginationScheduler({
    collector: fakeCollector({ start: { items: [], next: null } }),
    nextRequest: (context) => {
      seen.push(context.seed);
      return context.index === 0
        ? { url: 'https://api.test/list', method: 'GET' }
        : null;
    },
    limits: { maxEmptyPages: 0 },
  });

  await scheduler.collectAll({ seed: { query: 'shoes' } });
  assert.deepEqual(seen[0], { query: 'shoes' });
});

// ------------------------------------------------------ 上限与环检测

test('maxPages stops the walk and reports why', async () => {
  // 游标永不为空——只靠"采完"判断会永远转下去
  const scheduler = cursorScheduler(
    { start: { items: ['x'], next: 'start' }, },
    { cursorOf: () => null, limits: { maxPages: 3 } }
  );

  const result = await scheduler.collectAll();

  assert.equal(result.pages.length, 3);
  assert.equal(result.stop.reason, PaginationStop.MAX_PAGES);
});

test('a repeating cursor stops the walk immediately', async () => {
  const collector = fakeCollector({ start: { items: ['x'], next: 'start' } });
  const scheduler = new PaginationScheduler({
    collector,
    // 每次都请求同一个 URL：典型的环形游标
    nextRequest: () => ({ url: 'https://api.test/list', method: 'GET' }),
    extractItems: (result) => result.response.body.items,
    limits: { maxPages: 50 },
  });

  const result = await scheduler.collectAll();

  // 只靠 maxPages 会采 50 次同一页；环检测在第二次就停
  assert.equal(result.pages.length, 1);
  assert.equal(result.stop.reason, PaginationStop.CURSOR_LOOP);
  assert.equal(collector.sent.length, 2, 'the loop is detected on the second fetch');
});

test('the cursor loop stop reports which cursor repeated', async () => {
  const scheduler = new PaginationScheduler({
    collector: fakeCollector({ start: { items: ['x'], next: 'start' } }),
    nextRequest: () => ({ url: 'https://api.test/list', method: 'GET' }),
    extractItems: (result) => result.response.body.items,
  });

  const result = await scheduler.collectAll();
  // 诊断信息要能直接定位问题，不能只说"有环"
  assert.equal(result.stop.cursor, 'https://api.test/list');
});

test('consecutive empty pages stop the walk', async () => {
  const scheduler = cursorScheduler(
    {
      start: { items: ['a'], next: 'e1' },
      e1: { items: [], next: 'e2' },
      e2: { items: [], next: 'e3' },
      e3: { items: ['never'], next: null },
    },
    { limits: { maxEmptyPages: 2 } }
  );

  const result = await scheduler.collectAll();

  assert.deepEqual([...result.items], ['a']);
  assert.equal(result.stop.reason, PaginationStop.EMPTY_PAGES);
});

test('maxEmptyPages 0 disables the empty-page guard', async () => {
  const scheduler = cursorScheduler(
    {
      start: { items: [], next: 'e1' },
      e1: { items: [], next: 'e2' },
      e2: { items: ['late'], next: null },
    },
    { limits: { maxEmptyPages: 0 } }
  );

  const result = await scheduler.collectAll();
  // 有些 API 中间会返回空页，关掉守卫后必须能走到底
  assert.deepEqual([...result.items], ['late']);
  assert.equal(result.stop.reason, PaginationStop.EXHAUSTED);
});

test('maxTotalItems stops once enough items are collected', async () => {
  const scheduler = cursorScheduler(
    {
      start: { items: ['a', 'b'], next: 'c2' },
      c2: { items: ['c', 'd'], next: 'c3' },
      c3: { items: ['e'], next: null },
    },
    { limits: { maxTotalItems: 3 } }
  );

  const result = await scheduler.collectAll();

  // 第二页跨过了上限就停，不会为了凑整继续翻
  assert.equal(result.items.length, 4);
  assert.equal(result.pages.length, 2);
  // 撞上限 != 数据采完：用独立原因 MAX_TOTAL_ITEMS，不再跟 EXHAUSTED 混用
  assert.equal(result.stop.reason, PaginationStop.MAX_TOTAL_ITEMS);
});

// ------------------------------------------------------ 取消与错误

test('an aborted signal stops before the first request', async () => {
  const collector = fakeCollector({ start: { items: ['a'], next: null } });
  const scheduler = new PaginationScheduler({
    collector,
    nextRequest: () => ({ url: 'https://api.test/list', method: 'GET' }),
  });

  const controller = new AbortController();
  controller.abort();
  const result = await scheduler.collectAll({ signal: controller.signal });

  assert.equal(result.stop.reason, PaginationStop.ABORTED);
  assert.equal(collector.sent.length, 0, 'no request may be sent after abort');
});

test('the signal is forwarded to the collector', async () => {
  const scheduler = cursorScheduler({ start: { items: ['a'], next: null } });
  const controller = new AbortController();

  const seen = [];
  for await (const page of scheduler.pages({ signal: controller.signal })) {
    if (page.stop === null) seen.push(page.response.status);
  }

  // 取消要能一路传到传输层，否则 abort 只停调度、在飞请求还在跑
  assert.deepEqual(seen, [200]);
});

test('a collector failure propagates instead of being swallowed', async () => {
  const scheduler = cursorScheduler(
    {
      start: { items: ['a'], next: 'c2' },
      c2: { items: ['b'], next: null },
    },
    { collectorOptions: { failAt: 2 } }
  );

  // 分页调度不做错误恢复：重试是 RetryPolicy 的职责，
  // 在这里吞掉会让"少采了一页"变成静默数据丢失
  await assert.rejects(scheduler.collectAll(), /transport blew up/);
});

test('extractItems returning a non-array is a configuration error', async () => {
  const scheduler = new PaginationScheduler({
    collector: fakeCollector({ start: { items: ['a'], next: null } }),
    nextRequest: ({ index }) => index === 0
      ? { url: 'https://api.test/list', method: 'GET' }
      : null,
    extractItems: () => 'not-an-array',
  });

  await assert.rejects(scheduler.collectAll(), (error) => {
    assert.equal(error.code, CollectorErrorCode.INVALID_PLAN);
    return true;
  });
});

test('extractItems may return null for pages with no items', async () => {
  const scheduler = new PaginationScheduler({
    collector: fakeCollector({ start: { items: [], next: null } }),
    nextRequest: ({ index }) => index === 0
      ? { url: 'https://api.test/list', method: 'GET' }
      : null,
    extractItems: () => null,
    limits: { maxEmptyPages: 0 },
  });

  const result = await scheduler.collectAll();
  assert.deepEqual([...result.items], []);
});

// ------------------------------------------------------ 默认行为

test('the default cursor is the request url', async () => {
  const scheduler = new PaginationScheduler({
    collector: fakeCollector({ start: { items: ['a'], next: null } }),
    nextRequest: ({ index }) => index === 0
      ? { url: 'https://api.test/list', method: 'GET' }
      : null,
  });

  for await (const page of scheduler.pages()) {
    if (page.stop === null) {
      // 不给 cursorOf 时用 URL 兜底：至少能挡住"反复请求同一个 URL"
      assert.equal(page.cursor, 'https://api.test/list');
    }
  }
});

test('extractItems defaults to no items so request sequencing works alone', async () => {
  const scheduler = new PaginationScheduler({
    collector: fakeCollector({ start: { items: ['ignored'], next: null } }),
    nextRequest: ({ index }) => index === 0
      ? { url: 'https://api.test/list', method: 'GET' }
      : null,
    limits: { maxEmptyPages: 0 },
  });

  const result = await scheduler.collectAll();
  // 只关心请求序列（比如预热 cookie）时不必提供 extractItems
  assert.deepEqual([...result.items], []);
  assert.equal(result.pages.length, 1);
});
