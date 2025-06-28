import { TaskStatus } from './taskConst';
import type { AsyncResult, Result } from '../types';
import type { Error } from '../errors';

export interface ITask<T = true> {
  status: TaskStatus;
  promise: AsyncResult<T>;
  result: Result<T> | null;
  value: T | null;
  error: Error | null;
  isSettled: boolean;
  run(): AsyncResult<T>;
  abort(): void;
}

export type TaskProps = {
  abortSignal?: AbortSignal | null;
};

export type TaskFactory<TTask extends ITask<any>> = () => TTask;