/**
 * Realm Factory - 创建不同类型的执行环境
 * 
 * 支持的 Realm 类型：
 * 1. node - Node.js 原生环境（vm2 或 isolated-vm）
 * 2. browser - 浏览器环境模拟（jsdom 或 happy-dom）
 * 3. quickjs - QuickJS 轻量级引擎
 * 4. v8 - 纯 V8 引擎（isolated-vm）
 */

/**
 * Realm 接口
 * 
 * 所有 Realm 实现都需要提供这些方法：
 * - create(sandbox): 创建执行上下文
 * - injectGlobals(globals): 注入全局对象
 * - setGlobal(name, value): 设置单个全局变量
 * - execute(code, options): 执行代码
 * - executeFunction(fn, ...args): 执行函数
 * - destroy(): 清理资源
 */

/**
 * Node Realm - 使用 Node.js vm 模块
 */
class NodeRealm {
  constructor() {
    this.vm = null;
    this.context = null;
    this.sandbox = null;
  }
  
  async create(sandbox) {
    this.sandbox = sandbox;
    
    // 动态导入 vm 模块（Node.js 内置）
    const { createContext } = await import('vm');
    
    // 创建上下文对象
    const contextObject = {
      console,
      setTimeout,
      setInterval,
      clearTimeout,
      clearInterval,
      Buffer,
      process: {
        env: process.env,
        version: process.version,
        platform: process.platform,
        arch: process.arch,
      },
    };
    
    this.context = createContext(contextObject);
    
    return this;
  }
  
  injectGlobals(globals) {
    if (!this.context) {
      throw new Error('Context not created');
    }
    
    for (const [key, value] of Object.entries(globals)) {
      this.context[key] = value;
    }
  }
  
  setGlobal(name, value) {
    if (!this.context) {
      throw new Error('Context not created');
    }
    
    this.context[name] = value;
  }
  
  async execute(code, options = {}) {
    const { runInContext } = await import('vm');
    
    const vmOptions = {
      filename: options.filename || 'sandbox.js',
      timeout: options.timeout || 5000,
      displayErrors: true,
    };
    
    return runInContext(code, this.context, vmOptions);
  }
  
  async executeFunction(fn, ...args) {
    // 将函数序列化为代码并执行
    const code = `(${fn.toString()})(...${JSON.stringify(args)})`;
    return await this.execute(code);
  }
  
  destroy() {
    this.context = null;
    this.sandbox = null;
  }
}

/**
 * Browser Realm - 使用 jsdom 模拟浏览器环境
 */
class BrowserRealm {
  constructor() {
    this.window = null;
    this.document = null;
    this.sandbox = null;
  }
  
  async create(sandbox) {
    this.sandbox = sandbox;
    
    try {
      // 尝试使用 jsdom（需要安装）
      const { JSDOM } = await import('jsdom');
      
      const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
        url: 'http://localhost',
        runScripts: 'outside-only',
        resources: 'usable',
      });
      
      this.window = dom.window;
      this.document = dom.window.document;
      
    } catch (error) {
      throw new Error(
        `Browser realm requires jsdom: npm install jsdom\n${error.message}`
      );
    }
    
    return this;
  }
  
  injectGlobals(globals) {
    if (!this.window) {
      throw new Error('Window not created');
    }
    
    for (const [key, value] of Object.entries(globals)) {
      this.window[key] = value;
    }
  }
  
  setGlobal(name, value) {
    if (!this.window) {
      throw new Error('Window not created');
    }
    
    this.window[name] = value;
  }
  
  async execute(code, options = {}) {
    if (!this.window) {
      throw new Error('Window not created');
    }
    
    // 使用 window.eval 在 DOM 上下文中执行
    return this.window.eval(code);
  }
  
  async executeFunction(fn, ...args) {
    if (!this.window) {
      throw new Error('Window not created');
    }
    
    // 在 window 上下文中执行函数
    return fn.apply(this.window, args);
  }
  
  destroy() {
    if (this.window) {
      this.window.close();
    }
    
    this.window = null;
    this.document = null;
    this.sandbox = null;
  }
}

/**
 * QuickJS Realm - 使用 QuickJS 引擎
 */
class QuickJSRealm {
  constructor() {
    this.vm = null;
    this.context = null;
    this.sandbox = null;
  }
  
  async create(sandbox) {
    this.sandbox = sandbox;
    
    try {
      // 尝试使用 quickjs-emscripten（需要安装）
      const { getQuickJS } = await import('quickjs-emscripten');
      
      const QuickJS = await getQuickJS();
      this.vm = QuickJS.newContext();
      
    } catch (error) {
      throw new Error(
        `QuickJS realm requires quickjs-emscripten: npm install quickjs-emscripten\n${error.message}`
      );
    }
    
    return this;
  }
  
