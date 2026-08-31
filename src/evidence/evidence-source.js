/**
 * Evidence Source 适配器
 *
 * 把具体的 Evidence Bundle（磁盘格式 + manifest schema）包装成 Core 所需的
 * 抽象 `EvidenceSource`。
 *
 * 依赖方向：evidence → core-contract。Core 不反向 import 这里。
 * 因此 Bundle schema 变化只影响本文件，不影响 Core。
 */

/**
 * 把 Bundle 文件元数据映射为契约里的资源描述。
 * `id` 对应 Bundle 内相对路径，但 Core 只当它是不透明标识。
 */
function toResourceDescriptor(file) {
  return Object.freeze({
    id: file.path,
    mediaType: file.mediaType ?? null,
    bytes: file.bytes ?? null,
    role: file.role ?? null,
  });
}

/**
 * 用 Bundle 创建符合 Core 契约的 EvidenceSource。
 *
 * @param {object} bundle `loadEvidenceBundle()` 的返回值
 * @returns {Readonly<object>} EvidenceSource
 */
export function createEvidenceSource(bundle) {
  if (bundle === null || typeof bundle !== 'object') {
    throw new TypeError('createEvidenceSource(bundle): bundle must be an object');
  }

  return Object.freeze({
    /**
     * 资源是否存在
     * @param {string} id
     * @returns {boolean}
     */
    has(id) {
      return bundle.hasFile(id);
    },

    /**
     * 读取文本资源
     * @param {string} id
     * @returns {Promise<string>}
     */
    async readText(id) {
      return bundle.readFile(id, 'utf8');
    },

    /**
     * 读取二进制资源
     * @param {string} id
     * @returns {Promise<Buffer>}
     */
    async readBinary(id) {
      return bundle.readFileBuffer(id);
    },

    /**
     * 入口脚本 id 列表（执行顺序即声明顺序）
     * @returns {Promise<string[]>}
     */
    async listEntryScripts() {
      return [...bundle.getEntrypoints()];
    },

    /**
     * 所有已声明脚本
     * @returns {Promise<ReadonlyArray<object>>}
     */
    async listScripts() {
      return bundle.getScripts().map(toResourceDescriptor);
    },

    /**
     * 所有已声明页面
     * @returns {Promise<ReadonlyArray<object>>}
     */
    async listPages() {
      return bundle.getPages().map(toResourceDescriptor);
    },

    /**
     * 网络 replay fixture；不存在时返回 null
     * @returns {Promise<object|null>}
     */
    async getNetworkReplayFixture() {
      return bundle.getNetworkReplay();
    },

    /**
     * 诊断快照。只暴露标识和计数，不暴露内容。
     * @returns {object}
     */
    describe() {
      const verification = bundle.getVerification();
      return {
        kind: 'evidence-bundle',
        schemaVersion: verification.schemaVersion,
        bundleId: verification.bundleId,
        fileCount: verification.fileCount,
        totalBytes: verification.totalBytes,
        loadedAt: verification.loadedAt,
      };
    },

    /**
     * 逃生舱：拿到底层 Bundle。
     *
     * 仅供需要 manifest 细节的证据层工具使用（例如 replay body 解析）。
     * Core 不使用该属性——使用它意味着重新引入格式耦合。
     */
    get underlyingBundle() {
      return bundle;
    },
  });
}

/**
 * 用内存数据构造 EvidenceSource，主要用于测试和程序化组装。
 *
 * @param {object} [input]
 * @param {Record<string, string|Buffer>} [input.resources] id → 内容
 * @param {string[]} [input.entryScripts] 入口脚本 id
 * @param {string[]} [input.scripts] 脚本 id（默认取 entryScripts）
 * @param {string[]} [input.pages] 页面 id
 * @param {object|null} [input.networkReplay] replay fixture
 * @param {string} [input.id] 诊断标识
 * @returns {Readonly<object>} EvidenceSource
 */
export function createInMemoryEvidenceSource(input = {}) {
  const resources = new Map(Object.entries(input.resources ?? {}));
  const entryScripts = [...(input.entryScripts ?? [])];
  const scripts = [...(input.scripts ?? entryScripts)];
  const pages = [...(input.pages ?? [])];
  const networkReplay = input.networkReplay ?? null;
  const id = input.id ?? 'in-memory';

  const requireResource = (resourceId) => {
    if (!resources.has(resourceId)) {
      throw Object.assign(
        new Error(`Evidence resource not found: ${resourceId}`),
        { code: 'ERR_NV8_EVIDENCE_RESOURCE_NOT_FOUND' }
      );
    }
    return resources.get(resourceId);
  };

  const describeIds = (ids) => ids.map((resourceId) => {
    const content = resources.get(resourceId);
    return Object.freeze({
      id: resourceId,
      mediaType: null,
      bytes: content === undefined
        ? null
        : Buffer.byteLength(Buffer.isBuffer(content) ? content : String(content)),
      role: null,
    });
  });

  return Object.freeze({
    has(resourceId) {
      return resources.has(resourceId);
    },

    async readText(resourceId) {
      const content = requireResource(resourceId);
      return Buffer.isBuffer(content) ? content.toString('utf8') : String(content);
    },

    async readBinary(resourceId) {
      const content = requireResource(resourceId);
      return Buffer.isBuffer(content) ? content : Buffer.from(String(content), 'utf8');
    },

    async listEntryScripts() {
      return [...entryScripts];
    },

    async listScripts() {
      return describeIds(scripts);
    },

    async listPages() {
      return describeIds(pages);
    },

    async getNetworkReplayFixture() {
      return networkReplay;
    },

    describe() {
      return {
        kind: 'in-memory',
        bundleId: id,
        fileCount: resources.size,
        totalBytes: [...resources.values()].reduce(
          (sum, content) => sum + Buffer.byteLength(
            Buffer.isBuffer(content) ? content : String(content)
          ),
          0
        ),
      };
    },
  });
}
