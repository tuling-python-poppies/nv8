import {
  isLocalNativeFunctionImplementation,
  isRegisteredNativeFunction,
} from "./native-function.js";

export function findCrossRealmPrototypeMethod(receiver, name, localMethod) {
  if (
    (typeof receiver !== "object" && typeof receiver !== "function")
    || receiver === null
  ) {
    return null;
  }
  let prototype = Object.getPrototypeOf(receiver);
  while (prototype !== null) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
    if (typeof descriptor?.value === "function") {
      if (
        descriptor.value === localMethod
        || isLocalNativeFunctionImplementation(
          descriptor.value,
          localMethod,
        )
      ) {
        return null;
      }
      return isRegisteredNativeFunction(descriptor.value)
        ? descriptor.value
        : null;
    }
    prototype = Object.getPrototypeOf(prototype);
  }
  return null;
}

export function findCrossRealmPrototypeAccessor(
  receiver,
  name,
  kind,
  localAccessor,
) {
  if (
    (typeof receiver !== "object" && typeof receiver !== "function")
    || receiver === null
  ) {
    return null;
  }
  let prototype = Object.getPrototypeOf(receiver);
  while (prototype !== null) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
    if (descriptor !== undefined) {
      const accessor = descriptor[kind];
      if (
        typeof accessor !== "function"
        || accessor === localAccessor
        || isLocalNativeFunctionImplementation(accessor, localAccessor)
      ) {
        return null;
      }
      return isRegisteredNativeFunction(accessor) ? accessor : null;
    }
    prototype = Object.getPrototypeOf(prototype);
  }
  return null;
}
