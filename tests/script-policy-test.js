import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_SCRIPT_POLICY,
  normalizeScriptPolicy,
  scriptPolicyAllows,
} from '../src/engine/core/script-policy.js';

test('default script policy allows ordinary replay scripts', () => {
  const policy = normalizeScriptPolicy();
  assert.deepEqual(policy, DEFAULT_SCRIPT_POLICY);
  assert.deepEqual(scriptPolicyAllows(policy, {
    url: 'https://target.test/app.js',
    inline: false,
    module: false,
    pageUrl: 'https://target.test/',
  }), { allowed: true, reason: null });
});

test('script classes can be denied independently', () => {
  const policy = normalizeScriptPolicy({
    allowInline: false,
    allowExternal: false,
    allowModules: false,
    allowDataUrls: false,
  });
  assert.equal(scriptPolicyAllows(policy, {
    url: 'https://target.test/', inline: true, module: false, pageUrl: 'https://target.test/',
  }).reason, 'inline-disabled');
  assert.equal(scriptPolicyAllows(policy, {
    url: 'https://target.test/app.js', inline: false, module: false, pageUrl: 'https://target.test/',
  }).reason, 'external-disabled');
  assert.equal(scriptPolicyAllows(policy, {
    url: 'https://target.test/app.js', inline: false, module: true, pageUrl: 'https://target.test/',
  }).reason, 'modules-disabled');
  assert.equal(scriptPolicyAllows(normalizeScriptPolicy({ allowDataUrls: false }), {
    url: 'data:text/javascript,export default 1', inline: false, module: true, pageUrl: 'https://target.test/',
  }).reason, 'data-url-disabled');
});

test('allowedOrigins canonicalizes origins and blocks cross-origin scripts', () => {
  const policy = normalizeScriptPolicy({ allowedOrigins: ['https://cdn.test/path', 'https://target.test'] });
  assert.deepEqual(policy.allowedOrigins, ['https://cdn.test', 'https://target.test']);
  assert.equal(scriptPolicyAllows(policy, {
    url: 'https://cdn.test/app.js', inline: false, module: false, pageUrl: 'https://target.test/',
  }).allowed, true);
  assert.equal(scriptPolicyAllows(policy, {
    url: 'https://evil.test/app.js', inline: false, module: false, pageUrl: 'https://target.test/',
  }).reason, 'origin-not-allowlisted');
});

test('script policy rejects malformed configuration', () => {
  assert.throws(() => normalizeScriptPolicy({ allowModules: 'yes' }), /must be boolean/);
  assert.throws(() => normalizeScriptPolicy({ allowedOrigins: [] }), /non-empty array/);
  assert.throws(() => normalizeScriptPolicy({ allowedOrigins: ['not-an-origin'] }), /invalid origin/);
});
