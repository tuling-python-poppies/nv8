/**
 * Plugin SDK contract version.
 *
 * This is intentionally independent from plugin.version: the latter describes
 * the implementation, while apiVersion describes the shape of the SDK hooks
 * and lifecycle contract consumed by Core.
 */
export const CURRENT_PLUGIN_API_VERSION = '1';
export const SUPPORTED_PLUGIN_API_MAJORS = Object.freeze(['1']);

export function normalizePluginApiVersion(value = CURRENT_PLUGIN_API_VERSION) {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    throw new TypeError(
      `Plugin apiVersion must be a numeric major string (for example "${CURRENT_PLUGIN_API_VERSION}")`,
    );
  }
  const normalized = String(Number(value));
  if (normalized !== value) {
    throw new TypeError(`Plugin apiVersion must not contain leading zeroes: "${value}"`);
  }
  return normalized;
}

export function assertSupportedPluginApiVersion(value, pluginId = 'unknown') {
  const apiVersion = normalizePluginApiVersion(value);
  if (!SUPPORTED_PLUGIN_API_MAJORS.includes(apiVersion)) {
    const error = new Error(
      `Plugin "${pluginId}" requires unsupported Plugin SDK apiVersion "${apiVersion}"`,
    );
    error.code = 'PLUGIN_SDK_API_UNSUPPORTED';
    error.pluginId = pluginId;
    error.apiVersion = apiVersion;
    error.supportedApiVersions = [...SUPPORTED_PLUGIN_API_MAJORS];
    throw error;
  }
  return apiVersion;
}
