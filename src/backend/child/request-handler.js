import { Opcode, DEFAULT_PROTOCOL_LIMITS } from "../protocol/constants.js";
import { errorRecord } from "../protocol/typed-values.js";
import { resolveProtocolLimits } from "../protocol/limits.js";
import { sanitizeErrorRecord } from "../../engine/bootstrap/sanitize-stack.js";
import { RuntimePool } from "./runtime-pool.js";

export class RequestHandler {
  constructor() {
    this.runtime = null;
    this.options = null;
    this.protocolLimits = null;
  }

  async handle(opcode, payload) {
    switch (opcode) {
      case Opcode.INIT:
        return this.initialize(payload);
      case Opcode.UPDATE_LIMITS:
        this.applyProtocolLimits(payload);
        return undefined;
      case Opcode.EVALUATE:
        return this.withRuntime((runtime) => runtime.evaluate(payload.source));
      case Opcode.BATCH_EVALUATE:
        return this.withRuntime((runtime) => runtime.batchEvaluate(payload.sources));
      case Opcode.EVALUATE_MODULE:
        return this.withRuntime((runtime) => (
          runtime.evaluateModule(payload.source, payload.url)
        ));
      case Opcode.SET_PAGE:
        return this.withRuntime((runtime) => runtime.exportPersistence());
      case Opcode.RESET_REALM:
        return this.resetRealm(payload);
      case Opcode.ENABLE_TRACE:
        return this.withRuntime((runtime) => runtime.enableTrace());
      case Opcode.DISABLE_TRACE:
        return this.withRuntime((runtime) => runtime.disableTrace());
      case Opcode.CLEAR_TRACE:
        return this.withRuntime((runtime) => runtime.clearTrace());
      case Opcode.READ_TRACE:
        return this.withRuntime((runtime) => runtime.readTrace());
      case Opcode.READ_NETWORK_REQUESTS:
        return this.withRuntime((runtime) => runtime.readNetworkRequests());
      case Opcode.CLEAR_NETWORK_REQUESTS:
        return this.withRuntime((runtime) => runtime.clearNetworkRequests());
      case Opcode.READ_RESOURCES:
        return this.withRuntime((runtime) => runtime.readResources());
      case Opcode.CLOSE:
        return this.close();
      default:
        throw protocolRequestError("Unknown request opcode");
    }
  }

  async initialize(options) {
    if (this.runtime !== null) {
      throw protocolRequestError("Child runtime was initialized twice");
    }
    this.options = options;
    // 与父侧 ConnectionBase.protocolLimits() 共用同一解析器：字符串/字节数
    // 等限制必须两边一致，否则合法请求会在子侧被打死（IKFD9N）。
    this.protocolLimits = resolveProtocolLimits(options?.limits);
    this.runtime = new RuntimePool(options);
    await this.runtime.initialize();
    return undefined;
  }

  applyProtocolLimits(options) {
    if (this.runtime !== null) throw protocolRequestError("Limits must be negotiated before INIT");
    this.protocolLimits = { ...DEFAULT_PROTOCOL_LIMITS, ...resolveProtocolLimits(options) };
  }

  withRuntime(callback) {
    if (this.runtime === null) {
      throw protocolRequestError("Child runtime has not been initialized");
    }
    return callback(this.runtime);
  }

  async resetRealm(payload) {
    if (this.runtime === null) {
      throw protocolRequestError("Child runtime has not been initialized");
    }
    // Destroy current realm and recreate with new page, preserving module cache.
    const persistence = this.runtime.exportPersistence();
    this.runtime.close();
    // 父侧 setPage 会把新的 page/fingerprint/proxyTrace 等一并发来；漏掉
    // proxyTrace 会让 enableTrace() 之后的 setPage 静默关掉 trace（IKF DAD）。
    const newOptions = {
      ...this.options,
      page: payload.page ?? this.options.page,
      fingerprint: payload.fingerprint ?? this.options.fingerprint,
      proxyTrace: payload.proxyTrace === undefined
        ? this.options.proxyTrace
        : { ...this.options.proxyTrace, ...payload.proxyTrace },
      networkCapture: payload.networkCapture ?? this.options.networkCapture,
      replay: payload.replay ?? this.options.replay,
      evidence: payload.evidence ?? this.options.evidence,
      limits: payload.limits ?? this.options.limits,
      persistence,
    };
    this.options = newOptions;
    this.protocolLimits = resolveProtocolLimits(newOptions.limits);
    this.runtime = new RuntimePool(newOptions);
    await this.runtime.initialize();
    this.runtime.preWarmShell();
    return persistence;
  }

  close() {
    this.runtime?.close();
    this.runtime = null;
    // 池化线程重新租用时，下一次小握手不能受上一个租户的小字符串限制影响。
    this.protocolLimits = { ...DEFAULT_PROTOCOL_LIMITS };
    this.options = null;
    return undefined;
  }

  responseLimits() {
    return this.protocolLimits ?? undefined;
  }

  protocolValueLimits() {
    return this.protocolLimits ?? undefined;
  }

  toErrorValue(error) {
    const pageUrl = this.options?.page?.url ?? "<anonymous>";
    const maxOutputBytes = this.options?.limits?.maxOutputBytes ?? 1024 * 1024;
    const record = sanitizeErrorRecord(error, pageUrl, maxOutputBytes);
    return errorRecord(record.name, record.message, record.code, record.stack);
  }
}

function protocolRequestError(message) {
  const error = new Error(message);
  error.code = "ERR_EDGE_PROTOCOL_REQUEST";
  return error;
}
