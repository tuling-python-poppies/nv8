/**
 * DOMTokenList.prototype.supports 的受支持 token 集合必须与真实 Chromium
 * (Edge 152 同源引擎)逐条对齐。此前 nv8 的 supports 对任何上下文都直接抛
 * TypeError,relList / sandbox.supports(...) 全部异常,与真实浏览器分叉、可被
 * 一行脚本探测。
 *
 * 基准值取自真实 Chromium 实测,注意几处易错点:
 * - 大小写:supports 先做 ASCII 小写归一,`supports('PRELOAD')` 应为 true。
 * - 空串 / 含空白:只返回 false,不抛(supports 不走 add/remove 的 token 校验)。
 * - sandbox:含 `allow-same-site-none-cookies`(true),但
 *   `allow-top-navigation-to-custom-protocols` / `allow-downloads-without-user-activation`
 *   都是 false。
 * - rel 按元素区分:<link> 与 <a>/<area>/<form> 是两套完全不同的集合。
 * - blocking→{render}、controlslist→{nodownload,nofullscreen,noremoteplayback}。
 * - classList / output.htmlFor 无受支持 token → 抛 TypeError。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const PAGE_HTML = '<!doctype html><html><head></head><body></body></html>';

const PROBE = `JSON.stringify((() => {
  const T = (fn) => { try { fn(); return null; } catch (e) { return e.constructor.name; } };
  const el = (t) => document.createElement(t);
  const a = el('a'), area = el('area'), form = el('form'), link = el('link');
  const iframe = el('iframe'), div = el('div'), output = el('output');
  const script = el('script'), style = el('style'), video = el('video');
  return {
    sandbox: {
      scripts: iframe.sandbox.supports('allow-scripts'),
      upper: iframe.sandbox.supports('ALLOW-SCRIPTS'),
      sameSiteNone: iframe.sandbox.supports('allow-same-site-none-cookies'),
      customProto: iframe.sandbox.supports('allow-top-navigation-to-custom-protocols'),
      downloadsNoUA: iframe.sandbox.supports('allow-downloads-without-user-activation'),
      bogus: iframe.sandbox.supports('bogus'),
      empty: iframe.sandbox.supports(''),
    },
    link: {
      preload: link.relList.supports('preload'),
      preloadUpper: link.relList.supports('PRELOAD'),
      modulepreload: link.relList.supports('modulepreload'),
      stylesheet: link.relList.supports('stylesheet'),
      compressionDict: link.relList.supports('compression-dictionary'),
      appleTouchIcon: link.relList.supports('apple-touch-icon'),
      canonical: link.relList.supports('canonical'),
      noopener: link.relList.supports('noopener'),
      bogus: link.relList.supports('bogus'),
    },
    anchor: {
      noopener: a.relList.supports('noopener'),
      opener: a.relList.supports('opener'),
      stylesheet: a.relList.supports('stylesheet'),
      preload: a.relList.supports('preload'),
      empty: a.relList.supports(''),
      withSpace: a.relList.supports('a b'),
    },
    area: { opener: area.relList.supports('opener'), stylesheet: area.relList.supports('stylesheet') },
    form: { opener: form.relList.supports('opener'), stylesheet: form.relList.supports('stylesheet') },
    blocking: {
      scriptRender: script.blocking.supports('render'),
      styleRender: style.blocking.supports('render'),
      linkRender: link.blocking.supports('render'),
      bogus: script.blocking.supports('bogus'),
    },
    controls: {
      nodownload: video.controlsList.supports('nodownload'),
      upper: video.controlsList.supports('NODOWNLOAD'),
      noremoteplayback: video.controlsList.supports('noremoteplayback'),
      bogus: video.controlsList.supports('bogus'),
    },
    classListThrows: T(() => div.classList.supports('x')),
    htmlForThrows: T(() => output.htmlFor.supports('x')),
  };
})())`;

async function probe() {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://tokenlist.test/page', {
    page: { html: PAGE_HTML },
    limits: { timeoutMs: 30_000 },
  });
  try {
    return JSON.parse(await sandbox.run(PROBE));
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
}

test('iframe.sandbox.supports matches real Chromium (case-insensitive, exact set)', async () => {
  const { sandbox } = await probe();
  assert.equal(sandbox.scripts, true);
  assert.equal(sandbox.upper, true);
  assert.equal(sandbox.sameSiteNone, true);
  assert.equal(sandbox.customProto, false);
  assert.equal(sandbox.downloadsNoUA, false);
  assert.equal(sandbox.bogus, false);
  assert.equal(sandbox.empty, false);
});

test('link.relList.supports uses the link-specific set', async () => {
  const { link } = await probe();
  assert.equal(link.preload, true);
  assert.equal(link.preloadUpper, true);
  assert.equal(link.modulepreload, true);
  assert.equal(link.stylesheet, true);
  assert.equal(link.compressionDict, true);
  assert.equal(link.appleTouchIcon, true);
  assert.equal(link.canonical, true);
  assert.equal(link.noopener, false);
  assert.equal(link.bogus, false);
});

test('a/area/form relList only support noopener/noreferrer/opener', async () => {
  const { anchor, area, form } = await probe();
  assert.equal(anchor.noopener, true);
  assert.equal(anchor.opener, true);
  assert.equal(anchor.stylesheet, false);
  assert.equal(anchor.preload, false);
  assert.equal(anchor.empty, false);
  assert.equal(anchor.withSpace, false);
  assert.equal(area.opener, true);
  assert.equal(area.stylesheet, false);
  assert.equal(form.opener, true);
  assert.equal(form.stylesheet, false);
});

test('blocking and controlsList support their exact token sets', async () => {
  const { blocking, controls } = await probe();
  assert.equal(blocking.scriptRender, true);
  assert.equal(blocking.styleRender, true);
  assert.equal(blocking.linkRender, true);
  assert.equal(blocking.bogus, false);
  assert.equal(controls.nodownload, true);
  assert.equal(controls.upper, true);
  assert.equal(controls.noremoteplayback, true);
  assert.equal(controls.bogus, false);
});

test('DOMTokenList without supported tokens throws TypeError', async () => {
  const { classListThrows, htmlForThrows } = await probe();
  assert.equal(classListThrows, 'TypeError');
  assert.equal(htmlForThrows, 'TypeError');
});
