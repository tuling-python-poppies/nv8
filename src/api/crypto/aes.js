const sbox = new Uint8Array(256);
const inverseSbox = new Uint8Array(256);
initializeSboxes();

export function aesEncrypt(algorithm, key, input) {
  const name = `${algorithm.name}`.toUpperCase();
  if (name === "AES-CTR") return ctr(key, input, algorithm.counter, algorithm.length);
  if (name === "AES-CBC") return cbcEncrypt(key, input, algorithm.iv);
  if (name === "AES-GCM") return gcmEncrypt(key, input, algorithm);
  unsupported();
}

export function aesDecrypt(algorithm, key, input) {
  const name = `${algorithm.name}`.toUpperCase();
  if (name === "AES-CTR") return ctr(key, input, algorithm.counter, algorithm.length);
  if (name === "AES-CBC") return cbcDecrypt(key, input, algorithm.iv);
  if (name === "AES-GCM") return gcmDecrypt(key, input, algorithm);
  unsupported();
}

function ctr(key, input, counterValue, lengthValue) {
  const counter = bytes(counterValue);
  const length = Number(lengthValue);
  if (counter.length !== 16 || !Number.isInteger(length) || length < 1 || length > 128) {
    operationError();
  }
  const roundKeys = expandKey(key);
  const output = new Uint8Array(input.length);
  for (let offset = 0; offset < input.length; offset += 16) {
    const mask = encryptBlock(counter, roundKeys);
    const count = Math.min(16, input.length - offset);
    for (let index = 0; index < count; index += 1) {
      output[offset + index] = input[offset + index] ^ mask[index];
    }
    incrementCounter(counter, length);
  }
  return output;
}

function cbcEncrypt(key, input, ivValue) {
  const iv = bytes(ivValue);
  if (iv.length !== 16) operationError();
  const padding = 16 - (input.length % 16);
  const padded = new Uint8Array(input.length + padding);
  padded.set(input);
  padded.fill(padding, input.length);
  const roundKeys = expandKey(key);
  const output = new Uint8Array(padded.length);
  let previous = iv;
  for (let offset = 0; offset < padded.length; offset += 16) {
    const block = padded.slice(offset, offset + 16);
    xorInto(block, previous);
    previous = encryptBlock(block, roundKeys);
    output.set(previous, offset);
  }
  return output;
}

function cbcDecrypt(key, input, ivValue) {
  const iv = bytes(ivValue);
  if (iv.length !== 16 || input.length === 0 || input.length % 16 !== 0) {
    operationError();
  }
  const roundKeys = expandKey(key);
  const output = new Uint8Array(input.length);
  let previous = iv;
  for (let offset = 0; offset < input.length; offset += 16) {
    const encrypted = input.slice(offset, offset + 16);
    const block = decryptBlock(encrypted, roundKeys);
    xorInto(block, previous);
    output.set(block, offset);
    previous = encrypted;
  }
  const padding = output.at(-1);
  if (padding < 1 || padding > 16) operationError();
  for (let index = output.length - padding; index < output.length; index += 1) {
    if (output[index] !== padding) operationError();
  }
  return output.slice(0, output.length - padding);
}

function gcmEncrypt(key, input, algorithm) {
  const tagLength = normalizeTagLength(algorithm.tagLength);
  const roundKeys = expandKey(key);
  const h = toBigInt(encryptBlock(new Uint8Array(16), roundKeys));
  const iv = bytes(algorithm.iv);
  const additionalData = algorithm.additionalData === undefined
    ? new Uint8Array()
    : bytes(algorithm.additionalData);
  const j0 = gcmInitialCounter(h, iv);
  const counter = j0.slice();
  incrementCounter(counter, 32);
  const ciphertext = ctrWithExpanded(input, counter, 32, roundKeys);
  const authentication = fromBigInt(
    toBigInt(encryptBlock(j0, roundKeys))
      ^ ghash(h, additionalData, ciphertext),
  );
  const result = new Uint8Array(ciphertext.length + tagLength / 8);
  result.set(ciphertext);
  result.set(authentication.subarray(0, tagLength / 8), ciphertext.length);
  return result;
}

function gcmDecrypt(key, input, algorithm) {
  const tagLength = normalizeTagLength(algorithm.tagLength);
  const tagBytes = tagLength / 8;
  if (input.length < tagBytes) operationError();
  const ciphertext = input.subarray(0, input.length - tagBytes);
  const suppliedTag = input.subarray(input.length - tagBytes);
  const roundKeys = expandKey(key);
  const h = toBigInt(encryptBlock(new Uint8Array(16), roundKeys));
  const iv = bytes(algorithm.iv);
  const additionalData = algorithm.additionalData === undefined
    ? new Uint8Array()
    : bytes(algorithm.additionalData);
  const j0 = gcmInitialCounter(h, iv);
  const expected = fromBigInt(
    toBigInt(encryptBlock(j0, roundKeys))
      ^ ghash(h, additionalData, ciphertext),
  ).subarray(0, tagBytes);
  let difference = 0;
  for (let index = 0; index < tagBytes; index += 1) {
    difference |= suppliedTag[index] ^ expected[index];
  }
  if (difference !== 0) {
    throw new DOMException("The operation failed for an operation-specific reason.", "OperationError");
  }
  const counter = j0.slice();
  incrementCounter(counter, 32);
  return ctrWithExpanded(ciphertext, counter, 32, roundKeys);
}