  injectGlobals(globals) {
    if (!this.vm) {
      throw new Error('QuickJS context not created');
    }
    
    for (const [key, value] of Object.entries(globals)) {
      const handle = this.vm.newString(JSON.stringify(value));
      this.vm.setProp(this.vm.global, key, handle);
      handle.dispose();
    }
  }
  
  setGlobal(name, value) {
    if (!this.vm) {
      throw new Error('QuickJS context not created');
    }
    
    const handle = this.vm.newString(JSON.stringify(value));
    this.vm.setProp(this.vm.global, name, handle);
    handle.dispose();
  }
  
  async execute(code, options = {}) {
    if (!this.vm) {
      throw new Error('QuickJS context not created');
    }
    
    const result = this.vm.evalCode(code);
    
    if (result.error) {
      const error = this.vm.dump(result.error);
      result.error.dispose();
      throw new Error(error);
    }
    
    const value = this.vm.dump(result.value);
    result.value.dispose();
    
    return value;
  }
  
  async executeFunction(fn, ...args) {
    // QuickJS 不支持直接执行 JS 函数，需要序列化
    const code = `(${fn.toString()})(...${JSON.stringify(args)})`;
    return await this.execute(code);
  }
  
  destroy() {
    if (this.vm) {
      this.vm.dispose();
    }
    
    this.vm = null;
    this.sandbox = null;
  }
}

/**
 * V8 Realm - 使用 isolated-vm（完全隔离）
 */
class V8Realm {
  constructor() {
    this.isolate = null;
    this.context = null;
    this.sandbox = null;
  }
  
  async create(sandbox) {
    this.sandbox = sandbox;
    
    try {
      // 尝试使用 isolated-vm（需要安装）
      const ivm = await import('isolated-vm');
      
      this.isolate = new ivm.Isolate({ memoryLimit: 128 });
      this.context = await this.isolate.createContext();
      
      // 注入基础全局对象
      const jail = this.context.global;
      await jail.set('global', jail.derefInto());
      
    } catch (error) {
      throw new Error(
        `V8 realm requires isolated-vm: npm install isolated-vm\n${error.message}`
      );
    }
    
    return this;
  }
  
  async injectGlobals(globals) {
    if (!this.context) {
      throw new Error('V8 context not created');
    }
    
    const jail = this.context.global;
    
    for (const [key, value] of Object.entries(globals)) {
      if (typeof value === 'function') {
        // 函数需要特殊处理
        await jail.set(key, new ivm.Reference(value));
      } else {
        await jail.set(key, value);
      }
    }
  }
  
  async setGlobal(name, value) {
    if (!this.context) {
      throw new Error('V8 context not created');
    }
    
    const jail = this.context.global;
    
    if (typeof value === 'function') {
      await jail.set(name, new ivm.Reference(value));
    } else {
      await jail.set(name, value);
    }
  }
  
  async execute(code, options = {}) {
    if (!this.context) {
      throw new Error('V8 context not created');
    }
    
    const script = await this.isolate.compileScript(code);
    const result = await script.run(this.context, {
      timeout: options.timeout || 5000,
    });
    
    return result;
  }
  
  async executeFunction(fn, ...args) {
    const code = `(${fn.toString()})(...${JSON.stringify(args)})`;
    return await this.execute(code);
  }
  
  destroy() {
    if (this.context) {
      this.context.release();
    }
    
    if (this.isolate) {
      this.isolate.dispose();
    }
    
    this.context = null;
    this.isolate = null;
    this.sandbox = null;
  }
}

/**
 * Realm 注册表
 */
const realmRegistry = new Map([
  ['node', NodeRealm],
  ['browser', BrowserRealm],
  ['quickjs', QuickJSRealm],
  ['v8', V8Realm],
]);

/**
 * 创建 Realm 工厂
 */
export function createRealmFactory(type) {
  const RealmClass = realmRegistry.get(type);
  
  if (!RealmClass) {
    throw new Error(
      `Unknown realm type: "${type}". Available: ${Array.from(realmRegistry.keys()).join(', ')}`
    );
  }
  
  return new RealmClass();
}

/**
 * 注册自定义 Realm
 */
export function registerRealm(type, RealmClass) {
  realmRegistry.set(type, RealmClass);
}

/**
 * 获取可用的 Realm 类型
 */
export function getAvailableRealms() {
  return Array.from(realmRegistry.keys());
}
