/**
 * Page script execution policy. This is a permission boundary for script
 * classes and replay origins, not a claim that vm.Context is a security box.
 */

export function normalizeScriptPolicy(input = {}) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('scriptPolicy must be an object');
  }
  const origins = input.allowedOrigins;
  const allowedOrigins = origins === undefined || origins === null
    ? null
    : normalizeOrigins(origins);
  return Object.freeze({
    allowInline: booleanOption(input.allowInline, true, 'scriptPolicy.allowInline'),
    allowExternal: booleanOption(input.allowExternal, true, 'scriptPolicy.allowExternal'),
    allowModules: booleanOption(input.allowModules, true, 'scriptPolicy.allowModules'),
    allowDataUrls: booleanOption(input.allowDataUrls, true, 'scriptPolicy.allowDataUrls'),
    allowedOrigins,
  });
}

export function scriptPolicyAllows(policy, { url, inline, module, pageUrl }) {
  if (module && !policy.allowModules) return { allowed: false, reason: 'modules-disabled' };
  if (inline && !policy.allowInline) return { allowed: false, reason: 'inline-disabled' };
  if (!inline && !policy.allowExternal) return { allowed: false, reason: 'external-disabled' };
  if (url.startsWith('data:') && !policy.allowDataUrls) {
    return { allowed: false, reason: 'data-url-disabled' };
  }
  if (policy.allowedOrigins !== null && !originAllowed(url, pageUrl, policy.allowedOrigins)) {
    return { allowed: false, reason: 'origin-not-allowlisted' };
  }
  return { allowed: true, reason: null };
}

function booleanOption(value, fallback, label) {
  if (value === undefined) return fallback;
  if (typeof value !== 'boolean') throw new TypeError(`${label} must be boolean`);
  return value;
}

function normalizeOrigins(value) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new TypeError('scriptPolicy.allowedOrigins must be a non-empty array');
  }
  return Object.freeze([...new Set(value.map(origin => {
    if (typeof origin !== 'string') throw new TypeError('scriptPolicy.allowedOrigins must contain strings');
    try {
      return new URL(origin).origin;
    } catch {
      throw new TypeError(`scriptPolicy.allowedOrigins contains an invalid origin: ${origin}`);
    }
  }))].sort());
}

function originAllowed(url, pageUrl, allowedOrigins) {
  try {
    const resolved = new URL(url, pageUrl);
    return resolved.protocol !== 'data:' && allowedOrigins.includes(resolved.origin);
  } catch {
    return false;
  }
}
