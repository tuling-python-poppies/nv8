import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import http from 'node:http';
import test from 'node:test';

import {
  CollectorErrorCode,
  createCollector,
  createWebSocketTransport,
} from '../src/collection/collector/index.js';
import { createRequestPlan } from '../src/collection/request-protocol/index.js';

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

function frame(opcode, payload = Buffer.alloc(0), fin = true) {
  const body = Buffer.from(payload);
  const header = body.length < 126
    ? Buffer.from([(fin ? 0x80 : 0) | opcode, body.length])
    : Buffer.from([(fin ? 0x80 : 0) | opcode, 126, body.length >> 8, body.length & 0xff]);
  return Buffer.concat([header, body]);
}

function decodeClientFrame(buffer) {
  if (buffer.length < 2) return null;
  const lengthCode = buffer[1] & 0x7f;
  const masked = (buffer[1] & 0x80) !== 0;
  let offset = 2;
  let length = lengthCode;
  if (lengthCode === 126) {
    if (buffer.length < 4) return null;
    length = buffer.readUInt16BE(2);
    offset = 4;
  }
  if (!masked || buffer.length < offset + 4 + length) return null;
  const mask = buffer.subarray(offset, offset + 4);
  const payload = Buffer.from(buffer.subarray(offset + 4, offset + 4 + length));
  for (let index = 0; index < payload.length; index += 1) {
    payload[index] ^= mask[index % 4];
  }
  return {
    opcode: buffer[0] & 0x0f,
    payload,
    rest: buffer.subarray(offset + 4 + length),
  };
}

async function createServer({ onMessage, onOpen } = {}) {
  const server = http.createServer();
  const sockets = new Set();
  server.on('upgrade', (request, socket) => {
    sockets.add(socket);
    socket.once('close', () => sockets.delete(socket));
    const key = request.headers['sec-websocket-key'];
    const protocols = `${request.headers['sec-websocket-protocol'] ?? ''}`
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
    const accept = crypto.createHash('sha1').update(`${key}${GUID}`).digest('base64');
    socket.write([
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${accept}`,
      ...(protocols.includes('chat') ? ['Sec-WebSocket-Protocol: chat'] : []),
      '\r\n',
    ].join('\r\n'));
    onOpen?.(request);
    // Client abort/transport destroy is expected to race with the test server.
    socket.on('error', () => {});

    let pending = Buffer.alloc(0);
    socket.on('data', chunk => {
      pending = Buffer.concat([pending, chunk]);
      for (;;) {
        const decoded = decodeClientFrame(pending);
        if (decoded === null) break;
        pending = decoded.rest;
        if (decoded.opcode === 0x9) {
          socket.write(frame(0xA, decoded.payload));
        } else if (decoded.opcode === 0x8) {
          socket.end();
        } else {
          onMessage?.(decoded.payload, decoded.opcode, socket);
        }
      }
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  return {
    url: `ws://127.0.0.1:${address.port}/socket`,
    close: () => new Promise(resolve => {
      for (const socket of sockets) socket.destroy();
      server.close(() => resolve());
    }),
  };
}

test('WebSocket transport performs a bounded masked exchange and handles ping plus fragmentation', async () => {
  let received = null;
  let opened = null;
  const server = await createServer({
    onOpen(request) {
      opened = request;
    },
    onMessage(payload, opcode, socket) {
      received = { payload: payload.toString('utf8'), opcode };
      socket.write(frame(0x9, Buffer.from('p')));
      socket.write(frame(0x1, Buffer.from('hel'), false));
      socket.write(frame(0x0, Buffer.from('lo')));
    },
  });
  try {
    const plan = createRequestPlan({
      method: 'GET',
      url: server.url,
      metadata: {
        websocket: {
          protocols: ['chat'],
          send: ['hello'],
          maxFrames: 1,
          maxMessageBytes: 32,
        },
      },
    });
    const collector = createCollector({
      transport: createWebSocketTransport({ connectTimeoutMs: 1000 }),
      policy: {
        enabled: true,
        allowedOrigins: [new URL(server.url).origin],
        allowedSchemes: ['ws:'],
      },
      retry: { maxAttempts: 1 },
      limits: { timeoutMs: 1000 },
    });
    const result = await collector.send(plan);
    assert.equal(result.response.status, 101);
    assert.equal(result.response.websocket.protocol, 'chat');
    assert.deepEqual(result.response.websocket.frames, [
      { type: 'text', data: 'hello', encoding: 'text' },
    ]);
    assert.equal(received.payload, 'hello');
    assert.equal(received.opcode, 0x1);
    assert.equal(opened.headers['upgrade'], 'websocket');
    await collector.dispose();
  } finally {
    await server.close();
  }
});

test('WebSocket transport does not retry after an application frame was sent', async () => {
  let connections = 0;
  const server = await createServer({
    onOpen() {
      connections += 1;
    },
    onMessage(_payload, _opcode, socket) {
      socket.destroy();
    },
  });
  const plan = createRequestPlan({
    method: 'GET',
    url: server.url,
    metadata: { websocket: { send: ['mutation'], maxFrames: 1 } },
  });
  const collector = createCollector({
    transport: createWebSocketTransport({ connectTimeoutMs: 1000 }),
    policy: {
      enabled: true,
      allowedOrigins: [new URL(server.url).origin],
      allowedSchemes: ['ws:'],
    },
    retry: { maxAttempts: 3 },
    sleep: () => Promise.resolve(),
    limits: { timeoutMs: 1000 },
  });
  try {
    await assert.rejects(
      collector.send(plan),
      error => error.code === CollectorErrorCode.REQUEST_FAILED,
    );
    assert.equal(connections, 1);
  } finally {
    await collector.dispose();
    await server.close();
  }
});

test('WebSocket transport dispose aborts a handshake-complete idle connection', async () => {
  let handshakeComplete;
  const handshaken = new Promise(resolve => { handshakeComplete = resolve; });
  const server = await createServer({ onOpen: handshakeComplete });
  const transport = createWebSocketTransport({ connectTimeoutMs: 1000 });
  const plan = createRequestPlan({
    method: 'GET',
    url: server.url,
    metadata: { websocket: { maxFrames: 1 } },
  });
  try {
    const pending = transport.send(plan);
    await handshaken;
    await transport.dispose();
    await assert.rejects(
      pending,
      error => error.code === CollectorErrorCode.ABORTED,
    );
    await assert.rejects(
      transport.send(plan),
      error => error.code === CollectorErrorCode.DISPOSED,
    );
  } finally {
    await transport.dispose();
    await server.close();
  }
});
