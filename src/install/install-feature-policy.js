import * as runtime from "../api/feature-policy/feature-policy-runtime.js";
import {
  FEATURE_POLICY_SURFACE,
} from "../api/feature-policy/feature-policy-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { registerNativeFunction } from "../webidl/native-function.js";

export function installFeaturePolicy() {
  delete runtime.FeaturePolicy.prototype.constructor;
  defineGlobalConstructor("FeaturePolicy", runtime.FeaturePolicy);
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
      defineToStringTag(runtime.FeaturePolicy.prototype, "FeaturePolicy");
    }
  } while (false);
}
