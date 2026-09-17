/**
 * 可选的真实 GPU 身份组合
 *
 * 硬编码单一 GPU 的问题：所有 NV8 实例都声称使用同一块显卡。指纹在群体里
 * 唯一，就失去了「混入人群」的意义。
 *
 * 更隐蔽的问题是**内部一致性**。一块 GPU 的身份散落在多个字段里：
 *
 * ```
 * webglVendor      "Google Inc. (NVIDIA)"
 * webglRenderer    "ANGLE (NVIDIA, NVIDIA GeForce RTX 5060 Direct3D11)"
 * webgpu.vendor    "nvidia"
 * webgpu.device    "NVIDIA GeForce RTX 5060"
 * webgpu.description "NVIDIA driver 32.0.15.8097"
 * webgpu.subgroupMinSize / subgroupMaxSize   32（NVIDIA warp 大小）
 * ```
 *
 * 手工改 GPU 型号时漏掉任何一处，就出现「WebGL 说是 NVIDIA、WebGPU 说是
 * Intel」这类自相矛盾——比用默认值更容易被识别。把它们绑成一个整体，
 * 一致性由 `validateGpuIdentity()` 校验而不是靠记性。
 *
 * `subgroupMinSize`/`subgroupMaxSize` 不是任意值：NVIDIA 的 warp 是 32，
 * AMD 的 wave64 是 32–64，Intel 的 EU SIMD 是 8–32。
 */

/** GPU 厂商到 subgroup 尺寸的映射。硬件特性，不能随意填。 */
const SUBGROUP_SIZES = Object.freeze({
  nvidia: Object.freeze({ min: 32, max: 32 }),
  amd: Object.freeze({ min: 32, max: 64 }),
  intel: Object.freeze({ min: 8, max: 32 }),
});

/** WebGL unmasked vendor 里的厂商名，与 webgpu.vendor 一一对应。 */
const ANGLE_VENDOR_NAMES = Object.freeze({
  nvidia: 'NVIDIA',
  amd: 'AMD',
  intel: 'Intel',
});

/**
 * 由厂商与型号推导出一整套自洽的 GPU 身份字段。
 *
 * 推导而非手写，是因为这些字段之间有固定的构造规则——手写就是把规则
 * 重复 N 遍，然后指望每遍都对。
 *
 * @param {object} spec
 * @param {'nvidia'|'amd'|'intel'} spec.vendor
 * @param {string} spec.device 完整型号，如 `NVIDIA GeForce RTX 5060`
 * @param {string} spec.driver 驱动版本串，如 `32.0.15.8097`
 * @param {string} [spec.architecture] WebGPU architecture，Chromium 桌面通常为空
 * @returns {object} 冻结的 GPU 身份
 */
function deriveGpuIdentity({ vendor, device, driver, architecture = '' }) {
  const angleVendor = ANGLE_VENDOR_NAMES[vendor];
  if (angleVendor === undefined) {
    throw new TypeError(`unknown GPU vendor: ${vendor}`);
  }
  const subgroup = SUBGROUP_SIZES[vendor];
  const driverLabel = vendor === 'nvidia'
    ? `NVIDIA driver ${driver}`
    : `${angleVendor} driver ${driver}`;

  return Object.freeze({
    // device 已含厂商名（"NVIDIA GeForce RTX 5060"），不再加前缀，
    // 否则得到 "nvidia-nvidia-geforce-..." 这种冗余 id
    id: device.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    webglVendor: `Google Inc. (${angleVendor})`,
    webglRenderer: `ANGLE (${angleVendor}, ${device} Direct3D11)`,
    webgpu: Object.freeze({
      vendor,
      architecture,
      device,
      description: driverLabel,
      subgroupMinSize: subgroup.min,
      subgroupMaxSize: subgroup.max,
      isFallbackAdapter: false,
    }),
  });
}

/**
 * 一组真实存在的桌面 GPU。
 *
 * 选取标准：Steam 硬件调查里份额较高的型号——目的是混入人群，冷门型号
 * 反而突出。
 */
export const GPU_IDENTITIES = Object.freeze([
  deriveGpuIdentity({
    vendor: 'nvidia', device: 'NVIDIA GeForce RTX 5060', driver: '32.0.15.8097',
  }),
  deriveGpuIdentity({
    vendor: 'nvidia', device: 'NVIDIA GeForce RTX 4060', driver: '32.0.15.7688',
  }),
  deriveGpuIdentity({
    vendor: 'nvidia', device: 'NVIDIA GeForce RTX 3060', driver: '31.0.15.5222',
  }),
  deriveGpuIdentity({
    vendor: 'amd', device: 'AMD Radeon RX 7600', driver: '32.0.12033.1030',
  }),
  deriveGpuIdentity({
    vendor: 'intel', device: 'Intel(R) UHD Graphics 770', driver: '31.0.101.5333',
  }),
]);

/**
 * 校验一套 rendering 字段内部自洽。
 *
 * 用于 profile 校验和测试：把「WebGL 说 NVIDIA、WebGPU 说 Intel」这类矛盾
 * 挡在运行前。
 *
 * @param {object} rendering 含 `webglVendor` / `webglRenderer` / `webgpu`
 * @returns {string[]} 问题列表，为空表示自洽
 */
export function validateGpuIdentity(rendering) {
  const problems = [];
  const webgpu = rendering.webgpu;

  if (webgpu === undefined || webgpu === null) {
    problems.push('rendering.webgpu is missing');
    return problems;
  }

  const angleVendor = ANGLE_VENDOR_NAMES[webgpu.vendor];
  if (angleVendor === undefined) {
    problems.push(`unknown webgpu.vendor "${webgpu.vendor}"`);
    return problems;
  }

  if (rendering.webglVendor !== `Google Inc. (${angleVendor})`) {
    problems.push(
      `webglVendor "${rendering.webglVendor}" disagrees with webgpu.vendor "${webgpu.vendor}"`
    );
  }

  if (!rendering.webglRenderer.includes(webgpu.device)) {
    problems.push(
      `webglRenderer "${rendering.webglRenderer}" does not mention webgpu.device "${webgpu.device}"`
    );
  }

  if (!rendering.webglRenderer.startsWith(`ANGLE (${angleVendor},`)) {
    problems.push(`webglRenderer must start with "ANGLE (${angleVendor},"`);
  }

  const subgroup = SUBGROUP_SIZES[webgpu.vendor];
  if (webgpu.subgroupMinSize !== subgroup.min || webgpu.subgroupMaxSize !== subgroup.max) {
    problems.push(
      `subgroup size ${webgpu.subgroupMinSize}-${webgpu.subgroupMaxSize} is not a real `
      + `${webgpu.vendor} configuration (expected ${subgroup.min}-${subgroup.max})`
    );
  }

  if (!webgpu.description.includes(angleVendor)) {
    problems.push(
      `webgpu.description "${webgpu.description}" does not mention ${angleVendor}`
    );
  }

  return problems;
}
