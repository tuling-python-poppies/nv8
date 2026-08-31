export function encodeUtf8(input) {
  const output = [];
  for (const character of input) {
    let point = character.codePointAt(0);
    if (point >= 0xd800 && point <= 0xdfff) {
      point = 0xfffd;
    }
    if (point <= 0x7f) {
      output.push(point);
    } else if (point <= 0x7ff) {
      output.push(
        0xc0 | (point >> 6),
        0x80 | (point & 0x3f),
      );
    } else if (point <= 0xffff) {
      output.push(
        0xe0 | (point >> 12),
        0x80 | ((point >> 6) & 0x3f),
        0x80 | (point & 0x3f),
      );
    } else {
      output.push(
        0xf0 | (point >> 18),
        0x80 | ((point >> 12) & 0x3f),
        0x80 | ((point >> 6) & 0x3f),
        0x80 | (point & 0x3f),
      );
    }
  }
  return output;
}

export function decodeBytes(encoding, bytes, fatal, ignoreBOM) {
  let output;
  if (encoding === "utf-8") {
    output = decodeUtf8(bytes, fatal);
  } else if (encoding === "utf-16le") {
    output = decodeUtf16(bytes, true, fatal);
  } else if (encoding === "utf-16be") {
    output = decodeUtf16(bytes, false, fatal);
  } else {
    output = decodeWindows1252(bytes);
  }
  if (!ignoreBOM && output.startsWith("\ufeff")) {
    return output.slice(1);
  }
  return output;
}

export function streamingPrefixLength(encoding, bytes) {
  if (encoding === "utf-16le" || encoding === "utf-16be") {
    return bytes.length - (bytes.length % 2);
  }
  if (encoding !== "utf-8" || bytes.length === 0) {
    return bytes.length;
  }
  let start = bytes.length - 1;
  while (start >= 0 && start >= bytes.length - 4 && (bytes[start] & 0xc0) === 0x80) {
    start -= 1;
  }
  if (start < 0) {
    return bytes.length;
  }
  const first = bytes[start];
  const expected = first < 0x80
    ? 1
    : first >= 0xc2 && first <= 0xdf
      ? 2
      : first >= 0xe0 && first <= 0xef
        ? 3
        : first >= 0xf0 && first <= 0xf4 ? 4 : 1;
  return bytes.length - start < expected ? start : bytes.length;
}

function decodeUtf8(bytes, fatal) {
  let output = "";
  for (let index = 0; index < bytes.length;) {
    const first = bytes[index];
    let point;
    let count;
    if (first <= 0x7f) {
      point = first;
      count = 1;
    } else if (first >= 0xc2 && first <= 0xdf) {
      point = first & 0x1f;
      count = 2;
    } else if (first >= 0xe0 && first <= 0xef) {
      point = first & 0x0f;
      count = 3;
    } else if (first >= 0xf0 && first <= 0xf4) {
      point = first & 0x07;
      count = 4;
    } else {
      output += invalid(fatal);
      index += 1;
      continue;
    }
    if (index + count > bytes.length) {
      output += invalid(fatal);
      break;
    }
    let valid = true;
    for (let offset = 1; offset < count; offset += 1) {
      const continuation = bytes[index + offset];
      if ((continuation & 0xc0) !== 0x80) {
        valid = false;
        break;
      }
      point = (point << 6) | (continuation & 0x3f);
    }
    const minimum = count === 1
      ? 0
      : count === 2 ? 0x80 : count === 3 ? 0x800 : 0x10000;
    if (
      !valid
      || point < minimum
      || point > 0x10ffff
      || (point >= 0xd800 && point <= 0xdfff)
    ) {
      output += invalid(fatal);
      index += 1;
      continue;
    }
    output += String.fromCodePoint(point);
    index += count;
  }
  return output;
}

function decodeUtf16(bytes, littleEndian, fatal) {
  if (fatal && bytes.length % 2 !== 0) {
    throw new TypeError("The encoded data has an incomplete UTF-16 code unit");
  }
  const units = [];
  for (let index = 0; index + 1 < bytes.length; index += 2) {
    units.push(littleEndian
      ? bytes[index] | (bytes[index + 1] << 8)
      : (bytes[index] << 8) | bytes[index + 1]);
  }
  let output = "";
  for (let index = 0; index < units.length; index += 1) {
    const unit = units[index];
    if (unit >= 0xd800 && unit <= 0xdbff) {
      const low = units[index + 1];
      if (low >= 0xdc00 && low <= 0xdfff) {
        output += String.fromCharCode(unit, low);
        index += 1;
      } else {
        output += invalid(fatal);
      }
    } else if (unit >= 0xdc00 && unit <= 0xdfff) {
      output += invalid(fatal);
    } else {
      output += String.fromCharCode(unit);
    }
  }
  return output;
}

function decodeWindows1252(bytes) {
  const special = {
    0x80: 0x20ac, 0x82: 0x201a, 0x83: 0x0192, 0x84: 0x201e,
    0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02c6,
    0x89: 0x2030, 0x8a: 0x0160, 0x8b: 0x2039, 0x8c: 0x0152,
    0x8e: 0x017d, 0x91: 0x2018, 0x92: 0x2019, 0x93: 0x201c,
    0x94: 0x201d, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
    0x98: 0x02dc, 0x99: 0x2122, 0x9a: 0x0161, 0x9b: 0x203a,
    0x9c: 0x0153, 0x9e: 0x017e, 0x9f: 0x0178,
  };
  return Array.from(bytes, (byte) => (
    String.fromCodePoint(special[byte] ?? byte)
  )).join("");
}

function invalid(fatal) {
  if (fatal) {
    throw new TypeError("The encoded data is not valid");
  }
  return "\ufffd";
}
