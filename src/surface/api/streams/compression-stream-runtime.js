import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const compressionState = new WeakMap();
const decompressionState = new WeakMap();

export function CompressionStream(format) {
  if (!new.target) throw new TypeError("Constructor requires 'new'");
  const normalized = normalizeFormat(format);
  const chunks = [];
  const transform = new TransformStream({
    transform(chunk) { chunks.push(copyBytes(chunk)); },
    flush(controller) {
      controller.enqueue(compress(concatenate(chunks), normalized));
    },
  });
  compressionState.set(this, { transform });
}
registerNativeFunction(CompressionStream, "CompressionStream");

export function DecompressionStream(format) {
  if (!new.target) throw new TypeError("Constructor requires 'new'");
  const normalized = normalizeFormat(format);
  const chunks = [];
  const transform = new TransformStream({
    transform(chunk) { chunks.push(copyBytes(chunk)); },
    flush(controller) {
      controller.enqueue(decompress(concatenate(chunks), normalized));
    },
  });
  decompressionState.set(this, { transform });
}
registerNativeFunction(DecompressionStream, "DecompressionStream");

export function compressionProperty(stream, name) {
  const state = compressionState.get(stream);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state.transform[name];
}

export function decompressionProperty(stream, name) {
  const state = decompressionState.get(stream);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state.transform[name];
}

function compress(bytes, format) {
  const raw = storedDeflate(bytes);
  if (format === "deflate-raw") return raw;
  if (format === "deflate") {
    const checksum = adler32(bytes);
    return concatenate([
      new Uint8Array([0x78, 0x01]),
      raw,
      new Uint8Array([
        checksum >>> 24,
        checksum >>> 16,
        checksum >>> 8,
        checksum,
      ]),
    ]);
  }
  const checksum = crc32(bytes);
  const size = bytes.length >>> 0;
  return concatenate([
    new Uint8Array([0x1f, 0x8b, 8, 0, 0, 0, 0, 0, 0, 255]),
    raw,
    littleEndian(checksum),
    littleEndian(size),
  ]);
}

function decompress(bytes, format) {
  let raw = bytes;
  if (format === "deflate") {
    if (bytes.length < 6 || (bytes[0] & 0x0f) !== 8) invalid();
    raw = bytes.subarray(2, bytes.length - 4);
  } else if (format === "gzip") {
    if (bytes.length < 18 || bytes[0] !== 0x1f || bytes[1] !== 0x8b || bytes[2] !== 8) {
      invalid();
    }
    raw = bytes.subarray(10, bytes.length - 8);
  }
  return inflateDeflate(raw);
}

function storedDeflate(bytes) {
  if (bytes.length === 0) {
    return new Uint8Array([1, 0, 0, 255, 255]);
  }
  const chunks = [];
  for (let offset = 0; offset < bytes.length; offset += 65_535) {
    const chunk = bytes.subarray(offset, Math.min(bytes.length, offset + 65_535));
    const final = offset + chunk.length >= bytes.length ? 1 : 0;
    const length = chunk.length;
    const inverse = (~length) & 0xffff;
    chunks.push(new Uint8Array([
      final,
      length & 0xff,
      length >>> 8,
      inverse & 0xff,
      inverse >>> 8,
    ]), chunk);
  }
  return concatenate(chunks);
}

function inflateDeflate(bytes) {
  const reader = bitReader(bytes);
  const output = [];
  let final = false;
  while (!final) {
    final = reader.readBits(1) === 1;
    const type = reader.readBits(2);
    if (type === 0) {
      reader.align();
      const length = reader.readBits(16);
      const inverse = reader.readBits(16);
      if (((length ^ inverse) & 0xffff) !== 0xffff) invalid();
      for (let index = 0; index < length; index += 1) {
        output.push(reader.readBits(8));
      }
      continue;
    }
    if (type === 3) invalid();
    const [literalTree, distanceTree] = type === 1
      ? fixedTrees()
      : dynamicTrees(reader);
    while (true) {
      const symbol = decodeSymbol(reader, literalTree);
      if (symbol < 256) {
        output.push(symbol);
        continue;
      }
      if (symbol === 256) break;
      if (symbol > 285) invalid();
      const lengthIndex = symbol - 257;
      const length = lengthBases[lengthIndex]
        + reader.readBits(lengthExtras[lengthIndex]);
      const distanceSymbol = decodeSymbol(reader, distanceTree);
      if (distanceSymbol > 29) invalid();
      const distance = distanceBases[distanceSymbol]
        + reader.readBits(distanceExtras[distanceSymbol]);
      if (distance < 1 || distance > output.length) invalid();
      for (let index = 0; index < length; index += 1) {
        output.push(output[output.length - distance]);
      }
    }
  }
  return new Uint8Array(output);
}

