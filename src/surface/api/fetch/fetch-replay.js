import { defineGlobalFunction } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { traceCall } from "../../../infra/trace/trace-function.js";
import { Request, createReplayResponse, requireRequest } from "./request-response-runtime.js";
import { headersEntries } from "./headers-runtime.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// replay entries、recorder、ServiceWorker 拦截器和 sequence 游标原先是模块级
// 状态，会让多个 Realm 共享 replay 消耗次数和请求记录。
const replaySlot = createRealmSlot(() => ({
  records: [],
  networkRequestRecorder: null,
  serviceWorkerFetch: null,
  replayStrategy: "method-url",
  enforceSequence: false,
  sequenceCursor: 0,
}), "fetch-replay");

function replayState() {
  return replaySlot.get(globalThis);
}

export function configureFetchReplay(entries = [], recorder = null, options = {}) {
  const state = replayState();
  state.networkRequestRecorder = recorder;
  state.serviceWorkerFetch = typeof options.serviceWorkerFetch === "function"
    ? options.serviceWorkerFetch
    : null;
  state.replayStrategy = `${options.strategy ?? "method-url"}`;
  state.enforceSequence = options.enforceSequence
    ?? entries.some(entry => entry?.sequence !== undefined);
  state.sequenceCursor = 0;
  state.records = [...entries].map(entry => ({
    method: `${entry.method ?? "GET"}`.toUpperCase(),
    url: `${entry.url}`,
    status: Number(entry.status ?? 200),
    statusText: `${entry.statusText ?? ""}`,
    headers: { ...(entry.headers ?? {}) },
    requestHeaders: entry.requestHeaders ?? null,
    body: `${entry.body ?? ""}`,
    requestBody: entry.requestBody ?? null,
    requestBodySha256: entry.requestBodySha256 ?? entry.bodySha256 ?? null,
    repeat: entry.repeat ?? "once",
    sequence: entry.sequence,
    matching: entry.matching ?? null,
    used: 0,
    redirected: Boolean(entry.redirected),
    type: `${entry.type ?? "basic"}`,
  }));
}

export function installFetch() {
  const fetch = function fetch(input, init = undefined) {
    const result = new Promise((resolve, reject) => {
      try {
        const request = input instanceof Request && init === undefined
          ? input
          : new Request(input, init);
        const requestRecord = requireRequest(request);
        const serviceWorkerFetch = replayState().serviceWorkerFetch;
        if (serviceWorkerFetch !== null) {
          Promise.resolve(serviceWorkerFetch({
            method: requestRecord.method,
            url: requestRecord.url,
            headers: Object.fromEntries(headersEntries(requestRecord.headers)),
            body: requestRecord.bytes,
          })).then(intercepted => {
            if (intercepted === null || intercepted === undefined) {
              resolve(replayRequest(request, "fetch"));
              return;
            }
            captureRequest("fetch", requestRecord, "service-worker");
            resolve(createReplayResponse(intercepted.body, {
              status: intercepted.status,
              statusText: intercepted.statusText,
              headers: intercepted.headers,
            }, {
              url: intercepted.url ?? requestRecord.url,
              redirected: intercepted.redirected,
              type: intercepted.type,
            }));
          }, reject);
          return;
        }
        resolve(replayRequest(request, "fetch"));
      } catch (error) {
        reject(error);
      }
    });
    traceCall("window.fetch", "Window", [input, init], result);
    return result;
  };
  Object.defineProperty(fetch, "length", { value: 1, configurable: true });
  registerNativeFunction(fetch, "fetch");
  defineGlobalFunction("fetch", fetch);
}

export async function replayRequestWithServiceWorker(request, api = "fetch") {
  const requestRecord = requireRequest(request);
  const serviceWorkerFetch = replayState().serviceWorkerFetch;
  if (serviceWorkerFetch === null) return replayRequest(request, api);
  const intercepted = await serviceWorkerFetch({
    method: requestRecord.method,
    url: requestRecord.url,
    headers: Object.fromEntries(headersEntries(requestRecord.headers)),
    body: requestRecord.bytes,
  });
  if (intercepted === null || intercepted === undefined) {
    return replayRequest(request, api);
  }
  captureRequest(api, requestRecord, "service-worker");
  return createReplayResponse(intercepted.body, {
    status: intercepted.status,
    statusText: intercepted.statusText,
    headers: intercepted.headers,
  }, {
    url: intercepted.url ?? requestRecord.url,
    redirected: intercepted.redirected,
    type: intercepted.type,
  });
}

