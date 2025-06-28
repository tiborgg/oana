import type { AbortableOptions, BatchFuncList } from './asyncSchema';
import type { AsyncResult } from '../types';

export type SleepOptions = AbortableOptions;

export function sleep(timeout = 1000, options: SleepOptions = {}): Promise<void> {
  const { abortSignal } = options;

  return new Promise(resolve => {
    if (abortSignal?.aborted)
      return resolve();

    let isAborted = false;
    abortSignal?.addEventListener('abort', () => {
      resolve();
      isAborted = true;
    });

    setTimeout(() => {
      if (!isAborted)
        resolve();
    }, timeout);
  });
}