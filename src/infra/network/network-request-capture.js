import { Buffer } from "node:buffer";

const RECORD_OVERHEAD_BYTES = 512;
const MAX_CAPTURED_URL_BYTES = 64 * 1024;

export class NetworkRequestCapture {
  constructor(options, persisted = null) {
    this.options = options;
    this.ring = new Array(Math.min(options.maxEntries, 1024));
    this.ringStart = 0;
    this.ringSize = 0;
    this.storedBytes = 0;
    this.nextSequence = 1;
    this.restore(persisted);
  }

  scopedRecorder(context) {
    const capture = this;
    const normalizedContext = Object.freeze({
      kind: `${context.kind}`,
      url: `${context.url}`,
      topLevel: Boolean(context.topLevel),
    });
    return Object.freeze({
      record(request) {
        capture.record(normalizedContext, request);
      },
    });
  }

  record(context, request) {
    if (!this.options.enabled) return;

    const api = `${request.api}`;
    const method = `${request.method}`;
    const outcome = `${request.outcome}`;
    const urlBudget = Math.min(
      MAX_CAPTURED_URL_BYTES,
      Math.max(
        0,
        Math.floor(
          (this.options.maxTotalBytes - RECORD_OVERHEAD_BYTES) / 3,
        ),
      ),
    );
    const capturedUrl = truncateText(
      `${request.url}`,
      urlBudget,
    );
    const capturedContextUrl = truncateText(
      context.url,
      urlBudget,
    );
    const baseBytes = RECORD_OVERHEAD_BYTES
      + Buffer.byteLength(api)
      + Buffer.byteLength(method)
      + Buffer.byteLength(outcome)
      + Buffer.byteLength(context.kind)
      + Buffer.byteLength(capturedUrl.value)
      + Buffer.byteLength(capturedContextUrl.value);
    const capturedHeaders = captureHeaders(
      request.headers,
      Math.min(
        this.options.maxHeaderBytes,
        Math.max(0, this.options.maxTotalBytes - baseBytes),
      ),
    );
    const fixedBytes = baseBytes + capturedHeaders.byteLength;
    const availableBodyBytes = Math.max(
      0,
      this.options.maxTotalBytes - fixedBytes,
    );
    const body = captureBody(
      request.body,
      Math.min(this.options.maxBodyBytes, availableBodyBytes),
    );
    const storedBytes = fixedBytes + body.bytes.byteLength;
    const record = {
      sequence: this.nextSequence,
      api,
      context: {
        kind: context.kind,
        url: capturedContextUrl.value,
        urlTruncated: capturedContextUrl.truncated,
        topLevel: context.topLevel,
      },
      method,
      url: capturedUrl.value,
      urlTruncated: capturedUrl.truncated,
      headers: capturedHeaders.headers,
      headersTruncated: capturedHeaders.truncated,
      body: body.bytes,
      bodyByteLength: body.byteLength,
      bodyTruncated: body.truncated,
      outcome,
      storedBytes,
    };
    this.nextSequence += 1;

    while (
      this.ringSize > 0
      && (
        this.ringSize >= this.options.maxEntries
        || this.storedBytes + storedBytes > this.options.maxTotalBytes
      )
    ) {
      const removed = this.ring[this.ringStart];
      this.ring[this.ringStart] = undefined;
      this.ringStart = (this.ringStart + 1) % this.ring.length;
      this.ringSize -= 1;
      this.storedBytes -= removed.storedBytes;
    }

    if (storedBytes > this.options.maxTotalBytes) return;
    this.growIfNeeded();
    const insertIndex = (this.ringStart + this.ringSize) % this.ring.length;
    this.ring[insertIndex] = record;
    this.ringSize += 1;
    this.storedBytes += storedBytes;
  }

  growIfNeeded() {
    if (this.ringSize < this.ring.length) return;
    const newCapacity = Math.min(
      this.ring.length * 2,
      this.options.maxEntries,
    );
    if (newCapacity <= this.ring.length) return;
    const expanded = new Array(newCapacity);
    for (let i = 0; i < this.ringSize; i += 1) {
      expanded[i] = this.ring[(this.ringStart + i) % this.ring.length];
    }
    this.ring = expanded;
    this.ringStart = 0;
  }

  clear() {
    this.ring.fill(undefined);
    this.ringStart = 0;
    this.ringSize = 0;
    this.storedBytes = 0;
  }

  read() {
    const output = new Array(this.ringSize);
    for (let i = 0; i < this.ringSize; i += 1) {
      output[i] = copyRecord(
        this.ring[(this.ringStart + i) % this.ring.length],
      );
    }
    return output;
  }

  exportState() {
    return {
      nextSequence: this.nextSequence,
      records: this.read(),
    };
  }

