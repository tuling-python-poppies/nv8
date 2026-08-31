import { traceGetter } from "../../trace/trace-accessor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../webidl/native-function.js";
import {
  getAttributeValue,
  removeAttributeValue,
  requireElement,
  setAttributeValue,
} from "./element-state.js";
import { descendants, rootOf } from "./node-state.js";

export function ariaElementProperty(name, attribute, multiple) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const state = requireElement(this);
      let result = state.reflectedElements.get(name);
      if (result === undefined) {
        const attributeValue = getAttributeValue(this, attribute);
        if (multiple && attributeValue === null) {
          // 属性**不存在**时返回 null，而不是空数组。
          //
          // 真实 Edge 151 实测 `ariaControlsElements`：
          //   属性不存在        → null
          //   属性存在但解不到  → array(0)
          //   属性为空字符串    → array(0)
          //   属性可解析        → array(1)
          //
          // 这一条影响全部 7 个 `aria*Elements` 属性，不只是新加的那个。
          traceGetter(`window.Element.prototype.${name}`, "Element", null);
          return null;
        }
        const ids = (attributeValue ?? "").trim().split(/\s+/u).filter(Boolean);
        const candidates = elementCandidates(this);
        const values = ids.map(id => (
          candidates.find(element => getAttributeValue(element, "id") === id)
        )).filter(Boolean);
        result = multiple ? values : values[0] ?? null;
      } else if (multiple) {
        result = [...result];
      }
      traceGetter(`window.Element.prototype.${name}`, "Element", result);
      return result;
    },
    set [name](value) {
      const state = requireElement(this);
      if (value === null || value === undefined) {
        state.reflectedElements.delete(name);
        removeAttributeValue(this, attribute);
        return;
      }
      const values = multiple ? Array.from(value) : [value];
      for (const element of values) requireElement(element);
      state.reflectedElements.set(name, multiple ? [...values] : values[0]);
      const ids = values.map(element => getAttributeValue(element, "id")).filter(Boolean);
      if (ids.length === 0) removeAttributeValue(this, attribute);
      else setAttributeValue(this, attribute, ids.join(" "));
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  return descriptor;
}

function elementCandidates(element) {
  const root = rootOf(element);
  const values = [];
  try {
    requireElement(root);
    values.push(root);
  } catch {}
  values.push(...descendants(root).filter(candidate => {
    try {
      requireElement(candidate);
      return true;
    } catch {
      return false;
    }
  }));
  return values;
}
