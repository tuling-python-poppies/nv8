const FORBIDDEN_STACK_TEXT = [
  "node:",
  "node_modules",
  "internal/",
  "child/entry.js",
  "vm.js",
  "processTicksAndRejections",
];

// 仓库根（`src/engine/bootstrap/` 往上三级）。堆栈里出现这个前缀的帧都是
// NV8 自己的内部帧，要过滤掉——留着就等于给沙箱盖章。
const PROJECT_URL = new URL("../../../", import.meta.url).href;
const PROJECT_WINDOWS_PATH = new URL("../../../", import.meta.url)
  .pathname
  .replace(/^\/([A-Za-z]:)/u, "$1")
  .replaceAll("/", "\\");

export function sanitizeStackText(stack, pageUrl = "<anonymous>") {
  if (typeof stack !== "string") {
    return "";
  }
  const lines = stack.split(/\r?\n/u);
  const filtered = [];
  for (const line of lines) {
    if (
      line.includes(PROJECT_URL)
      || line.includes(PROJECT_WINDOWS_PATH)
      || FORBIDDEN_STACK_TEXT.some((text) => line.includes(text))
    ) {
      continue;
    }
    const scrubbed = line
      .replaceAll("evalmachine.<anonymous>", pageUrl)
      .replace(/\(?[A-Za-z]:\\[^():\r\n]+/gu, "<anonymous>")
      .replace(/\(?\/[^():\r\n]+\/src\/[^():\r\n]+/gu, "<anonymous>");
    filtered.push(scrubbed);
  }
  return filtered.join("\n");
}

export function sanitizeErrorRecord(error, pageUrl, maxOutputBytes) {
  const fallbackName = "Error";
  const name = typeof error?.name === "string" ? error.name : fallbackName;
  const rawMessage = typeof error?.message === "string"
    ? error.message
    : "Sandbox evaluation failed";
  const message = truncateUtf8(rawMessage, maxOutputBytes);
  const stack = truncateUtf8(
    sanitizeStackText(error?.stack, pageUrl) || `${name}: ${message}`,
    maxOutputBytes,
  );
  const code = typeof error?.code === "string"
    && (
      error.code.startsWith("ERR_EDGE_")
      || error.code.startsWith("LIMIT_")
      || error.code.startsWith("HOST_")
      || error.code.startsWith("PLUGIN_")
      || error.code.startsWith("DEPENDENCY_")
    )
    ? error.code
    : "ERR_EDGE_EVALUATION";
  return { name, message, code, stack };
}

function truncateUtf8(value, maxBytes) {
  if (Buffer.byteLength(value, "utf8") <= maxBytes) {
    return value;
  }
  let end = Math.min(value.length, maxBytes);
  while (end > 0 && Buffer.byteLength(value.slice(0, end), "utf8") > maxBytes) {
    end -= 1;
  }
  return value.slice(0, end);
}
