import type { AsyncResult, Result } from '../types';

export type BatchFunc<T> = (...args: any[]) => Result<T> | AsyncResult<T>;
export type BatchFuncList<T> = [
  ...BatchFunc<any>[],
  BatchFunc<T>
];

export type AbortableProps = {
  abortSignal?: AbortSignal | null;
}

export type AbortableParams = {
  abortSignal?: AbortSignal | null;
}

export type AbortableOptions = {
  abortSignal?: AbortSignal | null;
}

export type PromiseResolveFunc<T> = (value: Result<T> | PromiseLike<Result<T>>) => void;

export type PromiseRejectFunc = (reason?: any) => void;

export type PromiseExecutor<T> = (
  resolve: PromiseResolveFunc<T>,
  reject: PromiseRejectFunc) => void;

  
export type NativePromiseResolveFunc<T> = 
  (value: T | PromiseLike<T>) => void

export type NativePromiseRejectFunc<TReason> = 
  (reason?: TReason) => void;
