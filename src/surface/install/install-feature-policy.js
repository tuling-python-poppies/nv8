import * as runtime from "../api/feature-policy/feature-policy-runtime.js";
import {
  FEATURE_POLICY_SURFACE,
} from "../api/feature-policy/feature-policy-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../engine/webidl/native-function.js";

/**
 * @param {boolean} [edge152Surface] Edge 152 起 `FeaturePolicy` 被**重命名**为
 *   `PermissionsPolicy`。
 *
 *   实测真实 Edge 152：`FeaturePolicy === PermissionsPolicy`（同一个函数对象）、
 *   `FeaturePolicy.prototype === PermissionsPolicy.prototype`，两个名字的
 *   `Symbol.toStringTag` 都是 `"PermissionsPolicy"`，而 `document.featurePolicy`
 *   返回的实例 `Object.prototype.toString` 也是 `[object PermissionsPolicy]`。
 *
 *   所以这不是「新增一个接口」，是**加一个同对象别名并改 toStringTag**——
 *   与 `webkitURL === URL` 同一种关系。实例入口仍然只有 `document.featurePolicy`；
 *   `document.permissionsPolicy` 实测是 `undefined`。
 */
export function installFeaturePolicy(edge152Surface = false) {
  delete runtime.FeaturePolicy.prototype.constructor;
  defineGlobalConstructor("FeaturePolicy", runtime.FeaturePolicy);
  if (edge152Surface) {
    defineGlobalConstructor("PermissionsPolicy", runtime.FeaturePolicy);
  }
  do {
    {
      const callback = {
        [("allowedFeatures")](...args) {
          return runtime.featurePolicyOperation(this, ("allowedFeatures"), args);
        },
      }[("allowedFeatures")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("allowedFeatures"));
      definePrototypeMethod(
        runtime.FeaturePolicy.prototype,
        ("allowedFeatures"),
        callback,
      );
    }
  } while (false);
do {
    {
      const callback = {
        [("allowsFeature")](...args) {
          return runtime.featurePolicyOperation(this, ("allowsFeature"), args);
        },
      }[("allowsFeature")];
      Object.defineProperty(callback, "length", {
        value: (1),
        configurable: true,
      });
      registerNativeFunction(callback, ("allowsFeature"));
      definePrototypeMethod(
        runtime.FeaturePolicy.prototype,
        ("allowsFeature"),
        callback,
      );
    }
  } while (false);
do {
    {
      const callback = {
        [("features")](...args) {
          return runtime.featurePolicyOperation(this, ("features"), args);
        },
      }[("features")];
      Object.defineProperty(callback, "length", {
        value: (0),
        configurable: true,
      });
      registerNativeFunction(callback, ("features"));
      definePrototypeMethod(
        runtime.FeaturePolicy.prototype,
        ("features"),
        callback,
      );
    }
  } while (false);
do {
    {
      const callback = {
        [("getAllowlistForFeature")](...args) {
          return runtime.featurePolicyOperation(this, ("getAllowlistForFeature"), args);
        },
      }[("getAllowlistForFeature")];
      Object.defineProperty(callback, "length", {
        value: (1),
        configurable: true,
      });
      registerNativeFunction(callback, ("getAllowlistForFeature"));
      definePrototypeMethod(
        runtime.FeaturePolicy.prototype,
        ("getAllowlistForFeature"),
        callback,
      );
    }
  } while (false);
do {
    {
      defineConstructorBacklink(
        runtime.FeaturePolicy.prototype,
        runtime.FeaturePolicy,
      );
    }
  } while (false);
do {
    {
      defineToStringTag(
        runtime.FeaturePolicy.prototype,
        edge152Surface ? "PermissionsPolicy" : "FeaturePolicy",
      );
    }
  } while (false);
}
