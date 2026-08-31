import { Opcode } from "../protocol/constants.js";
import { errorRecord } from "../protocol/typed-values.js";
import { sanitizeErrorRecord } from "../bootstrap/sanitize-stack.js";
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
    this.protocolLimits = {
      maxPayloadBytes: options.limits?.maxPayloadBytes,
      maxValueDepth: options.limits?.maxValueDepth,
    };
    this.runtime = new RuntimePool(options);
    await this.runtime.initialize();
    return undefined;
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
    const newOptions = {
      ...this.options,
      page: payload.page,
      persistence,
    };
    this.options = newOptions;
    this.runtime = new RuntimePool(newOptions);
    await this.runtime.initialize();
    this.runtime.preWarmShell();
    return persistence;
  }

  close() {
    this.runtime?.close();
    this.runtime = null;
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
