import { installAtob } from "../api/encoding/atob.js";
import { installBtoa } from "../api/encoding/btoa.js";

export function installBase64() {
  installAtob();
  installBtoa();
}
