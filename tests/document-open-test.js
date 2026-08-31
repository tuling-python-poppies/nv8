/**
 * `document.open()` / `write()` / `close()` 的规范一致性测试
 *
 * `open()` 此前只改 readyState 和返回值，不清空文档——后果是
 * `open(); write(...); close()` 把新内容**追加**到旧文档而不是替换它，
 * 这恰好是这三个方法最常见的用法。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { createNv8, domPreset } from '../src/index.js';
import { streamsPlugin } from '../src/plugins/streams/index.js';
import { drainTasks } from './helpers/async-wait.js';

const silentLogger = { info() {}, warn() {}, error() {}, trace() {} };

const ORIGINAL_HTML = '<!doctype html><html><head><title>Original</title></head>'
  + '<body><p id="old">old</p></body></html>';

async function withDocument(html = ORIGINAL_HTML, id = 'document-open') {
  const nv8 = await createNv8({
    plugins: [...domPreset, streamsPlugin],
    profile: {
      id,
      version: '1.0.0',
      name: 'DocumentOpen',
      url: 'https://document.test/',
      pageHtml: html,
    },
    logger: silentLogger,
  });

  const realm = await nv8.sandbox.createRealm({
    type: 'root',
    pageUrl: 'https://document.test/',
    pageHtml: html,
  });
  await realm.pageScriptAsyncComplete;
  await drainTasks();

  return {
    read: (expression) => realm.evaluate(expression),
    json: (expression) => JSON.parse(realm.evaluate(`JSON.stringify(${expression})`)),
    dispose: () => nv8.destroy(),
  };
}

// -------------------------------------------------------------- open()

test('open() returns the document', async () => {
  const page = await withDocument(ORIGINAL_HTML, 'open-returns');
  try {
    assert.equal(page.read('document.open() === document'), true);
  } finally {
    await page.dispose();
  }
});

test('open() removes existing content', async () => {
  const page = await withDocument(ORIGINAL_HTML, 'open-clears');
  try {
    assert.equal(
      page.read('document.querySelector("#old") ? "present" : "absent"'),
      'present',
      'precondition: the original node exists'
    );

    page.read('document.open()');

    // 此前这里是 'present'——open() 不清空，后续 write 变成追加
    assert.equal(
      page.read('document.querySelector("#old") ? "present" : "absent"'),
      'absent',
      'open() must replace the document, not append to it'
    );
    assert.equal(page.read('document.title'), '', 'the old title is gone');
  } finally {
    await page.dispose();
  }
});

test('open() rebuilds an empty html/head/body skeleton', async () => {
  const page = await withDocument(ORIGINAL_HTML, 'open-skeleton');
  try {
    page.read('document.open()');

    // 浏览器在 open() 返回后立刻就有 html/head/body 可用；
    // write() 之前访问 document.body 不应是 null
    assert.equal(page.read('document.documentElement?.localName ?? null'), 'html');
    assert.equal(page.read('document.head ? "present" : "absent"'), 'present');
    assert.equal(page.read('document.body ? "present" : "absent"'), 'present');
    assert.equal(
      page.read('document.body.childNodes.length'),
      0,
      'the rebuilt body starts empty'
    );
  } finally {
    await page.dispose();
  }
});

test('open() leaves exactly one child node', async () => {
  const page = await withDocument(ORIGINAL_HTML, 'open-child-count');
  try {
    assert.equal(
      page.read('document.childNodes.length'),
      2,
      'precondition: doctype plus documentElement'
    );
    page.read('document.open()');
    assert.equal(
      page.read('document.childNodes.length'),
      1,
      'only the rebuilt documentElement remains; the doctype is dropped'
    );
  } finally {
    await page.dispose();
  }
});

test('open() sets readyState back to loading', async () => {
  const page = await withDocument(ORIGINAL_HTML, 'open-readystate');
  try {
    assert.equal(page.read('document.readyState'), 'complete');
    page.read('document.open()');
    assert.equal(page.read('document.readyState'), 'loading');
  } finally {
    await page.dispose();
  }
});

// ------------------------------------------------- open/write/close 组合

test('open, write and close replace the whole document', async () => {
  const page = await withDocument(ORIGINAL_HTML, 'owc-replace');
  try {
    const result = page.json(`(() => {
      document.open();
      document.write('<!doctype html><html><head><title>Replaced</title></head>'
        + '<body><p id="fresh">fresh</p></body></html>');
      document.close();
      return {
        title: document.title,
        hasOld: !!document.querySelector('#old'),
        hasFresh: !!document.querySelector('#fresh'),
        readyState: document.readyState,
      };
    })()`);

    assert.deepEqual(result, {
      title: 'Replaced',
      hasOld: false,
      hasFresh: true,
      readyState: 'complete',
    });
  } finally {
    await page.dispose();
  }
});

test('multiple writes are buffered until close', async () => {
  const page = await withDocument(ORIGINAL_HTML, 'owc-buffered');
  try {
    const result = page.json(`(() => {
      document.open();
      document.write('<html><body><p id="a">A');
      document.write('</p><p id="b">B</p></body></html>');
      document.close();
      return {
        a: document.querySelector('#a')?.textContent ?? null,
        b: document.querySelector('#b')?.textContent ?? null,
      };
    })()`);

    // 分片写入必须拼接后一次解析，否则跨片的标签会被截断
    assert.deepEqual(result, { a: 'A', b: 'B' });
  } finally {
    await page.dispose();
  }
});

test('close() moves readyState to complete', async () => {
  const page = await withDocument(ORIGINAL_HTML, 'owc-readystate');
  try {
    const states = page.json(`(() => {
      const seen = [];
      document.open();
      seen.push(document.readyState);
      document.write('<html><body>x</body></html>');
      seen.push(document.readyState);
      document.close();
      seen.push(document.readyState);
      return seen;
    })()`);

    assert.deepEqual(states, ['loading', 'loading', 'complete']);
  } finally {
    await page.dispose();
  }
});

test('close() without a preceding open() is a no-op', async () => {
  const page = await withDocument(ORIGINAL_HTML, 'owc-close-only');
  try {
    page.read('document.close()');
    assert.equal(
      page.read('document.querySelector("#old") ? "present" : "absent"'),
      'present',
      'a stray close() must not disturb the document'
    );
  } finally {
    await page.dispose();
  }
});

test('a second open() clears content written after the first', async () => {
  const page = await withDocument(ORIGINAL_HTML, 'owc-reopen');
  try {
    const result = page.json(`(() => {
      document.open();
      document.write('<html><body><p id="first">1</p></body></html>');
      document.close();
      const afterFirst = !!document.querySelector('#first');

      document.open();
      const afterReopen = !!document.querySelector('#first');
      document.write('<html><body><p id="second">2</p></body></html>');
      document.close();

      return {
        afterFirst,
        afterReopen,
        hasFirst: !!document.querySelector('#first'),
        hasSecond: !!document.querySelector('#second'),
      };
    })()`);

    assert.deepEqual(result, {
      afterFirst: true,
      afterReopen: false,
      hasFirst: false,
      hasSecond: true,
    });
  } finally {
    await page.dispose();
  }
});