function ctrWithExpanded(input, counter, length, roundKeys) {
  const output = new Uint8Array(input.length);
  for (let offset = 0; offset < input.length; offset += 16) {
    const mask = encryptBlock(counter, roundKeys);
    const count = Math.min(16, input.length - offset);
    for (let index = 0; index < count; index += 1) {
      output[offset + index] = input[offset + index] ^ mask[index];
    }
    incrementCounter(counter, length);
  }
  return output;
}

function gcmInitialCounter(h, iv) {
  if (iv.length === 12) {
    const counter = new Uint8Array(16);
    counter.set(iv);
    counter[15] = 1;
    return counter;
  }
  const lengthBlock = new Uint8Array(16);
  writeUint64(lengthBlock, 8, BigInt(iv.length) * 8n);
  return fromBigInt(ghashBlocks(h, concatenate([pad16(iv), lengthBlock])));
}

function ghash(h, additionalData, ciphertext) {
  const lengthBlock = new Uint8Array(16);
  writeUint64(lengthBlock, 0, BigInt(additionalData.length) * 8n);
  writeUint64(lengthBlock, 8, BigInt(ciphertext.length) * 8n);
  return ghashBlocks(h, concatenate([
    pad16(additionalData),
    pad16(ciphertext),
    lengthBlock,
  ]));
}

function ghashBlocks(h, data) {
  let value = 0n;
  for (let offset = 0; offset < data.length; offset += 16) {
    value = multiplyGalois(value ^ toBigInt(data.subarray(offset, offset + 16)), h);
  }
  return value;
}

function multiplyGalois(x, y) {
  let z = 0n;
  let v = y;
  const reduction = 0xe1000000000000000000000000000000n;
  for (let bit = 0; bit < 128; bit += 1) {
    if ((x & (1n << BigInt(127 - bit))) !== 0n) z ^= v;
    v = (v & 1n) === 0n ? v >> 1n : (v >> 1n) ^ reduction;
  }
  return z;
}

function expandKey(key) {
  if (![16, 24, 32].includes(key.length)) operationError();
  const nk = key.length / 4;
  const rounds = nk + 6;
  const words = new Uint32Array(4 * (rounds + 1));
  const view = new DataView(key.buffer, key.byteOffset, key.byteLength);
  for (let index = 0; index < nk; index += 1) words[index] = view.getUint32(index * 4);
  let rcon = 1;
  for (let index = nk; index < words.length; index += 1) {
    let value = words[index - 1];
    if (index % nk === 0) {
      value = substituteWord(rotateWord(value)) ^ (rcon << 24);
      rcon = multiply(rcon, 2);
    } else if (nk > 6 && index % nk === 4) {
      value = substituteWord(value);
    }
    words[index] = words[index - nk] ^ value;
  }
  return { words, rounds };
}

function encryptBlock(input, expanded) {
  const state = input.slice();
  addRoundKey(state, expanded.words, 0);
  for (let round = 1; round < expanded.rounds; round += 1) {
    substitute(state, sbox);
    shiftRows(state);
    mixColumns(state);
    addRoundKey(state, expanded.words, round);
  }
  substitute(state, sbox);
  shiftRows(state);
  addRoundKey(state, expanded.words, expanded.rounds);
  return state;
}

function decryptBlock(input, expanded) {
  const state = input.slice();
  addRoundKey(state, expanded.words, expanded.rounds);
  for (let round = expanded.rounds - 1; round > 0; round -= 1) {
    inverseShiftRows(state);
    substitute(state, inverseSbox);
    addRoundKey(state, expanded.words, round);
    inverseMixColumns(state);
  }
  inverseShiftRows(state);
  substitute(state, inverseSbox);
  addRoundKey(state, expanded.words, 0);
  return state;
}

function addRoundKey(state, words, round) {
  for (let column = 0; column < 4; column += 1) {
    const word = words[round * 4 + column];
    state[column * 4] ^= word >>> 24;
    state[column * 4 + 1] ^= word >>> 16;
    state[column * 4 + 2] ^= word >>> 8;
    state[column * 4 + 3] ^= word;
  }
}

function substitute(state, box) {
  for (let index = 0; index < state.length; index += 1) state[index] = box[state[index]];
}

