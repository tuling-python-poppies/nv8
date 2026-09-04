import {
  installTextDecoderConstructor,
  installTextDecoderConstructorBacklink,
} from "../api/encoding/text-decoder-constructor.js";
import { installTextDecoderDecode } from "../api/encoding/text-decoder-decode.js";
import { installTextDecoderEncoding } from "../api/encoding/text-decoder-encoding-getter.js";
import { installTextDecoderFatal } from "../api/encoding/text-decoder-fatal-getter.js";
import { installTextDecoderIgnoreBOM } from "../api/encoding/text-decoder-ignore-bom-getter.js";
import {
  installTextEncoderConstructor,
  installTextEncoderConstructorBacklink,
} from "../api/encoding/text-encoder-constructor.js";
import { installTextEncoderEncodeInto } from "../api/encoding/text-encoder-encode-into.js";
import { installTextEncoderEncode } from "../api/encoding/text-encoder-encode.js";
import { installTextEncoderEncoding } from "../api/encoding/text-encoder-encoding-getter.js";

export function installTextEncoding() {
  installTextEncoderConstructor();
  installTextEncoderEncoding();
  installTextEncoderEncode();
  installTextEncoderEncodeInto();
  installTextEncoderConstructorBacklink();
  installTextDecoderConstructor();
  installTextDecoderEncoding();
  installTextDecoderFatal();
  installTextDecoderIgnoreBOM();
  installTextDecoderDecode();
  installTextDecoderConstructorBacklink();
}
