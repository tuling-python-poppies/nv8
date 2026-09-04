import { blobMethod } from "./blob-method.js";

export const stream = blobMethod("stream", record => {
  const bytes = record.bytes.slice();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    },
    type: "bytes",
  });
});