function shiftRows(state) {
  const copy = state.slice();
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      state[column * 4 + row] = copy[((column + row) % 4) * 4 + row];
    }
  }
}

function inverseShiftRows(state) {
  const copy = state.slice();
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      state[column * 4 + row] = copy[((column - row + 4) % 4) * 4 + row];
    }
  }
}

function mixColumns(state) {
  for (let column = 0; column < 4; column += 1) {
    const offset = column * 4;
    const [a, b, c, d] = state.subarray(offset, offset + 4);
    state[offset] = multiply(a, 2) ^ multiply(b, 3) ^ c ^ d;
    state[offset + 1] = a ^ multiply(b, 2) ^ multiply(c, 3) ^ d;
    state[offset + 2] = a ^ b ^ multiply(c, 2) ^ multiply(d, 3);
    state[offset + 3] = multiply(a, 3) ^ b ^ c ^ multiply(d, 2);
  }
}

function inverseMixColumns(state) {
  for (let column = 0; column < 4; column += 1) {
    const offset = column * 4;
    const [a, b, c, d] = state.subarray(offset, offset + 4);
    state[offset] = multiply(a, 14) ^ multiply(b, 11) ^ multiply(c, 13) ^ multiply(d, 9);
    state[offset + 1] = multiply(a, 9) ^ multiply(b, 14) ^ multiply(c, 11) ^ multiply(d, 13);
    state[offset + 2] = multiply(a, 13) ^ multiply(b, 9) ^ multiply(c, 14) ^ multiply(d, 11);
    state[offset + 3] = multiply(a, 11) ^ multiply(b, 13) ^ multiply(c, 9) ^ multiply(d, 14);
  }
}

function initializeSboxes() {
  for (let value = 0; value < 256; value += 1) {
    const inverse = value === 0 ? 0 : power(value, 254);
    const transformed = inverse
      ^ rotateByte(inverse, 1)
      ^ rotateByte(inverse, 2)
      ^ rotateByte(inverse, 3)
      ^ rotateByte(inverse, 4)
      ^ 0x63;
    sbox[value] = transformed;
    inverseSbox[transformed] = value;
  }
}

function power(value, exponent) {
  let result = 1;
  let base = value;
  let current = exponent;
  while (current > 0) {
    if (current & 1) result = multiply(result, base);
    base = multiply(base, base);
    current >>>= 1;
  }
  return result;
}

function multiply(left, right) {
  let a = left;
  let b = right;
  let result = 0;
  while (b !== 0) {
    if (b & 1) result ^= a;
    a = (a << 1) ^ ((a & 0x80) ? 0x11b : 0);
    b >>>= 1;
  }
  return result & 0xff;
}

function rotateByte(value, count) {
  return ((value << count) | (value >>> (8 - count))) & 0xff;
}

function rotateWord(value) {
  return ((value << 8) | (value >>> 24)) >>> 0;
}

function substituteWord(value) {
  return (
    (sbox[value >>> 24] << 24)
    | (sbox[(value >>> 16) & 0xff] << 16)
    | (sbox[(value >>> 8) & 0xff] << 8)
    | sbox[value & 0xff]
  ) >>> 0;
}

function incrementCounter(counter, length) {
  let value = toBigInt(counter);
  const mask = (1n << BigInt(length)) - 1n;
  const low = (value & mask) + 1n & mask;
  value = (value & ~mask) | low;
  counter.set(fromBigInt(value));
}

function normalizeTagLength(value) {
  const length = Number(value ?? 128);
  if (![32, 64, 96, 104, 112, 120, 128].includes(length)) operationError();
  return length;
}

function pad16(value) {
  if (value.length % 16 === 0) return value;
  const output = new Uint8Array(Math.ceil(value.length / 16) * 16);
  output.set(value);
  return output;
}

function toBigInt(value) {
  let result = 0n;
  for (const byte of value) result = (result << 8n) | BigInt(byte);
  return result;
}

function fromBigInt(value) {
  const output = new Uint8Array(16);
  let current = value;
  for (let index = 15; index >= 0; index -= 1) {
    output[index] = Number(current & 0xffn);
    current >>= 8n;
  }
  return output;
}

function writeUint64(output, offset, value) {
  let current = value;
  for (let index = 7; index >= 0; index -= 1) {
    output[offset + index] = Number(current & 0xffn);
    current >>= 8n;
  }
}

function bytes(value) {
  if (value instanceof ArrayBuffer) return new Uint8Array(value.slice(0));
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(
      value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength),
    );
  }
  throw new TypeError("A BufferSource is required");
}

function xorInto(target, source) {
  for (let index = 0; index < target.length; index += 1) target[index] ^= source[index];
}

function concatenate(chunks) {
  const output = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}

function operationError() {
  throw new DOMException("The operation failed for an operation-specific reason.", "OperationError");
}

function unsupported() {
  throw new DOMException("The requested algorithm is not supported.", "NotSupportedError");
}