export function replayRequest(request, api = "fetch") {
  const requestRecord = requireRequest(request);
  if (requestRecord.signal.aborted) {
    captureRequest(api, requestRecord, "aborted");
    throw new DOMException("The operation was aborted.", "AbortError");
  }
  const match = findReplayRecord(requestRecord);
  if (match === null) {
    const error = createReplayMissError(api, requestRecord, {
      reason: "missing",
      candidates: [],
    });
    captureRequest(api, requestRecord, "replay-miss:missing");
    throw error;
  }
  if (match.error !== undefined) {
    const error = createReplayMissError(api, requestRecord, match.error);
    captureRequest(api, requestRecord, `replay-miss:${match.error.reason}`);
    throw error;
  }
  captureRequest(api, requestRecord, "replayed");
  match.record.used += 1;
  const state = replayState();
  if (state.enforceSequence && match.record.sequence !== undefined) {
    state.sequenceCursor += 1;
  }
  return createReplayResponse(match.record.body, {
    status: match.record.status,
    statusText: match.record.statusText,
    headers: match.record.headers,
  }, {
    url: match.record.url,
    redirected: match.record.redirected,
    type: match.record.type,
  });
}

function findReplayRecord(request) {
  const state = replayState();
  const candidates = state.records.filter(record => (
    record.method === request.method && record.url === request.url
  ));
  if (candidates.length === 0) return null;
  let exhausted = true;
  let sequenceMismatch = false;
  let requestMismatch = false;
  for (const record of candidates) {
    if (!isAvailable(record)) continue;
    exhausted = false;
    const strategy = record.matching ?? state.replayStrategy;
    if (!matchesRequest(request, record, strategy)) {
      requestMismatch = true;
      continue;
    }
    if (
      state.enforceSequence
      && record.sequence !== undefined
      && record.sequence !== state.sequenceCursor
    ) {
      sequenceMismatch = true;
      continue;
    }
    return { record };
  }
  const candidateDetails = candidates.map(record => ({
    repeat: record.repeat,
    sequence: record.sequence,
    used: record.used,
  }));
  if (sequenceMismatch) {
    return {
      error: {
        reason: "sequence-mismatch",
        candidates: candidateDetails,
        sequence: state.sequenceCursor,
      },
    };
  }
  if (exhausted) {
    return {
      error: {
        reason: "exhausted",
        candidates: candidateDetails,
      },
    };
  }
  if (requestMismatch) {
    return {
      error: {
        reason: "request-mismatch",
        candidates: candidateDetails,
      },
    };
  }
  return null;
}

function createReplayMissError(api, request, diagnostic) {
  const details = Object.freeze({
    api,
    method: request.method,
    url: request.url,
    reason: diagnostic.reason,
    sequence: diagnostic.sequence,
    candidates: Object.freeze((diagnostic.candidates ?? []).map(candidate => (
      Object.freeze({ ...candidate })
    ))),
  });
  const error = new TypeError(
    `Offline replay miss for ${api} ${request.method} ${request.url}: ${diagnostic.reason}`,
  );
  error.code = "ERR_NV8_REPLAY_MISS";
  error.details = details;
  return error;
}

function isAvailable(record) {
  if (record.repeat === "unlimited") return true;
  if (record.repeat === "once" || record.repeat === undefined) return record.used < 1;
  const limit = Number(record.repeat);
  return Number.isSafeInteger(limit) && limit >= 0
    ? record.used < limit
    : record.used < 1;
}

function matchesRequest(request, record, strategy) {
  if (strategy === "method-url") return true;
  if (strategy === "method-url-body") {
    return bodyEquals(request.bytes, record.requestBody);
  }
  if (strategy === "method-url-body-sha256") {
    if (record.requestBodySha256 !== null) {
      return sha256(request.bytes) === `${record.requestBodySha256}`.toLowerCase();
    }
    return bodyEquals(request.bytes, record.requestBody);
  }
  if (strategy === "exact") {
    return bodyEquals(request.bytes, record.requestBody)
      && headersEqual(request.headers, record.requestHeaders);
  }
  return false;
}

