import { installOfflineSocket } from "../../install/install-offline-socket.js";
import { installGeneralEvents } from "../../install/install-general-events.js";

const GENERAL_EVENTS_INSTALLER_URL = new URL(
  "../../install/install-general-events.js",
  import.meta.url,
);
const OFFLINE_SOCKET_INSTALLER_URL = new URL(
  "../../install/install-offline-socket.js",
  import.meta.url,
);

/**
 * @nv8/plugin-websocket
 * 
 * WebSocket API
 * 
 * 提供能力：
 * - websocket.base: WebSocket 和相关事件
 */
export const websocketPlugin = {
  id: "@nv8/plugin-websocket",
  version: "1.0.0",
  capabilities: ["websocket.base"],
  dependencies: ["@nv8/plugin-events", "@nv8/plugin-webidl"],
  
  install(sandbox, registry, config) {
    // 安装 General Events（包含 CloseEvent）
    installGeneralEvents();
    
    // 安装 Offline Socket（包含 WebSocket, EventSource 等）
    installOfflineSocket();
    
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "WebSocket");
    registry.reserveGlobalSurface(this.id, "EventSource");
    registry.reserveGlobalSurface(this.id, "WebSocketError");
    registry.reserveGlobalSurface(this.id, "WebSocketStream");
  },

  async activate(context) {
    const eventsModule = await context.moduleLoader?.importUrlAsync(GENERAL_EVENTS_INSTALLER_URL);
    const socketModule = await context.moduleLoader?.importUrlAsync(OFFLINE_SOCKET_INSTALLER_URL);
    if (!eventsModule?.namespace?.installGeneralEvents
      || !socketModule?.namespace?.installOfflineSocket) {
      throw new Error('Realm module loader cannot install offline WebSocket');
    }
    eventsModule.namespace.installGeneralEvents();
    socketModule.namespace.installOfflineSocket();
    context.exports.websocket = true;
  },
  
  async reset(context) {
    // Socket state is owned by individual Realm objects.
  },
  
  async dispose(context) {
    // Socket state is released with the Realm.
  },
};
