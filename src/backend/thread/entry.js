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

process.on("unhandledRejection", (reason) => {
  // Match the child-process runtime: realm rejections do not kill the isolate,
  // but they must remain visible to the host's stderr.
  reportBackendDiagnostic("unhandled sandbox rejection", reason);
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
    if (frame.opcode === Opcode.INIT) {
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
