/**
 * 现代内建对象的 Node 版本 shim
 *
 * `SuppressedError` / `DisposableStack` / `AsyncDisposableStack` /
 * `Float16Array` / `DataView.prototype.getFloat16` 都是 V8 13（Node 24）才有的，
 * Node 18–22 上由 `src/install/install-modern-builtins.js` 补。
 *
 * **这份测试刻意不区分 Node 版本**：同一张表在 Node 24 上验证原生实现、在
 * 18–22 上验证 shim。只有这样才能证明 shim 与原生一致——分成两套期望值等于
 * 承认「shim 长什么样都行」，而 shim 的全部意义就是长得和原生一样。
 *
 * 这里抓到过的真实偏差（Node 22）：
 *
 * - `[Symbol.dispose]() {}` 在 `Symbol.dispose` 不存在时，计算键被 ToPropertyKey
 *   转成**字符串 `"undefined"`**。于是 `DisposableStack.prototype` 上多出一个
 *   真实浏览器绝不会有的成员，符号键还少两个。多出的成员是宿主特征泄漏，
 *   比缺少成员严重。
 * - `SuppressedError` 的 `name` 写在构造器里（落在实例上），原型缺 `message`
 *   与 `name` 两个成员。
 * - `Float16Array.prototype` 少 `BYTES_PER_ELEMENT`，却多一个显式的
 *   `Symbol.toStringTag`（真实的那个在 `%TypedArray%.prototype` 上）。
 * - `DataView` 完全没有 `getFloat16` / `setFloat16`。
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const PAGE_HTML = '<!doctype html><html><head></head><body></body></html>';

let sandboxPromise = null;

function sharedSandbox() {
  if (sandboxPromise === null) {
    sandboxPromise = (async () => {
      const { createSandbox } = await import('../src/public/create-sandbox.js');
      return createSandbox('https://builtins.test/', {
        page: { html: PAGE_HTML },
        limits: { timeoutMs: 30_000 },
      });
    })();
  }
  return sandboxPromise;
}

test.after(async () => {
  if (sandboxPromise === null) return;
  const sandbox = await sandboxPromise;
  await sandbox.close();
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  createSandbox.drain();
});

async function probe(expression) {
  const sandbox = await sharedSandbox();
  return JSON.parse(await sandbox.run(`JSON.stringify(${expression})`));
}

// ------------------------------------------------------ dispose 符号

test('Symbol.dispose and Symbol.asyncDispose are real symbols', async () => {
  const observed = await probe(`(() => {
    const shape = (name) => {
      const descriptor = Object.getOwnPropertyDescriptor(Symbol, name);
      return {
        type: typeof Symbol[name],
        description: Symbol[name]?.description,
        writable: descriptor.writable,
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
      };
    };
    return { dispose: shape('dispose'), asyncDispose: shape('asyncDispose') };
  })()`);

  // well-known symbol 的描述符是三个 false
  for (const name of ['dispose', 'asyncDispose']) {
    assert.equal(observed[name].type, 'symbol', `Symbol.${name} must exist`);
    assert.equal(observed[name].description, `Symbol.${name}`);
    assert.equal(observed[name].writable, false);
    assert.equal(observed[name].enumerable, false);
    assert.equal(observed[name].configurable, false);
  }
});

// ------------------------------------------------------ DisposableStack

test('DisposableStack.prototype has the real member set', async () => {
  const observed = await probe(`(() => {
    const prototype = DisposableStack.prototype;
    return {
      strings: Object.getOwnPropertyNames(prototype).sort(),
      symbols: Object.getOwnPropertySymbols(prototype)
        .map(key => key.description).sort(),
      tag: Object.prototype.toString.call(new DisposableStack()),
      disposedIsGetter: typeof Object
        .getOwnPropertyDescriptor(prototype, 'disposed').get,
    };
  })()`);

  // 关键的一条：不能出现字符串键 "undefined"
  assert.deepEqual(observed.strings, [
    'adopt', 'constructor', 'defer', 'dispose', 'disposed', 'move', 'use',
  ]);
  assert.deepEqual(observed.symbols, ['Symbol.dispose', 'Symbol.toStringTag']);
  assert.equal(observed.tag, '[object DisposableStack]');
  assert.equal(observed.disposedIsGetter, 'function');
});

test('AsyncDisposableStack.prototype has the real member set', async () => {
  const observed = await probe(`(() => {
    const prototype = AsyncDisposableStack.prototype;
    return {
      strings: Object.getOwnPropertyNames(prototype).sort(),
      symbols: Object.getOwnPropertySymbols(prototype)
        .map(key => key.description).sort(),
      tag: Object.prototype.toString.call(new AsyncDisposableStack()),
    };
  })()`);

  assert.deepEqual(observed.strings, [
    'adopt', 'constructor', 'defer', 'disposeAsync', 'disposed', 'move', 'use',
  ]);
  assert.deepEqual(observed.symbols, [
    'Symbol.asyncDispose', 'Symbol.toStringTag',
  ]);
  assert.equal(observed.tag, '[object AsyncDisposableStack]');
});

test('DisposableStack actually disposes in reverse order', async () => {
  // 形状对了不代表行为对。shim 的语义必须真的能用，否则「补齐表面」
  // 只是把检测点从「缺 API」挪到「API 是空壳」。
  const observed = await probe(`(() => {
    const order = [];
    const stack = new DisposableStack();
    stack.defer(() => order.push('first'));
    stack.adopt('x', (value) => order.push('adopt:' + value));
    stack.use({ [Symbol.dispose]() { order.push('use'); } });
    const before = stack.disposed;
    stack.dispose();
    return { order, before, after: stack.disposed };
  })()`);

  assert.equal(observed.before, false);
  assert.equal(observed.after, true);
  assert.deepEqual(observed.order, ['use', 'adopt:x', 'first']);
});

// ------------------------------------------------------ SuppressedError

test('SuppressedError.prototype carries message and name', async () => {
  const observed = await probe(`(() => {
    const prototype = SuppressedError.prototype;
    const error = new SuppressedError('e', 's', 'boom');
    return {
      strings: Object.getOwnPropertyNames(prototype).sort(),
      name: prototype.name,
      message: prototype.message,
      instanceKeys: Object.getOwnPropertyNames(error).sort(),
      instanceName: error.name,
      instanceMessage: error.message,
      error: error.error,
      suppressed: error.suppressed,
    };
  })()`);

  // 真实 Edge 151 实测：原型自有成员恰好这三个
  assert.deepEqual(observed.strings, ['constructor', 'message', 'name']);
  assert.equal(observed.name, 'SuppressedError');
  assert.equal(observed.message, '');
  // name 必须来自原型而不是实例——写在构造器里会让原型缺成员
  assert.equal(observed.instanceKeys.includes('name'), false);
  assert.equal(observed.instanceName, 'SuppressedError');
  assert.equal(observed.instanceMessage, 'boom');
  assert.equal(observed.error, 'e');
  assert.equal(observed.suppressed, 's');
});

// ------------------------------------------------------ Float16Array

test('Float16Array.prototype exposes BYTES_PER_ELEMENT and no extra symbol', async () => {
  const observed = await probe(`(() => {
    const prototype = Float16Array.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(
      prototype, 'BYTES_PER_ELEMENT',
    );
    return {
      strings: Object.getOwnPropertyNames(prototype).sort(),
      symbols: Object.getOwnPropertySymbols(prototype).length,
      prototypeValue: prototype.BYTES_PER_ELEMENT,
      staticValue: Float16Array.BYTES_PER_ELEMENT,
      writable: descriptor.writable,
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      name: Float16Array.name,
    };
  })()`);

  assert.deepEqual(observed.strings, ['BYTES_PER_ELEMENT', 'constructor']);
  // `Symbol.toStringTag` 属于 `%TypedArray%.prototype`，不是自有成员
  assert.equal(observed.symbols, 0);
  assert.equal(observed.prototypeValue, 2);
  assert.equal(observed.staticValue, 2);
  assert.equal(observed.writable, false);
  assert.equal(observed.enumerable, false);
  assert.equal(observed.configurable, false);
  assert.equal(observed.name, 'Float16Array');
});

// ------------------------------------------------------ DataView 半精度

/**
 * IEEE 754 binary16 编码表。
 *
 * 逐位对齐，不是「差不多就行」——DataView 的写入结果会直接进协议字节，
 * 一个 bit 的偏差表现成「偶尔算出来的签名不对」，是最难定位的一类缺陷。
 *
 * 挑的都是能区分错误实现的点：
 * - `2049` 正好在 2048 与 2050 中间。ties-to-even 取 2048；用 `Math.round`
 *   会取 2050，只有这个用例能抓到。
 * - `65520` 是最大有限值 65504 与 65536 的中点，ties-to-even 溢出到无穷，
 *   所以边界是 `>=` 而不是 `>`。
 * - `2**-25` 是最小非规格化数的一半，ties-to-even 归零。
 *
 * 值写成**源码字符串**而不是数字：`Infinity` 过不了 JSON
 * （`JSON.stringify(Infinity)` 是 `null`），塞进探针会变成写 0，
 * 于是测试报「编码错了」而实现其实是对的。
 */
