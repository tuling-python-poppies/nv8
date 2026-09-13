/**
 * Sandbox 子进程/线程的诊断出口。
 *
 * 正常帧输出走 stdout / parentPort；诊断只能走 stderr，且永远不能因为
 * 通道已经关闭而把宿主带崩。
 */
export function reportBackendDiagnostic(message, error) {
  let detail = "";
  if (error instanceof Error) {
    detail = error.stack ?? `${error.name}: ${error.message}`;
  } else if (error !== undefined && error !== null) {
    detail = `${error}`;
  }
  try {
    process.stderr.write(
      `[edge-sandbox] ${message}${detail === "" ? "" : `: ${detail}`}\n`,
    );
  } catch {
    // stderr 可能已随 transport 一起关闭；诊断不是关键路径。
  }
}
