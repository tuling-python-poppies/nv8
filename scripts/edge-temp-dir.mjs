#!/usr/bin/env node
/**
 * 找一个 Windows 版 Edge 也能读到的临时目录。
 *
 * ## 为什么需要它
 *
 * WSL 下 `--edge` 指向的是 Windows 二进制（`/mnt/c/.../msedge.exe`），它看不见
 * Linux 的 `/tmp`。三个采集脚本原来各自硬编码 `'/mnt/c/temp'`——那个目录在
 * Windows 上**不是标准目录**，本机就没有，于是 `mkdtempSync` 直接 ENOENT，
 * `npm run fingerprint:globals` 在 WSL 上根本跑不起来。
 *
 * 这与 README「工具脚本必须跨平台」里记的两条是同一类：采集脚本自己坏掉的方式
 * 通常不是崩，是**在某个平台上根本没跑过**。
 *
 * 三处各写一份必然漂移，所以抽成一个模块。
 */

import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { tmpdir, userInfo } from 'node:os';
import path from 'node:path';
import process from 'node:process';

const WINDOWS_USERS = '/mnt/c/Users';

/** `/mnt/c/Users` 下不是真实用户的条目。 */
const NOT_A_USER = new Set(['Public', 'Default', 'Default User', 'All Users']);

function usable(candidate) {
  try {
    return statSync(candidate).isDirectory();
  } catch {
    return false;
  }
}

/**
 * @param {string} edgePath `findEdge()` 解析出的 Edge 可执行文件路径
 * @returns {string} 一个存在且可写的目录
 */
export function edgeTempDir(edgePath) {
  // 原生 Windows / 原生 Linux：宿主与浏览器同一个文件系统视图，用系统临时目录。
  if (!edgePath.startsWith('/mnt/')) return tmpdir();

  const candidates = [];
  // 显式覆盖优先，便于在权限受限的环境里指定目录。
  if (process.env.NV8_EDGE_TEMP !== undefined) candidates.push(process.env.NV8_EDGE_TEMP);
  candidates.push('/mnt/c/temp');
  candidates.push(path.join(WINDOWS_USERS, userInfo().username, 'AppData/Local/Temp'));
  if (existsSync(WINDOWS_USERS)) {
    for (const entry of readdirSync(WINDOWS_USERS)) {
      if (NOT_A_USER.has(entry)) continue;
      candidates.push(path.join(WINDOWS_USERS, entry, 'AppData/Local/Temp'));
    }
  }

  for (const candidate of candidates) {
    if (usable(candidate)) return candidate;
  }

  // 一个都没有就自己造。造出来的目录 Windows 侧可见，符合 Edge 的要求。
  try {
    mkdirSync('/mnt/c/temp', { recursive: true });
    return '/mnt/c/temp';
  } catch (error) {
    throw new Error(
      'WSL 下找不到 Windows 版 Edge 能读到的临时目录。'
      + `试过：${candidates.join(', ')}。`
      + `创建 /mnt/c/temp 也失败（${error.code}）。`
      + '可以设 NV8_EDGE_TEMP 指定一个 /mnt/c 下的目录。'
    );
  }
}

/**
 * WSL 路径 → Windows 版浏览器能打开的 `file://` URL。
 *
 * 与 `edgeTempDir` 放在一起：调用方拿到目录后紧接着就要这一步，分开放两个文件
 * 只会让人在其中一处忘掉盘符转换。
 *
 * @param {string} filePath
 * @returns {string}
 */
export function toBrowserUrl(filePath) {
  if (filePath.startsWith('/mnt/')) {
    const [, , drive, ...rest] = filePath.split('/');
    return `file:///${drive.toUpperCase()}:/${rest.join('/')}`;
  }
  return `file://${filePath}`;
}