const lengthBases = [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258,
];
const lengthExtras = [
  0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,
  3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0,
];
const distanceBases = [
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129,
  193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097,
  6145, 8193, 12289, 16385, 24577,
];
const distanceExtras = [
  0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6,
  6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13,
];
let cachedFixedTrees = null;

function fixedTrees() {
  if (cachedFixedTrees !== null) return cachedFixedTrees;
  const literalLengths = new Array(288);
  literalLengths.fill(8, 0, 144);
  literalLengths.fill(9, 144, 256);
  literalLengths.fill(7, 256, 280);
  literalLengths.fill(8, 280);
  cachedFixedTrees = [
    buildHuffman(literalLengths),
    buildHuffman(new Array(32).fill(5)),
  ];
  return cachedFixedTrees;
}

function dynamicTrees(reader) {
  const literalCount = reader.readBits(5) + 257;
  const distanceCount = reader.readBits(5) + 1;
  const codeCount = reader.readBits(4) + 4;
  const order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  const codeLengths = new Array(19).fill(0);
  for (let index = 0; index < codeCount; index += 1) {
    codeLengths[order[index]] = reader.readBits(3);
  }
  const codeTree = buildHuffman(codeLengths);
  const lengths = [];
  while (lengths.length < literalCount + distanceCount) {
    const symbol = decodeSymbol(reader, codeTree);
    if (symbol <= 15) {
      lengths.push(symbol);
    } else if (symbol === 16) {
      if (lengths.length === 0) invalid();
      const repeat = reader.readBits(2) + 3;
      const previous = lengths.at(-1);
      for (let index = 0; index < repeat; index += 1) lengths.push(previous);
    } else if (symbol === 17) {
      const repeat = reader.readBits(3) + 3;
      for (let index = 0; index < repeat; index += 1) lengths.push(0);
    } else if (symbol === 18) {
      const repeat = reader.readBits(7) + 11;
      for (let index = 0; index < repeat; index += 1) lengths.push(0);
    } else {
      invalid();
    }
    if (lengths.length > literalCount + distanceCount) invalid();
  }
  return [
    buildHuffman(lengths.slice(0, literalCount)),
    buildHuffman(lengths.slice(literalCount)),
  ];
}

function buildHuffman(lengths) {
  const maximum = Math.max(...lengths);
  if (maximum === 0) return { maximum: 1, codes: new Map([[0, 0]]) };
  const counts = new Array(maximum + 1).fill(0);
  for (const length of lengths) if (length > 0) counts[length] += 1;
  const next = new Array(maximum + 1).fill(0);
  let code = 0;
  for (let bits = 1; bits <= maximum; bits += 1) {
    code = (code + counts[bits - 1]) << 1;
    next[bits] = code;
  }
  const codes = new Map();
  lengths.forEach((length, symbol) => {
    if (length === 0) return;
    const key = `${length}:${next[length]}`;
    codes.set(key, symbol);
    next[length] += 1;
  });
  return { maximum, codes };
}

function decodeSymbol(reader, tree) {
  let code = 0;
  for (let length = 1; length <= tree.maximum; length += 1) {
    code = (code << 1) | reader.readBits(1);
    const symbol = tree.codes.get(`${length}:${code}`);
    if (symbol !== undefined) return symbol;
  }
  invalid();
}

function bitReader(bytes) {
  let offset = 0;
  let bitOffset = 0;
  return {
    readBits(count) {
      let value = 0;
      for (let index = 0; index < count; index += 1) {
        if (offset >= bytes.length) invalid();
        value |= ((bytes[offset] >>> bitOffset) & 1) << index;
        bitOffset += 1;
        if (bitOffset === 8) {
          bitOffset = 0;
          offset += 1;
        }
      }
      return value;
    },
    align() {
      if (bitOffset !== 0) {
        bitOffset = 0;
        offset += 1;
      }
    },
  };
}

function adler32(bytes) {
  let a = 1;
  let b = 0;
  for (const value of bytes) {
    a = (a + value) % 65_521;
    b = (b + a) % 65_521;
  }
  return ((b << 16) | a) >>> 0;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const value of bytes) {
    crc ^= value;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (~crc) >>> 0;
}

function littleEndian(value) {
  return new Uint8Array([
    value,
    value >>> 8,
    value >>> 16,
    value >>> 24,
  ]);
}

function copyBytes(value) {
  if (!ArrayBuffer.isView(value)) throw new TypeError("A BufferSource is required");
  return new Uint8Array(
    value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength),
  );
}

function concatenate(chunks) {
  const result = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

function normalizeFormat(format) {
  const value = `${format}`;
  if (!["deflate", "deflate-raw", "gzip"].includes(value)) {
    throw new TypeError("The compression format is unsupported");
  }
  return value;
}

function invalid() {
  throw new TypeError("The compressed input is invalid");
}
