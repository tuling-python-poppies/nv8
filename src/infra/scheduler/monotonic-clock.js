const nativeDateNow = Date.now.bind(Date);
const defaultTimingProfile = Object.freeze({
  timeOriginMs: nativeDateNow(),
  wallClockOffsetMs: 0,
  dateNowResolutionMs: 0,
  performanceResolutionMs: 0,
  performanceJitterMs: 0,
  jitterSeed: 0x4e5638,
  minimumTimerDelayMs: 0,
  animationFrameIntervalMs: 16,
});

/**
 * 时钟状态的作用域决策
 *
 * 这里的状态分两类，它们的正确作用域不同，但存储上统一按 Realm
 * 隔离，原因如下。
 *
 * 1. 指纹配置（wallClockOffsetMs、dateNowResolutionMs、jitterSeed……）
 *    语义上属于 Sandbox：同一个浏览会话里父窗口与 iframe 的 Date.now()
 *    偏移量必须一致，否则很容易被检测。
 *    这一点由调用方保证：所有 Realm 创建点（src/core/sandbox.js）都从同一份
 *    `profile.timing` 取配置。用“共享模块变量”来实现一致性是错的手段：
 *    它会让任意 Realm 的 configureTimingProfile() 逆向覆盖其他 Realm。
 *
 * 2. 运行时游标（timeOrigin、lastTimestamp、lastWallClock、jitterState）
 *    必须 per-Realm：
 *    - `performance.timeOrigin` 按规范就是每个 Document/Worker 独立的
 *    - `performance.now()` 的单调游标基于各自的 timeOrigin，共享会互相抬高
 *    - jitter PRNG 按 Realm 隔离后序列可复现；共享时多 Realm 交错消耗，
 *      同一段目标脚本两次运行拿到不同拖动量
 *
 * 注意：timeOrigin 来自配置（profile.timeOriginMs）而非“Realm 创建时刻”，
 * 因此迁移后同一 Sandbox 内各 Realm 的 timeOrigin 仍然相同——行为不变，
 * 变的只是不再互相覆盖。
 */
import { createRealmSlot } from "../../engine/core/state-scope.js";

const clockSlot = createRealmSlot(() => ({
  profile: defaultTimingProfile,
  sessionTimeOrigin: defaultTimingProfile.timeOriginMs,
  lastTimestamp: 0,
  lastWallClock: defaultTimingProfile.timeOriginMs,
  jitterState: defaultTimingProfile.jitterSeed >>> 0,
}), "monotonic-clock");

function clock() {
  return clockSlot.get(globalThis);
}

export function configureTimingProfile(input = null) {
  const state = clock();
  const selected = input ?? defaultTimingProfile;
  state.profile = Object.freeze({
    ...defaultTimingProfile,
    ...selected,
    timeOriginMs: Number.isFinite(selected.timeOriginMs)
      ? selected.timeOriginMs
      : defaultTimingProfile.timeOriginMs,
  });
  state.sessionTimeOrigin = state.profile.timeOriginMs
    + state.profile.wallClockOffsetMs;
  state.lastTimestamp = 0;
  state.lastWallClock = Math.trunc(state.sessionTimeOrigin);
  state.jitterState = state.profile.jitterSeed >>> 0;
  if (state.jitterState === 0) state.jitterState = 0x6d2b79f5;
}

export function timingProfile() {
  return clock().profile;
}

export function timeOrigin() {
  return clock().sessionTimeOrigin;
}

export function wallClockNow() {
  const state = clock();
  const raw = nativeDateNow() + state.profile.wallClockOffsetMs;
  const resolution = state.profile.dateNowResolutionMs;
  const quantized = resolution > 0
    ? Math.floor(raw / resolution) * resolution
    : raw;
  const value = Math.trunc(quantized);
  if (value < state.lastWallClock) return state.lastWallClock;
  state.lastWallClock = value;
  return value;
}

export function monotonicNow() {
  const state = clock();
  const elapsed = Math.max(
    0,
    nativeDateNow() + state.profile.wallClockOffsetMs - state.sessionTimeOrigin,
  );
  const resolution = state.profile.performanceResolutionMs;
  let value = resolution > 0
    ? Math.floor(elapsed / resolution) * resolution
    : elapsed;
  if (state.profile.performanceJitterMs > 0) {
    value += nextJitter(state, state.profile.performanceJitterMs);
  }
  value = Math.max(state.lastTimestamp, value, 0);
  state.lastTimestamp = value;
  return value;
}

function nextJitter(state, amplitude) {
  let jitter = state.jitterState;
  jitter = Math.imul(jitter ^ (jitter >>> 15), 1 | jitter);
  jitter ^= jitter + Math.imul(jitter ^ (jitter >>> 7), 61 | jitter);
  state.jitterState = jitter;
  const normalized = ((jitter ^ (jitter >>> 14)) >>> 0) / 0xffffffff;
  return (normalized * 2 - 1) * amplitude;
}
