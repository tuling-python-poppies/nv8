import { createHash } from 'node:crypto';
import { CORE_VERSION, assertCoreVersion } from './core-version.js';
import {
  assertSupportedPluginApiVersion,
  CURRENT_PLUGIN_API_VERSION,
} from '../plugin-sdk/api-version.js';

export const PLUGIN_LOCK_SCHEMA = 'nv8.plugin-lock/v1';

export function createPluginLockPlan({
  plugins,
  profile = {},
  hostCapabilities = null,
  runtimeMode = 'legacy',
}) {
  const entries = plugins.map(plugin => ({
    apiVersion: assertSupportedPluginApiVersion(
      plugin.apiVersion ?? plugin.manifest?.apiVersion ?? CURRENT_PLUGIN_API_VERSION,
      plugin.id,
    ),
    id: plugin.id,
    version: plugin.version,
    requires: normalizeRequirements(plugin.requires || plugin.manifest?.requires || []),
    provides: normalizeCapabilities(plugin.provides || plugin.manifest?.provides || plugin.capabilities || []),
    realms: [...(plugin.manifest?.realms || plugin.supports?.realms || [])].sort(),
    legacy: plugin.legacy === true,
  }));
  const plan = {
    schema: PLUGIN_LOCK_SCHEMA,
    coreVersion: assertCoreVersion(CORE_VERSION),
    runtimeMode,
    profile: {
      id: profile.id || 'default',
      digest: digest(profile),
    },
    host: hostCapabilities === null ? null : {
      nodeVersion: hostCapabilities.nodeVersion,
      v8Version: hostCapabilities.v8Version,
      features: Object.fromEntries(
        Object.entries(hostCapabilities.features || {}).sort(([a], [b]) => a.localeCompare(b)),
      ),
    },
    plugins: entries,
    installOrder: entries.map(entry => entry.id),
  };
  const digestInput = JSON.stringify(plan);
  return Object.freeze({
    ...plan,
    digest: createHash('sha256').update(digestInput).digest('hex'),
  });
}

export function assertPluginLockPlan(actual, expected) {
  if (expected === null || expected === undefined) return;
  if (expected.schema !== PLUGIN_LOCK_SCHEMA) {
    throw new TypeError(`Unsupported plugin lock schema: ${expected.schema}`);
  }
  if (expected.digest !== actual.digest) {
    const error = new Error('Plugin lock plan does not match the selected runtime');
    error.code = 'PLUGIN_LOCK_MISMATCH';
    error.expected = expected.digest;
    error.actual = actual.digest;
    throw error;
  }
}

function normalizeRequirements(values) {
  return [...values].map(value => `${value}`).sort();
}

function normalizeCapabilities(values) {
  return [...values].map(value => (
    typeof value === 'string'
      ? value
      : `${value.name || value.id}@${value.version || '*'}`
  )).sort();
}

function digest(value) {
  return createHash('sha256').update(JSON.stringify(sortObject(value))).digest('hex');
}

function sortObject(value) {
  if (Array.isArray(value)) return value.map(sortObject);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map(key => [key, sortObject(value[key])]),
    );
  }
  return value;
}
