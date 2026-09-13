/**
 * 协议限制的唯一解析入口。
 *
 * 父侧（ConnectionBase）与子/线程侧（RequestHandler、FrameReader）必须从
 * 同一份 `options.limits` 用同一段逻辑取协议限制，否则会出现「父侧按用户
 * 配置发送、子侧按默认限制拒收」的单边超限（见 IKF39N）。
 *
 * 只采纳显式配置的有效键；缺省键由 `DEFAULT_PROTOCOL_LIMITS` 在编码/解码时补齐。
 */
export const PROTOCOL_LIMIT_KEYS = Object.freeze([
  "maxPayloadBytes",
  "maxValueDepth",
  "maxArrayLength",
  "maxFieldCount",
  "maxStringBytes",
  "maxBytesLength",
]);

export function resolveProtocolLimits(source) {
  const limits = {};
  if (source === null || typeof source !== "object") {
    return limits;
  }
  for (const key of PROTOCOL_LIMIT_KEYS) {
    const value = source[key];
    if (Number.isSafeInteger(value) && value >= 1) {
      limits[key] = value;
    }
  }
  return limits;
}
