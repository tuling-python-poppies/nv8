import net from 'node:net';
import tls from 'node:tls';
import { createHash, randomBytes } from 'node:crypto';

import {
  CollectorConfigError,
  CollectorErrorCode,
  CollectorRequestError,
  CollectorTimeoutError,
} from './errors.js';
import { buildRequestPayload, createCollectorResponse } from './transport.js';
import { redactRequestUrl } from './credentials.js';

const WEBSOCKET_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const DEFAULT_MAX_FRAMES = 1;
const DEFAULT_MAX_MESSAGE_BYTES = 16 * 1024 * 1024;
const DEFAULT_MAX_TOTAL_BYTES = 32 * 1024 * 1024;
const DEFAULT_MAX_HANDSHAKE_BYTES = 64 * 1024;
const DEFAULT_CONNECT_TIMEOUT_MS = 15_000;

/**
 * Browser-free WebSocket transport for bounded request/response exchanges.
 *
 * The RequestPlan carries `metadata.websocket`:
 *
 * {
 *   protocols?: string[],
 *   send?: string[] | { type: 'text'|'binary', data: string }[],
 *   maxFrames?: number,
 *   maxMessageBytes?: number,
 *   maxTotalBytes?: number,
 *   closeOnFrames?: boolean
 * }
 *
 * Binary data is base64. The transport intentionally resolves after a bounded
 * number of complete messages or a peer close; it is not a general subscription
 * manager. A caller that needs a long-lived subscription should provide a
 * transport with the same `send()` contract and its own lifecycle policy.
 */
export function createWebSocketTransport(config = {}) {
  const connectTimeoutMs = positiveInteger(
    config.connectTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS,
    'connectTimeoutMs',
  );
  const maxHandshakeBytes = positiveInteger(
    config.maxHandshakeBytes ?? DEFAULT_MAX_HANDSHAKE_BYTES,
    'maxHandshakeBytes',
  );
  const defaultMaxFrames = positiveInteger(
    config.maxFrames ?? DEFAULT_MAX_FRAMES,
    'maxFrames',
  );
  const defaultMaxMessageBytes = positiveInteger(
    config.maxMessageBytes ?? DEFAULT_MAX_MESSAGE_BYTES,
    'maxMessageBytes',
  );
  const defaultMaxTotalBytes = positiveInteger(
    config.maxTotalBytes ?? DEFAULT_MAX_TOTAL_BYTES,
    'maxTotalBytes',
  );
  const connect = typeof config.connect === 'function'
    ? config.connect
    : connectDirect;
  const operations = new Set();
  const sockets = new Set();
  let disposed = false;

  return {
    async send(request, sendOptions = {}) {
      if (disposed) throw disposedError();
      const operationController = new AbortController();
      const externalSignal = sendOptions.signal;
      const operationSignal = operationController.signal;
      const onExternalAbort = () => operationController.abort(externalSignal.reason);
      if (externalSignal?.aborted === true) {
        operationController.abort(externalSignal.reason);
      } else {
        externalSignal?.addEventListener('abort', onExternalAbort, { once: true });
      }
      operations.add(operationController);
      let socket = null;
      let sentMessages = 0;
      try {
        const target = parseWebSocketUrl(request);
        const websocket = normalizeWebSocketOptions(
          request.metadata?.websocket,
          {
            maxFrames: defaultMaxFrames,
            maxMessageBytes: defaultMaxMessageBytes,
            maxTotalBytes: defaultMaxTotalBytes,
          },
        );
        const { headers, body } = buildRequestPayload(request);
        if (body !== undefined) {
          throw new CollectorRequestError(
            CollectorErrorCode.INVALID_PLAN,
            'WebSocket plans must not carry an HTTP request body',
            { retryable: false },
          );
        }

        const key = randomBytes(16).toString('base64');
        const startedAt = Date.now();
        socket = await connect(target, {
          signal: operationSignal,
          timeoutMs: connectTimeoutMs,
          secure: target.protocol === 'wss:',
        });
        sockets.add(socket);
        const handshake = await performHandshake(socket, target, headers, websocket, key, {
          signal: operationSignal,
          maxBytes: maxHandshakeBytes,
        });

        const reader = new FrameReader(socket, handshake.leftover, {
          maxFrameBytes: Math.max(websocket.maxMessageBytes, 125),
        });
        try {
          for (const message of websocket.send) {
            await writeFrame(socket, encodeMessageFrame(message), operationSignal);
            sentMessages += 1;
          }

          const received = await receiveMessages(
            socket,
            reader,
            websocket,
            operationSignal,
          );
          return createCollectorResponse({
            status: 101,
            statusText: 'Switching Protocols',
            headers: handshake.headers,
            body: null,
            bodyEncoding: 'none',
            url: request.url,
            timingMs: Date.now() - startedAt,
            websocket: {
              protocol: handshake.protocol,
              frames: received.frames,
              closeCode: received.closeCode,
              closeReason: received.closeReason,
            },
          });
        } finally {
          reader.dispose();
        }
      } catch (error) {
        if (sentMessages > 0 && error?.retryable === true) {
          // Replaying an already sent application message can duplicate a mutation.
          error.retryable = false;
        }
        throw normalizeWebSocketError(error, request.url);
      } finally {
        if (socket !== null) sockets.delete(socket);
        socket?.destroy();
        operations.delete(operationController);
        externalSignal?.removeEventListener('abort', onExternalAbort);
      }
    },
    async dispose() {
      if (disposed) return;
      disposed = true;
      for (const controller of operations) controller.abort();
      for (const socket of sockets) socket.destroy();
      operations.clear();
      sockets.clear();
    },
  };
}

