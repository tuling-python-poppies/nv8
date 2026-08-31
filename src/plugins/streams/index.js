import { installStreams } from "../../install/install-streams.js";

const STREAMS_INSTALLER_URL = new URL(
  "../../install/install-streams.js",
  import.meta.url,
);

/**
 * @nv8/plugin-streams
 * 
 * Streams API
 * 
 * 提供能力：
 * - streams.base: ReadableStream, WritableStream, TransformStream
 */
export const streamsPlugin = {
  id: "@nv8/plugin-streams",
  version: "1.0.0",
  capabilities: ["streams.base"],
  dependencies: ["@nv8/plugin-webidl", "@nv8/plugin-abort"],
  supports: { realms: ['root', 'iframe', 'worker'] },
  
  install(sandbox, registry, config) {
    // 安装 Streams API
    installStreams();
    
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "ReadableStream");
    registry.reserveGlobalSurface(this.id, "WritableStream");
    registry.reserveGlobalSurface(this.id, "TransformStream");
    registry.reserveGlobalSurface(this.id, "ReadableByteStreamController");
    registry.reserveGlobalSurface(this.id, "ReadableStreamBYOBReader");
    registry.reserveGlobalSurface(this.id, "ReadableStreamBYOBRequest");
    registry.reserveGlobalSurface(this.id, "ReadableStreamDefaultController");
    registry.reserveGlobalSurface(this.id, "ReadableStreamDefaultReader");
    registry.reserveGlobalSurface(this.id, "TransformStreamDefaultController");
    registry.reserveGlobalSurface(this.id, "WritableStreamDefaultController");
    registry.reserveGlobalSurface(this.id, "WritableStreamDefaultWriter");
  },

  async activate(context) {
    const module = await context.moduleLoader?.importUrlAsync(STREAMS_INSTALLER_URL);
    if (!module?.namespace?.installStreams) {
      throw new Error('Realm module loader cannot install Streams');
    }
    module.namespace.installStreams();
    context.exports.streams = true;
  },
  
  async reset(context) {
    // Stream state is owned by individual Realm objects.
  },
  
  async dispose(context) {
    // Stream state is released with the Realm.
  },
};
