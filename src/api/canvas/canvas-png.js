export function encodeCanvasPng(width, height, pixels) {
  const rowLength = width * 4 + 1;
  const raw = new Uint8Array(rowLength * height);
  for (let row = 0; row < height; row += 1) {
    raw[row * rowLength] = 0;
    raw.set(
      pixels.subarray(row * width * 4, (row + 1) * width * 4),
      row * rowLength + 1,
    );
  }
  return joinBytes(
    new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", joinBytes(
      uint32(width),
      uint32(height),
      new Uint8Array([8, 6, 0, 0, 0]),
    )),
    pngChunk("IDAT", deflateStored(raw)),
    pngChunk("IEND", new Uint8Array()),
  );
}

export function encodeBase64(bytes) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  for (let offset = 0; offset < bytes.length; offset += 3) {
    const first = bytes[offset];
    const second = bytes[offset + 1];
    const third = bytes[offset + 2];
    result += alphabet[first >>> 2];
    result += alphabet[((first & 3) << 4) | ((second ?? 0) >>> 4)];
    result += second === undefined
      ? "="
      : alphabet[((second & 15) << 2) | ((third ?? 0) >>> 6)];
    result += third === undefined ? "=" : alphabet[third & 63];
  }
  return result;
}

function deflateStored(bytes) {
  const blocks = [];
  let offset = 0;
  do {
    const length = Math.min(65535, bytes.length - offset);
    const final = offset + length >= bytes.length;
    blocks.push(new Uint8Array([
      final ? 1 : 0,
      length & 0xff,
      (length >>> 8) & 0xff,
      (~length) & 0xff,
      ((~length) >>> 8) & 0xff,
    ]));
    blocks.push(bytes.subarray(offset, offset + length));
    offset += length;
  } while (offset < bytes.length);
  return joinBytes(
    new Uint8Array([0x78, 0x01]),
    ...blocks,
    uint32(adler32(bytes)),
  );
}

function pngChunk(type, data) {
  const typeBytes = new Uint8Array([
    type.charCodeAt(0),
    type.charCodeAt(1),
    type.charCodeAt(2),
    type.charCodeAt(3),
  ]);
  return joinBytes(
    uint32(data.length),
    typeBytes,
    data,
    uint32(crc32(joinBytes(typeBytes, data))),
  );
}

function uint32(value) {
  return new Uint8Array([
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  ]);
}

function adler32(bytes) {
  let a = 1;
  let b = 0;
  for (const byte of bytes) {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function joinBytes(...parts) {
  const result = new Uint8Array(
    parts.reduce((length, part) => length + part.length, 0),
  );
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
}
