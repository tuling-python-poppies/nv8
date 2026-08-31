import { blobMethod } from "./blob-method.js";

/**
 * `Blob.prototype.textStream()` —— Edge 151 新增。
 *
 * 真实 Edge 实测是**方法**（`value: function`，不是访问器），
 * `toString()` 为 `function textStream() { [native code] }`。
 *
 * 与 `stream()` 的区别：`stream()` 产出 `Uint8Array` 块，
 * `textStream()` 产出**已解码的字符串**块。
 */
export const textStream = blobMethod("textStream", record => {
  const text = new TextDecoder().decode(record.bytes.slice());
  return new ReadableStream({
    start(controller) {
      controller.enqueue(text);
      controller.close();
    },
  });
});
