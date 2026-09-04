/**
 * Trace / Network / Navigation golden fixture
 *
 * 这三类记录都带非确定性成分（时间戳、自增序号、宿主随机值），直接存
 * golden 会每次都不一致。这里的核心工作是**归一化**：剥掉非确定性字段，
 * 只保留行为语义。
 *
 * 判断标准：如果某个字段在同一场景重复运行时会变，它就不属于行为契约，
 * 应当被剔除或降级为计数。
 */

import { createHash } from 'node:crypto';

export const OBSERVABILITY_SCHEMA = 'nv8/baseline/observability@1';

/**
 * 归一化 proxy trace。
 *
 * 剔除 `sequence`——它是自增序号，会随之前执行过多少操作而漂移。
 * 保留 operation/api/receiver/result 类型，这些才是行为。
 *
 * `arguments` 只保留类型序列而非值：值里可能有 URL、随机数或对象地址，
 * 类型序列足以发现签名变化。
 *
 * @param {readonly object[]} entries
 * @returns {object[]}
 */
export function normalizeTrace(entries) {
  if (!Array.isArray(entries)) return [];
  return entries.map((entry) => ({
    operation: entry.operation ?? null,
    api: entry.api ?? null,
    receiver: entry.receiver ?? null,
    argumentTypes: Array.isArray(entry.arguments)
      ? entry.arguments.map((value) => typeof value)
      : [],
    result: entry.result ?? null,
  }));
}

/**
 * 归一化网络请求记录。
 *
 * 剔除 `sequence`（自增）与各类 `*Truncated` 标志（取决于限额配置而非行为）。
 * body 只保留字节长度：内容可能含时间戳或随机 nonce。
 *
 * @param {readonly object[]} records
 * @returns {object[]}
 */
export function normalizeNetworkRequests(records) {
  if (!Array.isArray(records)) return [];
  return records.map((record) => ({
    api: record.api ?? null,
    method: record.method ?? null,
    url: record.url ?? null,
    outcome: record.outcome ?? null,
    contextKind: record.context?.kind ?? null,
    contextUrl: record.context?.url ?? null,
    topLevel: record.context?.topLevel ?? null,
    headerNames: Array.isArray(record.headers)
      ? record.headers.map((header) => String(header.name ?? header[0]).toLowerCase()).sort()
      : [],
    bodyByteLength: record.bodyByteLength ?? 0,
  }));
}

/**
 * 归一化导航序列。
 *
 * 只保留 URL 与导航模式，剔除条目 key/id——它们是自增标识，
 * 会随之前创建过多少条目而漂移。
 *
 * @param {readonly object[]} entries
 * @returns {object[]}
 */
export function normalizeNavigation(entries) {
  if (!Array.isArray(entries)) return [];
  return entries.map((entry) => ({
    url: entry.url ?? null,
    index: entry.index ?? null,
    hasState: entry.state !== null && entry.state !== undefined,
  }));
}

/**
 * 汇总为可存档的 observability 快照。
 *
 * @param {object} input
 * @param {readonly object[]} [input.trace]
 * @param {readonly object[]} [input.requests]
 * @param {readonly object[]} [input.navigation]
 * @returns {object}
 */
export function summarizeObservability(input = {}) {
  const trace = normalizeTrace(input.trace);
  const requests = normalizeNetworkRequests(input.requests);
  const navigation = normalizeNavigation(input.navigation);

  return {
    schema: OBSERVABILITY_SCHEMA,
    trace: {
      count: trace.length,
      digest: digestOf(trace),
      entries: trace,
    },
    requests: {
      count: requests.length,
      digest: digestOf(requests),
      entries: requests,
    },
    navigation: {
      count: navigation.length,
      digest: digestOf(navigation),
      entries: navigation,
    },
  };
}

/**
 * 对比两份 observability 快照。
 *
 * 逐条对比而非只比 digest——digest 不一致时需要知道是哪一条变了。
 *
 * @param {object} expected
 * @param {object} actual
 * @returns {object[]} 差异列表，空数组表示一致
 */
export function diffObservability(expected, actual) {
  const differences = [];

  for (const section of ['trace', 'requests', 'navigation']) {
    const before = expected?.[section] ?? { count: 0, entries: [] };
    const after = actual?.[section] ?? { count: 0, entries: [] };

    if (before.count !== after.count) {
      differences.push({
        section,
        kind: 'count',
        expected: before.count,
        actual: after.count,
      });
    }

    const limit = Math.min(before.entries.length, after.entries.length);
    for (let index = 0; index < limit; index += 1) {
      const left = JSON.stringify(before.entries[index]);
      const right = JSON.stringify(after.entries[index]);
      if (left === right) continue;
      differences.push({
        section,
        kind: 'entry',
        index,
        expected: before.entries[index],
        actual: after.entries[index],
      });
    }
  }

  return differences;
}

function digestOf(value) {
  return createHash('sha256').update(canonical(value)).digest('hex').slice(0, 16);
}

function canonical(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
}
