import test from 'node:test';
import assert from 'node:assert/strict';
import {
  compareSchemaVersions,
  isSchemaVersionCompatible,
  parseSchemaVersion,
  resolveSchemaCompatibility,
} from '../src/collection/evidence/index.js';

test('schema versions use strict major.minor notation', () => {
  assert.deepEqual(parseSchemaVersion('1.2'), { major: 1, minor: 2, value: '1.2' });
  assert.equal(parseSchemaVersion('1.2.0'), null);
  assert.equal(parseSchemaVersion('v1.2'), null);
  assert.equal(parseSchemaVersion('1.x'), null);
});

test('schema versions compare by major then minor', () => {
  assert.equal(compareSchemaVersions('1.0', '1.1'), -1);
  assert.equal(compareSchemaVersions('2.0', '1.9'), 1);
  assert.equal(compareSchemaVersions('1.2', '1.2'), 0);
});

test('current and older same-major schemas are compatible', () => {
  assert.deepEqual(resolveSchemaCompatibility('1.0', ['1.2']), {
    compatible: true,
    mode: 'compatible-legacy',
    version: '1.0',
  });
  assert.equal(isSchemaVersionCompatible('1.0', { supportedVersions: ['1.2'] }), true);
});

test('newer minor and different major schemas are rejected', () => {
  assert.deepEqual(resolveSchemaCompatibility('1.3', ['1.2']), {
    compatible: false,
    reason: 'newer-minor',
  });
  assert.deepEqual(resolveSchemaCompatibility('2.0', ['1.2']), {
    compatible: false,
    reason: 'major-mismatch',
  });
});

test('legacy compatibility can be disabled explicitly', () => {
  assert.deepEqual(resolveSchemaCompatibility('1.0', ['1.2'], { allowLegacy: false }), {
    compatible: false,
    reason: 'legacy-disabled',
  });
});

test('invalid versions are incompatible rather than guessed', () => {
  assert.deepEqual(resolveSchemaCompatibility('latest', ['1.0']), {
    compatible: false,
    reason: 'invalid',
  });
});