function bodyEquals(actualBytes, expected) {
  if (expected === null || expected === undefined) {
    return actualBytes === null || actualBytes === undefined || actualBytes.length === 0;
  }
  const actual = actualBytes instanceof Uint8Array
    ? actualBytes
    : new Uint8Array(actualBytes || []);
  const expectedBytes = typeof expected === "string"
    ? new TextEncoder().encode(expected)
    : expected instanceof Uint8Array
      ? expected
      : new Uint8Array(expected);
  if (actual.length !== expectedBytes.length) return false;
  for (let index = 0; index < actual.length; index += 1) {
    if (actual[index] !== expectedBytes[index]) return false;
  }
  return true;
}

function headersEqual(actual, expected) {
  if (expected === null || expected === undefined) return true;
  const actualEntries = actual && typeof actual.entries === "function"
    ? [...headersEntries(actual)].map(([name, value]) => [`${name}`.toLowerCase(), `${value}`])
    : Object.entries(actual || {})
      .map(([name, value]) => [`${name}`.toLowerCase(), `${value}`]);
  const expectedEntries = Array.isArray(expected)
    ? expected.map(entry => Array.isArray(entry)
      ? [`${entry[0]}`.toLowerCase(), `${entry[1]}`]
      : [`${entry.name}`.toLowerCase(), `${entry.value}`])
    : Object.entries(expected).map(([name, value]) => [`${name}`.toLowerCase(), `${value}`]);
  if (actualEntries.length !== expectedEntries.length) return false;
  const actualMap = new Map(actualEntries);
  return expectedEntries.every(([name, value]) => actualMap.get(name) === value);
}

function sha256(bytes) {
  const input = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []);
  const bitLength = input.length * 8;
  const paddedLength = (((input.length + 9) + 63) >> 6) << 6;
  const data = new Uint8Array(paddedLength);
  data.set(input);
  data[input.length] = 0x80;
  const view = new DataView(data.buffer);
  view.setUint32(paddedLength - 8, Math.floor(bitLength / 0x100000000));
  view.setUint32(paddedLength - 4, bitLength >>> 0);
  const hash = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);
  const schedule = new Uint32Array(64);
  for (let offset = 0; offset < data.length; offset += 64) {
    for (let index = 0; index < 16; index += 1) {
      schedule[index] = view.getUint32(offset + index * 4);
    }
    for (let index = 16; index < 64; index += 1) {
      const value = schedule[index - 15];
      const s0 = ((value >>> 7) | (value << 25))
        ^ ((value >>> 18) | (value << 14)) ^ (value >>> 3);
      const previous = schedule[index - 2];
      const s1 = ((previous >>> 17) | (previous << 15))
        ^ ((previous >>> 19) | (previous << 13)) ^ (previous >>> 10);
      schedule[index] = (schedule[index - 16] + s0 + schedule[index - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = hash;
    for (let index = 0; index < 64; index += 1) {
      const s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const choose = (e & f) ^ (~e & g);
      const temp1 = (h + s1 + choose + SHA256_K[index] + schedule[index]) >>> 0;
      const s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + majority) >>> 0;
      h = g; g = f; f = e; e = (d + temp1) >>> 0;
      d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
    }
    hash[0] = (hash[0] + a) >>> 0;
    hash[1] = (hash[1] + b) >>> 0;
    hash[2] = (hash[2] + c) >>> 0;
    hash[3] = (hash[3] + d) >>> 0;
    hash[4] = (hash[4] + e) >>> 0;
    hash[5] = (hash[5] + f) >>> 0;
    hash[6] = (hash[6] + g) >>> 0;
    hash[7] = (hash[7] + h) >>> 0;
  }
  return [...hash].map(value => value.toString(16).padStart(8, "0")).join("");
}

const SHA256_K = Object.freeze([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b,
  0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
  0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7,
  0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152,
  0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
  0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
  0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08,
  0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f,
  0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

function captureRequest(api, request, outcome) {
  const networkRequestRecorder = replayState().networkRequestRecorder;
  if (networkRequestRecorder === null) return;
  try {
    networkRequestRecorder.record({
      api,
      method: request.method,
      url: request.url,
      headers: [...headersEntries(request.headers)],
      body: request.bytes,
      outcome,
    });
  } catch {
    // Request observability must never change the page-visible network result.
  }
}
