import { Buffer } from "node:buffer";
import { parentPort } from "node:worker_threads";
import { Opcode } from "../protocol/constants.js";
import { FrameReader } from "../protocol/frame-reader.js";
import { encodeFramedValue } from "../protocol/frame-writer.js";
import { decodeValue } from "../protocol/value-decoder.js";
import { errorRecord } from "../protocol/typed-values.js";
import { reportBackendDiagnostic } from "../protocol/diagnostics.js";
import { RequestHandler } from "../child/request-handler.js";

if (parentPort === null) {
  throw new Error("Sandbox thread entry requires a parent port");
}

const handler = new RequestHandler();
let reader = null;
let queue = Promise.resolve();
const rejectionReasons = new WeakMap();

process.on("unhandledRejection", (reason, promise) => {
  // 与 child-process 运行时一致：先路由到拥有该 Promise 的 Realm 派发窗口
  // `unhandledrejection` 事件；无 Realm 认领时保留 stderr 诊断。
  if (promise !== null && typeof promise === "object") {
    rejectionReasons.set(promise, reason);
  }
  if (!handler.handleUnhandledRejection(reason, promise)) {
    reportBackendDiagnostic("unhandled sandbox rejection", reason);
  }
});

process.on("rejectionHandled", (promise) => {
  const reason = promise !== null && typeof promise === "object"
    ? rejectionReasons.get(promise)
    : undefined;
  if (promise !== null && typeof promise === "object") {
    rejectionReasons.delete(promise);
  }
  handler.handleRejectionHandled(promise, reason);
});

reader = new FrameReader({
  onFrame(frame) {
    queue = queue
      .then(() => processFrame(frame))
      .catch((error) => {
        reportBackendDiagnostic(
          `frame ${frame.requestId} (opcode=${frame.opcode}) failed`,
          error,
        );
        writeBestEffortError(frame, error);
      });
  },
  onError(error) {
    reportBackendDiagnostic("sandbox frame reader failed", error);
    parentPort.close();
  },
});

parentPort.on("message", chunk => {
  reader.push(Buffer.from(
    chunk.buffer,
    chunk.byteOffset,
    chunk.byteLength,
  ));
});

async function processFrame(frame) {
  let responseOpcode = frame.opcode | Opcode.RESPONSE_FLAG;
  let value;
  try {
    const payload = decodeValue(frame.payload, handler.protocolValueLimits());
    value = await handler.handle(frame.opcode, payload);
    if ([Opcode.UPDATE_LIMITS, Opcode.INIT, Opcode.RESET_REALM, Opcode.CLOSE].includes(frame.opcode)) {
      reader.setLimits(handler.protocolValueLimits());
    }
  } catch (error) {
    responseOpcode = Opcode.ERROR;
    value = handler.toErrorValue(error);
  }
  let response;
  try {
    response = encodeFramedValue(
      responseOpcode,
      frame.requestId,
      value,
      handler.responseLimits(),
    );
  } catch (error) {
    response = encodeErrorResponse(frame.requestId, error);
  }
  try {
    parentPort.postMessage(response);
  } catch (error) {
    reportBackendDiagnostic("failed to post sandbox response", error);
  }
}

function encodeErrorResponse(requestId, error) {
  const limits = handler.responseLimits();
  try {
    return encodeFramedValue(
      Opcode.ERROR,
      requestId,
      errorRecord(
        `${error?.name ?? "Error"}`,
        `${error?.message ?? error}`,
        typeof error?.code === "string" ? error.code : "ERR_EDGE_RESPONSE_ENCODE",
        "",
      ),
      limits,
    );
  } catch {
    return encodeFramedValue(
      Opcode.ERROR,
      requestId,
      errorRecord("PayloadLimitError", "", "LIMIT_PAYLOAD_BYTES", ""),
      limits,
    );
  }
}

function writeBestEffortError(frame, error) {
  try {
    parentPort.postMessage(encodeErrorResponse(frame.requestId, error));
  } catch {
    // parentPort 已关闭时诊断就是唯一记录。
  }
}
