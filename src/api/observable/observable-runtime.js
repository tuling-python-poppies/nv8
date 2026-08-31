import {
  abortSignal,
  createAbortSignal,
} from "../abort/abort-signal-state.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();

export function Subscriber() {
  throw new TypeError(
    "Failed to construct 'Subscriber': Illegal constructor",
  );
}

export function Observable(subscriberCallback) {
  if (new.target === undefined || arguments.length === 0) {
    throw new TypeError(
      "Failed to construct 'Observable': 1 argument required",
    );
  }
  if (typeof subscriberCallback !== "function") {
    throw new TypeError("The subscriber callback must be a function");
  }
  state.set(this, { kind: "observable", source: {
    type: "callback",
    callback: subscriberCallback,
  } });
}

registerNativeFunction(Subscriber, "Subscriber");
registerNativeFunction(Observable, "Observable");
export const observableConstructors = Object.freeze([
  Subscriber,
  Observable,
]);

export function observableFrom(value) {
  const record = state.get(value);
  if (record?.kind === "observable") return value;
  if (!isObject(value) || typeof value === "string") {
    throw new TypeError("Cannot convert value to an Observable");
  }
  if (value instanceof Promise) {
    return createObservable({ type: "promise", promise: value });
  }
  const iterator = value[Symbol.iterator];
  if (typeof iterator !== "function") {
    throw new TypeError("Cannot convert value to an Observable");
  }
  return createObservable({ type: "values", values: [...value] });
}
Object.defineProperty(observableFrom, "name", {
  value: "from",
  configurable: true,
});
registerNativeFunction(observableFrom, "from");

export function observableProperty(value, name) {
  const record = requireSubscriber(value);
  if (name === "active" || name === "signal") return record[name];
  throw new TypeError("Illegal invocation");
}

export function observableOperation(value, name, args) {
  const record = state.get(value);
  if (record?.kind === "subscriber") {
    return subscriberOperation(record, name, args);
  }
  if (record?.kind !== "observable") throw new TypeError("Illegal invocation");
  if (name === "subscribe") {
    emitSource(record.source, createSubscriber(observerValue(args[0])));
    return undefined;
  }
  if ([
    "catch",
    "filter",
    "finally",
    "flatMap",
    "map",
    "switchMap",
  ].includes(name)) {
    requireCallback(args[0], name);
    return derived(value, name, args[0]);
  }
  if (name === "drop" || name === "take") {
    return derived(value, name, Math.max(0, toInteger(args[0])));
  }
  if (name === "inspect") {
    return derived(value, name, isObject(args[0]) ? args[0] : null);
  }
  if (name === "takeUntil") {
    if (state.get(args[0])?.kind !== "observable") {
      throw new TypeError("takeUntil requires an Observable");
    }
    return derived(value, name, args[0]);
  }
  return terminal(value, name, args);
}

function subscriberOperation(record, name, args) {
  if (name === "addTeardown") {
    if (typeof args[0] !== "function") {
      throw new TypeError("addTeardown requires a function");
    }
    if (record.active) record.teardowns.push(args[0]);
    else Reflect.apply(args[0], undefined, []);
    return undefined;
  }
  if (name === "next") {
    if (record.active && typeof record.next === "function") {
      Reflect.apply(record.next, record.observer, [args[0]]);
    }
    return undefined;
  }
  if (name === "complete") {
    finishSubscriber(record, "complete", []);
    return undefined;
  }
  if (name === "error") {
    finishSubscriber(record, "error", [args[0]]);
    return undefined;
  }
  throw new TypeError("Illegal invocation");
}

function createSubscriber(observer) {
  const value = Object.create(Subscriber.prototype);
  state.set(value, {
    kind: "subscriber",
    object: value,
    active: true,
    signal: createAbortSignal(),
    observer,
    next: typeof observer.next === "function" ? observer.next : null,
    error: typeof observer.error === "function" ? observer.error : null,
    complete: typeof observer.complete === "function"
      ? observer.complete
      : null,
    teardowns: [],
  });
  return value;
}

function finishSubscriber(record, callbackName, args) {
  if (!record.active) return;
  record.active = false;
  abortSignal(record.signal, undefined);
  for (const teardown of record.teardowns) {
    Reflect.apply(teardown, undefined, []);
  }
  const callback = record[callbackName];
  if (typeof callback === "function") {
    Reflect.apply(callback, record.observer, args);
  }
}

