import { Opcode } from "../protocol/constants.js";
import { FrameReader } from "../protocol/frame-reader.js";
import { encodeFramedValue } from "../protocol/frame-writer.js";
import { decodeValue } from "../protocol/value-decoder.js";
import { errorRecord } from "../protocol/typed-values.js";
import { reportBackendDiagnostic } from "../protocol/diagnostics.js";
import { RequestHandler } from "./request-handler.js";

const handler = new RequestHandler();
let reader = null;
let queue = Promise.resolve();
let closing = false;

process.on("unhandledRejection", (reason) => {
  // Browsers report an unhandled Promise rejection to the owning global; they
  // do not terminate the entire renderer process. Keep the isolate alive but
  // leave a diagnosable record instead of an empty handler.
  reportBackendDiagnostic("unhandled sandbox rejection", reason);
});

reader = new FrameReader({
  onFrame(frame) {
    queue = queue
      .then(() => processFrame(frame))
      .catch((error) => {
        // 一个帧的失败不能把后续帧一起跳过；记录后尽力回 ERROR 响应。
        reportBackendDiagnostic(
          `frame ${frame.requestId} (opcode=${frame.opcode}) failed`,
          error,
        );
        writeBestEffortError(frame, error);
      });
  },
  onError(error) {
    reportBackendDiagnostic("sandbox frame reader failed", error);
    process.exitCode = 70;
    process.stdin.destroy();
  },
});

process.stdin.on("data", (chunk) => reader.push(chunk));
process.stdin.on("end", () => {
  if (!closing) {
    process.exitCode = 0;
  }
});
process.stdin.on("error", (error) => {
  reportBackendDiagnostic("sandbox stdin failed", error);
  process.exitCode = 74;
});

async function processFrame(frame) {
  let responseOpcode = frame.opcode | Opcode.RESPONSE_FLAG;
  let value;
  try {
    const payload = decodeValue(frame.payload, handler.protocolValueLimits());
    value = await handler.handle(frame.opcode, payload);
    if ([Opcode.UPDATE_LIMITS, Opcode.INIT, Opcode.RESET_REALM].includes(frame.opcode)) {
      // 父侧等待握手响应后才发送 INIT，无须在 onFrame 提前修改状态。
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
    // 保留真实错误码（LIMIT_STRING_BYTES / LIMIT_BYTES / ...），
    // 不再把任何编码失败伪装成 maxPayloadBytes 超限。
    response = encodeErrorResponse(frame.requestId, error);
  }
  try {
    await writeResponse(response);
  } catch (error) {
    reportBackendDiagnostic("failed to write sandbox response", error);
    return;
  }
  if (frame.opcode === Opcode.CLOSE) {
    closing = true;
    process.stdin.destroy();
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
    // 连错误记录都放不进极小的限制时，退回最小可编码记录。
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
    const response = encodeErrorResponse(frame.requestId, error);
    writeResponse(response).catch(() => {});
  } catch {
    // stdout 已不可用时诊断就是唯一记录。
  }
}

function writeResponse(frame) {
  return new Promise((resolve, reject) => {
    process.stdout.write(frame, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
