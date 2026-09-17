import { CollectorError, CollectorErrorCode } from './errors.js';

export function throwIfCancelled(signal) {
  if (signal?.aborted) {
    throw signal.reason instanceof CollectorError
      ? signal.reason
      : new CollectorError(CollectorErrorCode.ABORTED, 'collector operation aborted', {
        retryable: false,
      });
  }
}

export function awaitWithSignal(operation, signal) {
  throwIfCancelled(signal);
  let onAbort;
  const promise = new Promise((resolve, reject) => {
    onAbort = () => reject(signal.reason instanceof CollectorError ? signal.reason : new CollectorError(
      CollectorErrorCode.ABORTED,
      'collector operation aborted',
      { retryable: false },
    ));
    signal?.addEventListener('abort', onAbort, { once: true });
    Promise.resolve().then(() => {
      throwIfCancelled(signal);
      return operation();
    }).then(resolve, reject);
  });
  return promise.finally(() => signal?.removeEventListener('abort', onAbort));
}

export function cancellableDelay(ms, signal) {
  throwIfCancelled(signal);
  return new Promise((resolve, reject) => {
    let timer;
    const onAbort = () => {
      clearTimeout(timer);
      signal.removeEventListener('abort', onAbort);
      reject(signal.reason instanceof CollectorError ? signal.reason : new CollectorError(
        CollectorErrorCode.ABORTED,
        'collector operation aborted',
        { retryable: false },
      ));
    };
    const finish = () => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    };
    timer = setTimeout(finish, ms);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}
