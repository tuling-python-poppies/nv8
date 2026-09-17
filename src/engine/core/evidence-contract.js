/**
 * Evidence Source 契约
 *
 * Core 只依赖这个抽象接口，不依赖任何具体的 Evidence Bundle 磁盘格式、
 * manifest schema 或 loader 实现。
 *
 * 这样做的原因：
 * - Bundle 格式可以独立演进（新增字段、换容器、走远程存储），Core 不用改
 * - Core 的测试可以注入内存实现，不需要真实目录和哈希校验
 * - 具体 loader 可以拆成独立包，Core 不承担它的依赖
 *
 * 资源用不透明的 `id` 标识。基于文件的实现把 `id` 当作相对路径，
 * 但 Core 不做这个假设，只把 `id` 原样传回给 source。
 */

/**
 * 受信任脚本策略。
 *
 * 这是 **Core 的**策略枚举，不是 Bundle schema 的一部分——决定"哪些脚本
 * 允许在 Realm 里执行"属于运行时信任决策，而不是证据格式描述。
 */
export const TRUSTED_SCRIPT_POLICY = Object.freeze({
  /** 只执行 source 声明的入口脚本 */
  ENTRYPOINTS_ONLY: 'entrypoints-only',
  /** 只执行显式 allowlist 中的脚本 */
  ALLOWLIST: 'allowlist',
  /** 不执行任何证据脚本 */
  DENY_ALL: 'deny-all',
});

/**
 * 旧策略名到契约策略名的映射。
 *
 * `registered-only` 是 Evidence schema 层的历史命名，语义与
 * `entrypoints-only` 相同（只执行声明的入口）。保留别名以兼容现有配置。
 */
export const TRUSTED_SCRIPT_POLICY_ALIASES = Object.freeze({
  'registered-only': TRUSTED_SCRIPT_POLICY.ENTRYPOINTS_ONLY,
});

const TRUSTED_SCRIPT_POLICY_VALUES = new Set(Object.values(TRUSTED_SCRIPT_POLICY));

/**
 * EvidenceSource 必须实现的方法。
 * @type {readonly string[]}
 */
export const EVIDENCE_SOURCE_METHODS = Object.freeze([
  'has',
  'readText',
  'readBinary',
  'listEntryScripts',
  'listScripts',
  'listPages',
  'getNetworkReplayFixture',
  'describe',
]);

/**
 * Core 侧的 Evidence 契约错误。
 * 不继承 Evidence 实现层的错误类型，避免反向依赖。
 */
class EvidenceContractError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'EvidenceContractError';
    this.code = code;
    this.context = details.context ?? null;
    this.suggestions = details.suggestions ?? [];
    if (details.cause) this.cause = details.cause;
  }
}

export const EvidenceContractErrorCode = Object.freeze({
  SOURCE_INVALID: 'ERR_NV8_EVIDENCE_SOURCE_INVALID',
  RESOURCE_NOT_FOUND: 'ERR_NV8_EVIDENCE_RESOURCE_NOT_FOUND',
  POLICY_INVALID: 'ERR_NV8_EVIDENCE_POLICY_INVALID',
  POLICY_REJECTED: 'ERR_NV8_EVIDENCE_POLICY_REJECTED',
});

/**
 * 校验一个对象是否满足 EvidenceSource 契约。
 *
 * 采用 duck typing 而不是 instanceof：实现可以来自独立包、
 * 不同 Realm 或测试替身。
 *
 * @param {unknown} source
 * @param {string} [label] 诊断用途的来源标签
 * @returns {object} 原对象
 */
export function assertEvidenceSource(source, label = 'evidenceSource') {
  if (source === null || typeof source !== 'object') {
    throw new EvidenceContractError(
      EvidenceContractErrorCode.SOURCE_INVALID,
      `${label} must be an object implementing the EvidenceSource contract`,
      { context: { received: source === null ? 'null' : typeof source } }
    );
  }

  const missing = EVIDENCE_SOURCE_METHODS.filter(
    (method) => typeof source[method] !== 'function'
  );

  if (missing.length > 0) {
    throw new EvidenceContractError(
      EvidenceContractErrorCode.SOURCE_INVALID,
      `${label} is missing required method(s): ${missing.join(', ')}`,
      {
        context: { missing },
        suggestions: [
          'Wrap a concrete bundle with createEvidenceSource() from the evidence package',
        ],
      }
    );
  }

  return source;
}

