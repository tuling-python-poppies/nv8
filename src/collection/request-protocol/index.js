/**
 * NV8 Protocol Layer
 *
 * 把运行时工件转换成请求变换，输出可被 Collector 执行的 RequestPlan。
 *
 * 边界：Protocol 不发起真实网络请求，不持有 socket、代理、凭据或重试策略。
 * 违反该边界的行为应通过 Collector 权限模型阻止，而不是在此层放宽。
 */

export {
  canonicalJson,
  canonicalDigest,
  canonicalByteLength,
} from './canonical-json.js';

export {
  ARTIFACT_SCHEMA_VERSION,
  ArtifactKind,
  DEFAULT_ARTIFACT_LIMITS,
  createRuntimeArtifact,
  parseArtifactSchemaVersion,
  isArtifactSchemaCompatible,
  isArtifactExpired,
  assertArtifactFresh,
  serializeArtifact,
  serializeArtifactToJson,
  deserializeArtifact,
} from './artifact.js';

export { ArtifactSet, createArtifactSet } from './artifact-set.js';

export {
  REQUEST_PLAN_SCHEMA_VERSION,
  BodyEncoding,
  DEFAULT_REQUEST_PLAN_LIMITS,
  createRequestPlan,
  getHeader,
  getHeaderValues,
  getCookie,
  requestPlanToJSON,
} from './request-plan.js';

export {
  TransformKind,
  DEFAULT_TRANSFORM_LIMITS,
  createTransform,
  applyTransforms,
  findTransformConflicts,
  transformsDigest,
  diffRequestPlans,
} from './transforms.js';

export {
  defineProtocolAdapter,
  checkAdapterRequirements,
  assertAdapterRequirements,
} from './adapter.js';

export {
  ProtocolRegistry,
  createProtocolRegistry,
  protocolResultToJSON,
} from './registry.js';

export {
  ProtocolErrorCode,
  ProtocolError,
  ArtifactInvalidError,
  ArtifactExpiredError,
  ProtocolDefinitionError,
  TransformError,
} from './errors.js';