  restore(persisted) {
    if (persisted === null || typeof persisted !== "object") return;
    if (
      Number.isSafeInteger(persisted.nextSequence)
      && persisted.nextSequence > 0
    ) {
      this.nextSequence = persisted.nextSequence;
    }
    if (!Array.isArray(persisted.records)) return;
    for (const record of persisted.records) {
      const copy = restoreRecord(record);
      if (copy === null) continue;
      while (
        this.ringSize > 0
        && (
          this.ringSize >= this.options.maxEntries
          || this.storedBytes + copy.storedBytes > this.options.maxTotalBytes
        )
      ) {
        const removed = this.ring[this.ringStart];
        this.ring[this.ringStart] = undefined;
        this.ringStart = (this.ringStart + 1) % this.ring.length;
        this.ringSize -= 1;
        this.storedBytes -= removed.storedBytes;
      }
      if (copy.storedBytes > this.options.maxTotalBytes) continue;
      this.growIfNeeded();
      const insertIndex = (this.ringStart + this.ringSize) % this.ring.length;
      this.ring[insertIndex] = copy;
      this.ringSize += 1;
      this.storedBytes += copy.storedBytes;
    }
  }
}

function captureHeaders(source, maximumBytes) {
  const headers = [];
  let byteLength = 0;
  let truncated = false;
  const length = Number.isSafeInteger(source?.length) ? source.length : 0;
  for (let index = 0; index < length; index += 1) {
    const pair = source[index];
    const name = `${pair?.[0] ?? ""}`;
    const value = `${pair?.[1] ?? ""}`;
    const pairBytes = Buffer.byteLength(name) + Buffer.byteLength(value) + 16;
    if (byteLength + pairBytes > maximumBytes) {
      truncated = true;
      break;
    }
    headers.push([name, value]);
    byteLength += pairBytes;
  }
  if (headers.length < length) truncated = true;
  return { headers, byteLength, truncated };
}

function captureBody(source, maximumBytes) {
  const byteLength = Number.isSafeInteger(source?.byteLength)
    ? source.byteLength
    : 0;
  const capturedLength = Math.min(byteLength, maximumBytes);
  const bytes = new Uint8Array(capturedLength);
  for (let index = 0; index < capturedLength; index += 1) {
    bytes[index] = Number(source[index]) & 0xff;
  }
  return {
    bytes,
    byteLength,
    truncated: capturedLength < byteLength,
  };
}

function truncateText(value, maximumBytes) {
  const encoded = Buffer.from(value);
  if (encoded.byteLength <= maximumBytes) {
    return { value, truncated: false };
  }
  return {
    value: encoded.subarray(0, maximumBytes).toString("utf8"),
    truncated: true,
  };
}

function copyRecord(record) {
  return {
    sequence: record.sequence,
    api: record.api,
    context: { ...record.context },
    method: record.method,
    url: record.url,
    urlTruncated: record.urlTruncated,
    headers: record.headers.map(pair => [...pair]),
    headersTruncated: record.headersTruncated,
    body: record.body.slice(),
    bodyByteLength: record.bodyByteLength,
    bodyTruncated: record.bodyTruncated,
    outcome: record.outcome,
  };
}

function restoreRecord(record) {
  if (
    record === null
    || typeof record !== "object"
    || !Number.isSafeInteger(record.sequence)
    || record.sequence < 1
  ) {
    return null;
  }
  const headers = captureHeaders(
    record.headers,
    Number.MAX_SAFE_INTEGER,
  );
  const body = captureBody(record.body, Number.MAX_SAFE_INTEGER);
  const context = {
    kind: `${record.context?.kind ?? "window"}`,
    url: `${record.context?.url ?? ""}`,
    urlTruncated: Boolean(record.context?.urlTruncated),
    topLevel: Boolean(record.context?.topLevel),
  };
  const restored = {
    sequence: record.sequence,
    api: `${record.api}`,
    context,
    method: `${record.method}`,
    url: `${record.url}`,
    urlTruncated: Boolean(record.urlTruncated),
    headers: headers.headers,
    headersTruncated: Boolean(record.headersTruncated),
    body: body.bytes,
    bodyByteLength: Number.isSafeInteger(record.bodyByteLength)
      ? record.bodyByteLength
      : body.byteLength,
    bodyTruncated: Boolean(record.bodyTruncated),
    outcome: `${record.outcome}`,
  };
  restored.storedBytes = estimateStoredBytes(restored);
  return restored;
}

function estimateStoredBytes(record) {
  let size = RECORD_OVERHEAD_BYTES
    + Buffer.byteLength(record.api)
    + Buffer.byteLength(record.context.kind)
    + Buffer.byteLength(record.context.url)
    + Buffer.byteLength(record.method)
    + Buffer.byteLength(record.url)
    + Buffer.byteLength(record.outcome)
    + record.body.byteLength;
  for (const [name, value] of record.headers) {
    size += Buffer.byteLength(name) + Buffer.byteLength(value) + 16;
  }
  return size;
}
