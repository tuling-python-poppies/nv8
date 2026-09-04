const mask64 = (1n << 64n) - 1n;
let sha512Constants = null;

export function sha1(input) {
  const bitLength = input.length * 8;
  const paddedLength = Math.ceil((input.length + 9) / 64) * 64;
  const bytes = new Uint8Array(paddedLength);
  bytes.set(input);
  bytes[input.length] = 0x80;
  const view = new DataView(bytes.buffer);
  view.setUint32(paddedLength - 4, bitLength >>> 0);
  view.setUint32(paddedLength - 8, Math.floor(bitLength / 0x100000000));
  const hash = new Uint32Array([
    0x67452301,
    0xefcdab89,
    0x98badcfe,
    0x10325476,
    0xc3d2e1f0,
  ]);
  const words = new Uint32Array(80);
  for (let offset = 0; offset < bytes.length; offset += 64) {
    for (let index = 0; index < 16; index += 1) {
      words[index] = view.getUint32(offset + index * 4);
    }
    for (let index = 16; index < 80; index += 1) {
      words[index] = rotateLeft(
        words[index - 3] ^ words[index - 8] ^ words[index - 14] ^ words[index - 16],
        1,
      );
    }
    let [a, b, c, d, e] = hash;
    for (let index = 0; index < 80; index += 1) {
      let operation;
      let constant;
      if (index < 20) {
        operation = (b & c) | (~b & d);
        constant = 0x5a827999;
      } else if (index < 40) {
        operation = b ^ c ^ d;
        constant = 0x6ed9eba1;
      } else if (index < 60) {
        operation = (b & c) | (b & d) | (c & d);
        constant = 0x8f1bbcdc;
      } else {
        operation = b ^ c ^ d;
        constant = 0xca62c1d6;
      }
      const temporary = (
        rotateLeft(a, 5) + operation + e + constant + words[index]
      ) >>> 0;
      e = d;
      d = c;
      c = rotateLeft(b, 30);
      b = a;
      a = temporary;
    }
    hash[0] = (hash[0] + a) >>> 0;
    hash[1] = (hash[1] + b) >>> 0;
    hash[2] = (hash[2] + c) >>> 0;
    hash[3] = (hash[3] + d) >>> 0;
    hash[4] = (hash[4] + e) >>> 0;
  }
  const output = new Uint8Array(20);
  const outputView = new DataView(output.buffer);
  hash.forEach((value, index) => outputView.setUint32(index * 4, value));
  return output;
}

export function sha384(input) {
  return sha512Family(input, true);
}

export function sha512(input) {
  return sha512Family(input, false);
}

function sha512Family(input, use384) {
  const constants = constants512();
  const bitLength = BigInt(input.length) * 8n;
  const paddedLength = Math.ceil((input.length + 17) / 128) * 128;
  const bytes = new Uint8Array(paddedLength);
  bytes.set(input);
  bytes[input.length] = 0x80;
  writeBigEndian64(bytes, paddedLength - 8, bitLength);
  const view = new DataView(bytes.buffer);
  const hash = (use384 ? constants.iv384 : constants.iv512).slice();
  const words = new Array(80).fill(0n);
  for (let offset = 0; offset < bytes.length; offset += 128) {
    for (let index = 0; index < 16; index += 1) {
      words[index] = view.getBigUint64(offset + index * 8);
    }
    for (let index = 16; index < 80; index += 1) {
      const left = words[index - 15];
      const right = words[index - 2];
      const s0 = rotateRight64(left, 1) ^ rotateRight64(left, 8) ^ (left >> 7n);
      const s1 = rotateRight64(right, 19) ^ rotateRight64(right, 61) ^ (right >> 6n);
      words[index] = (
        words[index - 16] + s0 + words[index - 7] + s1
      ) & mask64;
    }
    let [a, b, c, d, e, f, g, h] = hash;
    for (let index = 0; index < 80; index += 1) {
      const s1 = rotateRight64(e, 14) ^ rotateRight64(e, 18) ^ rotateRight64(e, 41);
      const choose = (e & f) ^ (~e & g);
      const first = (h + s1 + choose + constants.round[index] + words[index]) & mask64;
      const s0 = rotateRight64(a, 28) ^ rotateRight64(a, 34) ^ rotateRight64(a, 39);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const second = (s0 + majority) & mask64;
      h = g; g = f; f = e; e = (d + first) & mask64;
      d = c; c = b; b = a; a = (first + second) & mask64;
    }
    hash[0] = (hash[0] + a) & mask64;
    hash[1] = (hash[1] + b) & mask64;
    hash[2] = (hash[2] + c) & mask64;
    hash[3] = (hash[3] + d) & mask64;
    hash[4] = (hash[4] + e) & mask64;
    hash[5] = (hash[5] + f) & mask64;
    hash[6] = (hash[6] + g) & mask64;
    hash[7] = (hash[7] + h) & mask64;
  }
  const count = use384 ? 6 : 8;
  const output = new Uint8Array(count * 8);
  const outputView = new DataView(output.buffer);
  for (let index = 0; index < count; index += 1) {
    outputView.setBigUint64(index * 8, hash[index]);
  }
  return output;
}

function constants512() {
  if (sha512Constants !== null) return sha512Constants;
  const primes = firstPrimes(80);
  const round = primes.map(prime =>
    integerCubeRoot(BigInt(prime) << 192n) & mask64);
  const roots = primes.slice(0, 16).map(prime =>
    integerSquareRoot(BigInt(prime) << 128n) & mask64);
  sha512Constants = {
    round,
    iv512: roots.slice(0, 8),
    iv384: roots.slice(8, 16),
  };
  return sha512Constants;
}

function firstPrimes(count) {
  const output = [];
  for (let value = 2; output.length < count; value += 1) {
    let prime = true;
    for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
      if (value % divisor === 0) {
        prime = false;
        break;
      }
    }
    if (prime) output.push(value);
  }
  return output;
}

function integerSquareRoot(value) {
  if (value < 2n) return value;
  let current = 1n << BigInt(Math.ceil(bitLength(value) / 2));
  while (true) {
    const next = (current + value / current) >> 1n;
    if (next >= current) return current;
    current = next;
  }
}

function integerCubeRoot(value) {
  if (value < 2n) return value;
  let current = 1n << BigInt(Math.ceil(bitLength(value) / 3));
  while (true) {
    const next = (2n * current + value / (current * current)) / 3n;
    if (next >= current) return current;
    current = next;
  }
}

function bitLength(value) {
  return value.toString(2).length;
}

function rotateLeft(value, bits) {
  return ((value << bits) | (value >>> (32 - bits))) >>> 0;
}

function rotateRight64(value, bits) {
  const count = BigInt(bits);
  return ((value >> count) | (value << (64n - count))) & mask64;
}

function writeBigEndian64(output, offset, value) {
  let current = value;
  for (let index = 7; index >= 0; index -= 1) {
    output[offset + index] = Number(current & 0xffn);
    current >>= 8n;
  }
}