function parseWebSocketUrl(request) {
  let target;
  try {
    target = new URL(request.url);
  } catch {
    throw new CollectorRequestError(
      CollectorErrorCode.INVALID_PLAN,
      'WebSocket request URL is invalid',
      { retryable: false },
    );
  }
  if (target.protocol !== 'ws:' && target.protocol !== 'wss:') {
    throw new CollectorRequestError(
      CollectorErrorCode.INVALID_PLAN,
      'WebSocket transport requires a ws: or wss: URL',
      { retryable: false },
    );
  }
  return target;
}

function normalizeWebSocketOptions(input, defaults) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new CollectorRequestError(
      CollectorErrorCode.INVALID_PLAN,
      'metadata.websocket must be an object',
      { retryable: false },
    );
  }
  const protocols = input.protocols ?? [];
  if (!Array.isArray(protocols)) {
    throw new CollectorRequestError(
      CollectorErrorCode.INVALID_PLAN,
      'metadata.websocket.protocols must be an array',
      { retryable: false },
    );
  }
  const normalizedProtocols = protocols.map((protocol) => {
    if (typeof protocol !== 'string' || protocol.length === 0 || /[\x00-\x20\x7f(),/:;<=>?@[\]\\"]/.test(protocol)) {
      throw new CollectorRequestError(
        CollectorErrorCode.INVALID_PLAN,
        'metadata.websocket.protocols contains an invalid token',
        { retryable: false },
      );
    }
    return protocol;
  });
  if (new Set(normalizedProtocols).size !== normalizedProtocols.length) {
    throw new CollectorRequestError(
      CollectorErrorCode.INVALID_PLAN,
      'metadata.websocket.protocols must not contain duplicates',
      { retryable: false },
    );
  }

  const send = input.send ?? [];
  if (!Array.isArray(send)) {
    throw new CollectorRequestError(
      CollectorErrorCode.INVALID_PLAN,
      'metadata.websocket.send must be an array',
      { retryable: false },
    );
  }
  const normalizedSend = send.map(normalizeMessage);
  const maxFrames = positiveInteger(input.maxFrames ?? defaults.maxFrames, 'metadata.websocket.maxFrames');
  const maxMessageBytes = positiveInteger(
    input.maxMessageBytes ?? defaults.maxMessageBytes,
    'metadata.websocket.maxMessageBytes',
  );
  const maxTotalBytes = positiveInteger(
    input.maxTotalBytes ?? defaults.maxTotalBytes,
    'metadata.websocket.maxTotalBytes',
  );
  if (maxTotalBytes < maxMessageBytes && maxFrames > 1) {
    throw new CollectorRequestError(
      CollectorErrorCode.INVALID_PLAN,
      'metadata.websocket.maxTotalBytes must cover maxMessageBytes when receiving multiple frames',
      { retryable: false },
    );
  }
  for (const message of normalizedSend) {
    if (message.payload.byteLength > maxMessageBytes) {
      throw messageLimitError('outgoing WebSocket message exceeds maxMessageBytes');
    }
  }
  return {
    protocols: normalizedProtocols,
    send: normalizedSend,
    maxFrames,
    maxMessageBytes,
    maxTotalBytes,
    closeOnFrames: input.closeOnFrames !== false,
  };
}