function emitSource(source, subscriber) {
  if (source.type === "callback") {
    const teardown = Reflect.apply(source.callback, undefined, [subscriber]);
    if (typeof teardown === "function") {
      subscriberOperation(requireSubscriber(subscriber), "addTeardown", [
        teardown,
      ]);
    }
    return;
  }
  if (source.type === "values") {
    for (const value of source.values) {
      observableOperation(subscriber, "next", [value]);
    }
    observableOperation(subscriber, "complete", []);
    return;
  }
  if (source.type === "promise") {
    source.promise.then(
      value => {
        observableOperation(subscriber, "next", [value]);
        observableOperation(subscriber, "complete", []);
      },
      error => observableOperation(subscriber, "error", [error]),
    );
    return;
  }
  const collected = collect(source.upstream);
  applyOperation(collected, source.operation, source.argument);
  for (const value of collected.values) {
    observableOperation(subscriber, "next", [value]);
  }
  if (collected.error !== undefined) {
    observableOperation(subscriber, "error", [collected.error]);
  } else {
    observableOperation(subscriber, "complete", []);
  }
}

function collect(observable) {
  const record = requireObservable(observable);
  const output = { values: [], error: undefined, completed: false };
  const subscriber = createSubscriber({
    next(value) {
      output.values.push(value);
    },
    error(error) {
      output.error = error;
    },
    complete() {
      output.completed = true;
    },
  });
  emitSource(record.source, subscriber);
  return output;
}

function applyOperation(output, operation, argument) {
  if (operation === "map") {
    output.values = output.values.map((value, index) => argument(value, index));
  } else if (operation === "filter") {
    output.values = output.values.filter(
      (value, index) => Boolean(argument(value, index)),
    );
  } else if (operation === "drop") {
    output.values = output.values.slice(argument);
  } else if (operation === "take") {
    output.values = output.values.slice(0, argument);
  } else if (operation === "finally") {
    Reflect.apply(argument, undefined, []);
  } else if (operation === "inspect") {
    if (argument !== null) {
      for (const value of output.values) argument.next?.(value);
      if (output.error !== undefined) argument.error?.(output.error);
      else argument.complete?.();
    }
  } else if (operation === "catch") {
    if (output.error !== undefined) {
      const replacement = argument(output.error);
      output.error = undefined;
      if (state.get(replacement)?.kind === "observable") {
        Object.assign(output, collect(replacement));
      }
    }
  } else if (operation === "flatMap") {
    const values = [];
    for (let index = 0; index < output.values.length; index += 1) {
      const inner = argument(output.values[index], index);
      if (state.get(inner)?.kind !== "observable") continue;
      const collected = collect(inner);
      values.push(...collected.values);
      if (collected.error !== undefined) {
        output.error = collected.error;
        break;
      }
    }
    output.values = values;
  } else if (operation === "switchMap") {
    const last = output.values.at(-1);
    output.values = [];
    if (last !== undefined) {
      const inner = argument(last);
      if (state.get(inner)?.kind === "observable") {
        Object.assign(output, collect(inner));
      }
    }
  } else if (operation === "takeUntil") {
    if (collect(argument).values.length > 0) output.values = [];
  }
}

function terminal(observable, name, args) {
  const output = collect(observable);
  if (name === "first" || name === "last") {
    const value = name === "first"
      ? output.values[0]
      : output.values.at(-1);
    return value === undefined
      ? Promise.reject(new RangeError("Observable emitted no values"))
      : Promise.resolve(value);
  }
  if (name === "toArray") return Promise.resolve([...output.values]);
  if (["every", "find", "forEach", "some"].includes(name)) {
    requireCallback(args[0], name);
    if (name === "every") {
      return Promise.resolve(output.values.every(args[0]));
    }
    if (name === "find") {
      return Promise.resolve(output.values.find(args[0]));
    }
    if (name === "some") {
      return Promise.resolve(output.values.some(args[0]));
    }
    output.values.forEach(args[0]);
    return Promise.resolve();
  }
  if (name === "reduce") {
    requireCallback(args[0], name);
    if (args.length >= 2) {
      return Promise.resolve(output.values.reduce(args[0], args[1]));
    }
    if (output.values.length === 0) {
      return Promise.reject(new RangeError("Observable emitted no values"));
    }
    return Promise.resolve(output.values.reduce(args[0]));
  }
  throw new TypeError(`Unsupported Observable operation: ${name}`);
}

function derived(upstream, operation, argument) {
  return createObservable({
    type: "operation",
    upstream,
    operation,
    argument,
  });
}

function createObservable(source) {
  const value = Object.create(Observable.prototype);
  state.set(value, { kind: "observable", source });
  return value;
}

function observerValue(value) {
  return isObject(value) ? value : {};
}

function isObject(value) {
  return (typeof value === "object" && value !== null)
    || typeof value === "function";
}

function requireCallback(value, name) {
  if (typeof value !== "function") {
    throw new TypeError(`${name} requires a callback`);
  }
}

function toInteger(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.trunc(number);
}

function requireObservable(value) {
  const record = state.get(value);
  if (record?.kind !== "observable") throw new TypeError("Illegal invocation");
  return record;
}

function requireSubscriber(value) {
  const record = state.get(value);
  if (record?.kind !== "subscriber") throw new TypeError("Illegal invocation");
  return record;
}
