/**
 * Core Index - 统一导出
 */

export { createApp } from './app.js';
export { createSandbox } from './sandbox.js';
export { createRealm } from './realm-factory.js';
export * from './plugin-sdk/index.js';

// Evidence 抽象契约。Core 只依赖这个接口，不依赖具体 Bundle 格式。
export {
  TRUSTED_SCRIPT_POLICY,
  TRUSTED_SCRIPT_POLICY_ALIASES,
  EVIDENCE_SOURCE_METHODS,
  EvidenceContractError,
  EvidenceContractErrorCode,
  assertEvidenceSource,
  isEvidenceSource,
  normalizeTrustedScriptPolicy,
  resolveTrustedScriptIds,
} from './evidence-contract.js';
