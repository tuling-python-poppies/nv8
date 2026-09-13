import test from 'node:test';
import assert from 'node:assert/strict';
import { Opcode, FRAME_HEADER_BYTES, FRAME_MAGIC, PROTOCOL_VERSION } from '../src/backend/protocol/constants.js';
import { FrameReader } from '../src/backend/protocol/frame-reader.js';
import { encodeFramedValue } from '../src/backend/protocol/frame-writer.js';
import { decodeValue } from '../src/backend/protocol/value-decoder.js';

test('a frame uses the documented big-endian 16-byte header', () => {
  const frame = encodeFramedValue(Opcode.EVALUATE, 0x01020304, { ok: true });
  assert.equal(frame.length >= FRAME_HEADER_BYTES, true);
  assert.equal(frame.readUInt32BE(0), FRAME_MAGIC);
  assert.equal(frame.readUInt16BE(4), PROTOCOL_VERSION);
  assert.equal(frame.readUInt16BE(6), Opcode.EVALUATE);
  assert.equal(frame.readUInt32BE(8), 0x01020304);
  assert.equal(frame.readUInt32BE(12), frame.length - FRAME_HEADER_BYTES);
});

test('FrameReader handles fragmentation and multiple frames without using chunk boundaries', () => {
  const first = encodeFramedValue(Opcode.EVALUATE, 1, { value: 'first' });
  const second = encodeFramedValue(Opcode.EVALUATE | Opcode.RESPONSE_FLAG, 2, { value: 'second' });
  const frames = [];
  const errors = [];
  const reader = new FrameReader({
    onFrame: frame => frames.push({ ...frame, payload: { ...decodeValue(frame.payload) } }),
    onError: error => errors.push(error),
  });
  const combined = Buffer.concat([first, second]);
  reader.push(combined.subarray(0, 3));
  reader.push(combined.subarray(3, first.length + 1));
  reader.push(combined.subarray(first.length + 1));
  assert.deepEqual(frames.map(frame => ({
    opcode: frame.opcode,
    requestId: frame.requestId,
    payload: frame.payload,
  })), [
    { opcode: Opcode.EVALUATE, requestId: 1, payload: { value: 'first' } },
    { opcode: Opcode.EVALUATE | Opcode.RESPONSE_FLAG, requestId: 2, payload: { value: 'second' } },
  ]);
  assert.deepEqual(errors, []);
});

test('FrameReader rejects an invalid magic and stops consuming input', () => {
  const errors = [];
  const frames = [];
  const reader = new FrameReader({
    onFrame: frame => frames.push(frame),
    onError: error => errors.push(error),
  });
  const invalid = encodeFramedValue(Opcode.EVALUATE, 1, 1);
  invalid.writeUInt32BE(0, 0);
  reader.push(invalid);
  reader.push(encodeFramedValue(Opcode.EVALUATE, 2, 2));
  assert.equal(errors.length, 1);
  assert.match(errors[0].message, /Invalid frame magic/);
  assert.equal(frames.length, 0);
  assert.equal(reader.failed, true);
});

test('FrameReader rejects an unsupported protocol version before payload decoding', () => {
  const errors = [];
  const reader = new FrameReader({ onFrame() {}, onError: error => errors.push(error) });
  const frame = encodeFramedValue(Opcode.EVALUATE, 1, { safe: true });
  frame.writeUInt16BE(PROTOCOL_VERSION + 1, 4);
  reader.push(frame);
  assert.equal(errors.length, 1);
  assert.match(errors[0].message, /Unsupported protocol version/);
  assert.equal(reader.failed, true);
});

test('frame and request identifiers enforce their unsigned widths', () => {
  assert.throws(() => encodeFramedValue(-1, 1, null), /Opcode must be/);
  assert.throws(() => encodeFramedValue(Opcode.EVALUATE, -1, null), /Request ID must be/);
  assert.throws(() => encodeFramedValue(0x10000, 1, null), /Opcode must be/);
  assert.throws(() => encodeFramedValue(Opcode.EVALUATE, 0x1_0000_0000, null), /Request ID must be/);
});

test('FrameReader applies the payload limit from the representation boundary', () => {
  const errors = [];
  const reader = new FrameReader({ maxPayloadBytes: 4, onFrame() {}, onError: error => errors.push(error) });
  const frame = encodeFramedValue(Opcode.EVALUATE, 1, 'payload');
  reader.push(frame);
  assert.equal(errors.length, 1);
  assert.match(errors[0].message, /payload exceeds/);
  assert.equal(reader.failed, true);
});
