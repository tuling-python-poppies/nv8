/**
 * 打印宿主能力与支持等级。
 *
 * CI 在跑测试前先执行它，这样即便测试失败，日志里也能看到
 * 该 Node 版本上哪些能力缺失或损坏。
 */

import {
  CAPABILITY_STATUS,
  detectHostCapabilities,
  resolveNodeSupport,
} from '../src/core/host-capabilities.js';
import { describeHostCompat } from '../src/compat/index.js';

const host = detectHostCapabilities();
const support = resolveNodeSupport(host.nodeVersion);

console.log(`Node       : ${host.nodeVersion}`);
console.log(`V8         : ${host.v8Version}`);
console.log(`Support    : ${support.tier}${support.notes ? ` (${support.notes})` : ''}`);
console.log(`Meets min  : ${support.meetsMinimum}`);
console.log('');
console.log('Capabilities:');

const width = Math.max(...Object.keys(host.capabilities).map((id) => id.length));
for (const record of Object.values(host.capabilities)) {
  const mark = record.status === CAPABILITY_STATUS.AVAILABLE ? '+' : '-';
  const reason = record.reason ? `  ${record.reason}` : '';
  console.log(`  ${mark} ${record.id.padEnd(width)}  ${record.status}${reason}`);
}

console.log('');
console.log('Host compat fallbacks:');
for (const [key, value] of Object.entries(describeHostCompat())) {
  if (key === 'nodeVersion') continue;
  console.log(`  ${value ? '+' : '-'} ${key}`);
}

if (!support.meetsMinimum) {
  console.error(`\nNode ${host.nodeVersion} is below the minimum supported version`);
  process.exit(1);
}
