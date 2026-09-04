import { Opcode } from "../protocol/constants.js";
import { FrameReader } from "../protocol/frame-reader.js";
import { encodeFramedValue } from "../protocol/frame-writer.js";
import { decodeValue } from "../protocol/value-decoder.js";
import { errorRecord } from "../protocol/typed-values.js";
import { RequestHandler } from "./request-handler.js";

const handler = new RequestHandler();
let queue = Promise.resolve();
let closing = false;

process.on("unhandledRejection", () => {
  // Browsers report an unhandled Promise rejection to the owning global; they
  // do not terminate the entire renderer process. Realm event delivery needs
  // promise ownership metadata, but the Node default must never kill the
  // sandbox child in the meantime.
});

const reader = new FrameReader({
  onFrame(frame) {
    queue = queue.then(() => processFrame(frame));
  },
  onError() {
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
process.stdin.on("error", () => {
  process.exitCode = 74;
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
  await writeResponse(response);
  if (frame.opcode === Opcode.CLOSE) {
    closing = true;
    process.stdin.destroy();
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