function normalizeMessage(input) {
  if (typeof input === 'string') {
    return { type: 'text', payload: Buffer.from(input, 'utf8') };
  }
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new CollectorRequestError(
      CollectorErrorCode.INVALID_PLAN,
      'WebSocket messages must be strings or { type, data } objects',
      { retryable: false },
    );
  }
  const type = input.type ?? 'text';
  if (type !== 'text' && type !== 'binary') {
    throw new CollectorRequestError(
      CollectorErrorCode.INVALID_PLAN,
      'WebSocket message type must be text or binary',
      { retryable: false },
    );
  }
  if (typeof input.data !== 'string') {
    throw new CollectorRequestError(
      CollectorErrorCode.INVALID_PLAN,
      'WebSocket message data must be a string',
      { retryable: false },
    );
  }
  if (type === 'text') return { type, payload: Buffer.from(input.data, 'utf8') };
  if (!isBase64(input.data)) {
    throw new CollectorRequestError(
      CollectorErrorCode.INVALID_PLAN,
      'binary WebSocket message data must be base64',
      { retryable: false },
    );
  }
  return { type, payload: Buffer.from(input.data, 'base64') };
}

async function performHandshake(socket, target, headers, websocket, key, options) {
  const requestHeaders = new Map();
  for (const [name, value] of headers) {
    requestHeaders.set(name.toLowerCase(), value);
  }
  requestHeaders.set('host', target.host);
  requestHeaders.set('upgrade', 'websocket');
  requestHeaders.set('connection', 'Upgrade');
  requestHeaders.set('sec-websocket-key', key);
  requestHeaders.set('sec-websocket-version', '13');
  if (websocket.protocols.length > 0) {
    requestHeaders.set('sec-websocket-protocol', websocket.protocols.join(', '));
  }

  let request = `GET ${target.pathname}${target.search} HTTP/1.1\r\n`;
  for (const [name, value] of requestHeaders) request += `${name}: ${value}\r\n`;
  request += '\r\n';
  await writeSocket(socket, Buffer.from(request, 'ascii'), options.signal);

  const response = await readHandshake(socket, options);
  const accept = response.headers.find((entry) => entry.name === 'sec-websocket-accept')?.values[0];
  const expected = createHash('sha1').update(`${key}${WEBSOCKET_GUID}`).digest('base64');
  if (response.status !== 101
    || !headerContains(response.headers, 'upgrade', 'websocket')
    || !headerContains(response.headers, 'connection', 'upgrade')
    || accept !== expected) {
    throw new CollectorRequestError(
      CollectorErrorCode.REQUEST_FAILED,
      `WebSocket handshake failed for ${target.href}`,
      { context: { url: target.href, status: response.status }, retryable: false },
    );
  }
  const protocol = response.headers.find((entry) => entry.name === 'sec-websocket-protocol')?.values[0] ?? null;
  if (protocol !== null && !websocket.protocols.includes(protocol)) {
    throw new CollectorRequestError(
      CollectorErrorCode.REQUEST_FAILED,
      'WebSocket server selected a protocol that was not requested',
      { context: { url: target.href, protocol }, retryable: false },
    );
  }
  return { headers: response.headers, leftover: response.leftover, protocol };
}

