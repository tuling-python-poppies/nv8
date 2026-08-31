import { installHTMLMediaElement } from "../../install/install-html-media-element.js";
import { installHTMLAudioElement } from "../../install/install-html-audio-element.js";
import { installHTMLVideoElement } from "../../install/install-html-video-element.js";
import { installMediaError } from "../../install/install-media-error.js";
import { installTimeRanges } from "../../install/install-time-ranges.js";

/**
 * @nv8/plugin-html-media
 * 
 * HTML 媒体元素
 * 
 * 提供能力：
 * - html.media: audio, video 和相关 API
 */
export const htmlMediaPlugin = {
  id: "@nv8/plugin-html-media",
  version: "1.0.0",
  capabilities: ["html.media"],
  dependencies: ["@nv8/plugin-html-elements", "@nv8/plugin-webidl"],
  
  install(sandbox, registry, config) {
    // 安装媒体支持类型
    installMediaError();
    installTimeRanges();
    
    // 安装媒体元素
    installHTMLMediaElement();
    installHTMLAudioElement();
    installHTMLVideoElement();
    
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "HTMLMediaElement");
    registry.reserveGlobalSurface(this.id, "HTMLAudioElement");
    registry.reserveGlobalSurface(this.id, "HTMLVideoElement");
    registry.reserveGlobalSurface(this.id, "MediaError");
    registry.reserveGlobalSurface(this.id, "TimeRanges");
  },
  
  reset(sandbox, registry) {
    // 媒体元素不需要重置
  },
  
  dispose(sandbox, registry) {
    // 清理在 dispose 时处理
  },
};
