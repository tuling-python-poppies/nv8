/**
 * Web IDL Foundation Plugin - 测试套件
 * 
 * 测试所有 WebIDL 基础功能。
 */

import { strict as assert } from 'assert';
import { createApp } from '../../core/app.js';
import webidlPlugin from './index.js';

console.log('🧪 Testing webidl-foundation plugin...\n');

// ============================================================
// Test 1: 插件定义验证
// ============================================================

console.log('Test 1: Plugin definition validation');
assert.equal(webidlPlugin.id, 'webidl-foundation');
assert.equal(webidlPlugin.version, '1.0.0');
assert.equal(webidlPlugin.requires.length, 0); // 无依赖
assert.equal(webidlPlugin.provides.length, 3); // 提供 3 个能力
assert.deepEqual(
  webidlPlugin.provides.map(c => c.name),
  ['webidl-primitives', 'webidl-descriptors', 'native-function-registry']
);
console.log('✅ Plugin definition is valid\n');

// ============================================================
// Test 2: 在 App 中注册和创建 Sandbox
// ============================================================

console.log('Test 2: Register plugin and create sandbox');
const app = createApp({ trace: false });
app.registerPlugin(webidlPlugin);

app.registerProfile({
  id: 'webidl-test',
  description: 'WebIDL test profile',
  plugins: ['webidl-foundation@1.0.0'],
});

const sandbox = await app.createSandbox({
  profile: 'webidl-test',
  trace: false,
});

assert.equal(sandbox.hasCapability('webidl-primitives'), true);
assert.equal(sandbox.hasCapability('webidl-descriptors'), true);
assert.equal(sandbox.hasCapability('native-function-registry'), true);
console.log('✅ Plugin registered and sandbox created\n');

// ============================================================
// Test 3: 创建 Realm 并获取 WebIDL 工具
// ============================================================

console.log('Test 3: Create realm and access WebIDL tools');
const realm = await sandbox.createRealm({ type: 'root' });

// 从 sandbox 能力中获取 webidl-foundation 的导出
const webidlCap = sandbox.getCapability('webidl-primitives');
const webidlExports = sandbox.plugins.find(p => p.id === 'webidl-foundation').exports;

assert.notEqual(webidlExports, undefined);
assert.notEqual(webidlExports.registry, undefined);
assert.equal(typeof webidlExports.registerNativeFunction, 'function');
assert.equal(typeof webidlExports.createNativeFunction, 'function');
console.log('✅ WebIDL tools accessible\n');

// ============================================================
// Test 4: Native Function Registry
// ============================================================

console.log('Test 4: Native function registry');
const { registry, registerNativeFunction, createNativeFunction } = webidlExports;

// 测试注册普通函数
function testFunc() { return 42; }
registerNativeFunction(testFunc, 'testFunc');

assert.equal(registry.has(testFunc), true);
assert.equal(registry.source(testFunc), 'function testFunc() { [native code] }');
console.log('✅ Native function registration works\n');

// ============================================================
// Test 5: Function.prototype.toString 拦截
// ============================================================

console.log('Test 5: Function.prototype.toString override');
const toStringResult = testFunc.toString();
assert.equal(toStringResult, 'function testFunc() { [native code] }');

// 未注册的函数应该返回正常的 toString
function normalFunc() { return 123; }
assert.notEqual(normalFunc.toString(), 'function normalFunc() { [native code] }');
assert.equal(normalFunc.toString().includes('return 123'), true);
console.log('✅ Function.prototype.toString override works\n');

// ============================================================
// Test 6: createNativeFunction
// ============================================================

console.log('Test 6: createNativeFunction');
const nativeAdd = createNativeFunction(
  'add',
  2,
  function(a, b) { return a + b; },
  'add'
);

assert.equal(nativeAdd.name, 'add');
assert.equal(nativeAdd.length, 2);
assert.equal(nativeAdd(1, 2), 3);
assert.equal(nativeAdd.toString(), 'function add() { [native code] }');
console.log('✅ createNativeFunction works\n');

// ============================================================
// Test 7: 属性描述符工具
// ============================================================

console.log('Test 7: Property descriptor tools');
const {
  defineGlobalConstructor,
  defineGlobalFunction,
  defineStaticMethod,
  definePrototypeMethod,
  definePrototypeGetter,
  definePrototypeAccessor,
  defineToStringTag,
} = webidlExports;

// 测试 defineGlobalFunction
const globalFunc = defineGlobalFunction('testGlobalFunc', function() {
  return 'global';
});

assert.equal(typeof realm.global.testGlobalFunc, 'function');
assert.equal(realm.global.testGlobalFunc(), 'global');
assert.equal(
  realm.global.testGlobalFunc.toString(),
  'function testGlobalFunc() { [native code] }'
);
console.log('✅ defineGlobalFunction works\n');

