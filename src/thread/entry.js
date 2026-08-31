import { Buffer } from "node:buffer";
import { parentPort } from "node:worker_threads";
import { Opcode } from "../protocol/constants.js";
import { FrameReader } from "../protocol/frame-reader.js";
import { encodeFramedValue } from "../protocol/frame-writer.js";
import { decodeValue } from "../protocol/value-decoder.js";
import { errorRecord } from "../protocol/typed-values.js";
import { RequestHandler } from "../child/request-handler.js";

if (parentPort === null) {
  throw new Error("Sandbox thread entry requires a parent port");
}

const handler = new RequestHandler();
let queue = Promise.resolve();

process.on("unhandledRejection", () => {
  // Match the child-process runtime: realm rejections do not kill the isolate.
});

const reader = new FrameReader({
  onFrame(frame) {
    queue = queue.then(() => processFrame(frame));
  },
  onError() {
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
    responseOpcode = Opcode.ERROR;
    error.code = 'LIMIT_PAYLOAD_BYTES';
    error.message = 'Sandbox response exceeds limits.maxPayloadBytes';
    response = encodeFramedValue(
      responseOpcode,
      frame.requestId,
      errorRecord(
        'PayloadLimitError',
        'Sandbox response exceeds limits.maxPayloadBytes',
        'LIMIT_PAYLOAD_BYTES',
        '',
      ),
      handler.responseLimits(),
    );
  }
  parentPort.postMessage(response);
}