function readHandshake(socket, options) {
  const { signal, maxBytes } = options;
  return new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(0);
    let settled = false;
    const cleanup = () => {
      socket.removeListener('data', onData);
      socket.removeListener('error', onError);
      socket.removeListener('close', onClose);
      signal?.removeEventListener('abort', onAbort);
    };
    const fail = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };
    const onData = (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      if (buffer.byteLength > maxBytes) {
        fail(new CollectorRequestError(
          CollectorErrorCode.RESPONSE_TOO_LARGE,
          'WebSocket handshake exceeds maxHandshakeBytes',
          { limit: maxBytes, retryable: false },
        ));
        return;
      }
      const boundary = buffer.indexOf(Buffer.from('\r\n\r\n'));
      if (boundary === -1) return;
      const head = buffer.subarray(0, boundary).toString('latin1');
      const leftover = buffer.subarray(boundary + 4);
      try {
        const parsed = parseHandshake(head);
        settled = true;
        cleanup();
        resolve({ ...parsed, leftover });
      } catch (error) {
        fail(error);
      }
    };
    const onError = (error) => fail(new CollectorRequestError(
      CollectorErrorCode.REQUEST_FAILED,
      `WebSocket handshake transport failure: ${error.message}`,
      { cause: error, retryable: true },
    ));
    const onClose = () => fail(new CollectorRequestError(
      CollectorErrorCode.REQUEST_FAILED,
      'WebSocket closed before the handshake completed',
      { retryable: true },
    ));
    const onAbort = () => fail(abortedError());

    if (signal?.aborted === true) {
      onAbort();
      return;
    }
    socket.on('data', onData);
    socket.once('error', onError);
    socket.once('close', onClose);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function parseHandshake(head) {
  const lines = head.split('\r\n');
  const status = /^HTTP\/1\.1 (\d{3})(?: |$)/.exec(lines.shift() ?? '');
  if (!status) {
    throw new CollectorRequestError(
      CollectorErrorCode.REQUEST_FAILED,
      'WebSocket handshake returned an invalid HTTP status line',
      { retryable: false },
    );
  }
  const headers = [];
  for (const line of lines) {
    const separator = line.indexOf(':');
    if (separator <= 0) {
      throw new CollectorRequestError(
        CollectorErrorCode.REQUEST_FAILED,
        'WebSocket handshake returned an invalid header',
        { retryable: false },
      );
    }
    const name = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    const existing = headers.find((entry) => entry.name === name);
    if (existing) existing.values.push(value);
    else headers.push({ name, values: [value] });
  }
  return {
    status: Number(status[1]),
    headers,
  };
}

function headerContains(headers, name, expected) {
  return headers.some((entry) => entry.name === name
    && entry.values.some((value) => value.split(',').some((part) => part.trim().toLowerCase() === expected)));
}

async function receiveMessages(socket, reader, options, signal) {
  const frames = [];
  let closeCode = null;
  let closeReason = '';
  let totalBytes = 0;
  let fragmentType = null;
  let fragmentPayload = [];
  let fragmentBytes = 0;
  let closeSent = false;

  while (frames.length < options.maxFrames) {
    const frame = await reader.next(signal);
    if (frame.opcode === 0x8) {
      ({ code: closeCode, reason: closeReason } = parseClosePayload(frame.payload));
      if (!closeSent) {
        await writeFrame(socket, encodeCloseFrame(closeCode ?? 1000, closeReason), signal);
        closeSent = true;
      }
      break;
    }
    if (frame.opcode === 0x9) {
      await writeFrame(socket, encodeControlFrame(0xA, frame.payload), signal);
      continue;
    }
    if (frame.opcode === 0xA) continue;

    if (frame.opcode === 0x1 || frame.opcode === 0x2) {
      if (fragmentType !== null) throw protocolError('new data frame while a message is fragmented');
      fragmentType = frame.opcode;
      fragmentPayload = [frame.payload];
      fragmentBytes = frame.payload.byteLength;
    } else if (frame.opcode === 0x0) {
      if (fragmentType === null) throw protocolError('continuation frame without a fragmented message');
      fragmentPayload.push(frame.payload);
      fragmentBytes += frame.payload.byteLength;
    } else {
      throw protocolError(`unsupported WebSocket opcode 0x${frame.opcode.toString(16)}`);
    }

    if (fragmentBytes > options.maxMessageBytes) {
      throw messageLimitError('incoming WebSocket message exceeds maxMessageBytes');
    }
    if (!frame.fin) continue;

    const payload = Buffer.concat(fragmentPayload, fragmentBytes);
    totalBytes += payload.byteLength;
    if (totalBytes > options.maxTotalBytes) {
      throw messageLimitError('incoming WebSocket messages exceed maxTotalBytes');
    }
    if (fragmentType === 0x1) {
      let data;
      try {
        data = new TextDecoder('utf-8', { fatal: true }).decode(payload);
      } catch (error) {
        throw protocolError('incoming text frame is not valid UTF-8', error);
      }
      frames.push({ type: 'text', data, encoding: 'text' });
    } else {
      frames.push({ type: 'binary', data: payload.toString('base64'), encoding: 'base64' });
    }
    fragmentType = null;
    fragmentPayload = [];
    fragmentBytes = 0;

    if (options.closeOnFrames && frames.length >= options.maxFrames) {
      await writeFrame(socket, encodeCloseFrame(1000, ''), signal);
      closeSent = true;
      break;
    }
  }
  return { frames, closeCode, closeReason };
}

