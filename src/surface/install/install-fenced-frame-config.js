import {
  defineConstructorBacklink,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  FencedFrameConfig,
  installFencedFrameConfigConstructor,
} from "../api/dom/fenced-frame-config-constructor.js";
import { setSharedStorageContext } from "../api/dom/fenced-frame-config-set-shared-storage-context.js";

export function installFencedFrameConfig() {
  installFencedFrameConfigConstructor();
  definePrototypeMethod(
    FencedFrameConfig.prototype,
    "setSharedStorageContext",
    setSharedStorageContext,
  );
  defineConstructorBacklink(FencedFrameConfig.prototype, FencedFrameConfig);
  defineToStringTag(FencedFrameConfig.prototype, "FencedFrameConfig");
}
