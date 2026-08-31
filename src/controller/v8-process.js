import { fileURLToPath } from "node:url";
import { ChildProcessConnection } from "./child-process.js";

const PROJECT_ROOT = fileURLToPath(new URL("../../", import.meta.url));
const CHILD_STDERR_ENV = "EDGE_SANDBOX_CHILD_STDERR";

export class V8ProcessConnection extends ChildProcessConnection {
  constructor(limits, hostPath) {
    super(limits);
    this.hostPath = hostPath;
  }

  createSpawnSpec(initPayload) {
    return {
      command: this.hostPath,
      args: [],
      options: {
        cwd: PROJECT_ROOT,
        env: hostEnvironment(initPayload.fingerprint.timezone),
        windowsHide: true,
        stdio: ["pipe", "pipe", "pipe"],
      },
      forwardStderr: process.env[CHILD_STDERR_ENV] === "1",
    };
  }
}

function hostEnvironment(timezone) {
  const environment = {
    TZ: timezone,
  };
  if (process.platform === "win32") {
    environment.SystemRoot = process.env.SystemRoot;
    environment.WINDIR = process.env.WINDIR;
    environment.TEMP = process.env.TEMP;
    environment.TMP = process.env.TMP;
  }
  return environment;
}