/**
 * 判断对象是否满足契约，不抛错。
 * @param {unknown} source
 * @returns {boolean}
 */
export function isEvidenceSource(source) {
  if (source === null || typeof source !== 'object') return false;
  return EVIDENCE_SOURCE_METHODS.every((method) => typeof source[method] === 'function');
}

/**
 * 归一化受信任脚本策略配置。
 *
 * @param {object} [config]
 * @param {string} [config.trustedScriptPolicy]
 * @param {string[]} [config.scriptAllowlist]
 * @returns {Readonly<{ policy: string, allowlist: readonly string[] }>}
 */
export function normalizeTrustedScriptPolicy(config = {}) {
  const requested = config.trustedScriptPolicy ?? TRUSTED_SCRIPT_POLICY.ENTRYPOINTS_ONLY;
  const policy = TRUSTED_SCRIPT_POLICY_ALIASES[requested] ?? requested;

  if (!TRUSTED_SCRIPT_POLICY_VALUES.has(policy)) {
    throw new EvidenceContractError(
      EvidenceContractErrorCode.POLICY_INVALID,
      `Unknown trustedScriptPolicy "${requested}"`,
      {
        context: { policy: requested },
        suggestions: [
          `Use one of: ${[...TRUSTED_SCRIPT_POLICY_VALUES].join(', ')}`,
          `Accepted aliases: ${Object.keys(TRUSTED_SCRIPT_POLICY_ALIASES).join(', ')}`,
        ],
      }
    );
  }

  const allowlist = config.scriptAllowlist ?? [];
  if (!Array.isArray(allowlist) || allowlist.some((entry) => typeof entry !== 'string')) {
    throw new EvidenceContractError(
      EvidenceContractErrorCode.POLICY_INVALID,
      'scriptAllowlist must be an array of strings',
      { context: { policy } }
    );
  }

  if (policy === TRUSTED_SCRIPT_POLICY.ALLOWLIST && allowlist.length === 0) {
    throw new EvidenceContractError(
      EvidenceContractErrorCode.POLICY_INVALID,
      'trustedScriptPolicy "allowlist" requires a non-empty scriptAllowlist',
      {
        context: { policy },
        suggestions: ['Add script ids to scriptAllowlist, or use "entrypoints-only"'],
      }
    );
  }

  return Object.freeze({ policy, allowlist: Object.freeze([...allowlist]) });
}

/**
 * 按策略解析出允许执行的脚本 id 列表。
 *
 * @param {object} source EvidenceSource
 * @param {object} [config] 见 {@link normalizeTrustedScriptPolicy}
 * @returns {Promise<string[]>}
 */
export async function resolveTrustedScriptIds(source, config = {}) {
  assertEvidenceSource(source);
  const { policy, allowlist } = normalizeTrustedScriptPolicy(config);

  if (policy === TRUSTED_SCRIPT_POLICY.DENY_ALL) return [];

  if (policy === TRUSTED_SCRIPT_POLICY.ALLOWLIST) {
    const declared = await source.listScripts();
    const declaredIds = new Set(declared.map((entry) => entry.id));
    const rejected = allowlist.filter((id) => !declaredIds.has(id));
    if (rejected.length > 0) {
      throw new EvidenceContractError(
        EvidenceContractErrorCode.POLICY_REJECTED,
        `scriptAllowlist references undeclared script(s): ${rejected.join(', ')}`,
        {
          context: { rejected, declared: [...declaredIds] },
          suggestions: ['Only allowlist scripts that the evidence source declares'],
        }
      );
    }
    return [...allowlist];
  }

  return [...(await source.listEntryScripts())];
}