const FLOAT16_BITS = [
  ['1', 0x3c00],
  ['-2', 0xc000],
  ['1.5', 0x3e00],
  ['-0.5', 0xb800],
  ['0', 0x0000],
  ['65504', 0x7bff],
  ['65519', 0x7bff],
  ['65520', 0x7c00],
  ['2048', 0x6800],
  ['2049', 0x6800],
  ['2050', 0x6801],
  ['2051', 0x6802],
  ['2 ** -14', 0x0400],
  ['2 ** -24', 0x0001],
  ['2 ** -25', 0x0000],
  ['3 * 2 ** -25', 0x0002],
  ['Infinity', 0x7c00],
  ['-Infinity', 0xfc00],
];

test('DataView exposes getFloat16 and setFloat16 with the native arity', async () => {
  const observed = await probe(`(() => {
    const prototype = DataView.prototype;
    return {
      hasGetter: typeof prototype.getFloat16,
      hasSetter: typeof prototype.setFloat16,
      getLength: prototype.getFloat16.length,
      setLength: prototype.setFloat16.length,
      getterSource: Function.prototype.toString.call(prototype.getFloat16),
      setterSource: Function.prototype.toString.call(prototype.setFloat16),
    };
  })()`);

  assert.equal(observed.hasGetter, 'function');
  assert.equal(observed.hasSetter, 'function');
  // length 是 WebIDL 实参检查的权威来源，写成形参会把 1 变成 2
  assert.equal(observed.getLength, 1);
  assert.equal(observed.setLength, 2);
  // shim 也必须伪装成原生，否则 toString 直接吐出实现源码
  assert.equal(observed.getterSource, 'function getFloat16() { [native code] }');
  assert.equal(observed.setterSource, 'function setFloat16() { [native code] }');
});