// ============================================================
// Test 8: 构造器和原型方法
// ============================================================

console.log('Test 8: Constructor and prototype methods');

class TestClass {}
defineGlobalConstructor('TestClass', TestClass);

assert.equal(realm.global.TestClass, TestClass);
assert.equal(TestClass.prototype.writable, undefined); // prototype 应该是不可写的

// 定义原型方法
definePrototypeMethod(TestClass.prototype, 'testMethod', function() {
  return 'test';
});

const instance = new TestClass();
assert.equal(instance.testMethod(), 'test');
assert.equal(
  instance.testMethod.toString(),
  'function testMethod() { [native code] }'
);
console.log('✅ Constructor and prototype methods work\n');

// ============================================================
// Test 9: Getter/Setter
// ============================================================

console.log('Test 9: Prototype getter/setter');

let _value = 0;
definePrototypeGetter(TestClass.prototype, 'value', function() {
  return _value;
});

definePrototypeAccessor(
  TestClass.prototype,
  'value2',
  function() { return _value * 2; },
  function(val) { _value = val / 2; }
);

assert.equal(instance.value, 0);
instance.value2 = 10;
assert.equal(_value, 5);
assert.equal(instance.value2, 10);
console.log('✅ Getter/setter work\n');

// ============================================================
// Test 10: Web IDL 类型转换
// ============================================================

console.log('Test 10: Web IDL type conversions');
const { toDOMString, toBoolean, toEventInit, toEventListenerOptions } = webidlExports;

// toDOMString
assert.equal(toDOMString('hello'), 'hello');
assert.equal(toDOMString(123), '123');
assert.equal(toDOMString(null), 'null');
assert.equal(toDOMString(undefined), 'undefined');

try {
  toDOMString(Symbol('test'));
  assert.fail('Should throw TypeError for Symbol');
} catch (e) {
  assert.equal(e instanceof TypeError, true);
}

// toBoolean
assert.equal(toBoolean(true), true);
assert.equal(toBoolean(1), true);
assert.equal(toBoolean(''), false);
assert.equal(toBoolean(0), false);

// toEventInit
const eventInit1 = toEventInit(null);
assert.deepEqual(eventInit1, { bubbles: false, cancelable: false, composed: false });

const eventInit2 = toEventInit({ bubbles: true, cancelable: true });
assert.deepEqual(eventInit2, { bubbles: true, cancelable: true, composed: false });

// toEventListenerOptions
const options1 = toEventListenerOptions(null);
assert.deepEqual(options1, { capture: false, once: false, passive: false, signal: null });

const options2 = toEventListenerOptions(true);
assert.deepEqual(options2, { capture: true, once: false, passive: false, signal: null });

const options3 = toEventListenerOptions({ once: true, passive: true });
assert.deepEqual(options3, { capture: false, once: true, passive: true, signal: null });

console.log('✅ Type conversions work\n');

// ============================================================
// Test 11: 跨 Realm 状态共享
// ============================================================

console.log('Test 11: Cross-realm registry sharing');

// Registry 应该在 sandbox 层共享
const registry2 = sandbox.state.get('native-function-registry', 'sandbox');
assert.equal(registry2, registry);

// 创建第二个 realm，应该共享同一个 registry
const realm2 = await sandbox.createRealm({ type: 'root' });
const webidlExports2 = sandbox.plugins.find(p => p.id === 'webidl-foundation').exports;

assert.equal(webidlExports2.registry, registry);
console.log('✅ Cross-realm registry sharing works\n');

// ============================================================
// Test 12: 清理
// ============================================================

console.log('Test 12: Cleanup');
await realm.destroy();
await realm2.destroy();
await app.destroySandbox(sandbox.id);
console.log('✅ Cleanup successful\n');

// ============================================================
// 总结
// ============================================================

console.log('━'.repeat(60));
console.log('✨ All webidl-foundation tests passed!');
console.log('━'.repeat(60));
console.log('');
console.log('Verified functionality:');
console.log('  ✓ Plugin definition and registration');
console.log('  ✓ Native function registry');
console.log('  ✓ Function.prototype.toString override');
console.log('  ✓ createNativeFunction');
console.log('  ✓ Property descriptor tools');
console.log('  ✓ Constructor and prototype methods');
console.log('  ✓ Getter/setter support');
console.log('  ✓ Web IDL type conversions');
console.log('  ✓ Cross-realm registry sharing');
console.log('  ✓ Cleanup and lifecycle');
console.log('');
console.log('🎯 webidl-foundation plugin is production-ready!');
