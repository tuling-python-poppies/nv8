let nextObserverId = 1;
const observers = new Map();

export function observePromise(promise) {
  const id = nextObserverId;
  nextObserverId = nextObserverId === 0x7fffffff ? 1 : nextObserverId + 1;
  const observer = {
    status: 0,
    type: "undefined",
    value: undefined,
    name: "",
    message: "",
    stack: "",
  };
  observers.set(id, observer);
  Reflect.apply(Promise.prototype.then, promise, [
    (value) => {
      const normalized = normalizeValue(value);
      observer.status = 1;
      observer.type = normalized.type;
      observer.value = normalized.value;
    },
    (reason) => {
      const normalized = normalizeReason(reason);
      observer.status = 2;
      observer.name = normalized.name;
      observer.message = normalized.message;
      observer.stack = normalized.stack;
    },
  ]);
  return id;
}

export function readPromiseObserver(id) {
  const observer = observers.get(id);
  if (observer === undefined) {
    return { status: 3 };
  }
  if (observer.status === 0) {
    return { status: 0 };
  }
  observers.delete(id);
  if (observer.status === 1) {
    return {
      status: 1,
      type: observer.type,
      value: observer.value,
    };
  }
  return {
    status: 2,
    name: observer.name,
    message: observer.message,
    stack: observer.stack,
  };
}

function normalizeValue(value) {
  if (value === undefined) {
    return { type: "undefined", value: undefined };
  }
  if (value === null) {
    return { type: "null", value: null };
  }
  const type = typeof value;
  if (type === "boolean" || type === "number" || type === "string") {
    return { type, value };
  }
  return { type: "other", value: undefined };
}

function normalizeReason(reason) {
  if (reason !== null && typeof reason === "object") {
    try {
      return {
        name: typeof reason.name === "string" ? reason.name : "Error",
        message: typeof reason.message === "string"
          ? reason.message
          : "Sandbox evaluation rejected",
        stack: typeof reason.stack === "string" ? reason.stack : "",
      };
    } catch {
      return {
        name: "Error",
        message: "Sandbox evaluation rejected",
        stack: "",
      };
    }
  }
  return {
    name: "Error",
    message: typeof reason === "string"
      ? reason
      : "Sandbox evaluation rejected",
    stack: "",
  };
}