test('setFloat16 writes the exact IEEE 754 binary16 bit pattern', async () => {
  const observed = await probe(`(() => {
    const view = new DataView(new ArrayBuffer(2));
    const encode = (value) => {
      view.setFloat16(0, value, true);
      return view.getUint16(0, true);
    };
    return [${FLOAT16_BITS.map(([expression]) => `encode(${expression})`).join(', ')}];
  })()`);

  const failures = [];
  FLOAT16_BITS.forEach(([expression, bits], index) => {
    if (observed[index] === bits) return;
    failures.push(
      `${expression}: got 0x${observed[index].toString(16)}, want 0x${bits.toString(16)}`
    );
  });
  assert.deepEqual(failures, [], `binary16 encoding deviations:\n  ${failures.join('\n  ')}`);
});

test('getFloat16 decodes signed zero, subnormals, infinity and NaN', async () => {
  const observed = await probe(`(() => {
    const view = new DataView(new ArrayBuffer(2));
    const read = (bits) => {
      view.setUint16(0, bits, true);
      return view.getFloat16(0, true);
    };
    return {
      one: read(0x3c00),
      tenth: read(0x2e66),
      max: read(0x7bff),
      minSubnormal: read(0x0001),
      negativeZero: Object.is(read(0x8000), -0),
      // 无穷与 NaN 过不了 JSON，转成字符串再比
      positiveInfinity: String(read(0x7c00)),
      negativeInfinity: String(read(0xfc00)),
      isNaN: Number.isNaN(read(0x7e00)),
    };
  })()`);

  assert.equal(observed.one, 1);
  // 0.1 在半精度里存不下，真实值就是这个——写 0.1 才是错的
  assert.equal(observed.tenth, 0.0999755859375);
  assert.equal(observed.max, 65504);
  assert.equal(observed.minSubnormal, 2 ** -24);
  assert.equal(observed.negativeZero, true);
  assert.equal(observed.positiveInfinity, 'Infinity');
  assert.equal(observed.negativeInfinity, '-Infinity');
  assert.equal(observed.isNaN, true);
});

test('setFloat16 round-trips through getFloat16', async () => {
  const observed = await probe(`(() => {
    const view = new DataView(new ArrayBuffer(2));
    // 只取半精度能精确表示的值，否则比较的是舍入而不是往返
    return [1, -2, 0.5, 1.5, 256, -1024, 65504, 2 ** -14].map((value) => {
      view.setFloat16(0, value);
      return view.getFloat16(0);
    });
  })()`);

  assert.deepEqual(observed, [1, -2, 0.5, 1.5, 256, -1024, 65504, 2 ** -14]);
});