class FrameReader {
  #socket;
  #buffer;
  #queue = [];
  #waiters = [];
  #ended = null;
  #maxFrameBytes;
  #onData;
  #onError;
  #onClose;

  constructor(socket, initial, options) {
    this.#socket = socket;
    this.#buffer = initial;
    this.#maxFrameBytes = options.maxFrameBytes;
    this.#onData = (chunk) => {
      this.#buffer = Buffer.concat([this.#buffer, chunk]);
      this.#drain();
    };
    this.#onError = (error) => this.#end(new CollectorRequestError(
      CollectorErrorCode.REQUEST_FAILED,
      `WebSocket transport failure: ${error.message}`,
      { cause: error, retryable: true },
    ));
    this.#onClose = () => this.#end(new CollectorRequestError(
      CollectorErrorCode.REQUEST_FAILED,
      'WebSocket closed before a close frame was received',
      { retryable: true },
    ));
    socket.on('data', this.#onData);
    socket.once('error', this.#onError);
    socket.once('close', this.#onClose);
    this.#drain();
  }

  next(signal) {
    this.#drain();
    if (this.#queue.length > 0) return Promise.resolve(this.#queue.shift());
    if (this.#ended !== null) return Promise.reject(this.#ended);
    return new Promise((resolve, reject) => {
      const waiter = { resolve, reject, signal, onAbort: null };
      waiter.onAbort = () => {
        this.#waiters = this.#waiters.filter((candidate) => candidate !== waiter);
        reject(abortedError());
      };
      if (signal?.aborted === true) {
        waiter.onAbort();
        return;
      }
      signal?.addEventListener('abort', waiter.onAbort, { once: true });
      this.#waiters.push(waiter);
    });
  }

  dispose() {
    this.#socket.removeListener('data', this.#onData);
    this.#socket.removeListener('error', this.#onError);
    this.#socket.removeListener('close', this.#onClose);
    for (const waiter of this.#waiters) {
      waiter.signal?.removeEventListener('abort', waiter.onAbort);
      waiter.reject(new CollectorRequestError(
        CollectorErrorCode.REQUEST_FAILED,
        'WebSocket frame reader was disposed',
        { retryable: false },
      ));
    }
    this.#waiters = [];
  }

  #drain() {
    if (this.#ended !== null) return;
    try {
      for (;;) {
        const frame = decodeFrame(this.#buffer, this.#maxFrameBytes);
        if (frame === null) return;
        this.#buffer = frame.rest;
        const waiter = this.#waiters.shift();
        if (waiter) {
          waiter.signal?.removeEventListener('abort', waiter.onAbort);
          waiter.resolve(frame.value);
        } else {
          this.#queue.push(frame.value);
        }
      }
    } catch (error) {
      this.#end(error);
    }
  }

  #end(error) {
    if (this.#ended !== null) return;
    this.#ended = error;
    for (const waiter of this.#waiters) {
      waiter.signal?.removeEventListener('abort', waiter.onAbort);
      waiter.reject(error);
    }
    this.#waiters = [];
  }
}

function decodeFrame(buffer, maxFrameBytes) {
  if (buffer.byteLength < 2) return null;
  const first = buffer[0];
  const second = buffer[1];
  const fin = (first & 0x80) !== 0;
  const rsv = first & 0x70;
  const opcode = first & 0x0f;
  const masked = (second & 0x80) !== 0;
  const shortLength = second & 0x7f;
  let offset = 2;
  let length = shortLength;
  if (rsv !== 0) throw protocolError('WebSocket RSV bits are not supported');
  if (shortLength === 126) {
    if (buffer.byteLength < 4) return null;
    length = buffer.readUInt16BE(2);
    offset = 4;
  } else if (shortLength === 127) {
    if (buffer.byteLength < 10) return null;
    if ((buffer[2] & 0x80) !== 0) throw protocolError('WebSocket frame length has the high bit set');
    const high = buffer.readUInt32BE(2);
    const low = buffer.readUInt32BE(6);
    length = high * 2 ** 32 + low;
    if (!Number.isSafeInteger(length)) throw protocolError('WebSocket frame length is not safe');
    offset = 10;
  }
  const control = opcode >= 0x8;
  if (control && (!fin || length > 125)) throw protocolError('invalid WebSocket control frame');
  if (masked) throw protocolError('server-to-client WebSocket frames must not be masked');
  if (length > maxFrameBytes) throw messageLimitError('WebSocket frame exceeds maxMessageBytes');
  const maskOffset = masked ? 4 : 0;
  if (buffer.byteLength < offset + maskOffset + length) return null;
  let mask = null;
  if (masked) mask = buffer.subarray(offset, offset + 4);
  const payloadOffset = offset + maskOffset;
  const payload = Buffer.from(buffer.subarray(payloadOffset, payloadOffset + length));
  if (mask) {
    for (let index = 0; index < payload.length; index += 1) {
      payload[index] ^= mask[index % 4];
    }
  }
  return {
    value: { fin, opcode, payload },
    rest: buffer.subarray(payloadOffset + length),
  };
}

function parseClosePayload(payload) {
  if (payload.byteLength === 0) return { code: null, reason: '' };
  if (payload.byteLength === 1) throw protocolError('WebSocket close payload must not contain one byte');
  const code = payload.readUInt16BE(0);
  const validCode = code === 1000
    || code === 1001
    || code === 1002
    || code === 1003
    || (code >= 1007 && code <= 1011)
    || (code >= 3000 && code <= 4999);
  if (!validCode) throw protocolError(`invalid WebSocket close code ${code}`);
  let reason;
  try {
    reason = new TextDecoder('utf-8', { fatal: true }).decode(payload.subarray(2));
  } catch (error) {
    throw protocolError('WebSocket close reason is not valid UTF-8', error);
  }
  return { code, reason };
}

function encodeMessageFrame(message) {
  return encodeDataFrame(message.type === 'text' ? 0x1 : 0x2, message.payload);
}

function encodeControlFrame(opcode, payload) {
  return encodeDataFrame(opcode, payload);
}

function encodeCloseFrame(code, reason) {
  const reasonBytes = Buffer.from(reason, 'utf8');
  if (reasonBytes.byteLength > 123) throw protocolError('WebSocket close reason is too long');
  return encodeDataFrame(0x8, Buffer.concat([Buffer.from([code >> 8, code & 0xff]), reasonBytes]));
}

function encodeDataFrame(opcode, payload) {
  if (payload.byteLength > 0x7fffffff) throw messageLimitError('WebSocket frame is too large');
  const mask = randomBytes(4);
  let header;
  if (payload.byteLength < 126) {
    header = Buffer.from([0x80 | opcode, 0x80 | payload.byteLength]);
  } else if (payload.byteLength <= 0xffff) {
    header = Buffer.alloc(4);
    header[0] = 0x80 | opcode;
    header[1] = 0x80 | 126;
    header.writeUInt16BE(payload.byteLength, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x80 | opcode;
    header[1] = 0x80 | 127;
    header.writeUInt32BE(Math.floor(payload.byteLength / 2 ** 32), 2);
    header.writeUInt32BE(payload.byteLength >>> 0, 6);
  }
  const masked = Buffer.from(payload);
  for (let index = 0; index < masked.length; index += 1) {
    masked[index] ^= mask[index % 4];
  }
  return Buffer.concat([header, mask, masked]);
}

function connectDirect(target, options) {
  return new Promise((resolve, reject) => {
    const port = target.port === '' ? (options.secure ? 443 : 80) : Number(target.port);
    const socket = options.secure
      ? tls.connect({ host: target.hostname, port, servername: target.hostname })
      : net.connect({ host: target.hostname, port });
    let settled = false;
    const event = options.secure ? 'secureConnect' : 'connect';
    const timer = setTimeout(() => {
      fail(new CollectorTimeoutError(options.timeoutMs, { context: { url: target.href } }));
    }, options.timeoutMs);
    if (typeof timer.unref === 'function') timer.unref();
    const cleanup = () => {
      clearTimeout(timer);
      socket.removeListener(event, onOpen);
      socket.removeListener('error', onError);
      socket.removeListener('close', onClose);
      options.signal?.removeEventListener('abort', onAbort);
    };
    const fail = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      socket.destroy();
      reject(error);
    };
    const onOpen = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(socket);
    };
    const onError = (error) => fail(new CollectorRequestError(
      CollectorErrorCode.REQUEST_FAILED,
      `WebSocket connection failure for ${target.href}: ${error.message}`,
      { cause: error, retryable: true },
    ));
    const onClose = () => fail(new CollectorRequestError(
      CollectorErrorCode.REQUEST_FAILED,
      `WebSocket connection closed for ${target.href}`,
      { retryable: true },
    ));
    const onAbort = () => fail(abortedError());

    if (options.signal?.aborted === true) {
      onAbort();
      return;
    }
    socket.once(event, onOpen);
    socket.once('error', onError);
    socket.once('close', onClose);
    options.signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function writeSocket(socket, data, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted === true) {
      reject(abortedError());
      return;
    }
    let settled = false;
    const cleanup = () => {
      socket.removeListener('error', onError);
      signal?.removeEventListener('abort', onAbort);
    };
    const finish = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (error) reject(error); else resolve();
    };
    const onError = (error) => finish(new CollectorRequestError(
      CollectorErrorCode.REQUEST_FAILED,
      `WebSocket write failure: ${error.message}`,
      { cause: error, retryable: true },
    ));
    const onAbort = () => {
      socket.destroy();
      finish(abortedError());
    };
    socket.once('error', onError);
    signal?.addEventListener('abort', onAbort, { once: true });
    try {
      socket.write(data, () => finish());
    } catch (error) {
      finish(new CollectorRequestError(
        CollectorErrorCode.REQUEST_FAILED,
        `WebSocket write failure: ${error.message}`,
        { cause: error, retryable: true },
      ));
    }
  });
}

function writeFrame(socket, frame, signal) {
  return writeSocket(socket, frame, signal);
}

function normalizeWebSocketError(error, url) {
  if (error instanceof CollectorRequestError) return error;
  if (error?.code === CollectorErrorCode.REQUEST_TIMEOUT) return error;
  return new CollectorRequestError(
    CollectorErrorCode.REQUEST_FAILED,
    `WebSocket transport failure for ${redactRequestUrl(url)}: ${error?.message ?? error}`,
    { cause: error, retryable: false },
  );
}

function protocolError(message, cause = undefined) {
  return new CollectorRequestError(
    CollectorErrorCode.REQUEST_FAILED,
    `WebSocket protocol error: ${message}`,
    { cause, retryable: false },
  );
}

function messageLimitError(message) {
  return new CollectorRequestError(
    CollectorErrorCode.RESPONSE_TOO_LARGE,
    message,
    { retryable: false },
  );
}

function abortedError() {
  return new CollectorRequestError(
    CollectorErrorCode.ABORTED,
    'WebSocket request aborted',
    { retryable: false },
  );
}

function disposedError() {
  return new CollectorRequestError(
    CollectorErrorCode.DISPOSED,
    'WebSocket transport has been disposed',
    { retryable: false },
  );
}

function positiveInteger(value, name) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new CollectorConfigError(`${name} must be a positive integer`);
  }
  return value;
}

function isBase64(value) {
  return value.length % 4 === 0
    && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value);
}
