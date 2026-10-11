import assert from "node:assert/strict";
import test from "node:test";
import { createNv8 } from "../src/index.js";

const logger = { info() {}, warn() {}, error() {} };

async function createRuntime(options = {}) {
  return createNv8({ profile: "browser-profile-edge-v154", logger, ...options });
}

test("requestResize validates the child document and updates intrinsic iframe size", async () => {
  const nv8 = await createRuntime();
  try {
    const realm = await nv8.sandbox.createRealm({ type: "root" });
    const result = await realm.evaluate(`new Promise(resolve => {
      const frame = document.createElement("iframe");
      frame.addEventListener("load", () => {
        const before = frame.getBoundingClientRect();
        let denied;
        try { frame.contentWindow.requestResize(); }
        catch (error) { denied = error.name; }
        frame.srcdoc = '<!doctype html><meta name="responsive-embedded-sizing" content="allow-origins=*"><div id="content" style="width:321px;height:234px"></div>';
        frame.addEventListener("load", () => {
          let allowed = "pending";
          try { allowed = frame.contentWindow.requestResize(); }
          catch (error) { allowed = error.name; }
          const after = [frame.clientWidth, frame.clientHeight];
          resolve(JSON.stringify({ denied, allowed, before: [before.width, before.height], after }));
        }, { once: true });
      }, { once: true });
      document.body.appendChild(frame);
    })`);
    const value = JSON.parse(result);
    assert.equal(value.denied, "NotAllowedError");
    assert.equal(value.allowed, undefined);
    assert.deepEqual(value.after, [321, 234]);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test("requestResize rejects an origin not listed by allow-origins", async () => {
  const nv8 = await createRuntime();
  try {
    const realm = await nv8.sandbox.createRealm({ type: "root" });
    const value = await realm.evaluate(`new Promise(resolve => {
      const frame = document.createElement("iframe");
      frame.srcdoc = '<!doctype html><meta name="responsive-embedded-sizing" content="allow-origins=https://other.example"><script>parent.postMessage((() => { try { requestResize(); return "allowed"; } catch (error) { return error.name; } })(), "*")<' + '/scr' + 'ipt>';
      addEventListener("message", event => resolve(event.data), { once: true });
      document.body.appendChild(frame);
    })`);
    assert.equal(value, "NotAllowedError");
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});

test("capture setConstraints uses synchronous WebIDL dictionary conversion", async () => {
  const nv8 = await createRuntime();
  try {
    const realm = await nv8.sandbox.createRealm({ type: "root" });
    const value = JSON.parse(await realm.evaluate(`(() => {
      const camera = document.createElement("camera");
      const media = document.createElement("usermedia");
      const run = (target, value) => {
        try { return { result: target.setConstraints(value), promise: false }; }
        catch (error) { return { name: error.name, message: error.message, promise: false }; }
      };
      return JSON.stringify({
        camera: [run(camera), run(camera, null), run(camera, {}), run(camera, 1)],
        media: [run(media, "bad")],
      });
    })()`));
    assert.deepEqual(value.camera.slice(0, 3), [
      { promise: false },
      { promise: false },
      { promise: false },
    ]);
    assert.match(value.camera[3].message, /MediaTrackConstraintSet/);
    assert.match(value.media[0].message, /HTMLMediaStreamConstraints/);
    await nv8.sandbox.destroyRealm(realm.id);
  } finally {
    await nv8.destroy();
  }
});