test('big-endian is the default and littleEndian is honoured', async () => {
  const observed = await probe(`(() => {
    const view = new DataView(new ArrayBuffer(2));
    view.setFloat16(0, 1);
    const bigEndian = view.getUint16(0, false);
    view.setFloat16(0, 1, true);
    const littleEndian = view.getUint16(0, false);
    return { bigEndian, littleEndian };
  })()`);

  // 1.0 是 0x3C00；默认大端写成 3C 00，小端写成 00 3C
  assert.equal(observed.bigEndian, 0x3c00);
  assert.equal(observed.littleEndian, 0x003c);
});

// ------------------------------------------------------ 原生伪装

test('the dispose symbols alias the string-keyed methods', async () => {
  // 实测 Node 24 原生：`prototype[Symbol.dispose]` 与 `prototype.dispose`
  // 是**同一个函数对象**，所以 `.name` 是 `dispose` 而不是 `[Symbol.dispose]`。
  //
  // 这条只能靠实测。第一版按「符号键方法名带方括号」的推断写，在 Node 22 的
  // shim 上通过、在 Node 24 原生上失败——正是同一张表跑两条路径的价值：
  // 只测 shim 会把推断固化成契约。
  const observed = await probe(`(() => {
    const stack = DisposableStack.prototype;
    const asyncStack = AsyncDisposableStack.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(stack, Symbol.dispose);
    return {
      sameFunction: stack[Symbol.dispose] === stack.dispose,
      asyncSameFunction:
        asyncStack[Symbol.asyncDispose] === asyncStack.disposeAsync,
      name: stack[Symbol.dispose].name,
      asyncName: asyncStack[Symbol.asyncDispose].name,
      writable: descriptor.writable,
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
    };
  })()`);

  assert.equal(observed.sameFunction, true);
  assert.equal(observed.asyncSameFunction, true);
  assert.equal(observed.name, 'dispose');
  assert.equal(observed.asyncName, 'disposeAsync');
  assert.equal(observed.writable, true);
  assert.equal(observed.enumerable, false);
  assert.equal(observed.configurable, true);
});

test('DisposableStack methods carry the native arity', async () => {
  const observed = await probe(`(() => {
    const prototype = DisposableStack.prototype;
    return {
      use: prototype.use.length,
      adopt: prototype.adopt.length,
      defer: prototype.defer.length,
      move: prototype.move.length,
      dispose: prototype.dispose.length,
      constructorLength: DisposableStack.length,
      constructorName: DisposableStack.name,
      toStringTag: Object.getOwnPropertyDescriptor(
        prototype, Symbol.toStringTag,
      ),
    };
  })()`);

  // 实测 Node 24 原生的 length；WebIDL 实参检查把 length 当权威来源
  assert.equal(observed.use, 1);
  assert.equal(observed.adopt, 2);
  assert.equal(observed.defer, 1);
  assert.equal(observed.move, 0);
  assert.equal(observed.dispose, 0);
  assert.equal(observed.constructorLength, 0);
  assert.equal(observed.constructorName, 'DisposableStack');
  assert.deepEqual(observed.toStringTag, {
    value: 'DisposableStack',
    writable: false,
    enumerable: false,
    configurable: true,
  });
});

test('shim prototype methods hide their JavaScript source', async () => {
  const observed = await probe(`(() => {
    const stringify = (fn) => Function.prototype.toString.call(fn);
    return {
      use: stringify(DisposableStack.prototype.use),
      disposed: stringify(Object.getOwnPropertyDescriptor(
        DisposableStack.prototype, 'disposed',
      ).get),
      dispose: stringify(DisposableStack.prototype[Symbol.dispose]),
      constructor: stringify(DisposableStack),
      asyncDispose: stringify(
        AsyncDisposableStack.prototype[Symbol.asyncDispose],
      ),
    };
  })()`);

  assert.equal(observed.use, 'function use() { [native code] }');
  assert.equal(observed.disposed, 'function get disposed() { [native code] }');
  // 符号键与字符串键是同一个函数，所以名字是 dispose / disposeAsync
  assert.equal(observed.dispose, 'function dispose() { [native code] }');
  assert.equal(
    observed.asyncDispose,
    'function disposeAsync() { [native code] }',
  );
  // 构造器的名字是类名，不是 "constructor"
  assert.equal(
    observed.constructor,
    'function DisposableStack() { [native code] }',
  );
});
